'use client'

import { useState, useEffect } from 'react';
import { Page } from '@/app/utils/interfaces';
import { updatePage } from '@/app/services/page-service';
import { gql, useSubscription } from '@apollo/client';
import { usePagesStore } from '@/app/store/pages-store';

// const PAGE_UPDATED = gql`
//   subscription pageUpdated($id: String!) {
//     pageUpdated(id: $id) {
//       _id
//       title
//       content
//     }
//   }
// `;

export default function usePageState(initialPage: Page) {
  const [page, setPage] = useState<Page>(initialPage);

  // Zustand store
  const { updatePage: updatePageInStore, pages } = usePagesStore();

  // Синхронизируем локальное состояние с глобальным Zustand
  useEffect(() => {
    const found = pages.find((p) => p._id === initialPage._id);
    if (found) setPage(found);
  }, [pages, initialPage._id]);

  // Подписка на обновления страницы
//   useSubscription(PAGE_UPDATED, {
//     variables: { id: page._id },
//     onSubscriptionData: ({ subscriptionData }) => {
//       console.log('Page updated subscription data:', subscriptionData.data.pageUpdated);
//       const updatedPage = subscriptionData.data.pageUpdated;
//       setPage((prev) => ({ ...prev, ...updatedPage }));
//       updatePageInStore(updatedPage._id, updatedPage); // обновляем глобальный store
//     },
//   });

  // Обновление страницы (и локально, и в store)
  const handleUpdatePage = async (pageId: string, pageData: Partial<Page>) => {
    try {
      const updatedPage = await updatePage(pageId, pageData, ['_id', 'title', 'content']);
      console.log('Page updated:', updatedPage);
      setPage((prev) => ({ ...prev, ...updatedPage }));
      updatePageInStore(updatedPage._id, updatedPage); // обновляем глобальный store
    } catch (error) {
      console.error('Error updating page:', error);
    }
  };

  return {
    page,
    setPage,
    handleUpdatePage,
    updatePageInStore
  };
}

