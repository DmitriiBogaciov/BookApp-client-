import { getAccessToken } from '@auth0/nextjs-auth0';

const GetBookPages = async (id: string) => {

  try {
    // const { accessToken } = await getAccessToken();

    const response = await fetch(`${process.env.API}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: `
          query GetPages($id: String!) {
            pagesForBook(id: $id) {
              _id
              title
              order
            }
          }
        `,
        variables: {
          id: id,
        },
      }),
      next: { revalidate: 60 },
    });

    const { data } = await response.json();



    if (!data || !data.pagesForBook) {
      throw new Error('No pages found for the book');
    }

    return data.pagesForBook;
  } catch (error) {
    console.error('Error fetching pages for the book:', error);
    return [];
  }
};

export default GetBookPages;
