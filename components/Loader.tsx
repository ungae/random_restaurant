
import React, { useState, useEffect } from 'react';

interface LoaderProps {
  messages: string[];
}

const Loader: React.FC<LoaderProps> = ({ messages }) => {
  const [message, setMessage] = useState(messages[0]);

  useEffect(() => {
    setMessage(messages[0]);
    
    const interval = setInterval(() => {
      setMessage(prevMessage => {
        const currentIndex = messages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-orange-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-orange-500 rounded-full animate-spin-slow border-t-transparent"></div>
        <div className="absolute inset-2 flex items-center justify-center text-3xl animate-pulse">🍽️</div>
      </div>
      <p className="text-lg font-semibold text-gray-700 transition-opacity duration-500">{message}</p>
    </div>
  );
};

export default Loader;
