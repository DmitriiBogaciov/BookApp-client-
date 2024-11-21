'use client';
import { useContext, useEffect, useState, useRef } from "react";
import { Page } from "@/app/utils/interfaces";
import { StudioBookContext } from "@/app/contexts/studio-book-context";
import { Link } from '@/navigation';
import IconMenu from './book-icon-menu';
import { SlOptions } from "react-icons/sl";
import { removePage } from '@/app/actions/pageActions'

interface PagesListSideBarProps {
    props: Page[];
    bookId: string;
}

export default function PagesListSideBar({ props, bookId }: PagesListSideBarProps) {
    const [activeMenu, setActiveMenu] = useState<{ pageId: string, x: number, y: number } | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const { pages, setPages } = useContext(StudioBookContext);

    useEffect(() => {
        setPages(props);
    }, [props, setPages]);

    const handleRemovePage = (id: string) => {
        removePage(id)
    }

    const handleMenuClick = (event: React.MouseEvent, pageId: string) => {
        event.stopPropagation();
        setActiveMenu((prev) =>
            prev && prev.pageId === pageId
                ? null
                : { pageId, x: event.clientX, y: event.clientY }
        );
    }

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


    return (
        <ul className="list-none p-0">
            {pages.map((page) => (
                <li key={page._id} className=" p-2 mb-2 hover:bg-gray-200 cursor-pointer">
                    <div className='flex justify-between'>
                        <Link
                            href={`/studio/book/${bookId}/page/${page._id}`}
                            className="flex-1 no-underline">
                            {page.title}
                        </Link>
                        <button onClick={(e) => handleMenuClick(e, page._id)} className='content-center'>
                            <SlOptions className='mr-1' />
                        </button>
                        {activeMenu && activeMenu.pageId === page._id && (
                            <div
                                ref={menuRef}
                                className="absolute"
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