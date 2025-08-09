'use server';

import { fetchGraphQL } from './api-client';
import { Book } from '../utils/interfaces';

export async function getAllBooks() {
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
}

export async function getOneBook(id: string, fields: string[]) {
  const revalidate = undefined;
  const query = `
    query GetBook($id: String!) {
      book(id: $id) {
        ${fields}
      }
    }
  `;
  const variables = { id };

  try {
    const data = await fetchGraphQL(query, variables, { revalidate, useToken: false });
    return data.book;
  } catch (error) {
    console.error("Error fetching book:", error);
    return {};
  }
}

export async function booksForCreators(fields: string[]) {
  const revalidate = undefined;
  const query = `
    query GetBooks {
      booksForAuthor {
        ${fields}
      }
    }
  `;

  const data = await fetchGraphQL(query, {}, { revalidate, useToken: true });
  if (!data || !data.booksForAuthor) {
    console.warn('No books found');
    return [];
  }
  return data.booksForAuthor;
}

export async function updateBook(bookId: string, book: Partial<Book>, fields: string[]) {
  // console.log(`Book service, trying to update book with ID: ${bookId} and fields: ${fields}`);
  const revalidate = undefined;
  const mutation = `
    mutation UpdateBook($input: UpdateBookInput!) {
      updateBook(updateBookInput: $input) {
        ${fields}
      }
    }
  `;
  const variables = {
    input: {
      id: bookId,
      ...book
    }
  };

  const data = await fetchGraphQL(mutation, variables, { revalidate, useToken: true });

  if (!data || !data.updateBook) {
    throw new Error('Failed to update book title');
  }

  return data.updateBook;
}

export async function createBook() {
  const revalidate = undefined;
  const mutation = `
    mutation CreateBook($input: CreateBookInput!) {
      createBook(createBookInput: $input) {
        _id
        title
      }
    }
  `;
  const variables = { input: {} };

  try {
    const data = await fetchGraphQL(mutation, variables, { revalidate, useToken: true });
    return data.createBook;
  } catch (error) {
    console.error("Error creating book:", error);
    return error;
  }
}

export async function removeOneBook(id: string) {
  const revalidate = undefined;
  const mutation = `
    mutation RemoveBook($id: String!) {
      removeBook(id: $id) {
        deletedCount
      }
    }
  `;
  const variables = { id };

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