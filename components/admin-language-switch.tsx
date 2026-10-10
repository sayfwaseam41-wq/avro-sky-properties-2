'use client';
import {langLabel,langs} from '@/lib/i18n/config';
import {LanguageSwitch} from './language-switch';
import {useAdminI18n} from './admin-i18n-provider';

/** One pill per other language, kept together. The switch is instant; the server catches up in the background. */
export function AdminLanguageSwitch(){
  const {lang,setLang,switching}=useAdminI18n();
  return <div className="lang-group" aria-busy={switching}>{langs.filter(other=>other!==lang).map(other=><LanguageSwitch key={other} target={other} label={langLabel[other]} href="#" onClick={e=>{e.preventDefault();setLang(other);}}/>)}</div>;
}
