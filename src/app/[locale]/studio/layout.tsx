import Sidebar from '@/app/[locale]/studio/components/sidebar/studio-side-bar'
import BookService from '@/app/services/bookService'
import { StudioProvider } from '@/app/contexts/studio-context'

const bookService = new BookService();

export default async function StudioLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const books = await bookService.booksForCreators()

    return (
        <StudioProvider>
            <div className='flex h-screen'>
                <Sidebar Books={books} />
                {children}
            </div>
        </StudioProvider>
    )
}