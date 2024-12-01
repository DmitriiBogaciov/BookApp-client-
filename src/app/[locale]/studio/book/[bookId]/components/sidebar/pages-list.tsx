'use client';
import { useEffect, useState, useRef } from "react";
import { Page } from "@/app/utils/interfaces";
import { Link } from '@/navigation';
import IconMenu from './book-icon-menu';
import { SlOptions } from "react-icons/sl";
import AddIcon from '@mui/icons-material/Add';
import { removePage } from '@/app/actions/pageActions';
import { useRouter, usePathname } from '@/i18n/routing';
import CreatePageButton from "./create-page-button";
import { io, Socket } from 'socket.io-client';

let socket: Socket;

interface PagesListSideBarProps {
    pages: Page[];
    bookId: string;
}

export default function PagesListSideBar({ pages, bookId }: PagesListSideBarProps) {
    const [pagesTree, setPagesTree] = useState<Page[]>([]);
    const [activeMenu, setActiveMenu] = useState<{ pageId: string, x: number, y: number } | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        console.log("Book id client: ", bookId);

        // Инициализация WebSocket с динамическим bookId
        socket = io('http://localhost:4000', { query: { bookId } });

        // Обработчик успешного подключения
        const handleConnect = () => {
            console.log(`Connected to WebSocket server with bookId: ${bookId}`);
            socket.emit('get_pages', { bookId }); // Запрашиваем дерево страниц
        };

        // Обработчики событий
        const handlePagesTree = (tree: Page[]) => {
            console.log('Received pages tree:', tree);
            setPagesTree(tree);
        };

        const handlePageAdded = (newPage: Page) => {
            console.log('Page added:', newPage);
            setPagesTree((prevTree) => [...prevTree, newPage]);
        };

        const handlePageRemoved = (removedPageId: string) => {
            console.log('Page removed:', removedPageId);
            setPagesTree((prevTree) => prevTree.filter(page => page._id !== removedPageId));
        };

        const handlePageUpdated = (updatedPage: Page) => {
            console.log('Page updated:', updatedPage);
            setPagesTree((prevTree) =>
                prevTree.map((page) =>
                    page._id === updatedPage._id ? updatedPage : page
                )
            );
        };

        // Устанавливаем обработчики событий
        socket.on('connect', handleConnect);
        socket.on('pages_tree', handlePagesTree);
        socket.on('page_added', (newPage) => {
            console.log('Page added:', newPage); // Это сообщение должно отображаться в консоли
            setPagesTree((prevTree) => [...prevTree, newPage]);
        });
        socket.on('page_removed', handlePageRemoved);
        socket.on('page_updated', handlePageUpdated);

        // Очищаем обработчики при размонтировании или изменении bookId
        return () => {
            socket.off('connect', handleConnect);
            socket.off('pages_tree', handlePagesTree);
            socket.off('page_added', handlePageAdded);
            socket.off('page_removed', handlePageRemoved);
            socket.off('page_updated', handlePageUpdated);
            socket.disconnect(); // Отключение WebSocket
        };
    }, [bookId]);


    const handleRemovePage = async (id: string) => {
        try {
            const response = await removePage(id);

            if (response?._id) {
                const remainingPages = pages.filter(page => page._id !== id);

                if (pathname.includes(id)) {
                    if (remainingPages.length > 0) {
                        const nextPageId = remainingPages[0]._id;
                        router.push(`/studio/book/${bookId}/page/${nextPageId}`);
                    } else {
                        router.push(`/studio/book/${bookId}`);
                    }
                }
            } else {
                console.error("Failed to delete the page.");
                alert("Error deleting the page. Please try again.");
            }
        } catch (error) {
            console.error("Error in handleRemovePage:", error);
            alert("An unexpected error occurred. Please try again.");
        }
    };

    const handleMenuClick = (event: React.MouseEvent, pageId: string) => {
        event.stopPropagation();
        setActiveMenu((prev) =>
            prev && prev.pageId === pageId
                ? null
                : { pageId, x: event.clientX, y: event.clientY }
        );
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenu(null);
            }
        };

        if (activeMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeMenu]);

    if (!pages || pages.length === 0) {
        return <p className="p-2 text-gray-500">No pages available. Create one!</p>;
    }

    return (
        <ul className="list-none p-0">
            {pagesTree.map((page) => (
                <li key={page._id} className="pl-2 pt-1 pb-1 pr-2 hover:bg-gray-200 cursor-pointer">
                    <div className='flex justify-between'>
                        <Link
                            href={`/studio/book/${bookId}/page/${page._id}`}
                            className="flex-1 no-underline"
                        >
                            {page.title}
                        </Link>
                        <button onClick={(e) => handleMenuClick(e, page._id)} className='content-center'>
                            <SlOptions className='mr-1' />
                        </button>
                        <CreatePageButton
                            bookId={bookId}
                            parentId={page._id}
                        >
                            <AddIcon />
                        </CreatePageButton>
                        {activeMenu && activeMenu.pageId === page._id && (
                            <div
                                ref={menuRef}
                                className="absolute bg-white border shadow-md rounded"
                                style={{ top: `${activeMenu.y}px`, left: `${activeMenu.x}px` }}
                            >
                                <IconMenu onDelete={() => handleRemovePage(page._id)} />
                            </div>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
}
