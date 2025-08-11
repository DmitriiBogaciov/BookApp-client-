'use client'

import React, { useRef } from 'react'
import { Book } from '@/app/utils/interfaces'
import useBookState from './hooks/use-book'
import TipTapEditor from '@/app/components/TipTapEditor'
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"

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

    // Дебаунс для описания
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
        <div className="m-8">
            <input
                className="!text-2xl font-bold text-gray-800 mb-4 border-b border-gray-300 focus:outline-none focus:border-purple-500 bg-transparent"
                value={currentBook.title}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleEnterKey}
                placeholder="Enter book title"
            />
            <div className="h-[calc(100vh-56px)]">
                <h5 className="text-lg font-semibold text-gray-700 mb-2">Description</h5>
                <SimpleEditor
                    content={currentBook.description}
                    onUpdate={handleDescriptionChange}
                />
            </div>
        </div>
    )
}