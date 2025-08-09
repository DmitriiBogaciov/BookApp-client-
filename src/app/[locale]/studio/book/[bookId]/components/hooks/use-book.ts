'use client'

import { useState, useEffect } from 'react';
import { Book } from '@/app/utils/interfaces';
import { updateBook } from '@/app/services/book-service';
import { gql, useSubscription } from '@apollo/client';
import { useBooksStore } from '@/app/store/books-store';

const BOOK_UPDATED = gql`
  subscription bookUpdated($id: String!) {
    bookUpdated(id: $id) {
      _id
      title
      description
    }
  }
`;

export default function useBookState(initialBook: Book) {
  const [book, setBook] = useState<Book>(initialBook);

  // Zustand store
  const { updateBook: updateBookInStore, books } = useBooksStore();

  // Синхронизируем локальное состояние с глобальным Zustand
  useEffect(() => {
    const found = books.find((b) => b._id === initialBook._id);
    if (found) setBook(found);
  }, [books, initialBook._id]);

  // Подписка на обновления книги
  useSubscription(BOOK_UPDATED, {
    variables: { id: book._id },
    onSubscriptionData: ({ subscriptionData }) => {
      console.log('Book updated subscription data:', subscriptionData.data.bookUpdated);
      const updatedBook = subscriptionData.data.bookUpdated;
      setBook((prev) => ({ ...prev, ...updatedBook }));
      updateBookInStore(updatedBook._id, updatedBook); // обновляем глобальный store
    },
  });

  // Обновление книги (и локально, и в store)
  const handleUpdateBook = async (bookId: string, bookData: Partial<Book>) => {
    try {
      const updatedBook = await updateBook(bookId, bookData, ['_id', 'title', 'description']);
      console.log('Book updated:', updatedBook);
      setBook((prev) => ({ ...prev, ...updatedBook }));
      updateBookInStore(updatedBook._id, updatedBook); // обновляем глобальный store
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  return {
    book,
    setBook,
    handleUpdateBook,
    updateBookInStore
  };
}