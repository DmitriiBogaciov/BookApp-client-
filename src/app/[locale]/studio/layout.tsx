import Sidebar from '@/app/[locale]/studio/components/sidebar/studio-side-bar'
import BookService from '@/app/services/book-service'
import { auth0 } from '@/lib/auth0';
import SessionGuard from './components/userGuard';

const bookService = new BookService();

export default async function StudioLayout({
    children,
}: {
    children: React.ReactNode
}) {
    try {
        const session = await auth0.getSession();
        const books = session ? await bookService.booksForCreators(['_id', 'title']) : null;
        return (
            <SessionGuard>
                <div className='flex h-screen'>
                    <Sidebar Books={books} />
                    {children}
                </div>
            </SessionGuard>
        )
    } catch (error) {
        return (
            <div>
                <h1>Some error when loading books</h1>
            </div>
        )
    }
}