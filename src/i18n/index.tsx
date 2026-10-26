import {createContext, useContext, useEffect, useMemo, useState, type ReactNode} from 'react';
import {ptBR} from './ptBR';
import {enUS} from './enUS';

export type Locale = 'pt-BR' | 'en-US';
type Dictionary = typeof ptBR | typeof enUS;
const dictionaries: Record<Locale, Dictionary> = {'pt-BR': ptBR, 'en-US': enUS};

type I18nValue = { locale: Locale; setLocale: (locale: Locale) => void; t: Dictionary };
const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({children}:{children:ReactNode}){
  const [locale,setLocaleState]=useState<Locale>(()=>localStorage.getItem('webseer.locale') === 'en-US' ? 'en-US' : 'pt-BR');
  const setLocale=(next:Locale)=>setLocaleState(next);
  useEffect(()=>{ localStorage.setItem('webseer.locale',locale); document.documentElement.lang=locale; },[locale]);
  const value=useMemo(()=>({locale,setLocale,t:dictionaries[locale]}),[locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(){const value=useContext(I18nContext); if(!value) throw new Error('useI18n must be used inside I18nProvider'); return value;}
