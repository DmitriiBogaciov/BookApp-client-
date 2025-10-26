'use client';

import React, { useState } from 'react';
import Sidebar from '@/app/[locale]/studio/components/sidebar/studio-side-bar';
import { IoMenu } from 'react-icons/io5';

export default function StudioShell({
  books,
  children,
}: {
  books: any,
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="studio-shell flex h-full">
      <div className={`studio-shell-sidebar-container relative h-full ${isSidebarOpen ? 'w-56' : 'hidden'} transition-all duration-200 ease-in-out`}>
        <div className="studio-shell-sidebar absolute inset-y-0 left-0 right-0 z-20">
          <Sidebar
            Books={books}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </div>
      </div>
      <div className="studio-shell-content relative flex-1 h-full">
        <div className='studio-shell-content-top-nav bg-white flex w-full h-8 items-center'>
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-7 h-7 flex items-center justify-center"
            >
              <IoMenu size={25} />
            </button>)}
        </div>
        <div className="studio-shell-content-main flex justify-center h-[calc(100vh-32px-56px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}