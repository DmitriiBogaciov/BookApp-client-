import { create } from 'zustand';
import { Page } from '@/app/utils/interfaces';

interface PagesState {
  pagesByBook: Record<string, Page[]>;
  getPages: (bookId: string) => Page[];
  setPages: (bookId: string, pages: Page[]) => void;
  updatePage: (bookId: string, pageId: string, data: Partial<Page>) => void;
  addPage: (bookId: string, page: Page) => void;
  removePage: (bookId: string, pageId: string) => void;
}

const EMPTY_PAGES: Page[] = Object.freeze([]) as unknown as Page[];

export const usePagesStore = create<PagesState>((set, get) => ({
  pagesByBook: {},
  getPages: (bookId: string): Page[] => get().pagesByBook[bookId] ?? EMPTY_PAGES,
  setPages: (bookId: string, pages: Page[]): void =>
    set((state) => ({
      pagesByBook: { ...state.pagesByBook, [bookId]: pages },
    })),
  updatePage: (bookId: string, pageId: string, data: Partial<Page>): void => {
    set((state) => {
      const list = state.pagesByBook[bookId] ?? EMPTY_PAGES;
      return {
        pagesByBook: {
          ...state.pagesByBook,
          [bookId]: list.map((p) => (p._id === pageId ? { ...p, ...data } : p)),
        },
      };
    });
  },
  addPage: (bookId: string, page: Page): void =>
    set((state) => {
      const list = state.pagesByBook[bookId] ?? EMPTY_PAGES;
      return {
        pagesByBook: { ...state.pagesByBook, [bookId]: [...list, page] },
      };
    }),
  removePage: (bookId: string, pageId: string): void =>
    set((state) => {
      const list = state.pagesByBook[bookId] ?? EMPTY_PAGES;
      return {
        pagesByBook: {
          ...state.pagesByBook,
          [bookId]: list.filter((p) => p._id !== pageId),
        },
      };
    }),
}));