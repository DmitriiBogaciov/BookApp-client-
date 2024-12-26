'use client'
import { useState } from 'react'
import { Page } from '@/app/utils/interfaces';
import PagesListSideBar from './pages-list';
import StudioBookTitle from './book-title';
import CreatePageButton from './create-page-button';
import CloseIcon from '@mui/icons-material/Close';

interface SrudioBookSideBarProps {
    pages: Page[]
    bookId: string
}

const StudioBookSideBar = ({ bookId, pages }: SrudioBookSideBarProps) => {

    const [isSidebarOpen, setisSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setisSidebarOpen((prev) => !prev)
    }

    try {
        return (
            <div>
                <div className={`h-screen border-r transition-all duration-200 border-gray-200 bg-gray-100
                            ${isSidebarOpen ? 'w-44 p-2' : 'w-14'
                    }
                            `}>

                    {
                        !isSidebarOpen && (
                            <div className="flex justify-center pt-2">
                                <button
                                    onClick={toggleSidebar}
                                    className={`transition ease-in-out delay-150 bg-blue-100 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-200 duration-300`}
                                >
                                    Pages
                                </button>
                            </div>
                        )
                    }
                    <div className={`${isSidebarOpen ? 'block' : 'hidden'}`}>
                        <div className="flex items-center font-bold">
                            <StudioBookTitle id={bookId} />
                            <button onClick={toggleSidebar}>
                                <CloseIcon />
                            </button>
                        </div>
                        <PagesListSideBar pages={pages} bookId={bookId} />
                        <CreatePageButton bookId={bookId}>
                            <span className="pl-2 pt-1 pb-1 pr-2 w-full inline-block hover:bg-gray-200 cursor-pointer">
                                + create page
                            </span>
                        </CreatePageButton>
                    </div>
                </div>
            </div>
        );

    } catch (error) {
        console.error("Failed to fetch pages:", error);
        return <EmptyState message="Error fetching pages" />;
    }
};

const EmptyState = ({ message }: { message: string }) => (
    <div className="w-64 border h-screen border-black p-4 bg-gray-100">
        <p>{message}</p>
    </div>
);

export default StudioBookSideBar;
