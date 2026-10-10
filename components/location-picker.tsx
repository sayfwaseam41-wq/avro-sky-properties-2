'use client';
import {useEffect,useRef,useState} from 'react';
import {site} from '@/config/site';
import {parseLocation,type Coordinates} from '@/lib/location';
import {loadLeaflet} from './listing-map';

export type PickerLabels={zoomIn:string;zoomOut:string;contributors:string;loading:string;failed:string;hint:string;clear:string;mapLabel:string;placeholder:string};

/* Only the Leaflet calls the picker uses are typed. */
type Evt={latlng:{lat:number;lng:number}};
type Pin={setLatLng(p:[number,number]):Pin;getLatLng():{lat:number;lng:number};addTo(m:Map):Pin;on(e:string,f:(ev:Evt)=>void):Pin;remove():void};
type Map={setView(c:[number,number],z:number):Map;on(e:string,f:(ev:Evt)=>void):Map;remove():void;getZoom():number};
type Ctl={addTo(m:Map):Ctl};
type Api={
  map(el:HTMLElement,o?:object):Map;
  tileLayer(url:string,o?:object):Ctl;
  marker(p:[number,number],o?:object):Pin;
  control:{zoom(o?:object):Ctl;attribution(o?:object):Ctl&{addAttribution(t:string):Ctl}};
};

const round=(n:number)=>Math.round(n*1e6)/1e6;
const toText=(c:Coordinates)=>`${round(c.lat)}, ${round(c.lng)}`;

/**
 * Click-to-pick map for the admin form. The text box stays (named "location", so the server needs no change):
 * a click or marker drag fills it, and typing or pasting coordinates or a Google Maps link moves the marker.
 */
export function LocationPicker({initial,labels}:{initial:string;labels:PickerLabels}){
  const box=useRef<HTMLDivElement>(null);
  const api=useRef<{map:Map;marker?:Pin;L:Api}|null>(null);
  const [text,setText]=useState(initial);
  const [state,setState]=useState<'loading'|'ready'|'error'>('loading');
  const set=(c:Coordinates|null,fly=false)=>{
    const a=api.current;
    if(!a)return;
    if(!c){a.marker?.remove();a.marker=undefined;return;}
    if(a.marker)a.marker.setLatLng([c.lat,c.lng]);
    else{
      const pin=a.L.marker([c.lat,c.lng],{draggable:true,title:labels.mapLabel,alt:labels.mapLabel}).addTo(a.map);
      pin.on('dragend',()=>setText(toText(pin.getLatLng())));
      a.marker=pin;
    }
    if(fly)a.map.setView([c.lat,c.lng],Math.max(a.map.getZoom(),16));
  };
  const setRef=useRef(set);setRef.current=set;
  const start=useRef(initial);
  useEffect(()=>{
    let cancelled=false;let map:Map|undefined;
    loadLeaflet().then(raw=>{
      if(cancelled||!box.current)return;
      const L=raw as unknown as Api;
      map=L.map(box.current,{scrollWheelZoom:false,zoomControl:false,attributionControl:false});
      L.control.zoom({zoomInTitle:labels.zoomIn,zoomOutTitle:labels.zoomOut}).addTo(map);
      L.control.attribution({prefix:false}).addAttribution(`&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> ${labels.contributors}`).addTo(map);
      L.tileLayer(site.mapTileUrl,{maxZoom:19}).addTo(map);
      api.current={map,L};
      const saved=parseLocation(start.current);
      map.setView(saved?[saved.lat,saved.lng]:site.mapCenter,saved?16:12);
      if(saved)setRef.current(saved);
      map.on('click',e=>{const c={lat:e.latlng.lat,lng:e.latlng.lng};setRef.current(c);setText(toText(c));});
      setState('ready');
    }).catch(()=>{if(!cancelled)setState('error');});
    return ()=>{cancelled=true;api.current=null;map?.remove();};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  return <div className="picker">
    <div className="picker-map">
      <div ref={box} className="picker-canvas" dir="ltr" role="region" aria-label={labels.mapLabel}/>
      {state==='loading'&&<p className="picker-status" role="status">{labels.loading}</p>}
      {state==='error'&&<p className="picker-status" role="alert">{labels.failed}</p>}
    </div>
    <div className="picker-row">
      <input name="location" dir="ltr" value={text} placeholder={labels.placeholder} autoComplete="off"
        onChange={e=>{setText(e.target.value);const c=parseLocation(e.target.value);if(c)set(c,true);else if(!e.target.value.trim())set(null);}}/>
      <button type="button" className="ghost" onClick={()=>{setText('');set(null);}} disabled={!text}>{labels.clear}</button>
    </div>
    <small>{labels.hint}</small>
  </div>;
}
