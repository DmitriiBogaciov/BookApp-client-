import PageTitle from "./components/page-title";
import PageService from "@/app/services/page-service";

const pageService = new PageService();

export default async function Page({
  params,
}: {
  params: Promise<{ pageId: string }>
}) {
  try {

    const par = await params

    let page
    if (par.pageId) {
      page = await pageService.getOnePage(par.pageId);
    }

    if (!page || !page.title) {
      throw new Error("Page data is missing or incomplete");
    }

    return (
      <div className="container flex flex-col align-items-center">
        <PageTitle title={page.title} pageId={page._id} />
      </div>
    );
  } catch (error) {
    console.error("Error loading page:", error);

    return (
      <div className="container flex flex-col align-items-center">
        <div className="bg-red-500 text-white p-4 rounded shadow">
          <p>Failed to load the page. Please try again later.</p>
          <p className="text-sm">{error instanceof Error ? error.message : "Unknown error"}</p>
        </div>
      </div>
    );
  }
}
