'use client';
import { useEffect, useState, useRef } from "react";
import { Page } from "@/app/utils/interfaces";
import { removePage } from '@/app/actions/pageActions';
import { useRouter, usePathname } from '@/i18n/routing';
import { usePagesState } from './hooks/use-pageages-state';
import { useExpandedNodes } from './hooks/use-expanded-nodes';
import { PageTreeNode } from './pages-tree-node';

interface PagesListSideBarProps {
    pages: Page[]
    bookId: string;
}

export default function PagesListSideBar({ bookId, pages }: PagesListSideBarProps) {
    const [activeMenu, setActiveMenu] = useState<{ pageId: string, x: number, y: number } | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    const { pagesFlat, childrenCache, setChildrenCache } = usePagesState(bookId, pages);
    const { expandedNodes, isExpandedLoaded, toggleNode, isNodeExpanded } = useExpandedNodes(
        bookId, 
        pagesFlat, 
        childrenCache, 
        setChildrenCache
    );

    const handleRemovePage = async (id: string) => {
        try {
            const response = await removePage(id);

            if (response?._id) {
                const gatherChildrenIds = (parentId: string, pages: Page[]): string[] => {
                    const directChildren = pages.filter(page => page.parentId === parentId);
                    const allChildren = directChildren.flatMap(child => gatherChildrenIds(child._id, pages));
                    return [parentId, ...allChildren];
                };

                const deletedIds = gatherChildrenIds(id, pagesFlat);

                if (deletedIds.some(deletedId => pathname.includes(deletedId))) {
                    if (response.parentId) {
                        router.push(`/studio/book/${bookId}/page/${response.parentId}`);
                    } else {
                        const nextPage = pagesFlat.find(
                            page => !deletedIds.includes(page._id)
                        );
                        const nextPageId = nextPage?._id;
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

    const renderNode = (pages: Page[]) => {
        return (
            <ul className="list-none p-0">
                {pages.map((page) => (
                    <PageTreeNode
                        key={page._id}
                        page={page}
                        bookId={bookId}
                        isExpanded={isNodeExpanded(page._id)}
                        onToggle={toggleNode}
                        onMenuClick={handleMenuClick}
                        onDelete={handleRemovePage}
                        activeMenu={activeMenu}
                        menuRef={menuRef}
                        renderChildren={renderNode}
                    >
                        {childrenCache[page._id]}
                    </PageTreeNode>
                ))}
            </ul>
        );
    };

    if (!isExpandedLoaded) {
        return <p>Loading...</p>;
    }

    return (
        <>
            {pagesFlat.filter(page => !page.parentId).length > 0 ? (
                renderNode(pagesFlat.filter(page => !page.parentId))
            ) : (
                <p className="p-2 text-gray-500">No pages available. Create one!</p>
            )}
        </>
    );
}
