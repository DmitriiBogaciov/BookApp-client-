'use client'

import { useEffect, useState } from 'react';
import { Block } from '@/app/utils/interfaces';
import { createBlock, removeBlock } from '@/app/actions/blockActions';
import { CreateDtoIn } from '@/app/services/block-service';
import BlockRenderer from './block-render';
import DeleteIcon from '@mui/icons-material/Delete';
import socket from '@/app/utils/socket';
import './loading.css';
import DeleteBlockModal from './menu-block/delete-modal';
import BlockDeleteButton from './menu-block/block-delete-button'
import BlockMenu from './menu-block/block-menu';

interface BlocksListProps {
    blocks: Block[];
    pageId: string;
}

export default function BlocksList({ blocks: initialBlocks, pageId }: BlocksListProps) {
    const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
    const [blockToDelete, setBlockToDelete] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [hoveredBlock, setHoveredBlock] = useState<{ id: string, x: number, y: number } | null>(null);
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
        setIsDeleteModalOpen(true);
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
            setIsDeleteModalOpen(false);
            setBlockToDelete(null);
        }
    };

    const handleMouseBlockEnter = (event: React.MouseEvent, blockId: string) => {
        const rect = event.currentTarget.getBoundingClientRect();

        setHoveredBlock({
            id: blockId,
            x: rect.left,
            y: rect.top
        })
    }

    const handleMouseBlockLeave = () => {
        setHoveredBlock(null)
    }

    return (
        <div className=''>
            {blocks.length === 0 ? (
                <button onClick={() => handleBlockCreate({ order: 1, pageId, type: "draft" })}>
                    Create a new block
                </button>
            ) : (
                blocks.map((block) => (
                    <div
                        key={block._id}
                        className='group pb-2'
                        onMouseEnter={(e) => handleMouseBlockEnter(e, block._id)}
                        onMouseLeave={handleMouseBlockLeave}
                    >
                        <div className='flex'>
                            {/* <div className='w-[40px]'>
                            <BlockMenu
                                styles='hidden group-hover:flex items-center justify-center'
                                onDelete={() => confirmDeleteBlock(block._id)}
                                onCreate={() => handleBlockCreate({ order: block.order, pageId, type: "draft" })}
                            />
                            </div> */}
                            <div className='flex-1 border border-gray-200 px-[20px]'>
                                <BlockRenderer block={block} />
                            </div>
                        </div>

                        {hoveredBlock && (
                            <BlockMenu
                                classCSS='items-center justify-center'
                                onDelete={() => confirmDeleteBlock(hoveredBlock.id)}
                                onCreate={() => handleBlockCreate({ order: blocks.find(b => b._id === hoveredBlock.id)?.order || 1, pageId, type: "draft" })}
                                style={{
                                    position: 'absolute',
                                    top: hoveredBlock.y,
                                    left: hoveredBlock.x,
                                }}
                            />
                        )}
                    </div>
                ))
            )}

            <DeleteBlockModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleRemoveBlock}
                message='Delete this block?'
            />
        </div>
    );
}
