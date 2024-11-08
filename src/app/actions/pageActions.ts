'use server';

import PageService from "../services/pageService";

const pageService = new PageService();

export async function updatePageTitle(id: string, newTitle: string) {
    return await pageService.updatePageTitle(id, newTitle);
}