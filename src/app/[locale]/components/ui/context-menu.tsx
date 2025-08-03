'use client'

import React, { useEffect, useRef } from 'react';

interface ContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  onClose: () => void;
  children: React.ReactNode;
}

export default function ContextMenu({ visible, x, y, onClose, children }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return;
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-slate-300 opacity-30"
        onClick={onClose}
        aria-label="Close context menu"
      />
      {/* Menu */}
      <div
        ref={menuRef}
        className="absolute bg-white border shadow-lg rounded z-50"
        style={{ top: `${y}px`, left: `${x}px` }}
        onClick={e => e.stopPropagation()} // чтобы клик по меню не закрывал его
      >
        {children}
      </div>
    </>
  );
}