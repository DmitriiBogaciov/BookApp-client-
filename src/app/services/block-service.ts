import { fetchGraphQL } from './api-client'
import { Block } from '../utils/interfaces';
import { RawDraftContentState } from 'draft-js';

export default class BlockServise {

  //   getAllBooks = async () => {
  //     const revalidate = undefined;
  //     const query = `
  //       query GetBooks {
  //         books {
  //           _id
  //           title
  //           description
  //           author
  //         }
  //       }
  //     `;

  //     try {
  //       const data = await fetchGraphQL(query, {}, { revalidate, useToken: false });

  //       if (!data || !data.books) {
  //         throw new Error("No books found");
  //       }

  //       return data.books;

  //     } catch (error) {
  //       console.error("Error fetching books:", error);
  //       throw new Error("Failed to fetch books");
  //     }
  //   };

  //   getOneBook = async (id: string) => {
  //     const revalidate = undefined;
  //     const query = `
  //       query GetBook($id: String!) {
  //         book(id: $id) {
  //           _id
  //           title
  //       }
  //     }
  //   `;
  //     const variables = {
  //       id: id
  //     };

  //     try {
  //       const data = await fetchGraphQL(query, variables, { revalidate, useToken: false });

  //       // if (!data || !data.book) {
  //       //   throw new Error("No book found");
  //       // }

  //       return data.book;

  //     } catch (error) {
  //       console.error("Error fetching book:", error);
  //       return {}
  //     }
  //   };

  getBlocksForPage = async (id: string) => {
    const revalidate = undefined;
    const query = `
      query GetBlocksForPage($id: String!) {
        blocksForPage(id: $id) {
          _id,
		type,
		order,
		pageId,
		content
        }
      }
    `;
    const variables = {
      id: id
    }

    const data = await fetchGraphQL(query, variables, { revalidate, useToken: true });
    if (!data || !data.blocksForPage) {
      console.warn('No books found');
      return [];
    }
    return data.blocksForPage;
  };

  updateBlock = async (block: Block) => {
    const revalidate = undefined;
    const mutation = `
        mutation UpdateBlock($input: UpdateBlockInput!) {
          updateBlock(updateBlockInput: $input) {
            _id
            content
            order
            }
          }
        `;
    const variables = {
      input: {
        id: block._id, // Убедитесь, что передаете id
        type: block.type,
        order: block.order,
        pageId: block.pageId,
        content: JSON.stringify(block.content),
      },
    };

    const data = await fetchGraphQL(mutation, variables, { revalidate, useToken: true });

    if (!data || !data.updateBlock) {
      throw new Error('Failed to update book title');
    }

    return data.updateBlock;
  };

  //   createBook = async () => {
  //     const revalidate = undefined;
  //     const mutation = `
  //     mutation CreateBook($input: CreateBookInput!) {
  //       createBook(createBookInput: $input) {
  //         _id
  //         title
  //         }
  //       }
  //     `;
  //     const variables = {
  //       input: {}
  //     }

  //     try {
  //       const data = await fetchGraphQL(mutation, variables, { revalidate, useToken: true });
  //       return data.createBook;
  //     } catch (error) {
  //       console.error("Error creating book:", error);
  //       return {}
  //     }
  //   }

  //   removeOneBook = async (id: string) => {
  //     const revalidate = undefined;
  //     const mutation = `
  //     mutation RemoveBook($id: String!) {
  //       removeBook(id: $id) {
  //         deletedCount
  //       }
  //     }`;

  //     const variables = {
  //       id: id
  //     }

  //     try {
  //       const data = await fetchGraphQL(mutation, variables, { revalidate, useToken: true });

  //       if (!data || !data.removeBook) {
  //         throw new Error("Failed to remove the book");
  //       }

  //       return data.removeBook;
  //     } catch (error) {
  //       console.error("Error removing book:", error);
  //       return {};
  //     }
  //   }
}