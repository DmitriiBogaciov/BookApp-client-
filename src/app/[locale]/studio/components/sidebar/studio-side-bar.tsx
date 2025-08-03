'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Book, Page } from '@/app/utils/interfaces';
import IconMenu from './studio-icon-menu';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from '@/i18n/navigation'
import { useBooksState } from './hooks/use-books';
import BookList from './book-list';

interface StudioSideBarProps {
  Books: Book[];
}

const StudioSideBar = ({ Books }: StudioSideBarProps) => {
  const {
    books,
    setBooks,
    expandedBooks,
    toggleBookExpansion,
    handleCreateBook,
    handleRemoveBook 
  } = useBooksState(Books);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div
      className={`h-full bg-gray-100 border-r border-gray-200 shadow-lg transition-all overflow-hidden duration-200 ease-in-out 
    ${isSidebarOpen ? 'min-w-56 max-w-56 p-2' : 'min-w-14'}`}
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
      </div>
      <BookList
        books={books}
        expandedBooks={expandedBooks}
        toggleBookExpansion={toggleBookExpansion}
        handleRemoveBook={handleRemoveBook}
        // onMenuClick={handleMenuClick}
        // onDeleteBook={onDeleteBook}
      />
    </div>
  );
}
export default StudioSideBar;
