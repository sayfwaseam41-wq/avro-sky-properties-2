'use client';
import {createContext,useContext} from 'react';
import {fmt,localePath,type Lang} from '@/lib/i18n/config';
import type {Dict} from '@/lib/i18n/en';

type Value={lang:Lang;t:Dict;path:(href:string)=>string;fmt:typeof fmt};
const Context=createContext<Value|null>(null);

/** Hands the active language's text to client components, so only one language is sent to the browser. */
export function I18nProvider({lang,dict,children}:{lang:Lang;dict:Dict;children:React.ReactNode}){
  return <Context.Provider value={{lang,t:dict,path:href=>localePath(lang,href),fmt}}>{children}</Context.Provider>;
}
export function useI18n(){
  const value=useContext(Context);
  if(!value)throw new Error('useI18n must be used inside I18nProvider');
  return value;
}
