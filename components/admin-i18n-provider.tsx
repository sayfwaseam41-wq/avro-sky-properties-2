'use client';
import {createContext,useContext} from 'react';
import {fmt,type Lang} from '@/lib/i18n/config';
import type {AdminDict} from '@/lib/i18n/admin';

type Value={lang:Lang;a:AdminDict;fmt:typeof fmt};
const Context=createContext<Value|null>(null);

/** Hands the admin interface text in the active language to client components. */
export function AdminI18nProvider({lang,dict,children}:{lang:Lang;dict:AdminDict;children:React.ReactNode}){
  return <Context.Provider value={{lang,a:dict,fmt}}>{children}</Context.Provider>;
}
export function useAdminI18n(){
  const value=useContext(Context);
  if(!value)throw new Error('useAdminI18n must be used inside AdminI18nProvider');
  return value;
}
