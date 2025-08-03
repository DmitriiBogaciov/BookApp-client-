import Sidebar from '@/app/[locale]/studio/book/[bookId]/components/sidebar/book-side-bar'
import React from 'react';
import PageService from '@/app/services/page-service';
import BookService from '@/app/services/book-service';
import { Book } from '@/app/utils/interfaces';

const pageService = new PageService();
const bookService = new BookService();

export default async function StudioBookLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ bookId: string }>;
}) {

    const resolvedParams = await params;
    const pages = await pageService.getBookPages(resolvedParams.bookId)
    const book = await bookService.getOneBook(resolvedParams.bookId, ['_id', 'title']);

    return (
        <div className='flex flex-1 h-screen'>
                {/* <Sidebar pages={pages} book={book} /> */}
                {children}
        </div>
    )
}