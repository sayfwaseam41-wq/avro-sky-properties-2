import Link from 'next/link';
import {getCachedProperties,getCachedReviews,localProperties,localReviews} from '@/lib/public-data';
import {Reviews} from '@/components/reviews';
import {areaList,featuredProperties,type Property} from '@/lib/property';
import {PropertyCard} from '@/components/property-card';
import {HeroArt} from '@/components/hero-art';
import {HeroHeadline,headlineWordCount} from '@/components/hero-headline';
import {HomeSearch} from '@/components/home-search';
import {ApartmentIcon,ArrowIcon,CheckIcon,HouseIcon,LandIcon,OfficeIcon,PhoneIcon,VillaIcon,WhatsAppIcon} from '@/components/icons';
import {site,whatsappLink,siteName} from '@/config/site';
import {fmt,localePath} from '@/lib/i18n/config';
import {areaName} from '@/lib/i18n/areas';
import {getDict} from '@/lib/i18n/dict';
import {langFrom,type LangParams} from '@/lib/i18n/server';

export const revalidate=60;

const categories=[
  {type:'Apartment',Icon:ApartmentIcon},
  {type:'House',Icon:HouseIcon},
  {type:'Villa',Icon:VillaIcon},
  {type:'Land',Icon:LandIcon},
  {type:'Office',Icon:OfficeIcon},
] as const;

export default async function Home({params}:LangParams){
  const lang=await langFrom(params);
  const t=getDict(lang);
  const h=t.home;
  const to=(path:string)=>localePath(lang,path);
  const properties:Property[]=localProperties(await getCachedProperties().catch(()=>[]),lang);
  const reviews=localReviews(await getCachedReviews().catch(()=>[]),lang);
  const featured=featuredProperties(properties).slice(0,6);
  const areas=areaList(properties);
  const counts=new Map<string,number>();for(const p of properties)counts.set(p.type,(counts.get(p.type)||0)+1);

  return <>
    <section className="hero">
      <HeroArt/>
      <div className="wrap hero-inner">
        <p className="eyebrow eyebrow-light">{h.eyebrow}</p>
        <HeroHeadline a={h.h1a} em={h.h1em} z={h.h1z}/>
        <p className="hero-lede">{h.lede}</p>
        <div className="hero-actions">
          <Link className="btn btn-gold btn-lg" href={to('/properties')}>{h.browse}<ArrowIcon size={18}/></Link>
          <a className="btn btn-ghost btn-lg" href={whatsappLink(fmt(h.waHelp,{site:siteName(lang)}))} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={20}/>{h.chatWa}</a>
        </div>
        {properties.length>0&&<div className="hero-stat" style={{"--hero-words":headlineWordCount(h.h1a,h.h1em)} as React.CSSProperties}><b>{properties.length}</b><span>{h.statLabel}</span></div>}
      </div>
    </section>

    <div className="wrap search-wrap">
      <HomeSearch areas={areas}/>
    </div>

    <section className="section" aria-labelledby="cat-h">
      <div className="wrap">
        <header className="section-head"><p className="eyebrow">{h.catEyebrow}</p><h2 id="cat-h">{h.catTitle}</h2></header>
        <ul className="cats">{categories.map(({type,Icon})=><li key={type}><Link href={`${to('/properties')}?type=${type}`}><span className="cat-icon"><Icon size={30}/></span><b>{t.typesPlural[type]}</b><small>{counts.get(type)?fmt(h.available,{n:counts.get(type)!}):h.askUs}</small></Link></li>)}</ul>
      </div>
    </section>

    <section className="section section-tint" aria-labelledby="feat-h">
      <div className="wrap">
        <header className="section-head split"><div><p className="eyebrow">{h.featEyebrow}</p><h2 id="feat-h">{h.featTitle}</h2></div><Link className="text-link" href={to('/properties')}>{h.viewAll}<ArrowIcon size={16}/></Link></header>
        {featured.length
          ?<div className="grid">{featured.map(p=><PropertyCard key={p.id} property={p} lang={lang} t={t}/>)}</div>
          :<div className="empty"><h3>{h.preparing}</h3><p>{h.preparingText}</p><Link className="btn btn-gold" href={to('/request')}>{h.requestProperty}</Link></div>}
        {areas.length>0&&<div className="areas"><span>{h.popularAreas}</span>{areas.map(a=><Link key={a} href={`${to('/properties')}?area=${encodeURIComponent(a)}`}>{areaName(lang,a)}</Link>)}</div>}
      </div>
    </section>

    <section className="section" aria-labelledby="why-h">
      <div className="wrap why">
        <div><p className="eyebrow">{h.whyEyebrow}</p><h2 id="why-h">{h.whyTitle}</h2><p className="lede">{h.whyLede}</p>
          <ul className="promises">{h.promises.map(({t:title,d})=><li key={title}><span className="tick"><CheckIcon size={18}/></span><div><b>{title}</b><p>{d}</p></div></li>)}</ul>
        </div>
        <ol className="steps" aria-label={h.stepsLabel}>{h.steps.map(({t:title,d},i)=><li key={title}><span>{String(i+1).padStart(2,'0')}</span><div><b>{title}</b><p>{d}</p></div></li>)}</ol>
      </div>
    </section>

    <Reviews reviews={reviews} t={t}/>

    <section className="cta" aria-labelledby="cta-h">
      <div className="wrap cta-inner">
        <div><h2 id="cta-h">{h.ctaTitle}</h2><p>{h.ctaText}</p></div>
        <div className="cta-actions"><Link className="btn btn-gold btn-lg" href={to('/request')}>{h.requestProperty}</Link><a className="btn btn-ghost btn-lg" href={`tel:${site.phone}`}><PhoneIcon size={20}/>{t.common.callUs}</a></div>
      </div>
    </section>
  </>;
}
