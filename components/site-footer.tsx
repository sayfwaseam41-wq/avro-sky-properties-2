import Link from 'next/link';
import Image from 'next/image';
import {site,whatsappLink} from '@/config/site';
import {fmt,localePath,type Lang} from '@/lib/i18n/config';
import type {Dict} from '@/lib/i18n/en';
import {MailIcon,PhoneIcon,PinIcon,WhatsAppIcon} from './icons';

export function SiteFooter({lang,t}:{lang:Lang;t:Dict}){
  const message=whatsappLink(fmt(t.common.waGeneral,{site:site.name}));
  const to=(path:string)=>localePath(lang,path);
  return <>
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-about">
          <Link href={to('/')} className="footer-logo" aria-label={fmt(t.common.homeAria,{site:site.name})}><Image src="/brand/logo-224.webp" alt={site.name} width={112} height={112} unoptimized/></Link>
          <p>{lang==='en'&&site.about?site.about:t.about}</p>
        </div>
        <nav aria-label={t.footer.explore}><h2>{t.footer.explore}</h2><Link href={to('/properties')}>{t.footer.all}</Link><Link href={to('/properties')+'?type=Apartment'}>{t.typesPlural.Apartment}</Link><Link href={to('/properties')+'?type=House'}>{t.typesPlural.House}</Link><Link href={to('/properties')+'?type=Land'}>{t.typesPlural.Land}</Link><Link href={to('/request')}>{t.footer.requestLink}</Link></nav>
        <div className="footer-contact"><h2>{t.footer.contact}</h2>
          <a href={`tel:${site.phone}`}><PhoneIcon size={18}/>{t.common.callUs}</a>
          <a href={`mailto:${site.email}`}><MailIcon size={18}/><bdi dir="ltr">{site.email}</bdi></a>
          <a href={message} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={18}/>{lang==='ar'?'واتساب':'WhatsApp'}</a>
          {site.instagram&&<a href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
          <span><PinIcon size={18}/>{lang==='en'&&site.address?site.address:t.common.address}</span>
        </div>
      </div>
      <div className="wrap footer-bottom"><span>{fmt(t.footer.rights,{year:new Date().getFullYear(),site:site.name})}</span><span>{lang==='en'&&site.tagline?site.tagline:t.common.tagline}</span></div>
    </footer>
    <a className="wa-fab" href={message} target="_blank" rel="noopener noreferrer" aria-label={t.common.waChat}><WhatsAppIcon size={28}/></a>
  </>;
}
