import { useState, useEffect } from 'react';
import { Book } from '@/app/utils/interfaces';
import { gql, useSubscription } from '@apollo/client';
import { createBook, removeOneBook } from '@/app/actions/bookActions';
import { useRouter } from '@/i18n/navigation';

const BOOKS_SUBSCRIPTION = gql`
  subscription {
    bookUpdated {
      _id
      title
    }
  }
`;

const EXPANDED_BOOKS_KEY = 'studio-expanded-books';

const getInitialExpandedBooks = (): Set<string> => {
  try {
    const saved = localStorage.getItem(EXPANDED_BOOKS_KEY);
    console.log(`Initial expanded books: ${saved}`);
    return saved ? new Set<string>(JSON.parse(saved)) : new Set<string>();
  } catch (error) {
    console.error('Error loading expanded books from localStorage:', error);
    return new Set<string>();
  }
};

export const useBooksState = (initialBooks: Book[]) => {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [expandedBooks, setExpandedBooks] = useState<Set<string>>(getInitialExpandedBooks);
  const { data: newBookData } = useSubscription(BOOKS_SUBSCRIPTION);

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

  const handleCreateBook = async () => {
    try {
      const book = await createBook();
      if (book && book._id) {
        setBooks(prev => [...prev, book]);
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
      setBooks(prev => prev.filter(book => book._id !== id));
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

  useEffect(() => {
    if (newBookData?.bookUpdated) {
      setBooks(prev =>
        prev.map(book =>
          book._id === newBookData.bookUpdated._id ? newBookData.bookUpdated : book
        )
      );
    }
  }, [newBookData]);

  return {
    books,
    setBooks,
    expandedBooks,
    toggleBookExpansion,
    handleCreateBook,
    handleRemoveBook,
  };
};
