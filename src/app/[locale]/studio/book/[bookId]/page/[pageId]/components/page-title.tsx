'use client';
import { useContext, useState, useEffect } from "react";
import { StudioBookContext } from "@/app/contexts/studio-book-context";
import { updatePageTitle } from "@/app/actions/pageActions";

interface PageTitleProps {
    pageId: string;
}


export default function PageTitle({ pageId }: PageTitleProps) {
    const { pages, setPages } = useContext(StudioBookContext);
    const [inputValue, setInputValue] = useState<string>("");

    const page = pages.find((page) => page._id === pageId);
    
    useEffect(() => {
        if (page) {
            setInputValue(page.title);
        }
    }, [page]);

    const handleUpdatePage = () => {
        if (!page) return;

        updatePageTitle(pageId, inputValue); 

        const updatedPages = pages.map(p =>
            p._id === pageId ? { ...p, title: inputValue } : p
        );

        setPages(updatedPages);
    };

    const handleInputBlur = () => {
        handleUpdatePage();
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleUpdatePage();
        }
    };

    return (
        <input
            type="text"
            value={inputValue}
            placeholder={page ? page.title : "Untitled"}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleInputBlur}
        />
    );
}
