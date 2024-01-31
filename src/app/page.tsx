'use client'

import {useState} from "react";

export default function Home() {

  const [token, setToken] = useState(null);

  const fetchToken = async () => {
    try {
      const response = await fetch('api/testRoute');
      if (response.ok) {
        const data = await response.json();
        setToken(data.accessToken);
      } else {
        console.log('Error of fetching token');
      }
    } catch (error) {
      console.error('Error', error);
    }
  };
  return (
    <div className="container flex flex-col justify-content-center align-items-center">
      <div><p>Main Page: {token}</p></div>
      <button onClick={fetchToken}>TestFetch</button>
      </div>
  )
}
