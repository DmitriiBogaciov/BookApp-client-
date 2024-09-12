import{Book} from '@/app/utils/interfaces'

const ServerBookList = async () => {
  // Выполняем запрос данных с API
  const response = await fetch(`${process.env.API}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query GetBooks {
          books {
            _id
            title
            description
            author
            visibility
          }
        }
      `,
    }),
    next: { revalidate: 60  }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  const { data } = await response.json();

  return (
    <div>
      <h2>Book List</h2>
      {data.books.length > 0 ? (
        data.books.map((book: Book) => (
          <ul key={book._id}>
            <li><h3>Title: {book.title}</h3></li>
            <li>Author: {book.author}</li>
            <li>Description: {book.description}</li>
            <li>Visibility: {book.visibility ? 'Visible' : 'Hidden'}</li>
          </ul>
        ))
      ) : (
        <p>No books available.</p>
      )}
    </div>
  );
};

export default ServerBookList;
