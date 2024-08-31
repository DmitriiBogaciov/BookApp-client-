const GetBookPages = async (id: string) => {
    try {
      const response = await fetch(`${process.env.API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          query: `
            query GetPages {
              pages{
                _id
                title
              }
            }
          `,
        }),
        next: { revalidate: 60 },
      });

  
      const { data } = await response.json();

      console.log(data)
  
      if (!data || !data.pages) {
        throw new Error('No pages found for the book');
      }
  
      return data;
    } catch (error) {
      console.error('Error fetching pages for the book:', error);
      return [];
    }
  };
  
  export default GetBookPages;
  