import { Page } from '@/app/utils/interfaces';
import PagesListSideBar from './pages-list';
import StudioBookTitle from './book-title';
import CreatePageButton from './create-page-button';

interface SrudioBookSideBarProps {
    Pages: Page[],
    bookId: string
}

const StudioBookSideBar = async ({ Pages, bookId }: SrudioBookSideBarProps) => {
    try {
        return (
            <div className="w-64 border h-screen border-black bg-gray-100">
                <div className="flex items-center font-bold">
                    <StudioBookTitle id={bookId} />
                </div>
                {Pages && Pages.length > 0 ? (
                    <PagesListSideBar pages={Pages} bookId={bookId} />
                ) : (
                    <p>Book is empty</p>
                )}
                <CreatePageButton
                    bookId={bookId}
                >
                    <span className={'pl-2 pt-1 pb-1 pr-2 w-full inline-block hover:bg-gray-200 cursor-pointer'}>
                        + create page
                    </span>
                </CreatePageButton>
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
