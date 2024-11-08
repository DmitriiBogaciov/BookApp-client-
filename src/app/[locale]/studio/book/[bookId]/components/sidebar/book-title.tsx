'use client';

import { useEffect, useState } from 'react';
import { useStudioContext } from '@/app/contexts/studio-context';
import { updateBookTitleAction } from '@/app/actions/bookActions';

interface StudioBookTitleProps {
    id: string;
    title: string
}

const StudioBookTitle = ({ id }: StudioBookTitleProps) => {
    const { books, updateBookTitle} = useStudioContext();
    const [inputValue, setInputValue] = useState<string>("")

    const book = books.find(b => b._id === id);

    useEffect(() => {
        if (book) {
            setInputValue(book.title);
        }
    }, [book]);

    const handleUpdateBookTitle = async () => {
        if (!book) return;

        const data = await updateBookTitleAction(id, inputValue);

        if(data.title){
            updateBookTitle(data._id, data.title);
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