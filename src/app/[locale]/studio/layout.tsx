import Sidebar from '@/app/components/sidebars/studio-side-bar'
import { BooksForCreators } from '@/app/services/bookService'
import { StudioProvider } from '@/app/contexts/studio-context'

export default async function StudioLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const Books = await BooksForCreators()

    return (
        <StudioProvider>
            <div className='flex h-screen'>
                <Sidebar Books={Books} />
                {children}
            </div>
        </StudioProvider>
    )
}