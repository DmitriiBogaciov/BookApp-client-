'use client';
import {Book} from '@/app/utils/interfaces'
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// Определяем интерфейс для значений контекста
interface StudioContextType {
    books: Book[];
    updateBookTitle: (id: string, newTitle: string) => void;
    setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}

// Создаем контекст с указанным типом
const StudioContext = createContext<StudioContextType | null>(null);

export function StudioProvider({ children }: { children: ReactNode }) {
    const [books, setBooks] = useState<Book[]>([]);

    const updateBookTitle = (id: string, newTitle: string) => {
        setBooks(prevBook => 
            prevBook.map(book => 
                book._id === id ? {...book, title: newTitle} : book
            )
        )
    }

    return (
        <StudioContext.Provider value={{ books, setBooks, updateBookTitle }}>
            {children}
        </StudioContext.Provider>
    );
}

export function useStudioContext() {
    const context = useContext(StudioContext);
    if (!context) {
        throw new Error("useStudioContext must be used within a StudioProvider");
    }
    return context;
}
