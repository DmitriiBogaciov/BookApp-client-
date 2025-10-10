'use client'

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Page } from '@/app/utils/interfaces';

interface PageInfoTooltipProps {
  page: Page;
  depth: number;
  index: number;
  parentId: string | null;
  isVisible: boolean;
  mousePosition: { x: number; y: number };
}

/**
 * PageInfoTooltip component displays detailed information about a page when hovering
 * 
 * This component is essential for debugging and understanding the tree structure:
 * - Shows current page depth and hierarchy
 * - Displays parent-child relationships  
 * - Reveals internal IDs and order values
 * - Helps validate drag-and-drop calculations
 * 
 * @param page - Page object containing all page data
 * @param depth - Current nesting level in the tree (0 = root)
 * @param index - Position within the flattened array
 * @param parentId - ID of the parent page (null for root pages)
 * @param isVisible - Whether tooltip should be displayed
 * @param mousePosition - Current mouse coordinates for positioning
 */
export default function PageInfoTooltip({
  page,
  depth,
  index,
  parentId,
  isVisible,
  mousePosition,
}: PageInfoTooltipProps) {
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  /**
   * Calculate optimal tooltip position to avoid viewport overflow
   * This function ensures tooltip is always visible within the window bounds
   */
  useEffect(() => {
    if (!isVisible || !tooltipRef.current) return;

    const tooltip = tooltipRef.current;
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let x = mousePosition.x + 50; // 50px offset from cursor
    let y = mousePosition.y + 10;

    // Adjust horizontal position if tooltip would overflow
    if (x + tooltipRect.width > viewport.width) {
      x = mousePosition.x - tooltipRect.width - 10;
    }

    // Adjust vertical position if tooltip would overflow
    if (y + tooltipRect.height > viewport.height) {
      y = mousePosition.y - tooltipRect.height - 10;
    }

    // Ensure tooltip doesn't go off-screen on the left or top
    x = Math.max(10, x);
    y = Math.max(10, y);

    setTooltipPosition({ x, y });
  }, [mousePosition, isVisible]);

  if (!isVisible) return null;

  /**
   * Get readable parent information
   */
  const getParentInfo = () => {
    if (!parentId) return 'Root level (no parent)';
    return `${parentId}`;
  };

  /**
   * Calculate indentation in pixels
   */
  const indentationPixels = depth * 20; // assuming 20px per level

  return createPortal(
    <div
      ref={tooltipRef}
      className="fixed z-[9999] bg-gray-900 text-white text-xs rounded-lg shadow-xl border border-gray-700 p-3 min-w-[280px]"
      style={{
        left: tooltipPosition.x,
        top: tooltipPosition.y,
        pointerEvents: 'none', // Prevent tooltip from interfering with mouse events
      }}
    >
      {/* Header with page title */}
      <div className="border-b border-gray-600 pb-2 mb-2">
        <h4 className="font-semibold text-sm text-blue-300">
          📄 {page.title || 'Untitled Page'}
        </h4>
      </div>

      {/* Tree structure information */}
      <div className="space-y-1">
        <div className="grid grid-cols-2 gap-x-3">
          <span className="text-gray-400">ID:</span>
          <span className="font-mono text-xs">{page._id}</span>
        </div>

        <div className="grid grid-cols-2 gap-x-3">
          <span className="text-gray-400">Depth:</span>
          <span className="font-semibold text-yellow-300">{depth}</span>
        </div>

        <div className="grid grid-cols-2 gap-x-3">
          <span className="text-gray-400">Index:</span>
          <span className="text-blue-300">{index}</span>
        </div>

        <div className="grid grid-cols-2 gap-x-3">
          <span className="text-gray-400">Parent:</span>
          <span className="font-mono text-xs text-green-300">
            {getParentInfo()}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-3">
          <span className="text-gray-400">Order:</span>
          <span className="text-purple-300">{page.order || 0}</span>
        </div>

        <div className="grid grid-cols-2 gap-x-3">
          <span className="text-gray-400">Indentation:</span>
          <span className="text-orange-300">{indentationPixels}px</span>
        </div>
      </div>
      
    </div>,
    document.body
  );
}