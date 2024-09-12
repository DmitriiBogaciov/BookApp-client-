import React from 'react';
import { Book } from '@/app/utils/interfaces';
import { Link } from '@/navigation';

interface StudioSideBarProps {
  Books: Book[];
}

const StudioSideBar = ({ Books}: StudioSideBarProps) => {
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
        <button className="text-xl font-bold">+</button>
      </div>
      <ul className="list-none p-0">
        {Books.map((book) => {
          if (!book._id || !book.title) {
            console.warn(`Invalid book data: ${JSON.stringify(book)}`);
            return null;
          }
          return (
            <div key={book._id}>
              <Link
                href={`/studio/book/${book._id}`}
                className="no-underline"
              >
                <li
                  className="border border-black p-2 mb-2 hover:bg-gray-200 cursor-pointer"
                >
                  {book.title}
                </li>
              </Link>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default StudioSideBar;