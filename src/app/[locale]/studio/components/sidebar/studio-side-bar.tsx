'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Book, Page } from '@/app/utils/interfaces';
import { useBooksState } from '../hooks/use-books';
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
    <div className='relative h-full bg-gray-100 border-r border-gray-200 shadow-lg'>
      <div className={`flex sticky top-0 bg-gray-100 z-50 justify-between items-center font-bold shrink-0`}>
        <span className='flex-1'>Books</span>
        <button
          className="text-xl! font-bold pr-2"
          onClick={() => handleCreateBook()}
        >
          +
        </button>
        <button
          onClick={toggleSidebar}
          className={`w-7 h-7`}
        >
          <BiChevronsLeft size={32} />
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
