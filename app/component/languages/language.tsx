'use client';

import React, { useState } from 'react';

interface LanguageSelectorProps {
  onSelect: (language: string) => void;
  initialLanguage?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  onSelect,
  initialLanguage = 'en'
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  
  // Define languages with their display names - each language appears only once
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi (हिंदी)' },
    { code: 'fr', name: 'French (Français)' },
    { code: 'es', name: 'Spanish (Español)' },
    { code: 'ja', name: 'Japanese (日本語)' },
    { code: 'zh', name: 'Chinese (中文)' }
  ];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const langCode = e.target.value;
    setSelectedLanguage(langCode);
    onSelect(langCode);
  };

  return (
    <div className="w-full  space-y-2">
      <label htmlFor="language" className="block font-semibold mb-1">Language</label>
      <select
        id="language"
        value={selectedLanguage}
        onChange={handleLanguageChange}
        className="w-full p-2 border border-gray-300 rounded-lg"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;