'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {usePathname} from 'next/navigation';
import {Menu,X} from 'lucide-react';
import {site} from '@/config/site';
export function Header(){
  const [open,setOpen]=useState(false);
  const [scrolled,setScrolled]=useState(false);
  const path=usePathname();
  const isHome=path==='/';

  useEffect(()=>{
    const onScroll=()=>setScrolled(window.scrollY>24);
    window.addEventListener('scroll',onScroll,{passive:true});
    onScroll();
    return()=>window.removeEventListener('scroll',onScroll);
  },[]);

  const isLight=!isHome&&!scrolled&&!open;

  return (
    <header className={`header ${scrolled||open?'scrolled':''} ${isLight?'header-light':''}`.trim()}>
      <div className="shell header-inner">
        <Link href="/" className="brand" onClick={()=>setOpen(false)}>
          <span className="header-logo">
            <Image src={site.logo} width={142} height={52} alt={site.name} priority/>
          </span>
        </Link>
        <button
          className="menu-toggle"
          aria-label={open?'Close navigation':'Open navigation'}
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={()=>setOpen(!open)}
        >
          {open?<X/>:<Menu/>}
        </button>
        <nav id="main-nav" className={open?'nav open':'nav'} aria-label="Main navigation">
          {[
            ['/','Home'],
            ['/properties','Properties'],
            ['/request','Find me a property']
          ].map(([href,label])=>(
            <Link
              key={href}
              href={href}
              aria-current={path===href?'page':undefined}
              onClick={()=>setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <a className="nav-phone" href={`tel:${site.phone}`}>Call us</a>
          <a
            className="button nav-cta"
            href={`https://wa.me/${site.whatsapp.replace(/\D/g,'')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp us
          </a>
        </nav>
      </div>
    </header>
  );
}
