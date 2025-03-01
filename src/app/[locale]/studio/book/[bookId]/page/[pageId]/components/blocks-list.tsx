'use client'

import { useEffect, useState } from 'react';
import { Block } from '@/app/utils/interfaces';
import { createBlock, removeBlock } from '@/app/actions/blockActions';
import { CreateDtoIn } from '@/app/services/block-service';
import BlockRenderer from './block-render';
import socket from '@/app/utils/socket';
import './loading.css';

interface BlocksListProps {
    blocks: Block[];
    pageId: string;
}

export default function BlocksList({ blocks: initialBlocks, pageId }: BlocksListProps) {
    const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
    const [blockToDelete, setBlockToDelete] = useState<string | null>(null); // ID блока для удаления
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        socket.emit('join_page', pageId);
    }, [pageId]);

    useEffect(() => {
        const handleBlockCreated = (newBlock: Block) => {
            setBlocks((prevBlocks) => [...prevBlocks, newBlock]);
        };

        socket.on('block_created', handleBlockCreated);

        return () => {
            socket.off('block_created', handleBlockCreated);
        };
    }, []);

    const handleBlockCreate = async (DtoIn: CreateDtoIn) => {
        try {
            const newBlock = await createBlock(DtoIn);

            if (newBlock) {
                setBlocks((prevBlocks) => [...prevBlocks, newBlock]);
                console.log(`New block created: ${newBlock}`);
            } else {
                console.log("Error creating a block");
            }
        } catch (error) {
            console.log("Error creating a block", error);
        }
    };

    const confirmDeleteBlock = (id: string) => {
        setBlockToDelete(id);
        setIsModalOpen(true);
    };

    const handleRemoveBlock = async () => {
        if (!blockToDelete) return;

        try {
            const result = await removeBlock(blockToDelete);

            if (result.deletedCount > 0) {
                setBlocks((prevBlocks) => prevBlocks.filter(block => block._id !== blockToDelete));
                console.log(`Block with id ${blockToDelete} was deleted`);
            }
        } catch (error) {
            console.log(`Error deleting a block ${error}`);
        } finally {
            setIsModalOpen(false);
            setBlockToDelete(null);
        }
    };

    return (
        <div className='border border-black'>
            {blocks.length === 0 ? (
                <button onClick={() => handleBlockCreate({ order: 1, pageId })}>
                    Create a new block
                </button>
            ) : (
                blocks.map((block) => (
                    <div key={block._id}>
                        <div className='block-menu flex justify-end'>
                            <button onClick={() => confirmDeleteBlock(block._id)}>Delete</button>
                        </div>
                        <BlockRenderer block={block} />
                        <div className='flex justify-center'>
                            <button
                                className='mb-1 flex-1'
                                onClick={() => handleBlockCreate({ order: block.order, pageId, type: "draft" })}>
                                Create a new block
                            </button></div>
                    </div>
                ))
            )}

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-md">
                        <p>Are you sure you want to delete this block?</p>
                        <div className="flex justify-end mt-4">
                            <button className="mr-2 p-2 bg-gray-300 rounded" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button className="p-2 bg-red-500 text-white rounded" onClick={handleRemoveBlock}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
