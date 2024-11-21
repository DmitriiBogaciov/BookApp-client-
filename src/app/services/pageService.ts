import { fetchGraphQL } from './apiClient'

export default class PageService {

  getBookPagesStudio = async (id: string) => {
    const revalidate = undefined;
    const query = `
      query GetPages($id: String!) {
        pagesForBook(id: $id) {
          _id
          title
          order
        }
      }
    `;

    const data = await fetchGraphQL(query, { id }, { revalidate, useToken: true });
    if (!data || !data.pagesForBook) {
      throw new Error('No pages found for the book');
    }
    return data.pagesForBook;
  };

  updatePageTitle = async (pageId: string, newTitle: string) => {
    const revalidate = undefined;
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
  
    const data = await fetchGraphQL(mutation, variables, { revalidate, useToken: true });
  
    console.log("updatebookresponse: ", data)
  
    if (!data || !data.updatePage) {
      throw new Error('Failed to update page title');
    }
  
    return data.updatePage;
  };

  removeOnePage = async (id: string) => {
    const revalidate = undefined;
    const mutation = `
    mutation RemovePage($id: String!) {
      removePage(id: $id) {
        deletedCount
      }
    }`;

    const variables = {
      id: id
    }

    try {
      const data = await fetchGraphQL(mutation, variables, { revalidate, useToken: true });

      if (!data || !data.removePage) {
        throw new Error("Failed to remove the book");
      }

      return data.removePage;
    } catch (error) {
      console.error("Error removing book:", error);
      return {};
    }
  }
}



