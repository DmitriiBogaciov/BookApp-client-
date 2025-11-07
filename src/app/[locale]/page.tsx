import ServerBookList from './components/BookList';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-950 dark:via-purple-950 dark:to-blue-950">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl dark:shadow-purple-900/20 p-8 mt-12 border border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-baoboox-600 to-blue-600 dark:from-baoboox-400 dark:to-blue-400 mb-4">
          Добро пожаловать в <span className="text-blue-600 dark:text-blue-400">BaoBoox</span>
        </h1>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
          Ваше пространство для создания, хранения и чтения книг онлайн.
        </p>
        <ServerBookList />
      </div>
    </main>
  );
}
