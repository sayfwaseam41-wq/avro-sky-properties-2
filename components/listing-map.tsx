'use client';
import {useEffect,useRef,useState} from 'react';
import {site} from '@/config/site';
import {useI18n} from './i18n-provider';

/** One listing on the map. `price` is shown in the popup, `short` on the pin. */
export type MapPin={id:string;lat:number;lng:number;title:string;price:string;short:string;href:string};

/*
 * Leaflet is loaded from a CDN when a map is first shown, so there is nothing to install and pages without a map never pay for it.
 * The version is pinned. Only the few Leaflet calls used below are typed.
 */
const LEAFLET_VERSION='1.9.4';
const LEAFLET_CSS=`https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;
const LEAFLET_JS=`https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`;

type Layer={addTo(map:LeafletMap):Layer;bindPopup(content:HTMLElement,options?:object):Layer};
type LeafletMap={setView(center:[number,number],zoom:number):LeafletMap;fitBounds(bounds:[number,number][],options?:object):LeafletMap;remove():void};
type LeafletApi={
  map(element:HTMLElement,options?:object):LeafletMap;
  tileLayer(url:string,options?:object):Layer;
  marker(position:[number,number],options?:object):Layer;
  divIcon(options:object):unknown;
  control:{zoom(options?:object):Control;attribution(options?:object):Control&{addAttribution(text:string):Control}};
};
type Control={addTo(map:LeafletMap):Control};

let loading:Promise<LeafletApi>|undefined;
function loadLeaflet():Promise<LeafletApi>{
  const w=window as unknown as {L?:LeafletApi};
  if(w.L)return Promise.resolve(w.L);
  loading??=new Promise<LeafletApi>((resolve,reject)=>{
    if(!document.querySelector('link[data-leaflet]')){
      const link=document.createElement('link');
      link.rel='stylesheet';link.href=LEAFLET_CSS;link.dataset.leaflet='1';
      document.head.appendChild(link);
    }
    const script=document.createElement('script');
    script.src=LEAFLET_JS;script.async=true;
    script.onload=()=>w.L?resolve(w.L):reject(new Error('Leaflet did not start'));
    script.onerror=()=>reject(new Error('Leaflet could not be downloaded'));
    document.head.appendChild(script);
  }).catch(error=>{loading=undefined;throw error;});
  return loading;
}

/** Popup built from DOM nodes (not HTML strings), so listing titles can never inject markup. */
function popupFor(pin:MapPin,linkText:string){
  const root=document.createElement('div');root.className='map-popup';
  const title=document.createElement('a');title.href=pin.href;title.className='map-popup-title';title.textContent=pin.title;
  const price=document.createElement('p');price.textContent=pin.price;
  const more=document.createElement('a');more.href=pin.href;more.className='map-popup-link';more.textContent=linkText;
  root.append(title,price,more);
  return root;
}

export function ListingMap({pins,label,height=480,single=false}:{pins:MapPin[];label:string;height?:number;single?:boolean}){
  const {t}=useI18n();
  const box=useRef<HTMLDivElement>(null);
  const labels={zoomIn:t.map.zoomIn,zoomOut:t.map.zoomOut,contributors:t.map.contributors};
  const latest=useRef({pins,linkText:t.map.viewProperty,single,labels});
  latest.current={pins,linkText:t.map.viewProperty,single,labels};
  const [state,setState]=useState<'loading'|'ready'|'error'>('loading');
  // The map is rebuilt only when the set of pins really changes, not on every render of the parent.
  const signature=pins.map(p=>`${p.id}:${p.lat}:${p.lng}`).join('|');
  useEffect(()=>{
    let cancelled=false;
    let map:LeafletMap|undefined;
    setState('loading');
    loadLeaflet().then(L=>{
      if(cancelled||!box.current)return;
      const {pins:current,linkText,single:alone,labels}=latest.current;
      map=L.map(box.current,{scrollWheelZoom:false,zoomControl:false,attributionControl:false});
      // Controls are added by hand so their labels follow the page language ("Leaflet" prefix dropped; OpenStreetMap credit kept as its licence requires).
      L.control.zoom({zoomInTitle:labels.zoomIn,zoomOutTitle:labels.zoomOut}).addTo(map);
      L.control.attribution({prefix:false}).addAttribution(`&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> ${labels.contributors}`).addTo(map);
      L.tileLayer(site.mapTileUrl,{maxZoom:19}).addTo(map);
      for(const pin of current){
        const bubble=document.createElement('span');bubble.textContent=pin.short;
        const icon=L.divIcon({className:'map-pin',html:bubble,iconSize:[0,0]});
        L.marker([pin.lat,pin.lng],{icon,title:pin.title,alt:pin.title}).addTo(map).bindPopup(popupFor(pin,linkText));
      }
      if(current.length===0)map.setView(site.mapCenter,12);
      else if(alone||current.length===1)map.setView([current[0].lat,current[0].lng],15);
      else map.fitBounds(current.map(p=>[p.lat,p.lng] as [number,number]),{padding:[48,48],maxZoom:16});
      setState('ready');
    }).catch(()=>{if(!cancelled)setState('error');});
    return ()=>{cancelled=true;map?.remove();};
  },[signature]);
  return <div className="map-box" style={{height}}>
    <div ref={box} className="map-canvas" dir="ltr" role="region" aria-label={label}/>
    {state==='loading'&&<p className="map-status" role="status">{t.map.loading}</p>}
    {state==='error'&&<p className="map-status" role="alert">{t.map.failed}</p>}
  </div>;
}
