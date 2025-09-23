'use client'

import { Page } from '@/app/utils/interfaces';
import { Link } from '@/i18n/navigation';
import ContextMenu from '@/app/[locale]/components/ui/context-menu';
import { SlOptions } from "react-icons/sl";
import { IoMdAdd } from 'react-icons/io';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import React, { forwardRef, HTMLAttributes, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortablePageItemProps {
    page: Page,
    bookId: string,
    depth?: number;
    ref?: React.Ref<HTMLDivElement>;
    isDragOverlay?: boolean;
    indentationWidth?: number;
    expandedPage?: boolean;
    onCreatePage?: (bookId: string, parentId: string | null) => Promise<void>;
    togglePageExpansion?: (pageId: string) => void;
    onRemovePage?: (pageId: string) => Promise<void>;
}

export default function SortablePageItem(
    {
        page,
        expandedPage,
        depth,
        indentationWidth = 20,
        isDragOverlay = false,
        ref,
        onCreatePage,
        bookId,
        togglePageExpansion,
        onRemovePage,
        ...props
    }: SortablePageItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        isSorting,
    } = useSortable({
        id: page._id,
    });
    const [activeMenu, setActiveMenu] = useState<{ pageId: string, x: number, y: number } | null>(null);
    const [hovered, setHovered] = useState(false);

    const combinedRef = (node: HTMLDivElement | null) => {
        setNodeRef(node);
        if (typeof ref === 'function') {
            ref(node);
        }
        // Do not assign to ref.current if ref is a read-only object
    };

    const dragStyle = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    const indentationStyle = {
        paddingLeft: depth ? depth * indentationWidth : 0,
    };

    const handleMenuClick = (e: React.MouseEvent, pageId: string) => {
        e.stopPropagation();
        if (activeMenu && activeMenu.pageId === pageId) {
            setActiveMenu(null);
        } else {
            setActiveMenu({ pageId, x: e.clientX, y: e.clientY });
        }
    };

    return (
        <>
            <div
                ref={combinedRef}
                style={{ ...dragStyle, ...indentationStyle }}
                {...attributes}
                {...props}
                className={`
                    flex items-center justify-between 
                    m-1 px-2 py-2 rounded 
                    transition-colors duration-200
                    hover:bg-gray-300
                    ${isDragging ? 'z-50' : ''}
                    ${isDragOverlay ? 'shadow-lg bg-white border' : ''}
                    `}
            >
                <div>
                    <button
                        className="inline-flex justify-center items-center mr-2 p-1 
                     text-gray-500 hover:text-gray-800 transition-colors"
                        onClick={() => togglePageExpansion?.(page._id)}
                        style={{ width: 20, height: 20 }}
                        tabIndex={-1}
                    >
                        {expandedPage ? (
                            <FaChevronDown size={12} />
                        ) : (
                            <FaChevronRight size={12} />
                        )}
                    </button>
                    {/* Page icon */}
                    <span className="mr-2 text-gray-400" style={{ fontSize: 16 }}>
                        📄
                    </span>
                    <Link
                        href={`/studio/book/${bookId}/page/${page._id}`}
                        className="truncate text-sm !text-gray-700 hover:!text-gray-900 font-normal !no-underline flex-1"
                    >
                        {page.title || 'Untitled Page'}
                    </Link>
                </div>
                {/* Action buttons (visible on hover) */}
                <div className="flex items-center gap-1">
                    {/* Create subpage button */}
                    <button
                        className="p-1 hover:bg-gray-200 rounded text-gray-500 
                     hover:text-gray-800 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            onCreatePage?.(bookId, page._id);
                        }}
                        title="Create subpage"
                        tabIndex={-1}
                    >
                        <IoMdAdd className="text-base" />
                    </button>

                    {/* Options menu button */}
                    <button
                        className="p-1 hover:bg-gray-200 rounded text-gray-500 
                     hover:text-gray-800 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleMenuClick?.(e, page._id);
                        }}
                        title="Page options"
                        tabIndex={-1}
                    >
                        <SlOptions className="text-base" />
                    </button>

                    {/* Drag handle */}
                    <div
                        {...listeners}
                        className="p-1 cursor-grab active:cursor-grabbing text-gray-400 
                     hover:text-gray-600 transition-colors"
                        title="Drag to reorder"
                    >
                        <div className="flex flex-col gap-0.5">
                            <div className="w-1 h-1 bg-current rounded-full"></div>
                            <div className="w-1 h-1 bg-current rounded-full"></div>
                            <div className="w-1 h-1 bg-current rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
            {activeMenu && (
                <ContextMenu
                    visible={!!activeMenu}
                    x={activeMenu.x}
                    y={activeMenu.y}
                    onClose={() => setActiveMenu(null)}
                >
                    <div className="p-2">
                        <button
                            onClick={() => {
                                if (onRemovePage) {
                                    onRemovePage(activeMenu.pageId);
                                }
                                setActiveMenu(null);
                            }}
                            className="block w-full text-left text-red-600 hover:text-red-800 p-1"
                        >
                            Delete
                        </button>
                    </div>
                </ContextMenu>
            )}
        </>
    );
};
