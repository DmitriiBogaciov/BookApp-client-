import BookService from '@/app/services/book-service';

const bookService = new BookService()

export default async function book({
  params
}: {
  params: Promise<{bookId: string}>;
}) {
  try {
    const resolvedParams = await params;
    const book = await bookService.getOneBook(resolvedParams.bookId, ['_id', 'title', 'description', 'authors']);
    
    if (!book || !book._id) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Book not found</h2>
            <p className="text-gray-600">The book you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 bg-white overflow-auto">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{book.title}</h1>
            
            {book.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{book.description}</p>
              </div>
            )}
            
            {book.authors && book.authors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Authors</h3>
                <div className="flex flex-wrap gap-2">
                  {book.authors.map((author: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {author}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">Book ID: {book._id}</p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading book:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error loading book</h2>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : 'An unexpected error occurred while loading the book.'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
}