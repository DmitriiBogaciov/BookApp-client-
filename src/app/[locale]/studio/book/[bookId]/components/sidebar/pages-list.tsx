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
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { gql, useSubscription } from '@apollo/client';

const PAGE_CREATED_SUBSCRIPTION = gql`
  subscription PageCreated($bookId: String!) {
    pageCreated(bookId: $bookId){
      _id
      title
      bookId
      parentId
    }
  }
`;

const PAGE_REMOVED_SUBSCRIPTION = gql`
  subscription {
    pageRemoved {
      _id
    }
  }
`;

const PAGE_UPDATED_SUBSCRIPTION = gql`
  subscription {
    pageUpdated{
      _id
      title
      bookId
      parentId
    }
  }
`;

interface PagesListSideBarProps {
    pages: Page[]
    bookId: string;
}

export default function PagesListSideBar({ bookId, pages }: PagesListSideBarProps) {
    const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
    const [isExpandedLoaded, setIsExpandedLoaded] = useState(false);
    const [pagesFlat, setPagesFlat] = useState<Page[]>(pages); // Плоский массив страниц
    const [activeMenu, setActiveMenu] = useState<{ pageId: string, x: number, y: number } | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();
    const pathname = usePathname();
    const { data: createdPage } = useSubscription(PAGE_CREATED_SUBSCRIPTION, {variables: {bookId}});
    const { data: removedPage } = useSubscription(PAGE_REMOVED_SUBSCRIPTION);
    const { data: updatedPage } = useSubscription(PAGE_UPDATED_SUBSCRIPTION)

    useEffect(() => {
        console.log('updatedPage recieved', updatedPage)
        if (updatedPage?.pageUpdated) {
            const newPage = updatedPage.pageUpdated
            setPagesFlat((prevPages) =>
                prevPages.map((page) =>
                    page._id === newPage._id ? newPage : page
                )
            );
        }
    }, [updatedPage]);

    useEffect(() => {
        if (createdPage?.pageCreated) {
            setPagesFlat((prev) => [...prev, createdPage.pageCreated]);
            console.log("GraphSubPages", createdPage)
        }
    }, [createdPage]);

    useEffect(() => {
        if (removedPage?.pageRemoved) {
            setPagesFlat((prevPages) => prevPages.filter(page => page._id !== removedPage.pageRemoved._id));
            console.log("Removed page", removedPage.pageRemoved)
        }
    }, [removedPage]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const savedState = localStorage.getItem("expandedNodes");
                if (savedState) {
                    const parsedState = JSON.parse(savedState);
                    if (Array.isArray(parsedState)) {
                        setExpandedNodes(parsedState);
                    }
                }
            } catch (error) {
                console.error("Failed to parse expandedNodes from localStorage:", error);
            } finally {
                setIsExpandedLoaded(true);
            }
        }
    }, []);

    useEffect(() => {
        if (isExpandedLoaded) {
            localStorage.setItem("expandedNodes", JSON.stringify(expandedNodes));
        }
    }, [expandedNodes, isExpandedLoaded]);

    const toggleNode = (id: string) => {
        setExpandedNodes((prev) =>
            prev.includes(id) ? prev.filter((nodeId) => nodeId !== id) : [...prev, id]
        );
    };

    const isNodeExpanded = (id: string) => expandedNodes.includes(id);

    // Вспомогательная функция для построения дерева
    const buildTree = (pages: Page[]): (Page & { children: Page[] })[] => {
        const map = new Map<string, Page & { children: Page[] }>();
        pages.forEach((page) => {
            map.set(page._id, { ...page, children: [] });
        });

        const tree: (Page & { children: Page[] })[] = [];
        pages.forEach((page) => {
            if (page.parentId) {
                const parent = map.get(page.parentId);
                if (parent) {
                    parent.children.push(map.get(page._id)!);
                }
            } else {
                tree.push(map.get(page._id)!);
            }
        });
        return tree;
    };

    const pagesTree = buildTree(pagesFlat);

    const handleRemovePage = async (id: string) => {
        try {
            const response = await removePage(id); // Удаление корневой страницы на сервере

            if (response?._id) {
                // Рекурсивно собираем все подстраницы для удаления
                const gatherChildrenIds = (parentId: string, pages: Page[]): string[] => {
                    const directChildren = pages.filter(page => page.parentId === parentId);
                    const allChildren = directChildren.flatMap(child => gatherChildrenIds(child._id, pages));
                    return [parentId, ...allChildren];
                };

                const deletedIds = gatherChildrenIds(id, pagesFlat);

                // setPagesFlat((prevPages) =>
                //     prevPages.filter(page => !deletedIds.includes(page._id))
                // );

                // Если текущая страница — удаляемая страница или её подстраница
                if (deletedIds.some(deletedId => pathname.includes(deletedId))) {
                    // Проверяем, есть ли родительская страница
                    if (response.parentId) {
                        router.push(`/studio/book/${bookId}/page/${response.parentId}`);
                    } else {
                        // Если родительской страницы нет, пытаемся перенаправить на соседнюю страницу
                        const nextPage = pagesFlat.find(
                            page => !deletedIds.includes(page._id) // Находим первую оставшуюся страницу
                        );
                        const nextPageId = nextPage?._id;

                        // Перенаправляем на найденную страницу или корень книги
                        router.push(nextPageId ? `/studio/book/${bookId}/page/${nextPageId}` : `/studio/book/${bookId}`);
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

    const renderTree = (pages: (Page & { children: Page[] })[]) => {
        return (
            <ul className="list-none p-0">
                {pages.map((page) => (
                    <li key={page._id} className="pl-1 pt-1 pb-1 pr-0 ">
                        <div className='flex justify-between hover:bg-gray-200 cursor-pointer'>
                            {page.children && page.children.length > 0 && (
                                <button
                                    className="mr-2"
                                    onClick={() => toggleNode(page._id)}
                                >
                                    {isNodeExpanded(page._id) ? <FaChevronDown /> : <FaChevronRight />}
                                </button>
                            )}
                            <Link
                                href={`/studio/book/${bookId}/page/${page._id}`}
                                className="flex-1 no-underline overflow-y-auto"
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
                        <div className="pl-1">
                            {expandedNodes.includes(page._id) && renderTree(page.children)}
                        </div>
                    </li>
                ))}
            </ul>
        );
    };

    if (!isExpandedLoaded) {
        return <p>Loading...</p>;
    }

    return (
        <>
            {pagesTree.length > 0 ? (
                renderTree(pagesTree)
            ) : (
                <p className="p-2 text-gray-500">No pages available. Create one!</p>
            )}
        </>
    );
}
