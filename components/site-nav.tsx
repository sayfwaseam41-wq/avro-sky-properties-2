'use client';
import {useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {langLabel,langs,localePath,stripLang} from '@/lib/i18n/config';
import {CloseIcon,MenuIcon} from './icons';
import {useI18n} from './i18n-provider';
import {LanguageSwitch} from './language-switch';

const links=[['/','home'],['/properties','properties'],['/projects','projects'],['/about','aboutUs'],['/request','findMe']] as const;

/** The only client code in the header: highlights the current page, toggles the mobile menu and switches language. */
export function SiteNav({phone,whatsapp,hasProjects=false}:{phone:string;whatsapp:string;hasProjects?:boolean}){
  const {lang,t,path}=useI18n();
  const pathname=stripLang(usePathname());
  const [open,setOpen]=useState(false);
  const active=(href:string)=>href==='/'?pathname==='/':pathname.startsWith(href);
  return <>
    <nav id="site-nav" className="site-nav" data-open={open} aria-label={t.common.mainNav}>
      {links.filter(([href])=>href!=='/projects'||hasProjects).map(([href,key])=><Link key={href} href={path(href)} aria-current={active(href)?'page':undefined} onClick={()=>setOpen(false)}>{t.common[key]}</Link>)}
      <a className="nav-phone" href={`tel:${phone}`}>{t.common.callUs}</a>
      <a className="btn btn-gold btn-sm" href={whatsapp} target="_blank" rel="noopener noreferrer">{t.common.whatsappUs}</a>
      <a className="nav-admin" href="/admin" rel="nofollow">{t.common.staffSignIn}</a>
    </nav>
    <div className="header-tools">
      {langs.filter(l=>l!==lang).map(other=><LanguageSwitch key={other} target={other} label={langLabel[other]} href={localePath(other,pathname)} onClick={e=>{e.currentTarget.href=localePath(other,pathname)+window.location.search+window.location.hash;}}/>)}
      <button type="button" className="nav-toggle" aria-expanded={open} aria-controls="site-nav" aria-label={open?t.common.closeMenu:t.common.openMenu} onClick={()=>setOpen(o=>!o)}>{open?<CloseIcon size={24}/>:<MenuIcon size={24}/>}</button>
    </div>
  </>;
}
