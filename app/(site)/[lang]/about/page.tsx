import Link from 'next/link';
import {Reviews} from '@/components/reviews';
import {TeamGrid} from '@/components/team-grid';
import {CheckIcon,WhatsAppIcon} from '@/components/icons';
import {site,whatsappLink,siteName} from '@/config/site';
import {getCachedReviews,getCachedTeam,localReviews,localTeam} from '@/lib/public-data';
import {fmt,localePath} from '@/lib/i18n/config';
import {getDict} from '@/lib/i18n/dict';
import {alternates,langFrom,type LangParams} from '@/lib/i18n/server';

export const revalidate=60;

export async function generateMetadata({params}:LangParams){
  const lang=await langFrom(params);
  const t=getDict(lang).aboutPage;
  return {title:t.metaTitle,description:fmt(t.metaDesc,{site:siteName(lang)}),alternates:alternates(lang,'/about')};
}

export default async function About({params}:LangParams){
  const lang=await langFrom(params);
  const t=getDict(lang);
  const a=t.aboutPage;
  const [team,reviews]=await Promise.all([getCachedTeam().catch(()=>[]).then(x=>localTeam(x,lang)),getCachedReviews().catch(()=>[]).then(x=>localReviews(x,lang))]);
  return <>
    <section className="page-head"><div className="wrap"><p className="eyebrow eyebrow-light">{a.eyebrow}</p><h1>{fmt(a.h1,{site:siteName(lang)})}</h1><p>{a.lede}</p></div></section>
    <section className="section" aria-labelledby="about-h">
      <div className="wrap why">
        <div>
          <p className="eyebrow">{t.home.whyEyebrow}</p>
          <h2 id="about-h">{t.home.whyTitle}</h2>
          <p className="lede" dir="auto">{lang==='en'&&site.about?site.about:t.about}</p>
        </div>
        <ul className="promises">{t.home.promises.map(({t:title,d})=><li key={title}><span className="tick"><CheckIcon size={18}/></span><div><b>{title}</b><p>{d}</p></div></li>)}</ul>
      </div>
    </section>
    {team.length>0&&<section className="section section-tint" aria-labelledby="team-h">
      <div className="wrap">
        <header className="section-head"><p className="eyebrow">{a.teamTitle}</p><h2 id="team-h">{a.teamLede}</h2></header>
        <TeamGrid team={team}/>
      </div>
    </section>}
    <Reviews reviews={reviews} t={t}/>
    <section className="cta" aria-labelledby="about-cta-h">
      <div className="wrap cta-inner">
        <div><h2 id="about-cta-h">{a.ctaTitle}</h2><p>{a.ctaText}</p></div>
        <div className="cta-actions"><Link className="btn btn-gold btn-lg" href={localePath(lang,'/request')}>{t.home.requestProperty}</Link><a className="btn btn-ghost btn-lg" href={whatsappLink(fmt(t.home.waHelp,{site:siteName(lang)}))} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={20}/>{t.home.chatWa}</a></div>
      </div>
    </section>
  </>;
}
