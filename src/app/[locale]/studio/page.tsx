export const dynamic = "force-dynamic";
import StudioWindow from '@/app/components/studio/main'
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default withPageAuthRequired(
    async function studio() {

    // const Books = await BooksForCreators()

    return (
        <div>
            {/* <Sidebar Books={Books}/> */}
            {/* <StudioWindow /> */}
        </div>
    )
})