import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
  onGoHome: () => void;
  texts: {
    title: string;
    retry: string;
    home: string;
  }
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry, onGoHome, texts }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-red-50 border border-red-200 rounded-2xl shadow-lg max-w-sm mx-auto">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 className="text-xl font-bold text-red-800 mb-2">{texts.title}</h2>
      <p className="text-red-700 mb-6">
        {message}
      </p>
      <div className="w-full flex items-center space-x-3">
        <button
          onClick={onGoHome}
          className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors duration-200"
        >
          {texts.home}
        </button>
        <button
          onClick={onRetry}
          className="w-full bg-red-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200"
        >
          {texts.retry}
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;