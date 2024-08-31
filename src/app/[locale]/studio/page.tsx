import Sidebar from '@/app/components/sidebars/studio-side-bar'
import MainPage from '@/app/components/studio/main'
import BooksForCreators from "@/app/components/server-fetching-components/BooksForCreator";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default withPageAuthRequired( async function studio({params}) {

    const Books = await BooksForCreators()

    return (
        <div className='flex'>
            <Sidebar Books={Books}/>
            <MainPage/>
        </div>
    )
})