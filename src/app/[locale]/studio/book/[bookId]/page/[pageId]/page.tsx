import PageTitle from "./components/page-title"

export default async function page({ params }: { params: { pageId: string } }) {
    return (
        <div className="container flex flex-col  align-items-center">
            <PageTitle pageId={params.pageId} />
        </div>
    )
}