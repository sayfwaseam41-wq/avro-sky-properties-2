'use client';
import {useRouter} from 'next/navigation';
import {adminCookie} from '@/lib/i18n/admin';
import {LanguageSwitch} from './language-switch';
import {useAdminI18n} from './admin-i18n-provider';

/** Admin pages are not under /[lang], so the choice is stored in a cookie and the page is re-rendered. */
export function AdminLanguageSwitch(){
  const {lang,a}=useAdminI18n();
  const router=useRouter();
  const other=lang==='en'?'ar':'en';
  return <LanguageSwitch target={other} label={a.common.otherLang} href="#" onClick={e=>{
    e.preventDefault();
    document.cookie=`${adminCookie}=${other}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }}/>;
}
