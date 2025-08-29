
import React from 'react';

interface HeaderProps {
  texts: {
    title: string;
    subtitle: string;
  }
}

const Header: React.FC<HeaderProps> = ({ texts }) => {
  return (
    <header className="w-full text-center p-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight flex items-center justify-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM5 5a1 1 0 00-1 1v1a1 1 0 002 0V6a1 1 0 00-1-1zM15 5a1 1 0 00-1 1v1a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span>{texts.title}</span>
      </h1>
      <p className="text-gray-500 mt-1">{texts.subtitle}</p>
    </header>
  );
};

export default Header;
