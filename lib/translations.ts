import type {Lang} from './i18n/config';

/**
 * Text that staff type in the admin area (listing titles, project names, reviews...) is stored in English.
 * Staff can also type an Arabic and a Kurdish version; those live in one JSON column called `translations`:
 *   {"ar":{"title":"..."},"ckb":{"title":"..."}}
 * The website shows the version for the visitor's language and falls back to the English text when one is missing.
 */
export const translatedLangs=['ar','ckb'] as const;
export type TranslatedLang=typeof translatedLangs[number];
export type Translations=Partial<Record<TranslatedLang,Record<string,string>>>;

/** Safe reading of whatever the database returns (a JSON string, an object, null). Unknown keys and non-strings are dropped. */
export function parseTranslations(value:unknown,fields:readonly string[]):Translations{
  let raw:unknown=value;
  if(typeof value==='string'){try{raw=JSON.parse(value);}catch{raw={};}}
  const out:Translations={};
  if(!raw||typeof raw!=='object')return out;
  for(const lang of translatedLangs){
    const entry=(raw as Record<string,unknown>)[lang];
    if(!entry||typeof entry!=='object')continue;
    const clean:Record<string,string>={};
    for(const field of fields){const v=(entry as Record<string,unknown>)[field];if(typeof v==='string'&&v.trim())clean[field]=v.trim();}
    if(Object.keys(clean).length)out[lang]=clean;
  }
  return out;
}

/** Reads form inputs named `<field>_ar` and `<field>_ckb`. Empty boxes are simply left out. */
export function translationsFromForm(form:FormData,fields:readonly string[],maxLength:Record<string,number>={}):Translations{
  const out:Translations={};
  for(const lang of translatedLangs){
    const clean:Record<string,string>={};
    for(const field of fields){const v=String(form.get(`${field}_${lang}`)||'').trim().slice(0,maxLength[field]??4000);if(v)clean[field]=v;}
    if(Object.keys(clean).length)out[lang]=clean;
  }
  return out;
}

/** The text to show in `lang`: the translation when there is one, otherwise the English original. */
export function pick(translations:Translations|undefined,lang:Lang,field:string,original:string){
  if(lang==='en')return original;
  return translations?.[lang]?.[field]||original;
}
