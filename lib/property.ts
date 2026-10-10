import type {Lang} from './i18n/config';
import {pick,type Translations} from './translations';

/** Features a listing can have. The key is stored in the database; the words live in the dictionaries. */
export const amenityKeys = ['furnished','parking','balcony','generator','airConditioning','heating','elevator','security','garden','pool','internet'] as const;
export const propertyTypes = ['Apartment','House','Villa','Land','Office'] as const;
export type Property = { id: string; title:string; type:typeof propertyTypes[number]; listingType:'For Rent'|'For Sale'; price:number; bedrooms:number; bathrooms:number; size:number; area:string; status:'Available'|'Reserved'|'Rented'|'Sold'|'Off Market'; description:string; photos:{url:string;alt:string}[]; featured:boolean; latitude?:number|null; longitude?:number|null; amenities?:string[]; projectId?:string|null; translations?:Translations; dateListed:string; isPublic?:boolean; ownershipKind?:'Company Owned'|'Client Listed'; ownerClientId?:string|null; assignedAgentId?:string|null };
export type Filters = {area:string; type?:string; project?:string; listingType:string; minPrice:string; maxPrice:string; bedrooms:string};
export const emptyFilters: Filters = {area:'',type:'',project:'',listingType:'',minPrice:'',maxPrice:'',bedrooms:''};
export function filterProperties(properties:Property[], f:Filters) {
  return properties.filter(p=>(!f.area || p.area===f.area) && (!f.type || p.type===f.type) && (!f.project || p.projectId===f.project) && (!f.listingType || p.listingType===f.listingType) && (!f.minPrice || p.price>=Number(f.minPrice)) && (!f.maxPrice || p.price<=Number(f.maxPrice)) && (!f.bedrooms || (f.bedrooms==='4+' ? p.bedrooms>=4 : p.bedrooms===Number(f.bedrooms))));
}
export function featuredProperties(properties:Property[]) { const featured=properties.filter(p=>p.featured); return (featured.length?featured:properties).slice(0,6); }
/** Distinct, sorted areas across listings. Used by the listings filter, the home search and the request form. */
export function areaList(properties:Property[]){return [...new Set(properties.map(p=>p.area).filter(Boolean))].sort();}
/** Up to `limit` other listings a visitor might also like: same rent/sale type, then same area and property type, then closest in price. */
export function similarProperties(properties:Property[],current:Property,limit=3){
  return properties
    .filter(p=>p.id!==current.id&&p.listingType===current.listingType&&(p.area===current.area||p.type===current.type))
    .map(p=>({p,score:(p.area===current.area?2:0)+(p.type===current.type?2:0)+(Math.abs(p.price-current.price)<=current.price*0.3?1:0)}))
    .sort((a,b)=>b.score-a.score||Math.abs(a.p.price-current.price)-Math.abs(b.p.price-current.price)||a.p.id.localeCompare(b.p.id))
    .slice(0,limit)
    .map(entry=>entry.p);
}

/** Fields staff can translate on a listing. */
export const propertyTranslatedFields=['title','description'] as const;
/** The listing with its title and description (and photo descriptions) in the visitor's language; English when no translation was entered. */
export function localizeProperty(p:Property,lang:Lang,photoWord='photograph'):Property{
  if(lang==='en')return p;
  const title=pick(p.translations,lang,'title',p.title);
  return {...p,title,description:pick(p.translations,lang,'description',p.description),photos:p.photos.map((photo,index)=>({...photo,alt:`${title} — ${photoWord} ${index+1}`}))};
}
