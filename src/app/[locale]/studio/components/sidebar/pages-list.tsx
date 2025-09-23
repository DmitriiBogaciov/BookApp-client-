'use client';

import React, { useEffect, useState, useRef } from 'react';
import SortablePageItem from './page-item';
import { Page } from '@/app/utils/interfaces';

interface PagesListProps {
    bookId: string;
    onCreatePage?: (bookId: string, parentId: string | null) => Promise<void>;
    pages?: Page[],
    expandedPages?: Set<string> | null;
    parentId?: string | null;
    togglePageExpansion?: (pageId: string) => void;
    onRemovePage?: (pageId: string) => Promise<void>;
}

export default function PagesList({
    bookId,
    onCreatePage,
    pages,
    expandedPages,
    parentId = null,
    togglePageExpansion,
    onRemovePage
}: PagesListProps) {
    const currentPages = pages?.filter(page => (page.parentId ?? null) === parentId)
    return (
        <>
            <div className=''>
                {currentPages?.length === 0 && (
                    <span className="text-gray-400 pl-3 italic text-sm">No pages inside</span>
                )}
                {currentPages?.map((page) => (
                    <div key={page._id} className="">
                        <SortablePageItem
                            page={page}
                            bookId={bookId}
                            expandedPage={expandedPages?.has(page._id)}
                            onCreatePage={onCreatePage}
                            togglePageExpansion={togglePageExpansion}
                            onRemovePage={onRemovePage}
                        />
                        {expandedPages?.has(page._id) && (
                            <div className='ml-3'>
                                <PagesList
                                    bookId={bookId}
                                    onCreatePage={onCreatePage}
                                    pages={pages}
                                    expandedPages={expandedPages}
                                    parentId={page._id}
                                    togglePageExpansion={togglePageExpansion}
                                    onRemovePage={onRemovePage}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};
