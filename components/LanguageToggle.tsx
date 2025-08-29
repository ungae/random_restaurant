
import React from 'react';
import type { Language } from '../types';

interface LanguageToggleProps {
  language: Language;
  onToggle: () => void;
  text: string;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ language, onToggle, text }) => {
  return (
    <button
      onClick={onToggle}
      className="absolute top-4 right-4 bg-gray-200 text-gray-700 text-xs font-bold py-1 px-3 rounded-full hover:bg-gray-300 transition-colors z-10"
      aria-label={`Switch to ${language === 'ko' ? 'English' : 'Korean'}`}
    >
      {text}
    </button>
  );
};

export default LanguageToggle;
