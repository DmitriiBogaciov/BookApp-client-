import Sidebar from '@/app/[locale]/studio/book/[bookId]/components/sidebar/book-side-bar'
import React from 'react';
import { PagesClientProvider } from '@/app/contexts/client-provider';

export default function StudioBookLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { bookId: string };
}) {
    return (
        <PagesClientProvider>
            <div className='flex h-screen'>
                <Sidebar id={params.bookId} />
                {children}
            </div>
        </PagesClientProvider>
    )
}