'use client';

import { Editor, EditorState, RawDraftContentState, convertFromRaw, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { useState, useEffect, useRef } from 'react';
import socket from '@/app/utils/socket'; // Import socket
import { Block } from '@/app/utils/interfaces';

interface DraftEditorProps {
    block: { content: any; _id: string; pageId: string }; // ID of the page for socket operations
}

export default function DraftEditor({ block }: DraftEditorProps) {
    const parseContent = (content: any) => {
        try {
            const rawContent = typeof content === 'string' ? JSON.parse(content) : content;
            return EditorState.createWithContent(convertFromRaw(rawContent));
        } catch (error) {
            console.error("Failed to parse block.content:", error);
            return EditorState.createEmpty();
        }
    };

    const [editorState, setEditorState] = useState(() =>
        block.content ? parseContent(block.content) : EditorState.createEmpty()
    );
    const [saving, setSaving] = useState(false);
    const previousContentRef = useRef<string | null>(null);
    const isLocalUpdateRef = useRef(false); // Флаг для отслеживания локальных изменений

    // Сохраняем изменения на сервер
    useEffect(() => {
        const saveContent = () => {
            const rawContent = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
            console.log('Saving changes')
            // Если содержимое не изменилось, ничего не делаем
            if (previousContentRef.current === rawContent) {
                return;
            }

            previousContentRef.current = rawContent;
            isLocalUpdateRef.current = true; // Устанавливаем флаг, чтобы игнорировать входящее событие

            setSaving(true);

            try {
                socket.emit('block_update', {
                    blockId: block._id,
                    pageId: block.pageId,
                    content: rawContent,
                });
            } catch (error) {
                console.error('Failed to emit block update:', error);
            } finally {
                setSaving(false);
            }
        };

        saveContent();
    }, [editorState, block._id, block.pageId]);

    useEffect(() => {
        const handleBlockUpdate = (updatedBlock: Block) => {
            if (isLocalUpdateRef.current) {
                // Если обновление пришло из локального изменения, игнорируем его
                isLocalUpdateRef.current = false;
                return;
            }

            console.log("Updated block", updatedBlock._id, updatedBlock.content);

            try {
                const rawContent = typeof updatedBlock.content === 'string'
                    ? JSON.parse(updatedBlock.content)
                    : updatedBlock.content;

                const updatedEditorState = EditorState.createWithContent(convertFromRaw(rawContent));

                // Обновляем состояние редактора
                setEditorState((prevState) =>
                    EditorState.forceSelection(updatedEditorState, prevState.getSelection()) // Сохраняем текущую позицию курсора
                );
            } catch (error) {
                console.error("Failed to parse or update editorState:", error);
            }
        };

        socket.on('block_updated', handleBlockUpdate);

        return () => {
            socket.off('block_updated', handleBlockUpdate); // Очистка обработчиков
        };
    }, []);

    return (
        <div className='border'>
            <Editor
                editorState={editorState}
                onChange={setEditorState}
                placeholder="Start to type... Draft.js"

            />
            {/* {saving && <p className="text-sm text-gray-500">Saving...</p>} */}
        </div>
    );
}
