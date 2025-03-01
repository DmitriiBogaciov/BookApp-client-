import React from 'react';
import BlocksList from './components/blocks-list';
import BlockService from '@/app/services/block-service';
import PageService from "@/app/services/page-service";

const pageService = new PageService();
const blockService = new BlockService;

export default async function Page({
    params,
}: {
    // params: Promise<{ pageId: string }>
    params: { pageId: string }
}) {
    try {
        // const par = await params
        const pageId = params.pageId;
        const blocks = await blockService.getBlocksForPage(pageId)
        // const page = await pageService.getOnePage(pageId)

        return (
            <div>
              <BlocksList blocks={blocks} pageId={pageId}/>
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