'use server';

import PageService from "../services/page-service";
import { Page } from "../utils/interfaces";

const pageService = new PageService();

export async function updatePageTitle(id: string, newTitle: string) {
    return await pageService.updatePageTitle(id, newTitle);
}

export async function removePage(id: string) {
    return await pageService.removeOnePage(id)
}

export async function createPage(bookId: string, parentId: string | null) {
    return await pageService.createPage(bookId, parentId);
}

export async function getOnePage(id: string) {
    return await pageService.getOnePage(id)
}