'use client';
import { useState, useEffect } from "react";
import { Page } from "@/app/utils/interfaces";

interface PageTitleProps {
    bookId: string;
    title: string,
    pageId: string;
    onPageTitleChange?: (pageId: string, pageData: Partial<Page>) => void;
    onUpdateInStore?: (bookId: string, pageId: string, pageData: Partial<Page>) => void;
}


export default function PageTitle({bookId, title, pageId, onPageTitleChange, onUpdateInStore }: PageTitleProps) {
    const [inputValue, setInputValue] = useState<string>("");

    useEffect(() => {
        if (title) {
            setInputValue(title);
        }
    }, [title]);

    const handleUpdateTitle = () => {
        if (!inputValue) {
            if (onPageTitleChange) {
                onPageTitleChange(pageId, { title: "Untitled" });
            }
        } else {
            console.log("Updating title to:", inputValue);
            if (onPageTitleChange) {
                onPageTitleChange(pageId, { title: inputValue });
            }
        }
    };

    const handleInputBlur = () => {
        handleUpdateTitle();
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onUpdateInStore) {
            onUpdateInStore(bookId, pageId, { title: e.target.value });
        }
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleUpdateTitle();
        }
    };

    return (
        <div>
            <h5>
                <input
                    type="text"
                    value={inputValue}
                    placeholder={title ? title : "Untitled"}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleInputBlur}
                />
            </h5>
        </div>
    );
}
