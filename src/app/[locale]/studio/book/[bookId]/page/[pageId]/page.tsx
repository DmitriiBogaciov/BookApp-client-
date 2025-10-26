import React from 'react';
// import BlocksList from './components/blocks-list';
// import BlockService from '@/app/services/block-service';
import { getOnePage } from "@/app/services/page-service";
import MainPage from './components/main';

// const blockService = new BlockService;

export default async function Page({
    params,
}: {
    // params: Promise<{ pageId: string }>
    params: Promise<{ pageId: string }>
}) {
    try {
        const { pageId } = await params;
        const page = await getOnePage(pageId, ['_id', 'bookId', 'title', 'content'])
        // console.log('Page data:', page);

        if (!page) {
            return (
                <div className="flex items-center justify-center h-[calc(100vh-56px)]">
                    <p>Page not found</p>
                </div>
            );
        }
        return (
            <div className='page-container'>
                <MainPage page={page} />
            </div>
        )
    } catch (error) {
        return (
            <div>
                <p>Error loading Blocks</p>
            </div>
        )
    }
}