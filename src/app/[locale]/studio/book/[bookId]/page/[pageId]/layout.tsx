import React from 'react';
import {
    Navbar,
    Nav,
    NavItem
} from 'reactstrap';
import BlockService from '@/app/services/block-service';
import PageTitle from './components/page-title';
import PageService from "@/app/services/page-service";

const pageService = new PageService();
const blockService = new BlockService;

export default async function StudioPageLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ pageId: string }>
}) {
    try {
        const par = await params
        // const blocks = await blockService.getBlocksForPage(par.pageId)
        const page = await pageService.getOnePage(par.pageId)

        return (
            <div className=''>
                <Navbar>
                    <Nav>
                        <NavItem>
                            <PageTitle title={page.title} pageId={page._id} />
                        </NavItem>
                    </Nav>
                </Navbar>
                {children}
            </div>
        )
    } catch (error) {
        return (
            <div className="container flex flex-col align-items-center">
                <div className="bg-red-500 text-white p-4 rounded shadow">
                    <p>Failed to load the page. Please try again later.</p>
                    <p className="text-sm">{error instanceof Error ? error.message : "Unknown error"}</p>
                </div>
            </div>
        );
    }
}