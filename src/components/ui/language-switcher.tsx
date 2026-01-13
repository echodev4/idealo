"use client";

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { ChevronDown, Globe, Check } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'compact' | 'full';
  className?: string;
}

const languages = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    dir: 'ltr'
  },
  {
    code: 'ar',
    name: 'Arabic', 
    nativeName: 'العربية',
    flag: '🇸🇦',
    dir: 'rtl'
  }
];

export const LanguageSwitcher = ({ variant = 'compact', className = '' }: LanguageSwitcherProps) => {
  const { language, setLanguage, direction } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    const selectedLang = languages.find(lang => lang.code === langCode);
    if (selectedLang) {
      // @ts-ignore
      setLanguage(langCode);
      // Update document direction
      document.documentElement.dir = selectedLang.dir;
      document.documentElement.lang = langCode;
      setIsOpen(false);
    }
  };

  if (variant === 'compact') {
    return (
      <div 
        ref={dropdownRef}
        className={`relative inline-block text-left ${className}`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-text bg-white border border-border-gray rounded-md hover:bg-light-gray transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label={`Current language: ${currentLanguage.name}. Click to change language`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="text-base" aria-hidden="true">
            {currentLanguage.flag}
          </span>
          <span className="font-semibold">
            {currentLanguage.code.toUpperCase()}
          </span>
          <ChevronDown 
            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        <div
          className={`absolute ${direction === 'rtl' ? 'left-0' : 'right-0'} mt-2 w-48 bg-white border border-border-gray rounded-md shadow-lg z-50 transition-all duration-200 origin-top ${
            isOpen 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }`}
          role="listbox"
          aria-label="Language options"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-150 ${
                lang.code === language
                  ? 'bg-secondary text-primary font-medium'
                  : 'text-gray-text hover:bg-light-gray'
              } ${lang.code === languages[0].code ? 'rounded-t-md' : ''} ${
                lang.code === languages[languages.length - 1].code ? 'rounded-b-md' : ''
              }`}
              role="option"
              aria-selected={lang.code === language}
            >
              <span className="text-base" aria-hidden="true">
                {lang.flag}
              </span>
              <div className="flex-1 text-left">
                <div className="font-medium">{lang.nativeName}</div>
                <div className="text-xs text-muted-foreground">{lang.name}</div>
              </div>
              {lang.code === language && (
                <Check className="h-4 w-4 text-primary" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Full variant for settings/footer
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-3">
        <Globe className="h-5 w-5 text-primary" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-gray-text">
          {language === 'ar' ? 'اللغة' : 'Language'}
        </h3>
      </div>
      
      <div className="grid gap-3">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-200 ${
              lang.code === language
                ? 'border-primary bg-secondary text-primary'
                : 'border-border-gray bg-white hover:border-primary/30 hover:bg-light-gray'
            }`}
            aria-pressed={lang.code === language}
            aria-label={`Select ${lang.name} language`}
          >
            <span className="text-2xl" aria-hidden="true">
              {lang.flag}
            </span>
            <div className="flex-1 text-left">
              <div className="font-semibold text-lg">{lang.nativeName}</div>
              <div className="text-sm text-muted-foreground">{lang.name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {lang.dir === 'rtl' ? 'Right to Left' : 'Left to Right'}
              </div>
            </div>
            <div className="flex items-center">
              {lang.code === language ? (
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span className="text-sm font-medium text-primary">
                    {language === 'ar' ? 'مختار' : 'Selected'}
                  </span>
                </div>
              ) : (
                <div className="w-5 h-5 border-2 border-border-gray rounded-full" aria-hidden="true" />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="text-xs text-muted-foreground">
        {language === 'ar' 
          ? 'سيتم حفظ تفضيلات اللغة تلقائياً'
          : 'Language preference will be saved automatically'
        }
      </div>
    </div>
  );
};