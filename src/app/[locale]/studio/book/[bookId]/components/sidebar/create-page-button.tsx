'use client';

import React, { PropsWithChildren } from 'react';
import { createPage } from '@/app/actions/pageActions';
import { useRouter, usePathname } from '@/i18n/navigation';

interface CreatePageButtonProps extends PropsWithChildren {
  bookId: string;
  parentId?: string | null;
}

const CreatePageButton: React.FC<CreatePageButtonProps> = ({
  bookId,
  parentId,
  children
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleCreatePage = async () => {
    try {
      console.log("Creating page for BookID:", bookId);
      const newPage = await createPage(bookId, parentId || null);

      if (newPage && newPage._id) {
        if (pathname.startsWith(`/studio/book/${bookId}`)) {
          router.push(`/studio/book/${bookId}/page/${newPage._id}`);
        } else {
          router.push(`/page/${newPage._id}`);
        }
      } else {
        console.error("No page ID returned from the server");
      }
    } catch (error) {
      console.error("Failed to create page:", error);
      alert("Error creating page. Please try again later.");
    }
  };

  return (
      <span onClick={() => handleCreatePage()}>
        {children || '+ New Page'}
      </span>
  );
};

export default CreatePageButton;
