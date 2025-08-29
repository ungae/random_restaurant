
import React from 'react';

interface PermissionPromptProps {
  onGrant: () => void;
  loading: boolean;
  error: string | null;
  texts: {
    title: string;
    description: string;
    button: string;
    loading: string;
  }
}

const PermissionPrompt: React.FC<PermissionPromptProps> = ({ onGrant, loading, error, texts }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl shadow-lg max-w-sm mx-auto">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-orange-500 mb-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{texts.title}</h2>
      <p 
        className="text-gray-600 mb-6"
        dangerouslySetInnerHTML={{ __html: texts.description }}
      />
      
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      
      <button
        onClick={onGrant}
        disabled={loading}
        className="w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {texts.loading}
          </>
        ) : (
          texts.button
        )}
      </button>
    </div>
  );
};

export default PermissionPrompt;
