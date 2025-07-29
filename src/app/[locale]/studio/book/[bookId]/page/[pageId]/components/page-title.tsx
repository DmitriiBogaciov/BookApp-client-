'use client';
import { useState, useEffect } from "react";
import { updatePageTitle } from "@/app/actions/pageActions";

interface PageTitleProps {
    title: string,
    pageId: string;
}


export default function PageTitle({ title, pageId }: PageTitleProps) {
    const [inputValue, setInputValue] = useState<string>("");

    useEffect(() => {
        if (title) {
            setInputValue(title);
        } else {
            setInputValue("Untitled");
        }
    }, [title]);

    const handleUpdateTitle = () => {
        if (!inputValue) {
            updatePageTitle(pageId, "Untitled");
        } else {
            console.log("Updating title to:", inputValue);
            updatePageTitle(pageId, inputValue);
        }
    };

    const handleInputBlur = () => {
        handleUpdateTitle();
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
