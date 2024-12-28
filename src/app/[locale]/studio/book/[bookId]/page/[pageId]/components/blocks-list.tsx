'use client';

import { useEffect, useState } from 'react';
import { Block } from '@/app/utils/interfaces';
import BlockRenderer from './block-render';
import { getBlocksForPage } from '@/app/actions/blockActions';
import socket from '@/app/utils/socket'; // Общий socket для подключения

interface BlocksListProps {
    pageId: string;
}

export default function BlocksList({ pageId }: BlocksListProps) {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchBlocks = async () => {
            setLoading(true);
            setError(null);

            try {
                const fetchedBlocks = await getBlocksForPage(pageId); // Получаем блоки с сервера
                setBlocks(fetchedBlocks);
            } catch (err) {
                console.error('Ошибка при загрузке блоков:', err);
                setError('Не удалось загрузить блоки.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlocks(); // Загружаем блоки при монтировании компонента

        // Подключаемся к WebSocket
        socket.emit('join_page', pageId);

        // Обработчик обновления одного блока
        const handleBlockUpdate = ({ blockId, content }: { blockId: string; content: any }) => {
            setBlocks((prevBlocks) =>
                prevBlocks.map((block) =>
                    block._id === blockId ? { ...block, content } : block
                )
            );
        };

        // Обработчик синхронизации всех блоков
        // const handleBlockState = (updatedBlocks: Block[]) => {
        //     setBlocks(updatedBlocks);
        // };

        // Устанавливаем слушатели событий
        socket.on('block_updated', handleBlockUpdate);
        // socket.on('block_state', handleBlockState);

        // Удаляем обработчики при размонтировании
        return () => {
            socket.off('block_updated', handleBlockUpdate);
            // socket.off('block_state', handleBlockState);
        };
    }, [pageId]);

    if (loading) return <div>Загрузка блоков...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <ul className="block-list">
            {blocks.map((block) => (
                <BlockRenderer
                    key={block._id}
                    block={block}
                />
            ))}
        </ul>
    );
}
