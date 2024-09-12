import React, { createContext, useState, ReactNode } from 'react';
import { Page } from '@/app/utils/interfaces';

interface StudioBookContextProps {
    pages: Page[];
    setPages: React.Dispatch<React.SetStateAction<Page[]>>;
}

export const StudioBookContext = createContext<StudioBookContextProps>({
    pages: [],
    setPages: () => {},
});

// Провайдер контекста
export const StudioBookProvider = ({ children }: { children: ReactNode }) => {
    const [pages, setPages] = useState<Page[]>([]);

    return (
        <StudioBookContext.Provider value={{ pages, setPages }}>
            {children}
        </StudioBookContext.Provider>
    );
};
