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

  const data = await fetchGraphQL(query, {}, { revalidate, useToken: true });
  if (!data || !data.booksForAuthor) {
    throw new Error('No books found');
  }
  return data.booksForAuthor;
};

export const UpdateBookTitle = async (bookId: string, newTitle: string) => {
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

  const data = await fetchGraphQL(mutation, variables, {revalidate, useToken: true});

  if (!data || !data.updateBook) {
    throw new Error('Failed to update book title');
  }

  return data.updateBook
}

