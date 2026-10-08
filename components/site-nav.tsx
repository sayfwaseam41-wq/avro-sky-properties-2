'use client';
import {useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {localePath,stripLang} from '@/lib/i18n/config';
import {CloseIcon,MenuIcon} from './icons';
import {useI18n} from './i18n-provider';

const links=[['/','home'],['/properties','properties'],['/request','findMe']] as const;

/** The only client code in the header: highlights the current page, toggles the mobile menu and switches language. */
export function SiteNav({phone,whatsapp}:{phone:string;whatsapp:string}){
  const {lang,t,path}=useI18n();
  const pathname=stripLang(usePathname());
  const [open,setOpen]=useState(false);
  const active=(href:string)=>href==='/'?pathname==='/':pathname.startsWith(href);
  const other=lang==='en'?'ar':'en';
  return <>
    <button type="button" className="nav-toggle" aria-expanded={open} aria-controls="site-nav" aria-label={open?t.common.closeMenu:t.common.openMenu} onClick={()=>setOpen(o=>!o)}>{open?<CloseIcon size={24}/>:<MenuIcon size={24}/>}</button>
    <nav id="site-nav" className="site-nav" data-open={open} aria-label={t.common.mainNav}>
      {links.map(([href,key])=><Link key={href} href={path(href)} aria-current={active(href)?'page':undefined} onClick={()=>setOpen(false)}>{t.common[key]}</Link>)}
      <a className="nav-phone" href={`tel:${phone}`}>{t.common.callUs}</a>
      <a className="lang-switch" href={localePath(other,pathname)} hrefLang={other} lang={other} onClick={e=>{e.currentTarget.href=localePath(other,pathname)+window.location.search+window.location.hash;}}>{t.common.otherLang}</a>
      <a className="btn btn-gold btn-sm" href={whatsapp} target="_blank" rel="noopener noreferrer">{t.common.whatsappUs}</a>
    </nav>
  </>;
}
