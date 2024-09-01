import Sidebar from '@/app/components/sidebars/studio-side-bar'
import BooksForCreators from "@/app/components/server-fetching-components/BooksForCreator";

export default async function EmptyLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const Books = await BooksForCreators()
    return (
        <div className='flex h-screen'>
            <Sidebar Books={Books} />
            {children}
        </div>
)
}