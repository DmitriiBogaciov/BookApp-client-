'use client'

import { Page } from '@/app/utils/interfaces';
import { Link } from '@/i18n/navigation';
import ContextMenu from '@/app/[locale]/components/ui/context-menu';
import PageInfoTooltip from './page-info-tooltip';
import { SlOptions } from "react-icons/sl";
import { IoMdAdd } from 'react-icons/io';
import { CgFileDocument } from "react-icons/cg";
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import React, { forwardRef, HTMLAttributes, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FlattenedItem } from './types'
import clsx from 'clsx';

interface SortablePageItemProps {
    page: FlattenedItem,
    bookId: string,
    depth?: number;
    index?: number;
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
        depth = 0,
        index = 0,
        indentationWidth = 16,
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

    // State for context menu
    const [activeMenu, setActiveMenu] = useState<{ pageId: string, x: number, y: number } | null>(null);

    // State for debug tooltip
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const [mousePosition, setMousePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [activeArrow, setActiveArrow] = useState<boolean>(false);

    /**
     * Combines refs for both drag-and-drop and forwarded ref
     * This ensures proper integration with dnd-kit while supporting external refs
     */
    const combinedRef = (node: HTMLDivElement | null) => {
        setNodeRef(node);
        if (typeof ref === 'function') {
            ref(node);
        }
    };

    /**
     * Calculates drag transform styles
     * Reduces opacity during drag to provide visual feedback
     */
    const dragStyle = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    /**
     * Calculates indentation width in pixels
     * This creates the visual hierarchy by adding left margin
     */
    const indentationPixels = depth * indentationWidth;

    /**
     * Handles context menu display for page options
     * Toggles menu visibility and positions it at cursor location
     */
    const handleMenuClick = (e: React.MouseEvent, pageId: string) => {
        e.stopPropagation();
        if (activeMenu && activeMenu.pageId === pageId) {
            setActiveMenu(null);
        } else {
            setActiveMenu({ pageId, x: e.clientX, y: e.clientY });
        }
    };

    /**
     * Handles mouse enter for tooltip display
     * Tracks mouse position for accurate tooltip positioning
     */
    const handleMouseEnter = (e: React.MouseEvent) => {
        setShowTooltip(true);
        setMousePosition({ x: e.clientX, y: e.clientY });
    };

    /**
     * Handles mouse movement to update tooltip position
     * Ensures tooltip follows cursor for better UX
     */
    const handleMouseMove = (e: React.MouseEvent) => {
        if (showTooltip) {
            setMousePosition({ x: e.clientX, y: e.clientY });
        }
    };

    /**
     * Handles mouse leave to hide tooltip
     * Cleans up tooltip state when not hovering
     */
    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    return (
        <>
            <div
                ref={combinedRef}
                style={dragStyle}
                {...attributes}
                {...props}
                className={`
                    flex items-center
                    rounded
                    transition-colors duration-200
                    hover:bg-gray-300
                    ${isDragging ? 'z-50' : ''}
                    ${isDragOverlay ? 'shadow-lg bg-white border' : ''}
                `}
            // onMouseEnter={handleMouseEnter}
            // onMouseMove={handleMouseMove}
            // onMouseLeave={handleMouseLeave}
            >
                {/* Visual indentation spacer - THIS IS CRITICAL FOR TREE HIERARCHY */}
                <div
                    style={{ width: indentationPixels }}
                    className="flex-shrink-0"
                    aria-hidden="true"
                >
                </div>

                {/* Main content area */}
                <div className="flex items-center justify-between flex-1 min-w-0 px-1 py-1">
                    <div className="flex items-center flex-1 min-w-0">
                        {/* Drag handle */}
                        {/* <div
                            {...listeners}
                            className="p-1 cursor-grab active:cursor-grabbing text-gray-400 
                         hover:text-gray-600 transition-colors"
                        >
                        </div> */}
                        {/* Expansion toggle button */}
                        {page.hasChildren ? (
                            <button
                                className="inline-flex justify-center items-center mr-1
                         text-gray-500 hover:text-gray-800 transition-colors"
                                onClick={() => togglePageExpansion?.(page._id)}
                                style={{ width: 16, height: 16 }}
                                tabIndex={-1}
                            >
                                {expandedPage ? (
                                    <FaChevronDown size={12} />
                                ) : (
                                    <FaChevronRight size={12} />
                                )}
                            </button>
                        ) : (
                            <span className="inline-block" style={{ width: 16, height: 16 }} aria-hidden="true"></span>
                        )}

                        {/* Page icon */}
                        <CgFileDocument
                            className={`
                                mr-1
                            `}
                            style={{
                                filter: `brightness(${Math.min((1 + depth * 1.5), 6)})`
                             }}
                        />

                        {/* Page title with link */}
                        <Link {...listeners}
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
                    </div>
                </div>
            </div>

            {/* Debug tooltip for development */}
            <PageInfoTooltip
                page={page}
                depth={depth}
                index={index}
                parentId={page.parentId}
                isVisible={showTooltip && !isDragOverlay}
                mousePosition={mousePosition}
            />

            {/* Context menu for page options */}
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
