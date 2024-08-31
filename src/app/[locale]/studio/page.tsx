import Sidebar from '@/app/components/sidebars/studio-side-bar'
import MainPage from '@/app/components/studio/main'
import BooksForCreators from "@/app/components/server-fetching-components/BooksForCreator";

export default async function studio() {

    const Books = await BooksForCreators()

    return (
        <div className='flex'>
            <Sidebar Books={Books}/>
            <MainPage/>
        </div>
    )
}