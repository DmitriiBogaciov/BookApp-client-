import { fetchGraphQL } from './api-client';
import { Page } from '@/app/utils/interfaces';

export default class PageService {
  private revalidate = undefined;

  async getBookPages(bookId: string, parentIds?: string[]): Promise<Page[]> {
    const query = `
      query GetPages($id: String!, $parentIds: [String!]!) {
        pagesForBook(id: $id, parentIds: $parentIds) {
          _id
          title
          order
          parentId
        }
      }
    `;
    const variables = { id: bookId, parentIds: parentIds || [] };

    try {
      const data = await fetchGraphQL(query, variables, { revalidate: this.revalidate, useToken: true });
      if (!data || !data.pagesForBook) throw new Error('No pages found for the book');
      return data.pagesForBook;
    } catch (error) {
      console.error(`Error fetching pages for book ${bookId}:`, error);
      throw error; // Пробрасываем ошибку выше
    }
  }

  async getOnePage(pageId: string, fields: string[]): Promise<Page> {
    const query = `
      query GetPage($id: String!) {
        page(id: $id) {
          ${fields}
        }
      }
    `;
    const variables = { id: pageId };

    try {
      const data = await fetchGraphQL(query, variables, { revalidate: this.revalidate, useToken: true });
      // if (!data || !data.page) throw new Error('Page not found');
      return data.page;
    } catch (error) {
      console.error(`Error fetching page ${pageId}:`, error);
      throw error;
    }
  }

  async createPage(bookId: string, parentId: string | null): Promise<Page> {
    const mutation = `
      mutation CreatePage($input: CreatePageInput!) {
        createPage(createPageInput: $input) {
          _id
          title
          parentId
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
      const data = await fetchGraphQL(mutation, variables, { revalidate: this.revalidate, useToken: true });
      if (!data || !data.createPage) throw new Error('Failed to create page');
      return data.createPage;
    } catch (error) {
      console.error('Error creating page:', error);
      throw error;
    }
  }

  async updatePageTitle(pageId: string, newTitle: string): Promise<Page> {
    const mutation = `
      mutation UpdatePage($input: UpdatePageInput!) {
        updatePage(updatePageInput: $input) {
          _id
          title
          order
          parentId
          bookId
          visibility
        }
      }
    `;
    const variables = {
      input: {
        id: pageId,
        title: newTitle,
      },
    };

    try {
      const data = await fetchGraphQL(mutation, variables, { revalidate: this.revalidate, useToken: true });
      if (!data || !data.updatePage) throw new Error('Failed to update page title');
      return data.updatePage;
    } catch (error) {
      console.error(`Error updating page title for page ${pageId}:`, error);
      throw error;
    }
  }

  async removeOnePage(pageId: string){
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
      const data = await fetchGraphQL(mutation, variables, { revalidate: this.revalidate, useToken: true });
      if (!data || !data.removePage) throw new Error('Failed to remove the page');
      return data.removePage;
    } catch (error) {
      console.error(`Error removing page ${pageId}:`, error);
      throw error;
    }
  }
}
