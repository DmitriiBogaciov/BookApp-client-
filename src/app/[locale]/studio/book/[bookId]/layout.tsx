import Sidebar from '@/app/[locale]/studio/book/[bookId]/components/sidebar/book-side-bar'
import React from 'react';
import PageService from '@/app/services/page-service';
import { ApolloClientProvider } from '@/app/providers/apollo-provider';

const pageService = new PageService();

export default async function StudioBookLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { bookId: string };
}) {

    const pages = await pageService.getBookPages(params.bookId)
    // console.log("Pages: ", JSON.stringify(pages, null, 2))

    return (
        <div className='flex h-screen'>
            <ApolloClientProvider>
                <Sidebar pages={pages} bookId={params.bookId} />
                {children}
            </ApolloClientProvider>
        </div>
    )
}