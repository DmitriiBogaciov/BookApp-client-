// import Sidebar from '@/app/components/sidebars/studio-side-bar'
import StudioWindow from '@/app/components/studio/main'
// import BooksForCreators from "@/app/components/server-fetching-components/BooksForCreator";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default withPageAuthRequired( async function studio() {

    // const Books = await BooksForCreators()

    return (
        <div>
            {/* <Sidebar Books={Books}/> */}
            <StudioWindow/>
        </div>
    )
})