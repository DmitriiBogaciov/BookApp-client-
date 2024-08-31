import { getAccessToken } from '@auth0/nextjs-auth0';

const BooksForCreators = async () => {
  try {
    const { accessToken } = await getAccessToken();
    const response = await fetch(`${process.env.API}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            query: `
            query GetBooks {
              booksForAuthor {
                _id
                title
              }
            }
          `,
        }),
        next: { revalidate: 10 }
    });

    const {data} = await response.json()

    if (!data || !data.booksForAuthor) {
      throw new Error('No books found');
    }

    return data.booksForAuthor;
  } catch (error) {
    return []
  }
}

export default BooksForCreators;