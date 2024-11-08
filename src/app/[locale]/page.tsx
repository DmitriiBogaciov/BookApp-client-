import ServerBookList from './components/home/BookList';

export default function Home() {

  return (
    <div className="container flex flex-col justify-content-center align-items-center">
      <h2>This is the main page of BaoBoox App</h2>
      <ServerBookList />
    </div>
  )
}
