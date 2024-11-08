import { Book } from '@/app/utils/interfaces';
import BookService from '@/app/services/bookService';

const bookService = new BookService();

const ServerBookList = async () => {
  try {
    const books = await bookService.getAllBooks();

    return (
      <div>
        <h2>Book List</h2>
        {books.length > 0 ? (
          books.map((book: Book) => (
            <ul key={book._id}>
              <li><h3>Title: {book.title}</h3></li>
              <li>Author: {book.author}</li>
              <li>Description: {book.description}</li>
            </ul>
          ))
        ) : (
          <p>No books available.</p>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error loading books:", error);
    return <p>Error loading books.</p>;
  }
};

export default ServerBookList;
