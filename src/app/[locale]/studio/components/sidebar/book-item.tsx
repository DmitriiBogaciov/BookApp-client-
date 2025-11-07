'use client';

import React, { useEffect, useState } from 'react';
import usePages from '../../hooks/use-pages';
import { Book, Page } from '@/app/utils/interfaces';
import { Link } from '@/i18n/navigation';
import { SlOptions } from "react-icons/sl";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import ContextMenu from '@/app/[locale]/utils/context-menu';
import SortablePageTree from './pages-list';

interface BookItemProps {
  book: Book;
  toggleBookExpansion: (bookId: string) => void;
  expandedBook: boolean;
  handleRemoveBook?: (bookId: string) => void;
}

const BookItem = ({
  book,
  toggleBookExpansion,
  expandedBook,
  handleRemoveBook
}: BookItemProps) => {
  const {
    pages,
    expandedPages,
    onCreatePage,
    togglePageExpansion,
    onRemovePage
  } = usePages({
    bookId: book._id,
    expandedBook
  });
  const [activeMenu, setActiveMenu] = useState<{ pageId: string, x: number, y: number } | null>(null);

  if (!book._id || !book.title) {
    console.warn(`Invalid book data: ${JSON.stringify(book)}`);
    return null;
  }

  const handleMenuClick = (e: React.MouseEvent, pageId: string) => {
    e.stopPropagation();
    if (activeMenu && activeMenu.pageId === pageId) {
      setActiveMenu(null);
    } else {
      setActiveMenu({ pageId, x: e.clientX, y: e.clientY });
    }
  };

  return (
    <>
        {/* Заголовок книги */}
        <div className="border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
          <div className='flex justify-between items-center p-2'>
            <div className="flex items-center flex-1">
              <button
                onClick={() => toggleBookExpansion(book._id)}
                className="mr-2 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
              >
                {expandedBook ? (
                  <FaChevronDown size={12} className="text-slate-600 dark:text-slate-400" />
                ) : (
                  <FaChevronRight size={12} className="text-slate-600 dark:text-slate-400" />
                )}
              </button>
              <Link
                href={`/studio/book/${book._id}`}
                className="text-slate-700 dark:text-slate-300 hover:text-baoboox-600 dark:hover:text-baoboox-400 font-normal no-underline flex-1 transition-colors"
              >
                {book.title}
              </Link>
            </div>
            <div className="flex items-center">
              <button
                onClick={(e) => handleMenuClick(e, book._id)}
                className='p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors'
                title="Book options"
              >
                <SlOptions className='text-sm text-slate-600 dark:text-slate-400' />
              </button>
            </div>
          </div>
        </div >
        {expandedBook && (
          <div className=''>
            <SortablePageTree
              bookId={book._id}
              expandedPages={expandedPages}
              onCreatePage={onCreatePage}
              pages={pages}
              togglePageExpansion={togglePageExpansion}
              onRemovePage={onRemovePage}
            />
            <div>
              <div className="p-2 text-sm text-slate-500 dark:text-slate-400 italic">
                <button
                  onClick={() => {
                    if (onCreatePage) {
                      onCreatePage(book._id, null);
                    }
                  }}
                  className="text-slate-600 dark:text-slate-400 hover:text-baoboox-600 dark:hover:text-baoboox-400 transition-colors"
                >
                  + Add new page
                </button>
              </div>
            </div>
          </div>
        )}
      {activeMenu && (
        <ContextMenu
          visible={!!activeMenu}
          x={activeMenu.x}
          y={activeMenu.y}
          onClose={() => setActiveMenu(null)}
        >
          <div className="p-2">
            <button
              onClick={() => {
                if (handleRemoveBook) {
                  handleRemoveBook(activeMenu.pageId);
                }
                setActiveMenu(null);
              }}
              className="block w-full text-left text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1 transition-colors"
            >
              Delete
            </button>
          </div>
        </ContextMenu>
      )}
    </>
  );
};

export default BookItem;
