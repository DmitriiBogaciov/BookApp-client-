'use client';

import { useEffect, useState } from 'react';
import { Block } from '@/app/utils/interfaces';
import BlockRenderer from './block-render';
import { getBlocksForPage, updateBlock } from '@/app/actions/blockActions';
import socket from '@/app/utils/socket'; // Общий socket для подключения
import './loading.css'

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

        fetchBlocks();

    }, [pageId]);

    if (loading) return <div className="lds-ring"><div></div><div></div><div></div><div></div></div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div className='p-2 border border-black'>
            {blocks.map((block) => (
                <BlockRenderer
                    key={block._id}
                    block={block}
                />
            ))}
        </div>
    );
}
