'use client';

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// Определяем интерфейс для значений контекста
interface StudioContextType {
    bookTitle: string | null;
    setBookTitle: Dispatch<SetStateAction<string | null>>;
}

// Создаем контекст с указанным типом
const StudioContext = createContext<StudioContextType | null>(null);

export function StudioProvider({ children }: { children: ReactNode }) {
    const [bookTitle, setBookTitle] = useState<string | null>('');

    return (
        <StudioContext.Provider value={{ bookTitle, setBookTitle }}>
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
