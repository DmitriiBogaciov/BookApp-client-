'use client';
import { useContext, useEffect } from "react";
import { Page } from "@/app/utils/interfaces";
import { StudioBookContext } from "@/app/contexts/studio-book-context";
import { Link } from '@/navigation';

interface PagesListSideBarProps {
    props: Page[];
    bookId: string;
}

export default function PagesListSideBar({ props, bookId }: PagesListSideBarProps) {

    const { pages, setPages } = useContext(StudioBookContext);

    useEffect(() => {
        setPages(props);
    }, [props, setPages]);

    return (
        <div className="w-64 h-screen bg-gray-100">
            <div className="flex justify-between items-center font-bold">
            </div>
            <ul className="list-none p-0">
                {pages.map((page) => (
                    <Link key={page._id} href={`/studio/book/${bookId}/page/${page._id}`}>
                        <li className=" p-2 mb-2 hover:bg-gray-200 cursor-pointer">
                            {page.title}
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    );
}