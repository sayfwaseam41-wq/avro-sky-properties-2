'use client';

import type {Translations,TranslatedLang} from '@/lib/translations';
import {translatedLangs} from '@/lib/translations';
import {useAdminI18n} from './admin-i18n-provider';

export type TranslationField={name:string;label:string;multiline?:boolean;max?:number;required?:boolean};

/**
 * Arabic and Kurdish boxes for the text on a form. Inputs are named `<field>_ar` and `<field>_ckb`,
 * which is what `translationsFromForm` reads on the server. The section starts open when something is already translated.
 */
export function TranslationFields({fields,values}:{fields:TranslationField[];values?:Translations}){
  const {a}=useAdminI18n();const t=a.translations;
  const has=translatedLangs.some(lang=>values?.[lang]&&Object.keys(values[lang]!).length);
  const title:Record<TranslatedLang,string>={ar:t.ar,ckb:t.ckb};
  return <details className="admin-translations full" open={has}>
    <summary>{t.summary}</summary>
    <p className="admin-translations-hint">{t.hint}</p>
    {translatedLangs.map(lang=><fieldset key={lang} className="admin-translation-lang" lang={lang} dir="rtl">
      <legend>{title[lang]}</legend>
      {fields.map(field=><label key={field.name} className="field full">{field.label}
        {field.multiline
          ?<textarea name={`${field.name}_${lang}`} rows={4} defaultValue={values?.[lang]?.[field.name]} maxLength={field.max}/>
          :<input name={`${field.name}_${lang}`} defaultValue={values?.[lang]?.[field.name]} maxLength={field.max}/>}
      </label>)}
    </fieldset>)}
  </details>;
}
