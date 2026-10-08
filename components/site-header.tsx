import Link from 'next/link';
import Image from 'next/image';
import {site,whatsappLink} from '@/config/site';
import {fmt,localePath,type Lang} from '@/lib/i18n/config';
import type {Dict} from '@/lib/i18n/en';
import {SiteNav} from './site-nav';

export function SiteHeader({lang,t}:{lang:Lang;t:Dict}){
  return <header className="site-header">
    <div className="wrap header-inner">
      <Link href={localePath(lang,'/')} className="brand" aria-label={fmt(t.common.homeAria,{site:site.name})}>
        <Image src="/brand/mark-96.webp" alt="" width={40} height={45} loading="eager" unoptimized/>
        <span className="brand-text"><b dir="ltr">AVRO SKY</b><small>{t.common.tagline}</small></span>
      </Link>
      <SiteNav phone={site.phone} whatsapp={whatsappLink(fmt(t.common.waGeneral,{site:site.name}))}/>
    </div>
  </header>;
}
