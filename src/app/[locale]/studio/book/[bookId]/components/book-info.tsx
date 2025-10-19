'use client'

import React, { useRef } from 'react'
import { Book } from '@/app/utils/interfaces'
import useBookState from './hooks/use-book'
import Tiptap from '@/app/components/tip-tap/tiptap-editor';

interface BookTitleProps {
    book: Book
}

export default function BookInfo({ book }: BookTitleProps) {
    const {
        book: currentBook,
        handleUpdateBook,
        setBook,
        updateBookInStore
    } = useBookState(book)

    const debounceTimer = useRef<NodeJS.Timeout | null>(null)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBook(prev => ({ ...prev, title: e.target.value }))
        updateBookInStore(currentBook._id, { title: e.target.value })
    }

    const handleInputBlur = () => {
        handleUpdateBook(currentBook._id, { title: currentBook.title })
    }

    const handleEnterKey: (e: React.KeyboardEvent<HTMLInputElement>) => void = (e) => {
        if (e.key === 'Enter') {
            handleInputBlur()
        }
    }

    const handleDescriptionChange = (content: string) => {
        setBook(prev => ({ ...prev, description: content }))
        updateBookInStore(currentBook._id, { description: content })

        if (debounceTimer.current) clearTimeout(debounceTimer.current)
        debounceTimer.current = setTimeout(() => {
            handleUpdateBook(currentBook._id, { description: content })
        }, 1000)
    }

    return (
        <div>
            <input
                className="!text-2xl h-14 font-bold text-gray-800 mb-4 border-b border-gray-300 focus:outline-none focus:border-purple-500 bg-transparent"
                value={currentBook.title}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleEnterKey}
                placeholder="Enter book title"
            />
            <h5 className="text-lg font-semibold text-gray-700 mb-2">Description</h5>
            <div className="h-[calc(100vh-56px)]">
                <Tiptap
                    content={currentBook.description}
                    onUpdate={handleDescriptionChange}
                />
            </div>
        </div>
    )
}