import 'server-only';
import {cache} from 'react';
import {site} from '@/config/site';
import {publicFormula,propertyTypes,type Property} from './property';
type Row = {id:string;createdTime:string;fields:Record<string,unknown>};
function normalize(row:Row):Property | null {
 const f=row.fields;
 if(!['Available','Reserved','Rented'].includes(String(f.Status)) || !propertyTypes.includes(f.Type as Property['type']) || !['For Rent','For Sale'].includes(String(f['Listing Type'])) || typeof f.Price!=='number' || f.Price<0 || !f.Title) return null;
 const photos=Array.isArray(f.Photos)?f.Photos:[];
 return {id:row.id,title:String(f.Title),type:f.Type as Property['type'],listingType:f['Listing Type'] as Property['listingType'],price:f.Price,bedrooms:Number(f.Bedrooms||0),bathrooms:Number(f.Bathrooms||0),size:Number(f['Size (m²)']||0),area:String(f.Area||''),status:f.Status as Property['status'],description:String(f.Description||''),photos:photos.filter((p):p is {url:string}=>typeof p?.url==='string' && p.url.startsWith('https://')).map((p,i)=>({url:p.url,alt:`${f.Title} — photograph ${i+1}`})),featured:f.Featured===true,dateListed:String(f['Date Listed']||row.createdTime)};
}
// React cache deduplicates only within a request. no-store prevents stale status or expired attachment URLs.
export const getProperties=cache(async ():Promise<Property[]>=>{
 const token=process.env.AIRTABLE_TOKEN;
 if(!token) throw new Error('Property service is not configured');
 const all:Property[]=[]; let offset:string|undefined;
 do {
  const url=new URL(`https://api.airtable.com/v0/${site.airtableBaseId}/${encodeURIComponent(site.airtableTableName)}`);
  url.searchParams.set('filterByFormula',publicFormula()); url.searchParams.set('sort[0][field]','Date Listed');url.searchParams.set('sort[0][direction]','desc');url.searchParams.set('pageSize','100');if(offset)url.searchParams.set('offset',offset);
  const response=await fetch(url,{headers:{Authorization:`Bearer ${token}`},cache:'no-store',signal:AbortSignal.timeout(12000)});
  if(!response.ok) { console.error('Airtable request failed',response.status);throw new Error('Property service is temporarily unavailable'); }
  const data=await response.json() as {records:Row[];offset?:string};
  for(const row of data.records){const p=normalize(row);if(p)all.push(p);} offset=data.offset;
 }while(offset);
 return all.sort((a,b)=>Date.parse(b.dateListed)-Date.parse(a.dateListed)||a.id.localeCompare(b.id));
});
export async function getProperty(id:string){ if(!/^rec[a-zA-Z0-9]{14}$/.test(id))return undefined;return (await getProperties()).find(p=>p.id===id); }
