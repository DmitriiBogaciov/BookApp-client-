import ServerBookList from './components/home/BookList';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-50 to-purple-100 px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 mt-12">
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-4">
          Добро пожаловать в <span className="text-blue-600">BaoBoox</span>
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Ваше пространство для создания, хранения и чтения книг онлайн.
        </p>
        <ServerBookList />
      </div>
    </main>
  );
}
