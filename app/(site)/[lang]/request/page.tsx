import {RequestForm} from '@/components/request-form';
import {CheckIcon,WhatsAppIcon} from '@/components/icons';
import {site,whatsappLink} from '@/config/site';
import {getCachedProperties} from '@/lib/public-data';
import {areaList} from '@/lib/property';
import {fmt} from '@/lib/i18n/config';
import {getDict} from '@/lib/i18n/dict';
import {alternates,langFrom,type LangParams} from '@/lib/i18n/server';

export const revalidate=60;

export async function generateMetadata({params}:LangParams){
  const lang=await langFrom(params);
  const t=getDict(lang).request;
  return {title:t.metaTitle,description:t.metaDesc,alternates:alternates(lang,'/request')};
}

export default async function Request({params}:LangParams){
  const lang=await langFrom(params);
  const t=getDict(lang).request;
  const areas=areaList(await getCachedProperties().catch(()=>[]));
  return <>
    <section className="page-head"><div className="wrap"><p className="eyebrow eyebrow-light">{t.eyebrow}</p><h1>{t.h1}</h1><p>{t.lede}</p></div></section>
    <section className="section section-tint section-flush">
      <div className="wrap request">
        <aside className="request-side">
          <h2>{t.how}</h2>
          <ul className="promises">{t.steps.map(({t:title,d})=><li key={title}><span className="tick"><CheckIcon size={18}/></span><div><b>{title}</b><p>{d}</p></div></li>)}</ul>
          <a className="btn btn-outline" href={whatsappLink(fmt(t.waLooking,{site:site.name}))} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={20}/>{t.prefer}</a>
        </aside>
        <RequestForm areas={areas}/>
      </div>
    </section>
  </>;
}
