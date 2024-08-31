import GetPagesForBook from '@/app/components/server-fetching-components/GetBookPages'

export default async function book({params}: {params:{id: string}}) {

  const pages = await GetPagesForBook(params.id)
  console.log(pages)

  return (
    <div className="container flex flex-col justify-content-center align-items-center">
      <h2>This is one book {params.id}</h2>
    </div>
  )
}