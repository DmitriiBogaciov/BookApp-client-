'use client'

import { Page } from '@/app/utils/interfaces';
import { Link } from '@/i18n/navigation';
import React, { useState } from 'react';
import ContextMenu from '@/app/[locale]/components/ui/context-menu';
import { SlOptions } from "react-icons/sl";
import { IoMdAdd } from 'react-icons/io';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
// + DnD
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';

interface PageItemProps {
    page: Page,
    bookId: string,
    expandedPage?: boolean;
    onCreatePage?: (bookId: string, parentId: string | null) => Promise<void>;
    togglePageExpansion?: (pageId: string) => void;
    onRemovePage?: (pageId: string) => Promise<void>;
    // + глубина для aria-level и отступа
    depth?: number;
}

export default function PageItem({
    page,
    expandedPage,
    onCreatePage,
    bookId,
    togglePageExpansion,
    onRemovePage,
    depth = 1
}: PageItemProps) {
    const [activeMenu, setActiveMenu] = useState<{ pageId: string, x: number, y: number } | null>(null);
    const [hovered, setHovered] = useState(false);

    // Sortable для самой строки
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: page._id });
    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
        paddingLeft: depth * 12,
        cursor: 'grab',
        userSelect: 'none',
    };

    // Отдельная зона сброса "сделать дочерним" для этой страницы
    const childContainerId = `container:${page._id}`;
    const { setNodeRef: setChildDropRef, isOver: isOverChildZone } = useDroppable({ id: childContainerId });

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
            {page._id && (
                <div
                    ref={setNodeRef}
                    style={style}
                    aria-level={depth}
                    aria-selected={false}
                    aria-expanded={!!expandedPage}
                    className={`flex items-center justify-between m-1 px-1 py-1 rounded transition-colors duration-100 ${hovered ? 'bg-gray-200' : ''}`}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    {...attributes}
                    {...listeners}
                >
                    <div className="flex items-center flex-1 min-w-0">
                        <span className="inline-flex justify-center items-center mr-2" style={{ width: 22 }}>
                            <button
                                className="p-1 text-gray-500 hover:text-gray-800 transition"
                                onClick={(e) => { e.stopPropagation(); togglePageExpansion?.(page._id); }}
                                tabIndex={-1}
                                style={{ width: 20, height: 20 }}
                                aria-label={expandedPage ? 'Collapse' : 'Expand'}
                            >
                                {expandedPage ? <FaChevronDown size={14} /> : <FaChevronRight size={14} />}
                            </button>
                        </span>
                        <Link
                            href={`/studio/book/${bookId}/page/${page._id}`}
                            className="truncate text-sm !text-gray-700 hover:!text-gray-900 font-normal !no-underline flex-1"
                        >
                            {page.title || 'Untitled Page'}
                        </Link>
                    </div>

                    {/* Зона для "сделать дочерним" — появляется при наведении/перетаскивании */}
                    <div
                        ref={setChildDropRef}
                        aria-hidden="true"
                        className={`ml-2 px-2 py-1 rounded text-[10px] border border-dashed ${
                            isOverChildZone ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-transparent text-gray-400'
                        } ${hovered ? 'opacity-100' : 'opacity-0'} transition-opacity`}
                        title="Drop here to nest"
                    >
                        Child
                    </div>

                    {/* Кнопки при наведении */}
                    {hovered && (
                        <div className="flex items-center gap-1">
                            <button
                                className="p-1 hover:bg-gray-300 rounded text-gray-500 hover:text-gray-800 transition"
                                onClick={(e) => { e.stopPropagation(); onCreatePage?.(bookId, page._id); }}
                                title="Создать страницу"
                                tabIndex={-1}
                            >
                                <IoMdAdd className='text-base' />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleMenuClick(e, page._id); }}
                                className='p-1 hover:bg-gray-300 rounded text-gray-500 hover:text-gray-800 transition'
                                title="Опции страницы"
                                tabIndex={-1}
                            >
                                <SlOptions className='text-base' />
                            </button>
                        </div>
                    )}
                </div>
            )}
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
}
