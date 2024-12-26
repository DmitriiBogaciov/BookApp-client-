'use client';

import { useEffect, useState } from 'react';
import { Block } from '@/app/utils/interfaces';
import BlockComp from './block';
import { getBlocksForPage } from '@/app/actions/blockActions';
import socket from '@/app/utils/socket'; // Импортируем общий socket

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
                const fetchedBlocks = await getBlocksForPage(pageId);
                setBlocks(fetchedBlocks);
            } catch (err) {
                console.error('Ошибка при загрузке блоков:', err);
                setError('Не удалось загрузить блоки.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlocks();

        // Подключаемся к WebSocket и присоединяемся к странице
        socket.emit('join_page', pageId);

        // Слушаем события обновления блоков
        const handleBlockUpdate = ({ blockId, content }: { blockId: string; content: any }) => {
            setBlocks((prevBlocks) =>
                prevBlocks.map((block) =>
                    block._id === blockId ? { ...block, content } : block
                )
            );
        };

        const handleBlockState = (updatedBlocks: Block[]) => {
            setBlocks(updatedBlocks);
        };

        socket.on('block_updated', handleBlockUpdate);
        socket.on('block_state', handleBlockState);

        return () => {
            // Удаляем обработчики при размонтировании
            socket.off('block_updated', handleBlockUpdate);
            socket.off('block_state', handleBlockState);
        };
    }, [pageId]);

    if (loading) return <div>Загрузка блоков...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <ul>
            {blocks.map((block) => (
                <BlockComp key={block._id} block={block} />
            ))}
        </ul>
    );
}
