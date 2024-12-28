'use client';

import { Editor, EditorState, RawDraftContentState, convertFromRaw, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { useState, useEffect } from 'react';
import socket from '@/app/utils/socket'; // Импортируем socket
import { Block } from '@/app/utils/interfaces';

interface DraftEditorProps {
    block: { content: any; _id: string; pageId: string }; // ID страницы для работы через socket
}

export default function DraftEditor({ block }: DraftEditorProps) {
    const initialState = block.content
        ? EditorState.createWithContent(convertFromRaw(typeof block.content === 'string' ? JSON.parse(block.content) : block.content))
        : EditorState.createEmpty();

    const [editorState, setEditorState] = useState(initialState);
    const [saving, setSaving] = useState(false); // Индикатор сохранения

    // Сохранение контента через socket


    // Автосохранение при изменении содержимого
    useEffect(() => {
        const saveContent = () => {
            setSaving(true);

            try {
                const rawContent = convertToRaw(editorState.getCurrentContent()); // Сериализация содержимого
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

    // Обновление контента через socket при получении событий
    useEffect(() => {
        const handleBlockUpdate = ({ blockId: updatedBlockId, content }: { blockId: string; content: any }) => {
            if (updatedBlockId === block.pageId) {
                const newState = EditorState.createWithContent(convertFromRaw(content));
                setEditorState(newState);
            }
        };

        socket.on('block_updated', handleBlockUpdate);

        return () => {
            socket.off('block_updated', handleBlockUpdate); // Очистка обработчиков
        };
    }, [block.pageId]);

    return (
        <div>
            <Editor
                editorState={editorState}
                onChange={setEditorState}
                placeholder="Type some draft text"
            />
            {saving && <p className="text-sm text-gray-500">Saving...</p>}
        </div>
    );
}
