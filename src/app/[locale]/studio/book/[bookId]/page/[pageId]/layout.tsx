import React from 'react';
import {
    Navbar,
    Nav,
    NavItem
} from 'reactstrap';
import { getOnePage } from "@/app/services/page-service";
import PageTitle from './components/page-title';

export default async function StudioPageLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ pageId: string }>
}) {
    try {
        return (
            <div className='page-layout-0 md:px-15 md:max-w-[1080px] border justify-center w-screen mx-auto'>
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