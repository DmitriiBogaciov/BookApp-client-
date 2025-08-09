import React from 'react';

function Main() {
  return (
    <div className="flex flex-col items-center justify-center h-full flex-1 p-8">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-2 text-purple-700">Выберите книгу</h2>
        <p className="text-gray-500 mb-4">или создайте новую, чтобы начать работу</p>
        <span className="text-5xl mb-4 block">📚</span>
      </div>
    </div>
  );
}

export default Main;