'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Book, Page } from '@/app/utils/interfaces';
import { useBooksState } from '../../hooks/use-books';
import BookList from './book-list';
import { BiChevronsLeft, BiChevronsRight } from "react-icons/bi";
interface StudioSideBarProps {
  Books: Book[];
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const StudioSideBar = ({
  Books,
  isSidebarOpen,
  setIsSidebarOpen,
}: StudioSideBarProps) => {
  const {
    books,
    setBooks,
    expandedBooks,
    toggleBookExpansion,
    handleCreateBook,
    handleRemoveBook
  } = useBooksState(Books);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className='relative h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-lg'>
      <div className={`flex sticky top-0 bg-white dark:bg-slate-900 z-50 justify-between items-center font-bold shrink-0 p-2 border-b border-slate-200 dark:border-slate-800`}>
        <span className='flex-1 text-slate-800 dark:text-slate-200'>Books</span>
        <button
          className="text-xl font-bold px-3 py-1 rounded-lg hover:bg-baoboox-500 hover:text-white dark:hover:bg-baoboox-600 transition-all duration-200 text-baoboox-600 dark:text-baoboox-400"
          onClick={() => handleCreateBook()}
        >
          +
        </button>
        <button
          onClick={toggleSidebar}
          className={`w-7 h-7 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors`}
        >
          <BiChevronsLeft size={32} className="text-slate-700 dark:text-slate-300" />
        </button>
      </div>
      <BookList
        books={books}
        expandedBooks={expandedBooks}
        toggleBookExpansion={toggleBookExpansion}
        handleRemoveBook={handleRemoveBook}
      />
    </div>
  );
}
export default StudioSideBar;
