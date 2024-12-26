import React from 'react';
import BlocksList from './components/blocks-list';
import BlockService from '@/app/services/block-service';
import PageTitle from './components/page-title';
import PageService from "@/app/services/page-service";

const pageService = new PageService();
const blockService = new BlockService;

export default async function Page({
    params,
}: {
    params: Promise<{ pageId: string }>
}) {
    try {
        const par = await params
        // const blocks = await blockService.getBlocksForPage(par.pageId)
        const page = await pageService.getOnePage(par.pageId)

        return (
            <div className=''>
              <BlocksList pageId={par.pageId}/>
            </div>
        )
    } catch (error) {
        
    }



}