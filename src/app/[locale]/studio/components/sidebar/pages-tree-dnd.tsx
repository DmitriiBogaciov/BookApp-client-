'use client';

import React, { useMemo, useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragMoveEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Page } from '@/app/utils/interfaces';
import SortablePageItem from './sortable-page-item';
import PageDragOverlay from './page-drag-overlay';
import {
  flattenVisiblePages,
  getProjectionForPointer,
  computeDragState,
  diffOrderAndParentChanges,
} from './tree-utils';
import { updatePagesBatch } from '@/app/services/page-service';

type PagesTreeDndProps = {
  bookId: string;
  pages: Page[];
  expandedPages: Set<string> | null;
  indentationWidth?: number;
  onCreatePage?: (bookId: string, parentId: string | null) => Promise<void>;
  togglePageExpansion?: (pageId: string) => void;
  onRemovePage?: (pageId: string) => Promise<void>;
  onApply?: (next: Page[]) => void; // optional optimistic UI callback (not used here)
};

/**
 * PagesTreeDnd
 * Renders hierarchical pages as a sortable list and shows a live-indented drag overlay.
 *
 * Inputs:
 * - bookId: string — current book id.
 * - pages: Page[] — flat list of pages.
 * - expandedPages: Set<string> | null — expanded node ids (null = all expanded).
 * - indentationWidth?: number — pixels per indent level (default 20).
 * - onCreatePage, togglePageExpansion, onRemovePage — handlers passed to PageItem.
 * - onApply?: (next) => void — optional optimistic update on drop (not used in this step).
 *
 * Logic:
 * - Builds a visible flat list in render order via flattenVisiblePages.
 * - Tracks drag state: activeId, overId, offsetX.
 * - Computes a live projection via getProjectionForPointer to determine projected depth during drag.
 * - Renders DragOverlay with PageDragOverlay using the projected depth for proper indentation.
 *
 * Returns:
 * - JSX: DndContext + SortableContext + SortablePageItem rows + DragOverlay with correct indentation.
 */
export default function PagesTreeDnd({
  bookId,
  pages,
  expandedPages,
  indentationWidth = 20,
  onCreatePage,
  togglePageExpansion,
  onRemovePage,
  onApply,
}: PagesTreeDndProps) {
  // Visible nodes in render order
  const visible = useMemo(() => flattenVisiblePages(pages, expandedPages), [pages, expandedPages]);
  const items = useMemo(() => visible.map((n) => n.id), [visible]);

  // Depth lookup for fallback when no projection is available
  const depthById = useMemo(() => {
    const m = new Map<string, number>();
    visible.forEach((n) => m.set(n.id, n.depth));
    return m;
  }, [visible]);

  // Fast page lookup by id
  const pageById = useMemo(() => new Map(pages.map((p) => [p._id, p])), [pages]);

  // Drag state
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [offsetX, setOffsetX] = useState(0);

  // Sensors
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  // Handlers: only manage state for overlay in this step
  const onDragStart = useCallback(({ active }: DragStartEvent) => {
    const id = String(active.id);
    setActiveId(id);
    setOverId(id);
    setOffsetX(0);
    if (typeof document !== 'undefined') document.body.style.setProperty('cursor', 'grabbing');
  }, []);

  const onDragMove = useCallback(({ delta }: DragMoveEvent) => {
    setOffsetX(delta.x);
  }, []);

  const onDragOver = useCallback(({ over }: DragOverEvent) => {
    setOverId(over?.id ? String(over.id) : null);
  }, []);

  const reset = () => {
    setActiveId(null);
    setOverId(null);
    setOffsetX(0);
    if (typeof document !== 'undefined') document.body.style.setProperty('cursor', '');
  };

  const onDragCancel = useCallback(() => reset(), []);

  const onDragEnd = useCallback(
    async ({ over }: DragEndEvent) => {
      try {
        if (!activeId || !over?.id) {
          reset();
          return;
        }

        // Compute projected result and next pages state
        const { projection, nextPages } = computeDragState(
          pages,
          expandedPages ?? null,
          activeId,
          String(over.id),
          offsetX,
          indentationWidth
        );

        if (!projection) {
          reset();
          return;
        }

        // Compute minimal diff and persist via GraphQL batch update
        const changes = diffOrderAndParentChanges(pages, nextPages, bookId);

        if (changes.length > 0) {
          // Optimistic UI (optional)
          onApply?.(nextPages);

          await updatePagesBatch(
            changes.map((c) => ({ id: c.id, parentId: c.parentId, order: c.order })),
            ['_id']
          );
        }
      } catch (e) {
        console.error('Failed to persist pages reorder:', e);
        // No rollback logic here because we did not mutate local state unless onApply was provided
      } finally {
        reset();
      }
    },
    [activeId, pages, expandedPages, offsetX, indentationWidth, bookId, onApply]
  );

  // Live projection for overlay indentation
  const projection =
    activeId && overId
      ? getProjectionForPointer(visible, activeId, overId, offsetX, indentationWidth)
      : null;

  const overlayDepth = projection?.depth ?? (activeId ? depthById.get(activeId) ?? 0 : 0);

  const activePage = activeId ? pageById.get(activeId) ?? null : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((id) => {
          const page = pageById.get(id);
          if (!page) return null;
          const depth = id === activeId && projection ? projection.depth : (depthById.get(id) ?? 0);
          const isExpanded = expandedPages ? expandedPages.has(id) : true;

          return (
            <SortablePageItem
              key={id}
              page={page}
              bookId={bookId}
              depth={depth}
              indentationWidth={indentationWidth}
              expandedPage={isExpanded}
              onCreatePage={onCreatePage}
              togglePageExpansion={togglePageExpansion}
              onRemovePage={onRemovePage}
            />
          );
        })}
      </SortableContext>

      <DragOverlay>
        {activePage ? (
          <PageDragOverlay
            page={activePage}
            bookId={bookId}
            depth={overlayDepth}
            indentationWidth={indentationWidth}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}