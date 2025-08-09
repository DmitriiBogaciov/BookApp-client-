import { create } from 'zustand';
import { Page } from '@/app/utils/interfaces';

interface PagesState {
  pages: Page[];
  setPages: (pages: Page[]) => void;
  updatePage: (pageId: string, data: Partial<Page>) => void;
  addPage: (page: Page) => void;
  removePage: (pageId: string) => void;
}

export const usePagesStore = create<PagesState>((set) => ({
  pages: [],
  setPages: (pages) => set({ pages }),
  updatePage: (pageId, data) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p._id === pageId ? { ...p, ...data } : p
      ),
    })),
  addPage: (page) =>
    set((state) => ({
      pages: [...state.pages, page],
    })),
  removePage: (pageId) =>
    set((state) => ({
      pages: state.pages.filter((p) => p._id !== pageId),
    })),
}));