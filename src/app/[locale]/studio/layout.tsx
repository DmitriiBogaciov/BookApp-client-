import Sidebar from '@/app/[locale]/studio/components/sidebar/studio-side-bar'
import BookService from '@/app/services/bookService'
import { getSession } from '@auth0/nextjs-auth0';
import SessionGuard from './components/userGuard';

const bookService = new BookService();

export default async function StudioLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getSession();
    const books = session ? await bookService.booksForCreators() : null;
    return (
        <SessionGuard>
            {session && (
                <div className='flex h-screen'>
                    <Sidebar Books={books} />
                    {children}
                </div>
            )}
        </SessionGuard>
    )
}