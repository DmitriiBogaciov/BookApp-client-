import { fetchGraphQL } from './api-client'
import { Book } from '../utils/interfaces';

export default class BookServise {

  getAllBooks = async () => {
    const revalidate = undefined;
    const query = `
      query GetBooks {
        books {
          _id
          title
          description
          authors
        }
      }
    `;

    try {
      const data = await fetchGraphQL(query, {}, { revalidate, useToken: false });

      if (!data || !data.books) {
        throw new Error("No books found");
      }

      return data.books;

    } catch (error) {
      console.error("Error fetching books:", error);
      throw new Error("Failed to fetch books");
    }
  };

  getOneBook = async (id: string) => {
    const revalidate = undefined;
    const query = `
      query GetBook($id: String!) {
        book(id: $id) {
          _id
          title
      }
    }
  `;
    const variables = {
      id: id
    };

    try {
      const data = await fetchGraphQL(query, variables, { revalidate, useToken: false });

      // if (!data || !data.book) {
      //   throw new Error("No book found");
      // }

      return data.book;

    } catch (error) {
      console.error("Error fetching book:", error);
      return {}
    }
  };

  booksForCreators = async () => {
    const revalidate = undefined;
    const query = `
      query GetBooks {
        booksForAuthor {
          _id
          title
        }
      }
    `;

    const data = await fetchGraphQL(query, {}, { revalidate, useToken: true });
    if (!data || !data.booksForAuthor) {
      console.warn('No books found');
      return [];
    }
    return data.booksForAuthor;
  };

  updateBookTitle = async (bookId: string, newTitle: string) => {
    const revalidate = undefined;
    const mutation = `
    mutation UpdateBook($input: UpdateBookInput!) {
      updateBook(updateBookInput: $input) {
        _id
        title
        }
      }
    `;
    const variables = {
      input: {
        id: bookId,
        title: newTitle
      }
    }

    const data = await fetchGraphQL(mutation, variables, { revalidate, useToken: true });

    if (!data || !data.updateBook) {
      throw new Error('Failed to update book title');
    }

    return data.updateBook;
  };

  createBook = async () => {
    const revalidate = undefined;
    const mutation = `
    mutation CreateBook($input: CreateBookInput!) {
      createBook(createBookInput: $input) {
        _id
        title
        }
      }
    `;
    const variables = {
      input: {}
    }

    try {
      const data = await fetchGraphQL(mutation, variables, { revalidate, useToken: true });
      return data.createBook;
    } catch (error) {
      console.error("Error creating book:", error);
      return {}
    }
  }

  removeOneBook = async (id: string) => {
    const revalidate = undefined;
    const mutation = `
    mutation RemoveBook($id: String!) {
      removeBook(id: $id) {
        deletedCount
      }
    }`;

    const variables = {
      id: id
    }

    try {
      const data = await fetchGraphQL(mutation, variables, { revalidate, useToken: true });

      if (!data || !data.removeBook) {
        throw new Error("Failed to remove the book");
      }

      return data.removeBook;
    } catch (error) {
      console.error("Error removing book:", error);
      return {};
    }
  }
}