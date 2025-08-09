'use client';

import React, { useState } from 'react';
import { Book } from '@/app/utils/interfaces';
import BookItem from './book-item';

interface BookListProps {
    books: Book[];
    toggleBookExpansion: (bookId: string) => void;
    expandedBooks?: Set<string>;
    handleRemoveBook?: (bookId: string) => void;
}

export default function BookList({
    books,
    toggleBookExpansion,
    expandedBooks,
    handleRemoveBook
}: BookListProps) {
    return (
        <div className="book-list h-[calc(100vh-150px)] overflow-y-auto">
            {books.map((book) => (
                <BookItem key={book._id}
                    book={book}
                    expandedBook={expandedBooks?.has(book._id) || false}
                    toggleBookExpansion={toggleBookExpansion}
                    handleRemoveBook={handleRemoveBook}
                />
            ))}
        </div>
    );
};
