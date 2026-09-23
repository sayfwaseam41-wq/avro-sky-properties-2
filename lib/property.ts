export const propertyTypes = ['Apartment','House','Villa','Land','Office'] as const;
export type Property = { id: string; title:string; type:typeof propertyTypes[number]; listingType:'For Rent'|'For Sale'; price:number; bedrooms:number; bathrooms:number; size:number; area:string; status:'Available'|'Reserved'|'Rented'; description:string; photos:{url:string;alt:string}[]; featured:boolean; dateListed:string };
export type Filters = {area:string; listingType:string; minPrice:string; maxPrice:string; bedrooms:string};
export const emptyFilters: Filters = {area:'',listingType:'',minPrice:'',maxPrice:'',bedrooms:''};
export function filterProperties(properties:Property[], f:Filters) {
  return properties.filter(p=>(!f.area || p.area===f.area) && (!f.listingType || p.listingType===f.listingType) && (!f.minPrice || p.price>=Number(f.minPrice)) && (!f.maxPrice || p.price<=Number(f.maxPrice)) && (!f.bedrooms || (f.bedrooms==='4+' ? p.bedrooms>=4 : p.bedrooms===Number(f.bedrooms))));
}
export function featuredProperties(properties:Property[]) { const featured=properties.filter(p=>p.featured); return (featured.length?featured:properties).slice(0,6); }
export function publicFormula(now = new Date()) {
  const cutoff = new Date(now.getTime()-7*24*60*60*1000).toISOString();
  return `OR({Status}='Available',{Status}='Reserved',AND({Status}='Rented',IS_AFTER(IF(LAST_MODIFIED_TIME({Status}),LAST_MODIFIED_TIME({Status}),CREATED_TIME()),DATETIME_PARSE('${cutoff}'))))`;
}
