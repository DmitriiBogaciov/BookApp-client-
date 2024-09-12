'use server';

import { UpdatePageTitle } from "../services/pageService";

export async function updatePageTitle(id: string, newTitle: string) {
    return await UpdatePageTitle(id, newTitle);
}