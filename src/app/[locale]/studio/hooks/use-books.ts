'use client'

import { useState, useEffect } from 'react';
import { Book } from '@/app/utils/interfaces';
import { createBook, removeOneBook, updateBook } from '@/app/services/book-service';
import { useRouter } from '@/i18n/navigation';
import { useBooksStore } from '@/app/store/books-store';

const EXPANDED_BOOKS_KEY = 'studio-expanded-books';

const getInitialExpandedBooks = (): Set<string> => {
  try {
    const saved = localStorage.getItem(EXPANDED_BOOKS_KEY);
    return saved ? new Set<string>(JSON.parse(saved)) : new Set<string>();
  } catch (error) {
    console.error('Error loading expanded books from localStorage:', error);
    return new Set<string>();
  }
};

export const useBooksState = (initialBooks: Book[]) => {
  // Zustand store
  const {
    books,
    setBooks,
    updateBook: updateBookInStore,
    addBook: addBookInStore,
    removeBook: removeBookInStore
  } = useBooksStore();

  const router = useRouter();
  const [expandedBooks, setExpandedBooks] = useState<Set<string>>(getInitialExpandedBooks);

  // Инициализация книг из пропсов
  useEffect(() => {
    setBooks(initialBooks);
  }, [initialBooks, setBooks]);

  // Сохраняем expandedBooks в localStorage
  useEffect(() => {
    try {
      localStorage.setItem(EXPANDED_BOOKS_KEY, JSON.stringify(Array.from(expandedBooks)));
    } catch (error) {
      console.error('Error saving expanded books to localStorage:', error);
    }
  }, [expandedBooks]);

  const toggleBookExpansion = (bookId: string) => {
    setExpandedBooks(prev => {
      const next = new Set(prev);
      next.has(bookId) ? next.delete(bookId) : next.add(bookId);
      return next;
    });
  };

  const handleUpdateBook = async (bookId: string, book: Partial<Book>) => {
    try {
      const newBook = await updateBook(bookId, book, ['_id', 'title']);
      updateBookInStore(newBook._id, newBook);
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleCreateBook = async () => {
    try {
      const book = await createBook();
      if (book && book._id) {
        addBookInStore(book);
        setExpandedBooks(prev => {
          const next = new Set(prev);
          next.add(book._id);
          return next;
        });
        router.push(`/studio/book/${book._id}`);
      } else {
        console.error('Failed to create book');
      }
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

  const handleRemoveBook = async (id: string) => {
    try {
      await removeOneBook(id);
      removeBookInStore(id);
      setExpandedBooks(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      router.push(`/studio`);
    } catch (error) {
      console.error('Error removing book:', error);
    }
  };

  return {
    books,
    setBooks,
    expandedBooks,
    toggleBookExpansion,
    handleCreateBook,
    handleRemoveBook,
    handleUpdateBook
  };
};
