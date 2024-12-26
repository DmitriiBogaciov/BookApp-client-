'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
    Editor,
    EditorState,
    convertFromRaw,
    convertToRaw,
    RawDraftContentState,
} from 'draft-js';
import socket from '@/app/utils/socket'; // Используем общий socket
import { Block } from '@/app/utils/interfaces';

interface BlockProps {
    block: Block;
}

export default function BlockComp({ block }: BlockProps) {
    const initializeEditorState = (content: string | RawDraftContentState) => {
        try {
            const parsedContent =
                typeof content === 'string' ? JSON.parse(content) : content;

            if (isValidRawDraftContentState(parsedContent)) {
                return EditorState.createWithContent(convertFromRaw(parsedContent));
            } else {
                console.error('Неверный формат RawDraftContentState:', parsedContent);
                return EditorState.createEmpty();
            }
        } catch (error) {
            console.error('Ошибка при обработке контента:', error);
            return EditorState.createEmpty();
        }
    };

    const isValidRawDraftContentState = (content: any): boolean => {
        return (
            content &&
            typeof content === 'object' &&
            Array.isArray(content.blocks) &&
            typeof content.entityMap === 'object'
        );
    };

    // Инициализация состояния редактора
    const [editorState, setEditorState] = useState(() =>
        block.content ? initializeEditorState(block.content) : EditorState.createEmpty()
    );

    // Хранение предыдущего состояния для сравнения
    const previousContentRef = useRef<string | null>(null);

    const handleEditorChange = (state: EditorState) => {
        setEditorState(state);

        // Получаем текущее содержимое
        const currentContent = JSON.stringify(convertToRaw(state.getCurrentContent()));

        // Сравниваем с предыдущим содержимым
        if (previousContentRef.current !== currentContent) {
            previousContentRef.current = currentContent; // Обновляем ссылку на текущее содержимое

            // Отправляем изменения только если они отличаются
            socket.emit('update_block', {
                pageId: block.pageId,
                blockId: block._id,
                content: currentContent,
            });
        }
    };

    useEffect(() => {
        // Обновляем предыдущий контент при загрузке блока
        previousContentRef.current = JSON.stringify(
            convertToRaw(editorState.getCurrentContent())
        );

        const handleExternalUpdate = ({ blockId, content }: { blockId: string; content: any }) => {
            if (blockId === block._id) {
                const parsedContent = JSON.parse(content);
                const contentState = convertFromRaw(parsedContent);
                setEditorState(EditorState.createWithContent(contentState));
                previousContentRef.current = content; // Синхронизируем предыдущее состояние
            }
        };

        socket.on('block_updated', handleExternalUpdate);

        return () => {
            socket.off('block_updated', handleExternalUpdate);
        };
    }, [block._id, editorState]);

    return (
        <div style={{ border: '1px solid #ddd', padding: '10px', minHeight: '100px' }}>
            <Editor
                editorState={editorState}
                onChange={handleEditorChange}
                placeholder="Введите содержимое блока..."
            />
        </div>
    );
}
