export const langs=['en','ar','ckb'] as const;
export type Lang=(typeof langs)[number];
export const defaultLang:Lang='en';
export const isLang=(value:string):value is Lang=>(langs as readonly string[]).includes(value);
export const dirOf=(lang:Lang)=>lang==='en'?'ltr':'rtl';
/** Short label each language shows on its own switch button. */
export const langLabel:Record<Lang,string>={en:'EN',ar:'عربي',ckb:'کوردی'};
/** Open Graph locale for each language (Kurdish Sorani, Iraq). */
export const ogLocale:Record<Lang,string>={en:'en_US',ar:'ar_IQ',ckb:'ckb_IQ'};

/** English lives at the site root and other languages under a prefix: localePath('ar','/properties') -> /ar/properties, localePath('ckb','/properties') -> /ckb/properties */
export function localePath(lang:Lang,path:string){
  if(lang===defaultLang)return path;
  return path==='/'?`/${lang}`:`/${lang}${path}`;
}
/** Removes a language prefix from a path: /ar/properties -> /properties. English pages are prerendered under /en, so that prefix is removed too. */
export function stripLang(path:string){
  for(const lang of langs)if(path===`/${lang}`||path.startsWith(`/${lang}/`))return path.slice(lang.length+1)||'/';
  return path;
}
/** Fills {name} placeholders in a translated string. */
export function fmt(text:string,values:Record<string,string|number>={}){return text.replace(/\{(\w+)\}/g,(_,key)=>String(values[key]??''));}
