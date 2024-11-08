'use server';

import BookService from "../services/bookService";

const bookService = new BookService()

export async function updateBookTitleAction(id: string, newTitle: string) {
    return await bookService.updateBookTitle(id, newTitle);
}

export async function createBook() {
    return await bookService.createBook()
}