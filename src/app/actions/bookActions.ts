'use server';

import BookService from "../services/book-service";

const bookService = new BookService()

export async function updateBookTitleAction(id: string, newTitle: string) {
    return await bookService.updateBookTitle(id, newTitle);
}

export async function createBook() {
    return await bookService.createBook()
}

export async function getBookAction(id: string) {
    return await bookService.getOneBook(id);
}

export async function removeOneBook(id:string){
    return await bookService.removeOneBook(id)
}