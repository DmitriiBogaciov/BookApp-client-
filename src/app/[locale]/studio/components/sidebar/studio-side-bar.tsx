'use client'

import React, {useEffect} from 'react';
import { Book } from '@/app/utils/interfaces';
import { Link } from '@/navigation';
import { useStudioContext } from '@/app/contexts/studio-context'
import { SlOptions } from "react-icons/sl";
import BookServise from '@/app/services/bookService';
import { createBook } from '@/app/actions/bookActions';

const bookService = new BookServise();

interface StudioSideBarProps {
  Books: Book[];
}

const StudioSideBar = ({ Books }: StudioSideBarProps) => {

  const { books, setBooks } = useStudioContext()
  
  useEffect(() => {
    if (Books && Books.length > 0) {
      setBooks(Books);
    }
  },[Books, setBooks])

  // const createBook = async () => {
  //   bookService.createBook()
  // }

  if (!Books || Books.length === 0) {
    return (
      <div className="w-64 border h-screen border-black p-4 bg-gray-100">
        <div className="flex justify-between items-center mb-4 font-bold">
          <span>Books</span>
          <button className="text-xl font-bold">+</button>
        </div>
        <p>No books available.</p>
      </div>
    );
  }

  return (
    <div className="w-64 border h-screen border-black p-4 bg-gray-100">
      <div className="flex justify-between items-center mb-4 font-bold">
        <span>Books</span>
        <button
          className="text-xl font-bold"
          onClick={() => createBook()}
        >
          +
        </button>
      </div>
      <ul className="list-none p-0">
        {books.map((book) => {
          if (!book._id || !book.title) {
            console.warn(`Invalid book data: ${JSON.stringify(book)}`);
            return null;
          }
          return (
              <li key={book._id}
                className="border border-black p-2 mb-2 hover:bg-gray-200 cursor-pointer"
              >
                <Link
                  href={`/studio/book/${book._id}`}
                  className="no-underline"
                >
                  <div className='flex justify-between'>
                    <div className=''>

                      {book.title}


                    </div>
                    <div className='content-center'>
                      <SlOptions />
                    </div>
                  </div>
                </Link>
              </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StudioSideBar;