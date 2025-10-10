'use client';

import React, { useMemo, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverlay,
    DragMoveEvent,
    DragEndEvent,
    DragOverEvent,
    MeasuringStrategy,
    DropAnimation,
    defaultDropAnimation,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove
} from '@dnd-kit/sortable';
import SortablePageItem from './page-item';
import { flattenTree, getProjection } from './tree-utils';
import { Page } from '@/app/utils/interfaces';
import { updatePage } from '@/app/services/page-service';
import { usePagesStore } from '@/app/store/pages-store';

// Types for our tree structure
interface FlattenedPage extends Page {
    depth: number;
    parentId: string | null;
    index: number;
}

interface ProjectedPosition {
    depth: number;
    parentId: string | null;
}

interface SortablePageTreeProps {
    bookId: string;
    onCreatePage?: (bookId: string, parentId: string | null) => Promise<void>;
    pages?: Page[],
    expandedPages?: Set<string> | null;
    togglePageExpansion?: (pageId: string) => void;
    onRemovePage?: (pageId: string) => Promise<void>;
    indentationWidth?: number;
}

// Configuration for drag-and-drop measuring
const measuring = {
    droppable: {
        strategy: MeasuringStrategy.Always,
    },
};

// Animation configuration for drop 
const dropAnimation: DropAnimation = {
    ...defaultDropAnimation
};

/**
 * SortablePageTree component provides drag-and-drop functionality for organizing pages in a tree structure
 * 
 * @param pages - Array of pages to display in the tree
 * @param bookId - ID of the book these pages belong to
 * @param expandedPages - Set of page IDs that are currently expanded
 * @param onPagesReorder - Callback to handle reordering of pages
 * @param onCreatePage - Callback to create a new page
 * @param onToggleExpansion - Callback to toggle page expansion
 * @param onRemovePage - Callback to remove a page
 * @param indentationWidth - Width in pixels for each level of indentation
 */

export default function SortablePageTree({
    bookId,
    onCreatePage,
    pages,
    expandedPages,
    togglePageExpansion,
    onRemovePage,
    indentationWidth = 12,
}: SortablePageTreeProps) {
    // State for drag-and-drop operations
    const [activeId, setActiveId] = useState<string | null>(null);
    const [overId, setOverId] = useState<string | null>(null);
    const [offsetLeft, setOffsetLeft] = useState(0);
    const { updatePage: updatePageInStore } = usePagesStore();



    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 }
        })
    )

    /**
         * Recursively gets all descendant page IDs for a given page
         * This is critical for drag-and-drop operations to ensure entire subtrees move together
         * 
         * @param pageId - ID of the parent page
         * @param allPages - Complete array of all pages in the book
         * @returns Array of all descendant page IDs (children, grandchildren, etc.)
         * 
         * @example
         * Input pages:
         * [
         *   { _id: '1', parentId: null },
         *   { _id: '2', parentId: '1' },
         *   { _id: '3', parentId: '2' },
         *   { _id: '4', parentId: '1' },
         * ]
         * 
         * getDescendantIds('1', pages) returns: ['2', '3', '4']
     */

    const getDescendantIds = (pageId: string, allPages: Page[]): string[] => {
        const descendants: string[] = [];

        const collectChildren = (parentId: string) => {
            const children = allPages.filter(page => page.parentId === parentId);
            children.forEach(child => {
                descendants.push(child._id);
                if (parentId === child._id) return; // Prevent self-referencing loops
                collectChildren(child._id)
            });
        };

        collectChildren(pageId);
        return descendants;
    }

    /**
   * Flattens the tree structure into a linear array with depth information
   * This is needed for efficient rendering and drag-and-drop calculations
   * Pages are sorted by their 'order' field at each level
   */
    const flattenedPages = useMemo(() => {
        const flattenedPages = flattenTree(pages || [], expandedPages, activeId, overId);
        // console.log(`Flattened pages:`, flattenedPages);
        return flattenedPages;
    }, [pages, expandedPages, activeId, overId]);

    /**
   * Calculates the projected position when dragging over another item
   * This determines where the item would be placed if dropped
   */

    const projected =
        activeId && overId
            ? getProjection(
                flattenedPages,
                activeId,
                overId,
                offsetLeft,
                indentationWidth)
            : null;

    // Get IDs for SortableContext
    const sortedIds = useMemo(() =>
        flattenedPages.map(page => page._id),
        [flattenedPages]
    );

    // Find active item for drag overlay
    const activeItem = activeId
        ? flattenedPages.find(page => page._id === activeId)
        : null;

    /**
   * Handles the start of a drag operation
   */
    const handleDragStart = ({ active }: DragStartEvent) => {
        setActiveId(active.id as string);
        setOverId(active.id as string);
        document.body.style.setProperty('cursor', 'grabbing');
    };

    /**
  * Handles mouse movement during drag
  * Updates the horizontal offset for depth calculation
  */
    const handleDragMove = ({ delta }: DragMoveEvent) => {
        setOffsetLeft(delta.x);
    };

    /**
   * Handles drag over events
   * Updates which item is being dragged over
   */
    const handleDragOver = ({ over }: DragOverEvent) => {
        setOverId(over?.id as string ?? null);
    };

    /**
   * Handles the end of a drag operation
   * Calculates new positions and updates the page structure
   */
    const handleDragEnd = async ({ active, over }: DragEndEvent) => {
        if (!over || !projected) {
            resetDragState();
            return;
        }

        const activeItem = projected.activeItem;
        const newParentId = projected.parentId;
        //Sibling pages under the new parent
        const prevSibling = flattenedPages
        .slice(0, projected.overIndex)
        .reverse()
        .find(page => page.depth === projected.depth && page.parentId === newParentId);
        const nextSibling = projected.nextItem?.depth === projected.depth && projected.nextItem?.parentId === newParentId
            ? projected.nextItem : null;

        let newOrder = 0;
        if (nextSibling && prevSibling) {
            newOrder = (nextSibling.order + prevSibling.order) / 2;
            console.log(`New order calculated from both siblings: ${newOrder}`);
        } else if (nextSibling) {
            newOrder = nextSibling.order / 2;
            console.log(`New order calculated from nextSibling: ${newOrder}`);
        } else if (prevSibling) {
            newOrder = prevSibling.order + 100;
            console.log(`New order calculated from prevSibling: ${newOrder}`);
        } else {
            newOrder = 100;
            console.log(`New order set as first child: ${newOrder}`);
        }

        //Optimistically update UI
        updatePageInStore(bookId, activeItem._id, {
            parentId: newParentId,
            order: newOrder
        })

        try {
            const updatedPage = await updatePage(activeItem._id, {
                parentId: newParentId,
                order: newOrder,
            }, ['_id, parentId, order']);
            console.log(`Page moved: `, updatedPage);
        } catch (e) {
            updatePageInStore(bookId, activeItem._id, {
                parentId: activeItem.parentId,
                order: activeItem.order,
            });
            console.error("Failed to move page:", e);
        }
        resetDragState();
    };

    /**
   * Handles drag cancellation
   */
    const handleDragCancel = () => {
        resetDragState();
    };

    /**
  * Resets all drag-related state
  */
    const resetDragState = () => {
        setActiveId(null);
        setOverId(null);
        setOffsetLeft(0);
        document.body.style.setProperty('cursor', '');

        console.log(`ResetedDragState activeId:${activeId}`)
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            measuring={measuring}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
                <div className="m-0 p-0">
                    {flattenedPages.map((page) => (
                        <div key={page._id} className="group">
                            <SortablePageItem
                                page={page}
                                bookId={bookId}
                                depth={page._id === activeId && projected ? projected.depth : page.depth}
                                expandedPage={expandedPages?.has(page._id)}
                                indentationWidth={indentationWidth}
                                onCreatePage={onCreatePage}
                                togglePageExpansion={togglePageExpansion}
                                onRemovePage={onRemovePage}
                            />
                        </div>
                    ))}
                </div>
            </SortableContext>

            {/* Drag overlay portal */}
            {createPortal(
                <DragOverlay dropAnimation={dropAnimation}>
                    {activeId && activeItem ? (
                        <SortablePageItem
                            page={activeItem}
                            bookId={bookId}
                            depth={activeItem.depth}
                            isDragOverlay={true}
                            indentationWidth={indentationWidth}
                        />
                    ) : null}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    );
};
