'use client'
import axios from "axios"
import { useState } from "react";
const apiUrl = process.env.NEXT_PUBLIC_BABOOX_API;

export default function Home() {
  const [book, setBook] = useState<Book | null>(null);

  const fetchToken = async () => {
    try {
      const response = await fetch('api/shows');
      if (response.ok) {
        const data = await response.json();
        return data.accessToken;
      } else {
        console.log('Error of fetching token');
        return null;
      }
    } catch (error) {
      console.error('Error', error);
    }
  };

  async function createBook() {
    try {
      const response = await axios.post<BookResponse>(`${apiUrl}/book/create`,
        { title: "First book" },
        {
          headers: {
            'Authorization': `Bearer ${await fetchToken()}`
          }
        }
      );
      setBook(response.data.result)
      return response.data;
    } catch (error) {
      console.error('An error occurred during book creation:', error);
      throw error;
    }
  }
  return (
    <div className="container flex flex-col justify-content-center align-items-center">
      <h2>This is the main page of BaoBoox App</h2>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-3"
        onClick={createBook}
      >
        Create book
      </button>
      {book && <div>{book.title}</div>}
    </div>
  )
}
