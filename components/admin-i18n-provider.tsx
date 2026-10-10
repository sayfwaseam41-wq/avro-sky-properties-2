'use client';
import {createContext,useContext,useEffect,useState,useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {dirOf,fmt,type Lang} from '@/lib/i18n/config';
import {adminCookie,adminDictFor,type AdminDict} from '@/lib/i18n/admin';

type Value={lang:Lang;a:AdminDict;fmt:typeof fmt;setLang:(next:Lang)=>void;switching:boolean};
const Context=createContext<Value|null>(null);

/**
 * Hands the admin interface text to client components. All three dictionaries ship with the page, so choosing a language
 * changes every client-rendered label at once; the cookie is saved and the server re-renders in the background
 * so server-rendered headings follow a moment later.
 */
export function AdminI18nProvider({lang:serverLang,children}:{lang:Lang;children:React.ReactNode}){
  const router=useRouter();
  const [lang,setLangState]=useState(serverLang);
  const [switching,startTransition]=useTransition();
  // After the server has re-rendered, follow whatever language it used.
  useEffect(()=>{setLangState(serverLang);},[serverLang]);
  const setLang=(next:Lang)=>{
    if(next===lang)return;
    setLangState(next);
    document.documentElement.lang=next;
    document.documentElement.dir=dirOf(next);
    document.cookie=`${adminCookie}=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(()=>router.refresh());
  };
  return <Context.Provider value={{lang,a:adminDictFor(lang),fmt,setLang,switching}}>{children}</Context.Provider>;
}
export function useAdminI18n(){
  const value=useContext(Context);
  if(!value)throw new Error('useAdminI18n must be used inside AdminI18nProvider');
  return value;
}
