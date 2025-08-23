'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Page } from '@/app/utils/interfaces';
import PageItem from './page-item';

type SortablePageItemProps = {
  page: Page;
  bookId: string;
  depth: number;
  indentationWidth?: number;
  expandedPage?: boolean;
  onCreatePage?: (bookId: string, parentId: string | null) => Promise<void>;
  togglePageExpansion?: (pageId: string) => void;
  onRemovePage?: (pageId: string) => Promise<void>;
};

/**
 * SortablePageItem
 * Wraps PageItem with dnd-kit useSortable to enable drag-and-drop.
 *
 * Params:
 * - page: Page — page entity to render and make draggable.
 * - bookId: string — current book id.
 * - depth: number — visual nesting level (0 for root).
 * - indentationWidth?: number — pixels per depth level (default: 20).
 * - expandedPage?: boolean — whether this page is expanded in the tree.
 * - onCreatePage?: function — handler to create a child page.
 * - togglePageExpansion?: function — handler to toggle expand/collapse.
 * - onRemovePage?: function — handler to remove the page.
 *
 * Logic:
 * - Initializes useSortable with id = page._id.
 * - Applies dnd-kit transform/transition to a wrapper <div>.
 * - Adds left padding based on depth * indentationWidth for visual indentation.
 *
 * Returns:
 * - JSX element wrapping PageItem with sortable attributes and listeners.
 */
export default function SortablePageItem({
  page,
  bookId,
  depth,
  indentationWidth = 20,
  expandedPage,
  onCreatePage,
  togglePageExpansion,
  onRemovePage,
}: SortablePageItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: page._id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    cursor: 'grab',
    paddingLeft: Math.max(0, depth) * indentationWidth,
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <PageItem
        page={page}
        bookId={bookId}
        expandedPage={expandedPage}
        onCreatePage={onCreatePage}
        togglePageExpansion={togglePageExpansion}
        onRemovePage={onRemovePage}
      />
    </div>
  );
}