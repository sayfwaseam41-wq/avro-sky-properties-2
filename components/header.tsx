'use client';
import {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {usePathname} from 'next/navigation';
import {Menu,X} from 'lucide-react';
import {site} from '@/config/site';
export function Header(){const [open,setOpen]=useState(false);const path=usePathname();return <header className="header"><div className="shell header-inner"><Link href="/" className="brand" onClick={()=>setOpen(false)}><Image src={site.logo} width={34} height={40} alt=""/><span>{site.name}<small>Real estate in Duhok</small></span></Link><button className="menu-toggle" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} aria-controls="main-nav" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button><nav id="main-nav" className={open?'nav open':'nav'} aria-label="Main navigation">{[['/','Home'],['/properties','Properties'],['/request','Find me a property']].map(([href,label])=><Link key={href} href={href} aria-current={path===href?'page':undefined} onClick={()=>setOpen(false)}>{label}</Link>)}<a className="nav-phone" href={`tel:${site.phone}`}>{site.phone}</a></nav></div></header>}
