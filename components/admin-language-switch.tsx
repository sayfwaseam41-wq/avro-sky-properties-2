'use client';
import {useRouter} from 'next/navigation';
import {adminCookie} from '@/lib/i18n/admin';
import {langLabel,langs} from '@/lib/i18n/config';
import {LanguageSwitch} from './language-switch';
import {useAdminI18n} from './admin-i18n-provider';

/** Admin pages are not under /[lang], so the choice is stored in a cookie and the page is re-rendered. One pill per other language. */
export function AdminLanguageSwitch(){
  const {lang}=useAdminI18n();
  const router=useRouter();
  return <>{langs.filter(other=>other!==lang).map(other=><LanguageSwitch key={other} target={other} label={langLabel[other]} href="#" onClick={e=>{
    e.preventDefault();
    document.cookie=`${adminCookie}=${other}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }}/>)}</>;
}
