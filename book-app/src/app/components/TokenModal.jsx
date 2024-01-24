import React, { useState, useEffect } from 'react';

const TokenModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [token, setToken] = useState(null);


  const fetchToken = async () => {
    try {
      const response = await fetch('api/shows');
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

  useEffect(() => {
    if (isOpen) {
      fetchToken();
    }
  }, [isOpen]);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-content-center align-items-center">
      <div className="bg-white rounded-lg p-3 max-w-2xl max-h-2xl">
        <h4>Access Token</h4>
        {token && (
          <div className="mt-4 overflow-auto bg-neutral-200 p-3 break-all">
            {token}
          </div>
        )}
        <button
          className="bg-red-500 hover:bg-red-700 font-bold text-white py-2 px-4 rounded my-2"
          onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

export default TokenModal;