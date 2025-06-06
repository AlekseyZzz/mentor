import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' }
  ];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <div className="relative group">
      <button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none">
        <Globe size={20} className="text-gray-600" />
      </button>
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center ${
              i18n.language === lang.code ? 'bg-gray-50' : ''
            }`}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;