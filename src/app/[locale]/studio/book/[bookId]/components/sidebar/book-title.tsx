'use client';

import { useEffect, useState } from 'react';
import { useStudioContext } from '@/app/contexts/studio-context';
import { updateBookTitleAction, getBookAction } from '@/app/actions/bookActions';

interface Book {
    _id: string;
    title: string;
}

interface StudioBookTitleProps {
    id: string;
}

const StudioBookTitle = ({ id }: StudioBookTitleProps) => {
    const [book, setBook] = useState<Book | null>(null);
    const [inputValue, setInputValue] = useState<string>("")

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const result = await getBookAction(id)
                console.log(result)
                setBook(result);
            } catch (error) {
                console.error("Failed to fetch the book:", error);
            }
        };

        fetchBook();
    }, [id]);

    useEffect(() => {
        if (book) {
            setInputValue(book.title);
        }
    }, [book]);

    const handleUpdateBookTitle = async () => {
        if (!book || book.title === inputValue) return;

        try {
            const data = await updateBookTitleAction(id, inputValue);
            setBook(data)
        } catch (error) {
            console.error("Failed to update the book title:", error);
        }
    }

    const handleInputBlur = () => {
        handleUpdateBookTitle();
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleUpdateBookTitle();
        }
    };

    return (
        <input
            className="flex-1 w-full max-w-sm bg-transparent border-0 outline-none"
            type="text"
            value={inputValue}
            placeholder={book ? book.title : ""}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleInputBlur}
        />
    );
};

export default StudioBookTitle;