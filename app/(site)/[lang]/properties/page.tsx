import {getCachedProperties} from '@/lib/public-data';
import {PropertyBrowser} from '@/components/property-browser';
import type {Filters,Property} from '@/lib/property';
import {getDict} from '@/lib/i18n/dict';
import {alternates,langFrom,type LangParams} from '@/lib/i18n/server';

export async function generateMetadata({params}:LangParams){
  const lang=await langFrom(params);
  const t=getDict(lang).listings;
  return {title:t.metaTitle,description:t.metaDesc,alternates:alternates(lang,'/properties')};
}

const keys=['area','type','listingType','minPrice','maxPrice','bedrooms'] as const;

export default async function Properties({params,searchParams}:LangParams&{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const lang=await langFrom(params);
  const t=getDict(lang).listings;
  const query=await searchParams;
  const initial:Partial<Filters>={};
  for(const key of keys){const value=query[key];const text=Array.isArray(value)?value[0]:value;if(text)initial[key]=text;}
  const properties:Property[]=await getCachedProperties();
  return <>
    <section className="page-head"><div className="wrap"><p className="eyebrow eyebrow-light">{t.eyebrow}</p><h1>{t.h1}</h1><p>{t.lede}</p></div></section>
    <section className="section section-tint section-flush"><div className="wrap"><PropertyBrowser properties={properties} initial={initial}/></div></section>
  </>;
}
