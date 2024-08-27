import ServerBookList from '../components/server-fetching-components/BookList';

export default function Home() {

  return (
    <div className="container flex flex-col justify-content-center align-items-center">
      <h2>This is the main page of BaoBoox App</h2>
      <ServerBookList />
    </div>
  )
}
