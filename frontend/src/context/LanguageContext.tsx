'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  SupportedLanguage,
  I18nDictionary,
  getDictionary,
  LANGUAGE_OPTIONS,
  LanguageOption
} from '../lib/i18n';

interface LanguageContextValue {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  dict: I18nDictionary;
  availableLanguages: LanguageOption[];
  currentLanguageMeta: LanguageOption;
  t: (key: keyof I18nDictionary) => any;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'krishi_mitra_lang';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('kn');

  // Load persisted language from localStorage on initial client render
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage;
      if (saved && ['kn', 'en', 'hi', 'te', 'mr'].includes(saved)) {
        setLanguageState(saved);
        if (typeof document !== 'undefined') {
          document.documentElement.lang = saved;
        }
      } else {
        if (typeof document !== 'undefined') {
          document.documentElement.lang = 'kn';
        }
      }
    } catch {
      // LocalStorage access may fail in privacy sandbox modes; keep default
    }
  }, []);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
      }
    } catch {}
  }, []);

  const dict = useMemo(() => getDictionary(language), [language]);

  const currentLanguageMeta = useMemo(
    () => LANGUAGE_OPTIONS.find((l) => l.code === language) || LANGUAGE_OPTIONS[0],
    [language]
  );

  const t = useCallback(
    (key: keyof I18nDictionary) => {
      return dict[key];
    },
    [dict]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      dict,
      availableLanguages: LANGUAGE_OPTIONS,
      currentLanguageMeta,
      t
    }),
    [language, setLanguage, dict, currentLanguageMeta, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Safe graceful fallback for SSR or testing environments
    const fallbackDict = getDictionary('kn');
    return {
      language: 'kn',
      setLanguage: () => {},
      dict: fallbackDict,
      availableLanguages: LANGUAGE_OPTIONS,
      currentLanguageMeta: LANGUAGE_OPTIONS[0],
      t: (key) => fallbackDict[key]
    };
  }
  return ctx;
};
