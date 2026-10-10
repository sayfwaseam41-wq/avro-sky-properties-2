import Link from 'next/link';
import Image from 'next/image';
import {site,whatsappLink,siteName} from '@/config/site';
import {fmt,localePath,type Lang} from '@/lib/i18n/config';
import type {Dict} from '@/lib/i18n/en';
import {MailIcon,PhoneIcon,PinIcon,WhatsAppIcon} from './icons';

type Social='instagram'|'facebook'|'tiktok'|'youtube'|'linkedin';
const socials:[Social,string][]=[['instagram',site.instagram],['facebook',site.facebook],['tiktok',site.tiktok],['youtube',site.youtube],['linkedin',site.linkedin]];
/** Network names are written in each language so no Latin text shows on Arabic and Kurdish pages. */
const socialName:Record<Lang,Record<Social,string>>={
  en:{instagram:'Instagram',facebook:'Facebook',tiktok:'TikTok',youtube:'YouTube',linkedin:'LinkedIn'},
  ar:{instagram:'إنستغرام',facebook:'فيسبوك',tiktok:'تيك توك',youtube:'يوتيوب',linkedin:'لينكدإن'},
  ckb:{instagram:'ئینستاگرام',facebook:'فەیسبووک',tiktok:'تیکتۆک',youtube:'یوتیوب',linkedin:'لینکدین'},
};
const waLabel:Record<Lang,string>={en:'WhatsApp',ar:'واتساب',ckb:'واتسئاپ'};

export function SiteFooter({lang,t,hasProjects=false}:{lang:Lang;t:Dict;hasProjects?:boolean}){
  const message=whatsappLink(fmt(t.common.waGeneral,{site:siteName(lang)}));
  const to=(path:string)=>localePath(lang,path);
  return <>
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-about">
          <Link href={to('/')} className="footer-logo" aria-label={fmt(t.common.homeAria,{site:siteName(lang)})}><Image src="/brand/logo-224.webp" alt={siteName(lang)} width={112} height={112} unoptimized/></Link>
          <p>{lang==='en'&&site.about?site.about:t.about}</p>
        </div>
        <nav aria-label={t.footer.explore}><h2>{t.footer.explore}</h2><Link href={to('/properties')}>{t.footer.all}</Link><Link href={to('/properties')+'?type=Apartment'}>{t.typesPlural.Apartment}</Link><Link href={to('/properties')+'?type=House'}>{t.typesPlural.House}</Link><Link href={to('/properties')+'?type=Land'}>{t.typesPlural.Land}</Link>{hasProjects&&<Link href={to('/projects')}>{t.common.projects}</Link>}<Link href={to('/about')}>{t.common.aboutUs}</Link><Link href={to('/request')}>{t.footer.requestLink}</Link></nav>
        <div className="footer-contact"><h2>{t.footer.contact}</h2>
          <a href={`tel:${site.phone}`}><PhoneIcon size={18}/>{t.common.callUs}</a>
          <a href={`mailto:${site.email}`}><MailIcon size={18}/><bdi dir="ltr">{site.email}</bdi></a>
          <a href={message} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={18}/>{waLabel[lang]}</a>
          {socials.filter(([,url])=>url).map(([name,url])=><a key={name} href={url} target="_blank" rel="noopener noreferrer">{socialName[lang][name]}</a>)}
          <span><PinIcon size={18}/>{lang==='en'&&site.address?site.address:t.common.address}</span>
        </div>
      </div>
      <div className="wrap footer-bottom"><span>{fmt(t.footer.rights,{year:new Date().getFullYear(),site:siteName(lang)})}</span><span>{lang==='en'&&site.tagline?site.tagline:t.common.tagline}</span></div>
    </footer>
    <a className="wa-fab" href={message} target="_blank" rel="noopener noreferrer" aria-label={t.common.waChat}><WhatsAppIcon size={28}/></a>
  </>;
}
