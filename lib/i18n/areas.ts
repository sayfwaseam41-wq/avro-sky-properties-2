import type {Lang} from './config';

/**
 * Translated names for areas. The English name (as entered in the admin panel) is the key and stays the stored value,
 * so filters, links and database rows never change. Areas missing from a list are shown as entered.
 * To translate a new area, add one line to each language here.
 */
const translations:Record<Exclude<Lang,'en'>,Record<string,string>>={
  ar:{
    'City Centre':'مركز المدينة',
    'Dream City':'دريم سيتي',
    'Erbil Road':'طريق أربيل',
    'Malta':'مالطا',
    'Zawa':'زاوا',
    'Duhok':'دهوك',
    'Zakho':'زاخو',
    'Akre':'عقرة',
    'Amedi':'العمادية',
    'Zawita':'زاويتة',
    'Sumel':'سميل',
    'Domiz':'دوميز',
  },
  ckb:{
    'City Centre':'ناوەندی شار',
    'Dream City':'دریم سیتی',
    'Erbil Road':'ڕێگای هەولێر',
    'Malta':'مالتا',
    'Zawa':'زاوا',
    'Duhok':'دهۆک',
    'Zakho':'زاخۆ',
    'Akre':'ئاکرێ',
    'Amedi':'ئامێدی',
    'Zawita':'زاویتە',
    'Sumel':'سمێل',
    'Domiz':'دۆمیز',
  },
};

const normalise=(value:string)=>value.trim().toLowerCase();
/** Normalised English name -> English name as written above. */
const englishNames=new Map(Object.keys(translations.ar).map(english=>[normalise(english),english]));
/** Normalised name in any language -> English name. */
const toEnglish=new Map<string,string>(englishNames);
for(const names of Object.values(translations))for(const [english,translated] of Object.entries(names))toEnglish.set(normalise(translated),english);

/** Name to display for an area in the given language. */
export function areaName(lang:Lang,area:string){
  if(lang==='en')return area;
  const english=englishNames.get(normalise(area));
  return (english&&translations[lang][english])||area;
}

/** Turns what a visitor typed or picked (English, Arabic or Kurdish) back into the English name used in the database. */
export function canonicalArea(input:string){
  return toEnglish.get(normalise(input))??input.trim();
}
