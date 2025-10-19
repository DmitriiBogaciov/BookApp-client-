'use client';

import React, { useState } from 'react';
import Sidebar from '@/app/[locale]/studio/components/sidebar/studio-side-bar';

export default function StudioShell({
  books,
  children,
}: {
  books: any,
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const SIDEBAR_WIDTH = 224; // px
  //  const SIDEBAR_WIDTH = 0;

  return (
    <div className="studio-shell md:flex">
      <Sidebar
        Books={books}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div
        className="flex-1"
        style={{
          marginLeft: isSidebarOpen ? SIDEBAR_WIDTH : 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}