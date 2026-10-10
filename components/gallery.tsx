'use client';
import {useState} from 'react';
import Image from 'next/image';
import {dirOf,fmt} from '@/lib/i18n/config';
import {ChevronLeftIcon,ChevronRightIcon} from './icons';
import {useI18n} from './i18n-provider';

export function Gallery({photos}:{photos:{url:string;alt:string}[]}){
  const {lang,t}=useI18n();
  const g=t.gallery;
  const [active,setActive]=useState(0);
  const go=(delta:number)=>setActive(a=>(a+delta+photos.length)%photos.length);
  // Arrow keys follow the reading direction: in right-to-left languages (Arabic, Kurdish) the left arrow goes to the next photo.
  const rtl=dirOf(lang)==='rtl';
  const forward=rtl?'ArrowLeft':'ArrowRight';
  const back=rtl?'ArrowRight':'ArrowLeft';
  if(!photos.length)return <div className="gallery gallery-empty"><span>{g.soon}</span></div>;
  return <section className="gallery" aria-label={g.label} onKeyDown={e=>{if(e.key===forward){e.preventDefault();go(1);}if(e.key===back){e.preventDefault();go(-1);}}}>
    <div className="gallery-main">
      <Image key={photos[active].url} src={photos[active].url} alt={photos[active].alt} fill loading="eager" fetchPriority={active===0?'high':'auto'} sizes="(min-width:1024px) 760px,100vw"/>
      {photos.length>1&&<div className="gallery-controls"><button type="button" onClick={()=>go(-1)} aria-label={g.prev}><ChevronLeftIcon size={22}/></button><span aria-live="polite" dir="ltr">{active+1} / {photos.length}</span><button type="button" onClick={()=>go(1)} aria-label={g.next}><ChevronRightIcon size={22}/></button></div>}
    </div>
    {photos.length>1&&<div className="thumbs">{photos.map((p,i)=><button type="button" key={p.url} aria-label={fmt(g.show,{n:i+1})} aria-pressed={i===active} onClick={()=>setActive(i)}><Image src={p.url} alt="" fill loading="lazy" sizes="110px"/></button>)}</div>}
  </section>;
}
