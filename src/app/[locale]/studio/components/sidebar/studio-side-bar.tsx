'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Book, Page } from '@/app/utils/interfaces';
import { useBooksState } from '../hooks/use-books';
import BookList from './book-list';
import { BiChevronsLeft, BiChevronsRight } from "react-icons/bi";
import { IoMenu } from "react-icons/io5";

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
    <>
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="
            hidden md:flex
            fixed top-16 left-4 z-50
            w-7 h-7
            items-center justify-center
            rounded-full
          bg-gray-200 text-gray-700 shadow-lg
          hover:bg-gray-300 hover:text-gray-900 hover:scale-105
            transition-all duration-200
            border-2 border-white
          "
          aria-label="Open sidebar"
        >
          <BiChevronsRight size={32} />
        </button>
      )}
      <div className='p-2 width-full md:hidden z-50 bg-transparent'>
        <button
          onClick={toggleSidebar}
          className="w-7 h-7 flex items-center justify-center"
        >
          <IoMenu size={32} />
        </button>
      </div>
      <div
        className={`fixed top-14 left-0 h-screen bg-gray-100 border-r z-50 border-gray-200 shadow-lg transition-all duration-200 ease-in-out 
          ${isSidebarOpen ? 'min-w-56 max-w-56 p-2' : 'w-0'}`}
      >
        <div className={`${isSidebarOpen ? 'block' : 'hidden'}`}>
          <div className={`flex justify-between items-center mb-4 font-bold`}>
            <span className='flex-1'>Books</span>
            <button
              className="!text-xl font-bold pr-2"
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
      </div>
    </>
  );
}
export default StudioSideBar;
