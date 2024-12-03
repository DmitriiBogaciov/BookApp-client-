'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Book } from '@/app/utils/interfaces';
import { Link } from '@/navigation';
import { SlOptions } from "react-icons/sl";
import { createBook, removeOneBook } from '@/app/actions/bookActions';
import IconMenu from './studio-icon-menu';
import CloseIcon from '@mui/icons-material/Close';
// import { Habibi } from 'next/font/google';

interface StudioSideBarProps {
  Books: Book[];
}

const StudioSideBar = ({ Books }: StudioSideBarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState<{ bookId: string, x: number, y: number } | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  const handleCreateBook = async () => {
    createBook();
  };

  const handleRemoveBook = async (id: string) => {
    removeOneBook(id)
  }

  const handleMenuClick = (event: React.MouseEvent, bookId: string) => {
    event.stopPropagation();
    setActiveMenu((prev) =>
      prev && prev.bookId === bookId
        ? null
        : { bookId, x: event.clientX, y: event.clientY }
    );
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    if (activeMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenu]);

  return (
    <div
      className={`h-full bg-gray-100 border-r border-gray-200 shadow-lg transition-all overflow-hidden w-64 duration-200 ease-in-out 
        ${isSidebarOpen ? 'w-44 p-2' : 'w-14'}`}
    >
      {
        !isSidebarOpen && (
          <div className='flex justify-center pt-2'>
            <button
              onClick={toggleSidebar}
              className={`transition ease-in-out delay-150 bg-blue-100 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-200 duration-300`}
            >
              Books
            </button>
          </div>
        )
      }
      <div className={`${isSidebarOpen ? 'block' : 'hidden'}`}>
        <div className={`flex justify-between items-center mb-4 font-bold`}>
          <span className='flex-1'>Books</span>
          <button
            className="text-xl font-bold pr-2"
            onClick={() => handleCreateBook()}
          >
            +
          </button>
          <button
            onClick={toggleSidebar}
            className={``}
          >
            <CloseIcon />
          </button>
        </div>
        <ul className="list-none p-0">
          {Books.map((book) => {
            if (!book._id || !book.title) {
              console.warn(`Invalid book data: ${JSON.stringify(book)}`);
              return null;
            }
            return (
              <li key={book._id} className="border border-black mb-2 hover:bg-gray-200 cursor-pointer">
                <div className='flex justify-between'>
                  <Link href={`/studio/book/${book._id}`} className="no-underline flex-1 p-1 overflow-hidden">
                    {book.title}
                  </Link>
                  <button onClick={(e) => handleMenuClick(e, book._id)} className='content-center'>
                    <SlOptions className='mr-1' />
                  </button>
                  {activeMenu && activeMenu.bookId === book._id && (
                    <div
                      ref={menuRef}
                      className="absolute"
                      style={{ top: `${activeMenu.y}px`, left: `${activeMenu.x}px` }}
                    >
                      <IconMenu onDelete={() => handleRemoveBook(book._id)} />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  )
};

export default StudioSideBar;
