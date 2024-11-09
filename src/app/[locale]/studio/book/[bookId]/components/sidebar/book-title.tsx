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
    title: string
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
        if (!book) return;

        const data = await updateBookTitleAction(id, inputValue);

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
            type="text"
            value={inputValue}
            placeholder={book ? book.title : "Untitled"}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleInputBlur}
        />
    );
};

export default StudioBookTitle;