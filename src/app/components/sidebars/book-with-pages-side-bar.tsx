import React from 'react';
import { Book } from '@/app/utils/interfaces';
import { Link } from '@/navigation';

interface StudioSideBarProps {
    Book: Book;
    CloseBookBar: () => void;
}

const StudioSideBar = ({ Book, CloseBookBar }: StudioSideBarProps) => {
    if (!Book) {
        return (
            <div className="w-64 border h-screen border-black p-4 bg-gray-100">
                <div className="flex justify-between items-center mb-4 font-bold">
                    <span>Books</span>
                    <button className="text-xl font-bold">+</button>
                </div>
                <p>No books available.</p>
            </div>
        );
    }

    return (
        <div className="w-64 border h-screen border-black p-4 bg-gray-100">
            <div className="flex justify-between items-center mb-4 font-bold">
                <span>{Book.title}</span>
                <button className="text-xl font-bold">+</button>
            </div>
            <ul className="list-none p-0">
                return (
                <div>

                </div>
                );
            </ul>
        </div>
    );
};

export default StudioSideBar;