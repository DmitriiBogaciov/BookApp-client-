'use server';

import { fetchGraphQL } from './api-client';
import { Page } from '@/app/utils/interfaces';

const revalidate = undefined;

export async function getBookPages(bookId: string, fields: string[], parentIds?: string[]): Promise<Page[]> {
  const query = `
    query GetPages($id: String!, $parentIds: [String!]!) {
      pagesForBook(id: $id, parentIds: $parentIds) {
        ${fields}
      }
    }
  `;
  const variables = { id: bookId, parentIds: parentIds || [] };

  try {
    const data = await fetchGraphQL(query, variables, { revalidate, useToken: true });
    if (!data || !data.pagesForBook) throw new Error('No pages found for the book');
    return data.pagesForBook;
  } catch (error) {
    console.error(`Error fetching pages for book ${bookId}:`, error);
    throw error;
  }
}

export async function getOnePage(pageId: string, fields: string[]): Promise<Page> {
  const query = `
    query GetPage($id: String!) {
      page(id: $id) {
        ${fields}
      }
    }
  `;
  const variables = { id: pageId };

  try {
    const data = await fetchGraphQL(query, variables, { revalidate, useToken: true });
    return data.page;
  } catch (error) {
    console.error(`Error fetching page ${pageId}:`, error);
    throw error;
  }
}

export async function createPage(bookId: string, parentId: string | null, fields: string[]): Promise<Page> {
  const mutation = `
    mutation CreatePage($input: CreatePageInput!) {
      createPage(createPageInput: $input) {
        ${fields}
      }
    }
  `;
  const variables = {
    input: {
      bookId,
      parentId,
    },
  };

  try {
    const data = await fetchGraphQL(mutation, variables, { revalidate, useToken: true });
    if (!data || !data.createPage) throw new Error('Failed to create page');
    return data.createPage;
  } catch (error) {
    console.error('Error creating page:', error);
    throw error;
  }
}

export async function updatePage(pageId: string, page: Partial<Page>, fields: string[]): Promise<Page> {
  const mutation = `
    mutation UpdatePage($input: UpdatePageInput!) {
      updatePage(updatePageInput: $input) {
        ${fields}
      }
    }
  `;
  const variables = {
    input: {
      id: pageId,
      ...page
    },
  };

  try {
    const data = await fetchGraphQL(mutation, variables, { revalidate, useToken: true });
    if (!data || !data.updatePage) throw new Error('Failed to update page title');
    return data.updatePage;
  } catch (error) {
    console.error(`Error updating page title for page ${pageId}:`, error);
    throw error;
  }
}

export async function removeOnePage(pageId: string) {
  const mutation = `
    mutation RemovePage($id: String!) {
      removePage(id: $id) {
        _id,
        bookId,
        parentId
      }
    }
  `;
  const variables = { id: pageId };

  try {
    const data = await fetchGraphQL(mutation, variables, { revalidate, useToken: true });
    if (!data || !data.removePage) throw new Error('Failed to remove the page');
    return data.removePage;
  } catch (error) {
    console.error(`Error removing page ${pageId}:`, error);
    throw error;
  }
}

export async function updatePagesBatch(
  updates: Array<{ id: string; [key: string]: any }>,
  fields: string[] = ['_id']
): Promise<Page[]> {
  if (!Array.isArray(updates) || updates.length === 0) return [];

  const selection = fields.join('\n');
  const mutation = `
    mutation UpdatePages($updatePageInputs: [UpdatePageInput!]!) {
      updatePages(updatePageInputs: $updatePageInputs) {
        ${selection}
      }
    }
  `;
  const variables = { updatePageInputs: updates };

  try {
    // useToken: true — keep auth consistent with other calls
    const data = await fetchGraphQL(mutation, variables, { revalidate, useToken: true });
    if (!data || !data.updatePages) {
      throw new Error('Failed to update pages batch');
    }
    return data.updatePages as Page[];
  } catch (error) {
    console.error('Error in updatePagesBatch:', error);
    throw error;
  }
}
