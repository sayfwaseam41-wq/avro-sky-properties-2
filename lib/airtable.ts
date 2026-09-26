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
export const getAllProperties=cache(async ():Promise<Property[]>=>{
 const token=process.env.AIRTABLE_TOKEN;if(!token) throw new Error('Property service is not configured');
 const all:Property[]=[];let offset:string|undefined;
 do {const url=new URL(`https://api.airtable.com/v0/${site.airtableBaseId}/${encodeURIComponent(site.airtableTableName)}`);url.searchParams.set('sort[0][field]','Date Listed');url.searchParams.set('sort[0][direction]','desc');url.searchParams.set('pageSize','100');if(offset)url.searchParams.set('offset',offset);const response=await fetch(url,{headers:{Authorization:`Bearer ${token}`},cache:'no-store',signal:AbortSignal.timeout(12000)});if(!response.ok)throw new Error('Unable to load properties.');const data=await response.json() as {records:Row[];offset?:string};for(const row of data.records){const p=normalize(row);if(p)all.push(p);}offset=data.offset;}while(offset);
 return all.sort((a,b)=>Date.parse(b.dateListed)-Date.parse(a.dateListed)||a.id.localeCompare(b.id));
});
function numberField(value:FormDataEntryValue|null,label:string){const n=Number(value);if(!Number.isFinite(n)||n<0)throw new Error(`${label} must be a zero or positive number.`);return n;}
function fieldsFromForm(form:FormData){const title=String(form.get('title')||'').trim();const area=String(form.get('area')||'').trim();const description=String(form.get('description')||'').trim();const type=String(form.get('type')||'');const listingType=String(form.get('listingType')||'');const status=String(form.get('status')||'');const dateListed=String(form.get('dateListed')||'');if(!title||!area||!description)throw new Error('Title, area, and description are required.');if(!/^\d{4}-\d{2}-\d{2}$/.test(dateListed))throw new Error('Date listed must be a valid date.');if(!propertyTypes.includes(type as Property['type'])||!['For Rent','For Sale'].includes(listingType)||!['Available','Reserved','Rented'].includes(status))throw new Error('One of the selected options is invalid.');const photoUrls=String(form.get('photos')||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);if(photoUrls.some(url=>!/^https:\/\//.test(url)))throw new Error('Each photo URL must start with https://');return {Title:title,Type:type,'Listing Type':listingType,Price:numberField(form.get('price'),'Price'),Bedrooms:numberField(form.get('bedrooms'),'Bedrooms'),Bathrooms:numberField(form.get('bathrooms'),'Bathrooms'),'Size (m²)':numberField(form.get('size'),'Size'),Area:area,Status:status,Description:description,Photos:photoUrls.map(url=>({url})),Featured:form.get('featured')==='on','Date Listed':dateListed};}
async function mutate(method:'POST'|'PATCH'|'DELETE',body:unknown){const token=process.env.AIRTABLE_TOKEN;if(!token)throw new Error('Property service is not configured');const response=await fetch(`https://api.airtable.com/v0/${site.airtableBaseId}/${encodeURIComponent(site.airtableTableName)}`,{method,headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify(body),cache:'no-store',signal:AbortSignal.timeout(12000)});if(!response.ok){console.error('Airtable mutation failed',response.status);throw new Error('Airtable could not save this change.');}}
export async function createProperty(form:FormData){await mutate('POST',{fields:fieldsFromForm(form)});}
export async function updateProperty(id:string,form:FormData){if(!/^rec[a-zA-Z0-9]{14}$/.test(id))throw new Error('Invalid property ID.');await mutate('PATCH',{records:[{id,fields:fieldsFromForm(form)}]});}
export async function deleteProperty(id:string){if(!/^rec[a-zA-Z0-9]{14}$/.test(id))throw new Error('Invalid property ID.');await mutate('DELETE',{records:[{id}]});}
export async function getProperty(id:string){ if(!/^rec[a-zA-Z0-9]{14}$/.test(id))return undefined;return (await getProperties()).find(p=>p.id===id); }
