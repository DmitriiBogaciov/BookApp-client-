'use client';
import { StudioBookProvider } from '@/app/contexts/studio-book-context';
import React from 'react';

export function PagesClientProvider({ children }: { children: React.ReactNode }) {
    return (
        <StudioBookProvider>
            {children}
        </StudioBookProvider>
    );
}