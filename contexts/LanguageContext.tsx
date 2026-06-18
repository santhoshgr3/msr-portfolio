'use client';
import { createContext, useContext, useState, useEffect } from 'react';

export type Lang = 'en' | 'te';

interface LangCtx { lang: Lang; toggle: () => void; setLang: (l: Lang) => void }
const Ctx = createContext<LangCtx>({ lang: 'en', toggle: () => {}, setLang: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const stored = localStorage.getItem('site_lang') as Lang | null;
    if (stored === 'te') setLangState('te');
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('site_lang', l);
  };

  const toggle = () => setLang(lang === 'en' ? 'te' : 'en');

  return <Ctx.Provider value={{ lang, toggle, setLang }}>{children}</Ctx.Provider>;
}

export const useLanguage = () => useContext(Ctx);
