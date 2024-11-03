'use server';

import { UpdateBookTitle } from "../services/bookService";

export async function updateBookTitleAction(id: string, newTitle: string) {
    return await UpdateBookTitle(id, newTitle);
}