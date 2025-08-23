'use client';

import React from 'react';
import type { Page } from '@/app/utils/interfaces';
import PageItem from './page-item';

type PageDragOverlayProps = {
  page: Page;
  bookId: string;
  depth: number;               // projected depth during drag
  indentationWidth?: number;   // pixels per depth level (default: 20)
};

/**
 * PageDragOverlay
 * Renders a lightweight clone of PageItem for DragOverlay with proper indentation based on projected depth.
 *
 * Params:
 * - page: Page — the page being dragged.
 * - bookId: string — current book id (passed through to PageItem for consistent rendering).
 * - depth: number — projected nesting level (used to compute left padding).
 * - indentationWidth?: number — indentation per depth level in pixels (default 20).
 *
 * Logic:
 * - Wraps PageItem into a styled container with left padding = depth * indentationWidth.
 * - Adds reduced opacity and pointerEvents: 'none' to avoid interaction during overlay rendering.
 *
 * Returns:
 * - JSX: a visual “ghost” of the page row for dnd-kit <DragOverlay />.
 */
export default function PageDragOverlay({
  page,
  bookId,
  depth,
  indentationWidth = 20,
}: PageDragOverlayProps) {
  const style: React.CSSProperties = {
    paddingLeft: Math.max(0, depth) * indentationWidth,
    width: '100%',
    boxSizing: 'border-box',
    opacity: 0.9,
    pointerEvents: 'none',
    background: 'white',
    border: '1px dashed rgba(0,0,0,0.15)',
    borderRadius: 6,
  };

  return (
    <div style={style}>
      {/* Render a minimal PageItem clone; action handlers not needed in overlay */}
      <PageItem
        page={page}
        bookId={bookId}
        expandedPage={false}
        onCreatePage={undefined}
        togglePageExpansion={undefined}
        onRemovePage={undefined}
      />
    </div>
  );
}