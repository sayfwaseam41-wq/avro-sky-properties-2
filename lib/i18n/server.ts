import 'server-only';
import {notFound} from 'next/navigation';
import {isLang,localePath,type Lang} from './config';

export type LangParams={params:Promise<{lang:string}>};

/** Reads and validates the [lang] route segment. */
export async function langFrom(params:Promise<{lang:string}>):Promise<Lang>{
  const {lang}=await params;
  if(!isLang(lang))notFound();
  return lang;
}

/** Canonical and hreflang alternates for a page, given its language-free path. */
export function alternates(lang:Lang,path:string){
  return {canonical:localePath(lang,path),languages:{en:localePath('en',path),ar:localePath('ar',path),'x-default':localePath('en',path)}};
}
