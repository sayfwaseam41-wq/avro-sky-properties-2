export const propertyTypes = ['Apartment','House','Villa','Land','Office'] as const;
export type Property = { id: string; title:string; type:typeof propertyTypes[number]; listingType:'For Rent'|'For Sale'; price:number; bedrooms:number; bathrooms:number; size:number; area:string; status:'Available'|'Reserved'|'Rented'|'Sold'|'Off Market'; description:string; photos:{url:string;alt:string}[]; featured:boolean; dateListed:string; isPublic?:boolean; ownershipKind?:'Company Owned'|'Client Listed'; ownerClientId?:string|null; assignedAgentId?:string|null };
export type Filters = {area:string; type?:string; listingType:string; minPrice:string; maxPrice:string; bedrooms:string};
export const emptyFilters: Filters = {area:'',type:'',listingType:'',minPrice:'',maxPrice:'',bedrooms:''};
export function filterProperties(properties:Property[], f:Filters) {
  return properties.filter(p=>(!f.area || p.area===f.area) && (!f.type || p.type===f.type) && (!f.listingType || p.listingType===f.listingType) && (!f.minPrice || p.price>=Number(f.minPrice)) && (!f.maxPrice || p.price<=Number(f.maxPrice)) && (!f.bedrooms || (f.bedrooms==='4+' ? p.bedrooms>=4 : p.bedrooms===Number(f.bedrooms))));
}
export function featuredProperties(properties:Property[]) { const featured=properties.filter(p=>p.featured); return (featured.length?featured:properties).slice(0,6); }
/** Distinct, sorted areas across listings. Used by the listings filter, the home search and the request form. */
export function areaList(properties:Property[]){return [...new Set(properties.map(p=>p.area).filter(Boolean))].sort();}
