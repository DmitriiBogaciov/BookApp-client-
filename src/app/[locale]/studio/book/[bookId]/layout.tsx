import Sidebar from '@/app/[locale]/studio/book/[bookId]/components/sidebar/book-side-bar'
import React from 'react';
import PageService from '@/app/services/page-service';
import { ApolloClientProvider } from '@/app/providers/apollo-provider';

export default async function StudioBookLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { bookId: string };
}) {

    return (
        <div className='flex h-screen'>
            <ApolloClientProvider>
                <Sidebar bookId={params.bookId} />
                {children}
            </ApolloClientProvider>
        </div>
    )
}