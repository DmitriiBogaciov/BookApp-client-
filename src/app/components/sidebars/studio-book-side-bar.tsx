import { Page } from '@/app/utils/interfaces';
import PagesListSideBar from './components/pages-list-side-bar';
import { GetBookPagesStudio } from '@/app/services/pageService';

interface StudioBookSideBarProps {
    id: string;
}

const StudioBookSideBar = async ({ id }: StudioBookSideBarProps) => {

    if (!id) {
        return <EmptyState message="Book is not available" />;
    }

    try {

        const pages: Page[] = await GetBookPagesStudio(id);

        if (!pages || pages.length === 0) {
            return (
                <div className="w-64 border h-screen border-black p-4 bg-gray-100">
                    <div className="flex justify-between items-center mb-4 font-bold">
                        <p>Pages</p>
                        <button className="text-xl font-bold">+</button>
                    </div>
                    <p>No pages found</p>
                </div>
            );
        }

        return (
            <PagesListSideBar props={pages} bookId={id} />
        );
    } catch (error) {
        console.error("Failed to fetch pages:", error);
        return <EmptyState message="Error fetching pages" />;
    }
};

const EmptyState = ({ message }: { message: string }) => (
    <div className="w-64 border h-screen border-black p-4 bg-gray-100">
        <div className="flex justify-between items-center mb-4 font-bold">
            <p>Pages</p>
            <button className="text-xl font-bold">+</button>
        </div>
        <p>{message}</p>
    </div>
);

export default StudioBookSideBar;
