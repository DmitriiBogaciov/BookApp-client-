'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import {
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragMoveEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import type { Page } from '@/app/utils/interfaces';
import {
  flattenVisiblePages,
  computeDragState,
  diffOrderAndParentChanges,
} from './tree-utils';

/**
 * usePagesDnd
 * React hook that wires up dnd-kit for hierarchical pages and computes
 * visible order, depth per id, projection, and next state on drop.
 *
 * Params:
 * - pages: Page[] — current flat array of pages for the book.
 * - expanded: Set<string> | null — expanded node ids (null means all expanded).
 * - bookId: string — current book id to filter diffs for persistence.
 * - indentationWidth?: number — pixels per nesting level (default: 20).
 * - onApply?: (next: Page[]) => void — optional optimistic UI apply on drop.
 * - onPersist?: (changes, next) => Promise<void> | void — optional persistence callback (batch save).
 *
 * Logic:
 * - Builds visible = flattenVisiblePages(pages, expanded) for render order and depth.
 * - Tracks activeId, overId, offsetX during drag.
 * - On drop: computeDragState → nextPages; diffOrderAndParentChanges(prev,next,bookId) → changes;
 *   calls onApply(next) and onPersist(changes,next).
 *
 * Returns:
 * - {
 *     sensors,                         // dnd-kit sensors for <DndContext />
 *     items,                           // string[]: visible ids (render order) for <SortableContext />
 *     getDepth: (id) => number,        // depth lookup for indentation
 *     activeId, overId, offsetX,       // current drag state
 *     onDragStart, onDragMove, onDragOver, onDragEnd, onDragCancel // handlers
 *   }
 */
export function usePagesDnd({
  pages,
  expanded,
  bookId,
  indentationWidth = 20,
  onApply,
  onPersist,
}: {
  pages: Page[];
  expanded: Set<string> | null;
  bookId: string;
  indentationWidth?: number;
  onApply?: (next: Page[]) => void;
  onPersist?: (
    changes: Array<{ id: string; parentId: string | null; order: number }>,
    next: Page[]
  ) => Promise<void> | void;
}) {
  // Build visible list in render order and derive items/depth
  const visible = useMemo(() => flattenVisiblePages(pages, expanded), [pages, expanded]);
  const items = useMemo(() => visible.map((n) => n.id), [visible]);
  const depthById = useMemo(() => {
    const m = new Map<string, number>();
    visible.forEach((n) => m.set(n.id, n.depth));
    return m;
  }, [visible]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [offsetX, setOffsetX] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  // Keep last known drag context to compute on drop
  const last = useRef({
    pages,
    expanded,
    activeId: null as string | null,
    overId: null as string | null,
    offsetX: 0,
  });
  last.current.pages = pages;
  last.current.expanded = expanded;

  const onDragStart = useCallback(({ active }: DragStartEvent) => {
    const id = String(active.id);
    setActiveId(id);
    setOverId(id);
    setOffsetX(0);
    last.current.activeId = id;
    last.current.overId = id;
    last.current.offsetX = 0;
    if (typeof document !== 'undefined') {
      document.body.style.setProperty('cursor', 'grabbing');
    }
  }, []);

  const onDragMove = useCallback(({ delta }: DragMoveEvent) => {
    setOffsetX(delta.x);
    last.current.offsetX = delta.x;
  }, []);

  const onDragOver = useCallback(({ over }: DragOverEvent) => {
    const id = over?.id ? String(over.id) : null;
    setOverId(id);
    last.current.overId = id;
  }, []);

  const reset = () => {
    setActiveId(null);
    setOverId(null);
    setOffsetX(0);
    last.current.activeId = null;
    last.current.overId = null;
    last.current.offsetX = 0;
    if (typeof document !== 'undefined') {
      document.body.style.setProperty('cursor', '');
    }
  };

  const onDragCancel = useCallback(() => {
    reset();
  }, []);

  const onDragEnd = useCallback(
    async ({ active, over }: DragEndEvent) => {
      try {
        const aId = String(active.id);
        const oId = over?.id ? String(over.id) : null;
        if (!oId || aId === oId) {
          reset();
          return;
        }

        // Compute next state using projection
        const { nextPages } = computeDragState(
          last.current.pages,
          last.current.expanded,
          aId,
          oId,
          last.current.offsetX,
          indentationWidth
        );

        // Compute minimal diff for persistence
        const changes = diffOrderAndParentChanges(last.current.pages, nextPages, bookId);

        // Optimistic UI apply
        onApply?.(nextPages);

        // Persist (batch) if provided and there are changes
        if (changes.length && onPersist) {
          await onPersist(changes, nextPages);
        }
      } finally {
        reset();
      }
    },
    [bookId, indentationWidth, onApply, onPersist]
  );

  return {
    sensors,
    items,
    getDepth: (id: string) => depthById.get(id) ?? 0,
    activeId,
    overId,
    offsetX,
    onDragStart,
    onDragMove,
    onDragOver,
    onDragEnd,
    onDragCancel,
  } as const;
}