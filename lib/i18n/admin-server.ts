import 'server-only';
import {cookies} from 'next/headers';
import {adminCookie,adminDictFor} from './admin';
import {defaultLang,type Lang} from './config';

/** The admin area has no /[lang] route, so its language is a cookie set by the header switcher (English, Arabic or Kurdish). */
export async function adminLang():Promise<Lang>{
  const value=(await cookies()).get(adminCookie)?.value||'';
  return value==='ar'||value==='ckb'?value:defaultLang;
}
export async function adminDict(){return adminDictFor(await adminLang());}
