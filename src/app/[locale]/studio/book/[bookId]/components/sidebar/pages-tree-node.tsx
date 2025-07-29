import React from 'react';
import { Page } from '@/app/utils/interfaces';
import { Link } from '@/navigation';
import { SlOptions } from "react-icons/sl";
import AddIcon from '@mui/icons-material/Add';
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import CreatePageButton from "./create-page-button";
import IconMenu from './book-icon-menu';

interface PageTreeNodeProps {
    page: Page;
    bookId: string;
    isExpanded: boolean;
    children?: Page[];
    onToggle: (id: string) => void;
    onMenuClick: (event: React.MouseEvent, pageId: string) => void;
    onDelete: (id: string) => void;
    activeMenu: { pageId: string, x: number, y: number } | null;
    menuRef: React.RefObject<HTMLDivElement>;
    renderChildren: (pages: Page[]) => React.ReactNode;
}

export const PageTreeNode: React.FC<PageTreeNodeProps> = ({
    page,
    bookId,
    isExpanded,
    children,
    onToggle,
    onMenuClick,
    onDelete,
    activeMenu,
    menuRef,
    renderChildren
}) => {
    return (
        <li key={page._id} className="pl-1 pt-1 pb-1 pr-0">
            <div className='flex justify-between hover:bg-gray-200 cursor-pointer'>
                <button
                    className="mr-2"
                    onClick={() => onToggle(page._id)}
                >
                    {isExpanded && children ? <FaChevronDown /> : <FaChevronRight />}
                </button>
                <Link
                    href={`/studio/book/${bookId}/page/${page._id}`}
                    className="flex-1 no-underline overflow-y-auto"
                >
                    {page.title}
                </Link>
                <button onClick={(e) => onMenuClick(e, page._id)} className='content-center'>
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
                        <IconMenu onDelete={() => onDelete(page._id)} />
                    </div>
                )}
            </div>
            {isExpanded && children && renderChildren(children)}
        </li>
    );
};