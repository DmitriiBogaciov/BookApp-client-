'use client'
import { Page } from "@/app/utils/interfaces";
import Tiptap from '@/app/components/tip-tap/tiptap-editor';
import PageTitle from "./page-title";
import usePageState from "./hooks/use-page";

import { useRef } from "react";

export default function MainPage({
    page
}: {
    page: Page
}) {

    const { page: currentPage, setPage, handleUpdatePage, updatePageInStore } = usePageState(page);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    // console.log(`Current page:`, currentPage)

    const handleContentChange = (content: string) => {
        setPage(prev => ({ ...prev, content: content }));

        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            if (currentPage) {
                handleUpdatePage(currentPage._id, { content });
            }
        }, 1000);
    };

    // Если страница не загружена, показываем прелоадер
    if (!currentPage) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-56px)]">
                <span>Загрузка страницы...</span>
            </div>
        );
    }

    return (
        <div className="page-main flex flex-col">
            <div className="page-header px-[calc(3rem)] h-14 flex items-center border-b border-gray-200 mb-3">
                <PageTitle
                    title={currentPage.title}
                    pageId={currentPage._id}
                    bookId={currentPage.bookId}
                    onPageTitleChange={handleUpdatePage}
                    onUpdateInStore={updatePageInStore}
                />
            </div>

            <div className="page-content">
                <Tiptap
                    content={currentPage.content}
                    onUpdate={handleContentChange}
                />
            </div>
        </div>
    );
}