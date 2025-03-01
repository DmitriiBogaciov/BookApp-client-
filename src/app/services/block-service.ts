import { fetchGraphQL } from './api-client'
import { Block } from '../utils/interfaces';
import { RawDraftContentState } from 'draft-js';

export interface CreateDtoIn {
  order: number,
  pageId: string,
  type?: string,
}

export default class BlockService {
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

    createBlock = async (DtoIn: CreateDtoIn) => {
      const revalidate = undefined;
      const mutation = `
      mutation CreateBlock($input: CreateBlockInput!) {
        createBlock(createBlockInput: $input) {
          _id
          order
          type
          content
          }
        }
      `;
      const variables = {
        input: {
          order: DtoIn.order,
          pageId: DtoIn.pageId,
          type: DtoIn.type
        }
      }

      console.log("variables to create block", variables)

      try {
        console.log(`Block create data: ${variables}`)
        const data = await fetchGraphQL(mutation, variables, { revalidate, useToken: true });
        return data.createBlock;
      } catch (error) {
        console.error("Error creating Block:", error);
        return {}
      }
    }

    removeOneBlock = async (id: string) => {
      const revalidate = undefined;
      const mutation = `
      mutation RemoveBlock($id: String!) {
        removeBlock(id: $id) {
          deletedCount
        }
      }`;

      const variables = {
        id: id
      }

      try {
        const data = await fetchGraphQL(mutation, variables, { revalidate, useToken: true });

        if (!data || !data.removeBlock) {
          throw new Error("Failed to remove the book");
        }

        return data.removeBlock;
      } catch (error) {
        console.error("Error removing block:", error);
        return {};
      }
    }
}