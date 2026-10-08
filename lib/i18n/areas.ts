import type {Lang} from './config';

/**
 * Arabic names for areas. The English name (as entered in the admin panel) is the key and stays the stored value,
 * so filters, links and database rows never change. Areas missing from this list are shown as entered.
 * To translate a new area, add one line here.
 */
const arabicAreas:Record<string,string>={
  'City Centre':'مركز المدينة',
  'Dream City':'دريم سيتي',
  'Erbil Road':'طريق أربيل',
  'Malta':'مالطا',
  'Zawa':'زاوا',
};

const normalise=(value:string)=>value.trim().toLowerCase();
const byEnglish=new Map(Object.entries(arabicAreas).map(([english,arabic])=>[normalise(english),{english,arabic}]));
const byArabic=new Map(Object.entries(arabicAreas).map(([english,arabic])=>[normalise(arabic),english]));

/** Name to display for an area in the given language. */
export function areaName(lang:Lang,area:string){
  if(lang!=='ar')return area;
  return byEnglish.get(normalise(area))?.arabic??area;
}

/** Turns what a visitor typed or picked (English or Arabic) back into the English name used in the database. */
export function canonicalArea(input:string){
  const key=normalise(input);
  return byEnglish.get(key)?.english??byArabic.get(key)??input.trim();
}
