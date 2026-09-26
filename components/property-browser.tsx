'use client';
import {useEffect,useState} from 'react';
import {emptyFilters,filterProperties,type Property,type Filters} from '@/lib/property';
import {PropertyCard} from './property-card';
import {site} from '@/config/site';

export function PropertyBrowser({properties}:{properties:Property[]}){
  const [filters,setFilters]=useState<Filters>(emptyFilters);
  const areas=[...new Set(properties.map(p=>p.area))].sort();
  useEffect(()=>{const params=new URLSearchParams(window.location.search);setFilters(old=>({...old,area:params.get('area')||'',type:params.get('type')||'',listingType:params.get('listingType')||'',maxPrice:params.get('maxPrice')||'',bedrooms:params.get('bedrooms')||''}))},[]);
  const results=filterProperties(properties,filters);
  function set(key:keyof Filters,value:string){setFilters(old=>({...old,[key]:value}));}
  return <><div className="filters" role="search" aria-label="Filter properties">
    <label className="field">Property type<select value={filters.type} onChange={e=>set('type',e.target.value)}><option value="">All types</option><option>Apartment</option><option>House</option><option>Land</option><option>Villa</option><option>Office</option></select></label>
    <label className="field">Area<select value={filters.area} onChange={e=>set('area',e.target.value)}><option value="">All areas</option>{areas.map(area=><option key={area}>{area}</option>)}</select></label>
    <label className="field">Listing Type<select value={filters.listingType} onChange={e=>set('listingType',e.target.value)}><option value="">Rent & sale</option><option>For Rent</option><option>For Sale</option></select></label>
    <label className="field">Min price ({site.currency})<input type="number" min="0" placeholder="No minimum" value={filters.minPrice} onChange={e=>set('minPrice',e.target.value)}/></label>
    <label className="field">Max price ({site.currency})<input type="number" min="0" placeholder="No maximum" value={filters.maxPrice} onChange={e=>set('maxPrice',e.target.value)}/></label>
    <label className="field">Bedrooms<select value={filters.bedrooms} onChange={e=>set('bedrooms',e.target.value)}><option value="">Any</option><option value="0">0 / No bedrooms</option>{[1,2,3].map(n=><option key={n} value={n}>{n}</option>)}<option value="4+">4+</option></select></label>
  </div><div className="results-bar"><span role="status">{results.length} {results.length===1?'property':'properties'} found</span><button className="reset" onClick={()=>setFilters(emptyFilters)}>Clear filters</button></div>{results.length?<div className="property-grid">{results.map(p=><PropertyCard key={p.id} property={p}/>)}</div>:<div className="empty-state"><h2>No matching properties</h2><p>Try a different area or budget, or send us your requirements.</p><button className="button secondary" onClick={()=>setFilters(emptyFilters)}>Clear filters</button></div>}</>;
}
