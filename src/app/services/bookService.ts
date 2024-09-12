// src/app/services/booksService.ts
import { fetchGraphQL } from './apiClient'

export const BooksForCreators = async () => {
  const revalidate = undefined;
  const query = `
    query GetBooks {
      booksForAuthor {
        _id
        title
      }
    }
  `;

  const data =  await fetchGraphQL(query, {}, { revalidate, useToken: true });
  if (!data || !data.booksForAuthor) {
    throw new Error('No books found');
  }
  return data.booksForAuthor;
};

