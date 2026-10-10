'use client';
import {useDeferredValue,useState} from 'react';
import Link from 'next/link';
import {fmt} from '@/lib/i18n/config';
import {areaName} from '@/lib/i18n/areas';
import {areaList,emptyFilters,filterProperties,propertyTypes,type Property,type Filters} from '@/lib/property';
import {coordinatesOf} from '@/lib/location';
import {PropertyCard,pinPriceLabel,priceLabel} from './property-card';
import {ListingMap,type MapPin} from './listing-map';
import {useI18n} from './i18n-provider';

export function PropertyBrowser({properties,initial,projects=[]}:{properties:Property[];initial?:Partial<Filters>;projects?:{id:string;name:string}[]}){
  const {lang,t,path}=useI18n();
  const f=t.filters;
  const [filters,setFilters]=useState<Filters>({...emptyFilters,...initial});
  const [view,setView]=useState<'list'|'map'>('list');
  const deferred=useDeferredValue(filters);
  const areas=areaList(properties);
  const results=filterProperties(properties,deferred);
  const set=(key:keyof Filters,value:string)=>setFilters(old=>({...old,[key]:value}));
  const clear=()=>setFilters(emptyFilters);
  const active=Object.values(filters).some(Boolean);
  const pins:MapPin[]=results.flatMap(p=>{const at=coordinatesOf(p);return at?[{id:p.id,lat:at.lat,lng:at.lng,title:p.title,price:priceLabel(p)+(p.listingType==='For Rent'?` ${t.card.perMonth}`:''),short:pinPriceLabel(p),href:path(`/properties/${p.id}`)}]:[];});
  const missing=results.length-pins.length;
  return <>
    <div className="filters" role="search" aria-label={f.label}>
      <label className="field">{f.type}<select value={filters.type} onChange={e=>set('type',e.target.value)}><option value="">{f.allTypes}</option>{propertyTypes.map(type=><option key={type} value={type}>{t.types[type]}</option>)}</select></label>
      <label className="field">{f.area}<select value={filters.area} onChange={e=>set('area',e.target.value)}><option value="">{f.allAreas}</option>{areas.map(area=><option key={area} value={area}>{areaName(lang,area)}</option>)}</select></label>
      {projects.length>0&&<label className="field">{t.projects.projectFilter}<select value={filters.project||''} onChange={e=>set('project',e.target.value)}><option value="">{t.projects.allProjectsOption}</option>{projects.map(project=><option key={project.id} value={project.id}>{project.name}</option>)}</select></label>}
      <label className="field">{f.rentOrBuy}<select value={filters.listingType} onChange={e=>set('listingType',e.target.value)}><option value="">{f.rentSale}</option><option value="For Rent">{f.forRent}</option><option value="For Sale">{f.forSale}</option></select></label>
      <label className="field">{f.bedrooms}<select value={filters.bedrooms} onChange={e=>set('bedrooms',e.target.value)}><option value="">{f.any}</option><option value="0">{f.none}</option>{[1,2,3].map(n=><option key={n} value={n}>{n}</option>)}<option value="4+">4+</option></select></label>
      <label className="field">{f.min}<input type="number" dir="ltr" inputMode="numeric" min="0" placeholder={f.noMin} value={filters.minPrice} onChange={e=>set('minPrice',e.target.value)}/></label>
      <label className="field">{f.max}<input type="number" dir="ltr" inputMode="numeric" min="0" placeholder={f.noMax} value={filters.maxPrice} onChange={e=>set('maxPrice',e.target.value)}/></label>
    </div>
    <div className="results-bar"><span role="status" aria-live="polite">{fmt(results.length===1?f.found1:f.foundN,{n:results.length})}</span><div className="results-tools">{active&&<button type="button" className="link-btn" onClick={clear}>{f.clear}</button>}<div className="view-toggle" role="group" aria-label={t.map.view}><button type="button" aria-pressed={view==='list'} onClick={()=>setView('list')}>{t.map.list}</button><button type="button" aria-pressed={view==='map'} onClick={()=>setView('map')}>{t.map.map}</button></div></div></div>
    {results.length&&view==='map'
      ?<><ListingMap pins={pins} label={t.map.label} height={520}/><p className="map-note">{pins.length?fmt(t.map.onMap,{n:pins.length})+(missing?` · ${fmt(t.map.withoutLocation,{n:missing})}`:''):t.map.noPins}</p></>
      :results.length
      ?<div className="grid">{results.map((p,i)=><PropertyCard key={p.id} property={p} lang={lang} t={t} eager={i<3} heading="h2"/>)}</div>
      :<div className="empty"><h2>{f.noMatch}</h2><p>{f.noMatchText}</p><div className="empty-actions"><button type="button" className="btn btn-outline" onClick={clear}>{f.clear}</button><Link className="btn btn-gold" href={path('/request')}>{t.home.requestProperty}</Link></div></div>}
  </>;
}
