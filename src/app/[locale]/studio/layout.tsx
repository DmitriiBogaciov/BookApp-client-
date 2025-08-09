import StudioShell from './components/studio-shell';
import Sidebar from '@/app/[locale]/studio/components/sidebar/studio-side-bar'
import { booksForCreators } from '@/app/services/book-service'
import { auth0 } from '@/lib/auth0';
import SessionGuard from './components/userGuard';

export default async function StudioLayout({
    children,
}: {
    children: React.ReactNode
}) {
    try {
        const session = await auth0.getSession();
        const books = session ? await booksForCreators(['_id', 'title']) : null;
        return (
            <SessionGuard>
                <StudioShell books={books}>
                    {children}
                </StudioShell>
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