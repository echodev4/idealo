"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, getTranslation } from '@/lib/translations';
import { Locale, Direction } from '@/lib/i18n/types';

interface LanguageContextType {
  language: Locale;
  direction: Direction;
  setLanguage: (lang: Locale) => void;
  t: (key: string, fallback?: string) => string;
}

interface LanguageProviderProps {
  children: ReactNode;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Locale>('en');
  const [isClient, setIsClient] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setIsClient(true);
    
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem('preferred-language') as Locale | null;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Update localStorage and document direction when language changes
  useEffect(() => {
    if (!isClient) return;

    localStorage.setItem('preferred-language', language);
    
    // Update document direction and language
    const direction = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
    
    // Update CSS custom property for direction-aware styling
    document.documentElement.style.setProperty('--reading-direction', direction);
  }, [language, isClient]);

  const setLanguage = (lang: Locale) => {
    setLanguageState(lang);
  };

  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';

  const t = (key: string, fallback?: string): string => {
    return getTranslation(language, key, fallback);
  };

  const value: LanguageContextType = {
    language,
    direction,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};