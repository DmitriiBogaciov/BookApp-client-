'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Book } from '@/app/utils/interfaces';
import { Link } from '@/navigation';
import { SlOptions } from "react-icons/sl";
import { createBook, removeOneBook } from '@/app/actions/bookActions';
import IconMenu from './icon-menu';
// import { Habibi } from 'next/font/google';

interface StudioSideBarProps {
  Books: Book[];
}

const StudioSideBar = ({ Books }: StudioSideBarProps) => {
  const [activeMenu, setActiveMenu] = useState<{ bookId: string, x: number, y: number } | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleCreateBook = async () => {
    createBook();
  };

  const handleRemoveBook = async (id:string) => {
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
    <div className="w-64 border h-screen border-black p-4 bg-gray-100">
      <div className="flex justify-between items-center mb-4 font-bold">
        <span>Books</span>
        <button
          className="text-xl font-bold"
          onClick={() => handleCreateBook()}
        >
          +
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
                <Link href={`/studio/book/${book._id}`} className="no-underline flex-1 p-1">
                  {book.title}
                </Link>
                <button onClick={(e) => handleMenuClick(e, book._id)} className='content-center'>
                  <SlOptions className='mr-1'/>
                </button>
                {activeMenu && activeMenu.bookId === book._id && (
                  <div
                    ref={menuRef}
                    className="absolute"
                    style={{ top: `${activeMenu.y}px`, left: `${activeMenu.x}px` }}
                  >
                    <IconMenu onDelete={() => handleRemoveBook(book._id)}/>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StudioSideBar;
