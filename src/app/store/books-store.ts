import { create } from 'zustand';
import { Book } from '@/app/utils/interfaces';

interface BooksState {
  books: Book[];
  setBooks: (books: Book[]) => void;
  updateBook: (bookId: string, data: Partial<Book>) => void;
  addBook: (book: Book) => void;
  removeBook: (bookId: string) => void;
}

export const useBooksStore = create<BooksState>((set) => ({
  books: [],
  setBooks: (books) => set({ books }),
  updateBook: (bookId, data) =>
    set((state) => ({
      books: state.books.map((b) =>
        b._id === bookId ? { ...b, ...data } : b
      ),
    })),
  addBook: (book) =>
    set((state) => ({
      books: [...state.books, book],
    })),
  removeBook: (bookId) =>
    set((state) => ({
      books: state.books.filter((b) => b._id !== bookId),
    })),
}));