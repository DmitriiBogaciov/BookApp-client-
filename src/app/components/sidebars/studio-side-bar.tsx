'use client'
import BookWithPagesSideBar from "./book-with-pages-side-bar"
import BooksSideBar from './books-side-bar'
import { Book } from '@/app/utils/interfaces';
import { useState } from "react"

interface StudioSideBarProps {
    Books: Book[];
}

const StudioSideBar = ({ Books }: StudioSideBarProps) => {

    const [isBookBarOpen, setIsBookBarOpen] = useState(false)
    const [book, setBook] = useState(null)
    const [bookId, setBookId] = useState(null)

    const OpenBookBar = () => {
        setIsBookBarOpen(true)
    }

    const CloseBookBar = () => {
        setIsBookBarOpen(false)
    }

    return (
        <div>
            {isBookBarOpen ? (
                <div>
                    <BookWithPagesSideBar Book={Books[0]} CloseBookBar={CloseBookBar} />
                </div>
            ) : (
                <div>
                    <BooksSideBar Books={Books} OpenBookBar={OpenBookBar} />
                </div>
            )}
        </div>
    )
}

export default StudioSideBar;