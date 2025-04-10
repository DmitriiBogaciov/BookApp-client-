'use client';

import { Editor, EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { useState, useEffect, useRef } from 'react';
import socket from '@/app/utils/socket';
import CreateAutocompletePlugin from './menu-editor-draft/autocomplete';


interface DraftEditorProps {
    block: { content: any; _id: string; pageId: string }; // ID страницы для socket операций
}

export default function DraftEditor({ block }: DraftEditorProps) {
    const parseContent = (content: any) => {
        try {
            const rawContent = typeof content === 'string' ? JSON.parse(content) : content;
            return EditorState.createWithContent(convertFromRaw(rawContent));
        } catch (error) {
            console.error("Не удалось разобрать block.content:", error);
            return EditorState.createEmpty();
        }
    };

    const [editorState, setEditorState] = useState(() =>
        block.content ? parseContent(block.content) : EditorState.createEmpty()
    );
    
    const autocompletePlugin = CreateAutocompletePlugin(setEditorState, () => editorState);

    const [isLocalUpdate, setIsLocalUpdate] = useState(false);
    const [isServerUpdate, setIsServerUpdate] = useState(false) // Добавим состояние для локальных изменений
    const previousContentRef = useRef<string | null>(null);

    useEffect(() => {
        // Обработчик изменений с сервера
        const handleBlockUpdate = (updatedBlock: { _id: string; content: string }) => {
            // Проверяем, относится ли обновление к текущему блоку
            if (updatedBlock._id !== block._id) {
                return; // Если это не наш блок — игнорируем обновление
            }
    
            // Если локальные изменения, не применяем обновления с сервера
            if (isLocalUpdate) {
                console.log(`🚫 Локальное изменение в блоке ${block._id}, не обновляем`);
                return;
            }
    
            setIsServerUpdate(true);
    
            console.log(`📩 Пришло обновление от сервера для блока ${updatedBlock._id}`);
            console.log("⚡ Контент с сервера:", updatedBlock.content);
            setEditorState(parseContent(updatedBlock.content)); // Обновляем состояние редактора
        };
    
        socket.on('block_updated', handleBlockUpdate);
    
        return () => {
            socket.off('block_updated', handleBlockUpdate);
        };
    }, [isLocalUpdate, block._id]);

    useEffect(() => {
        // Сохраняем контент на сервер
        if(isServerUpdate) {
            setIsServerUpdate(false)
            return
        }
        const timeout = setTimeout(() => {
            const rawContent = JSON.stringify(convertToRaw(editorState.getCurrentContent()));

            if (previousContentRef.current === rawContent) return;

            previousContentRef.current = rawContent;
            setIsLocalUpdate(true); // Устанавливаем флаг локального изменения

            socket.emit('block_update', {
                blockId: block._id,
                pageId: block.pageId,
                content: rawContent,
            });

            // Сброс флага локального изменения после отправки на сервер
            setTimeout(() => {
                setIsLocalUpdate(false);
            }, 1000); // Флаг сбрасывается через 1 секунду (это время на возможное серверное обновление)
        }, 500); // Таймаут на 500 мс

        return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editorState]);

    return (
        <div className='min-h-[50px] w-full'>
            <Editor
                editorState={editorState}
                onChange={autocompletePlugin.onChange}
                placeholder="Start to type... Draft.js"
                handleBeforeInput={autocompletePlugin.handleBeforeInput}
                handleKeyCommand={autocompletePlugin.handleKeyCommand}
                keyBindingFn={autocompletePlugin.keyBindingFn}
                ref={autocompletePlugin.ref}
            />
            {autocompletePlugin.renderSuggestions()}
        </div>
    );
}
