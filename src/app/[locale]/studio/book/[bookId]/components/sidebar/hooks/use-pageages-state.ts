import { useState, useEffect } from 'react';
import { Page } from '@/app/utils/interfaces';
import { gql, useSubscription } from '@apollo/client';

const PAGE_CREATED_SUBSCRIPTION = gql`
  subscription PageCreated($bookId: String!) {
    pageCreated(bookId: $bookId){
      _id
      title
      bookId
      parentId
    }
  }
`;

const PAGE_REMOVED_SUBSCRIPTION = gql`
  subscription {
    pageRemoved {
      _id
    }
  }
`;

const PAGE_UPDATED_SUBSCRIPTION = gql`
  subscription {
    pageUpdated{
      _id
      title
      bookId
      parentId
    }
  }
`;

export const usePagesState = (bookId: string, initialPages: Page[]) => {
    const [pagesFlat, setPagesFlat] = useState<Page[]>(initialPages);
    const [childrenCache, setChildrenCache] = useState<{ [id: string]: Page[] }>({});
    
    const { data: createdPage } = useSubscription(PAGE_CREATED_SUBSCRIPTION, { variables: { bookId } });
    const { data: removedPage } = useSubscription(PAGE_REMOVED_SUBSCRIPTION);
    const { data: updatedPage } = useSubscription(PAGE_UPDATED_SUBSCRIPTION);

    // Handle page updates
    useEffect(() => {
        if (updatedPage?.pageUpdated) {
            const newPage = updatedPage.pageUpdated;
            
            setPagesFlat((prevPages) =>
                prevPages.map((page) =>
                    page._id === newPage._id ? newPage : page
                )
            );
            
            setChildrenCache(prev => {
                const updated = { ...prev };
                Object.keys(updated).forEach(parentId => {
                    updated[parentId] = updated[parentId].map(child => 
                        child._id === newPage._id ? newPage : child
                    );
                });
                return updated;
            });
        }
    }, [updatedPage]);

    // Handle page creation
    useEffect(() => {
        if (createdPage?.pageCreated) {
            const newPage = createdPage.pageCreated;
            setPagesFlat((prev) => [...prev, newPage]);
            
            if (newPage.parentId) {
                setChildrenCache(prev => ({
                    ...prev,
                    [newPage.parentId]: [
                        ...(prev[newPage.parentId] || []),
                        newPage
                    ]
                }));
            }
        }
    }, [createdPage]);

    // Handle page removal
    useEffect(() => {
        if (removedPage?.pageRemoved) {
            const removedPageId = removedPage.pageRemoved._id;
            
            setPagesFlat((prevPages) => prevPages.filter(page => page._id !== removedPageId));
            
            setChildrenCache(prev => {
                const updated = { ...prev };
                Object.keys(updated).forEach(parentId => {
                    updated[parentId] = updated[parentId].filter(child => child._id !== removedPageId);
                });
                return updated;
            });
        }
    }, [removedPage]);

    return {
        pagesFlat,
        childrenCache,
        setChildrenCache,
        setPagesFlat
    };
};