'use client';

import React, { useState, useEffect } from 'react';
import { Page } from '@/app/utils/interfaces';
import { getBookPages, createPage, removeOnePage } from '@/app/services/page-service';
import { useRouter } from '@/i18n/navigation';
import { usePagesStore } from '@/app/store/pages-store';

interface UsePagesResult {
    pages: Page[];
    expandedPages: Set<string> | null;
    onCreatePage?: (bookId: string, parentId: string | null) => Promise<void>;
    togglePageExpansion: (pageId: string) => void;
    onRemovePage?: (pageId: string) => Promise<void>;
}

interface UsePagesProps {
    bookId: string;
    expandedBook?: boolean;
}

const getInitialExpandedPages = (KEY: string): Set<string> => {
    try {
        const saved = localStorage.getItem(`${KEY}`);
        if (saved) {
            return new Set(JSON.parse(saved));
        }
    } catch (error) {
        console.error('Error getting initial expanded pages:', error);
    }
    return new Set<string>();
}

export default function usePages({
    bookId,
    expandedBook
}: UsePagesProps): UsePagesResult {
    const {
        pages,
        setPages,
        updatePage: updatePageInStore,
        addPage: addPageInStore,
        removePage: removePageInStore
    } = usePagesStore();
    const EXPANDED_PAGES_KEY = `expandedPages-${bookId}`;
    const router = useRouter();
    const [expandedPages, setExpandedPages] = useState<Set<string>>(getInitialExpandedPages(EXPANDED_PAGES_KEY));
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (expandedBook && !loaded) {
            const fetchPages = async () => {
                try {
                    const result = await getBookPages(bookId);
                    setPages(result);
                    setLoaded(true);
                } catch (error) {
                    console.error('Error fetching pages:', error);
                }
            };
            fetchPages();
        }
    }, [bookId, expandedBook, loaded, setPages]);

    useEffect(() => {
        if (expandedBook) {
            try {
                // console.log(`Saving expanded pages for ${bookId}, expandedPages: ${JSON.stringify(Array.from(expandedPages))}`);
                localStorage.setItem(EXPANDED_PAGES_KEY, JSON.stringify(Array.from(expandedPages)));
            } catch (error) {
                console.error('Error saving expanded pages to localStorage:', error);
            }
        }
    }, [EXPANDED_PAGES_KEY, bookId, expandedBook, expandedPages]);

    const togglePageExpansion = (pageId: string) => {
        // console.log(`Toggling expansion for pageId: ${pageId}`);
        setExpandedPages((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(pageId)) {
                newSet.delete(pageId);
            } else {
                newSet.add(pageId);
            }
            return newSet;
        });
    }

    const handleCreatePage = async (bookId: string, parentId: string | null) => {
        try {
            console.log(`Creating page for bookId: ${bookId}, parentId: ${parentId}`);
            const newPage = await createPage(bookId, parentId);
            setPages([...pages, newPage]);
            if (parentId !== null) {
                setExpandedPages((prev) => new Set(prev).add(parentId));
            }
            router.push(`/studio/book/${bookId}/page/${newPage._id}`);
        } catch (error) {
            console.error('Error creating page:', error);
        }
    }

    const handleRemovePage = async (pageId: string) => {
        try {
            console.log(`Removing page with id: ${pageId}`);
            await removeOnePage(pageId);
            setPages(pages.filter((page: Page) => page._id !== pageId));
            router.push(`/studio/book/${bookId}`);
        } catch (error) {
            console.error('Error removing book:', error);
        }
    }

    return {
        pages: pages,
        expandedPages,
        onCreatePage: handleCreatePage,
        togglePageExpansion,
        onRemovePage: handleRemovePage
        // addPage,
        // removePage,
    };
}

