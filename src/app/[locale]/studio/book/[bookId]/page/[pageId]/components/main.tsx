'use client'
import { Page } from "@/app/utils/interfaces";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
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
        <div>
            <div className="h-14 flex items-center">
                <PageTitle
                    title={currentPage.title}
                    pageId={currentPage._id}
                    bookId={currentPage.bookId}
                    onPageTitleChange={handleUpdatePage}
                    onUpdateInStore={updatePageInStore} />
            </div>
            <div className="h-[calc(100vh-56px)]">
                <SimpleEditor content={currentPage.content} onUpdate={handleContentChange} />
            </div>
        </div>

    );
}