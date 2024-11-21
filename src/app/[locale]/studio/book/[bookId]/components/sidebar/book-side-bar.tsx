import { Page } from '@/app/utils/interfaces';
import PagesListSideBar from './pages-list';
import PageService from '@/app/services/pageService';
import StudioBookTitle from './book-title';

const pageService = new PageService();

interface StudioBookSideBarProps {
    id: string
}

const StudioBookSideBar = async ({ id}: StudioBookSideBarProps) => {
    if (!id) {
        return <EmptyState message="Book is not available" />;
    }

    try {
        const pages: Page[] = await pageService.getBookPagesStudio(id);

        return (
            <div className="w-64 border h-screen border-black bg-gray-100">
                <div className="flex items-center font-bold m-1">
                    <StudioBookTitle id={id}/>
                    <button className="text-xl font-bold">+</button>
                </div>
                {pages && pages.length > 0 ? (
                    <PagesListSideBar props={pages} bookId={id} />
                ) : (
                    <p>No pages found</p>
                )}
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
