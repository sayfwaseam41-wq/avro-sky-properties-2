import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getCachedProjects,getCachedProperties,getCachedProperty,localProjects,localProperties,localProperty} from '@/lib/public-data';
import {similarProperties} from '@/lib/property';
import {PropertyCard,pinPriceLabel,priceLabel} from '@/components/property-card';
import {ShareButton} from '@/components/share-button';
import {ListingMap} from '@/components/listing-map';
import {coordinatesOf} from '@/lib/location';
import {Gallery} from '@/components/gallery';
import {AreaIcon,ArrowIcon,BathIcon,BedIcon,CheckIcon,HouseIcon,PhoneIcon,PinIcon,WhatsAppIcon} from '@/components/icons';
import {site,whatsappLink,siteName} from '@/config/site';
import {fmt,localePath} from '@/lib/i18n/config';
import {areaName} from '@/lib/i18n/areas';
import {getDict} from '@/lib/i18n/dict';
import {alternates,langFrom} from '@/lib/i18n/server';

export const revalidate=60;
/** No pages are built ahead of time; each property page is generated on first visit, then cached and refreshed every minute. */
export async function generateStaticParams(){return [];}

type Params={params:Promise<{lang:string;id:string}>};

export async function generateMetadata({params}:Params){
  const {lang:rawLang,id}=await params;
  const lang=await langFrom(Promise.resolve({lang:rawLang}));
  const t=getDict(lang);
  const p=await getCachedProperty(id).then(x=>x&&localProperty(x,lang));
  if(!p)return {title:t.detail.notFound};
  const rent=p.listingType==='For Rent';
  const summary=fmt(t.detail.metaDesc,{type:t.types[p.type]??p.type,listing:(rent?t.card.forRent:t.card.forSale).toLowerCase(),area:areaName(lang,p.area),description:p.description}).slice(0,200);
  return {title:p.title,description:summary,alternates:alternates(lang,`/properties/${p.id}`),openGraph:{title:p.title,description:summary,...(p.photos[0]?{images:[p.photos[0].url]}:{})}};
}

export default async function Detail({params}:Params){
  const {lang:rawLang,id}=await params;
  const lang=await langFrom(Promise.resolve({lang:rawLang}));
  const t=getDict(lang);
  const d=t.detail;
  const to=(path:string)=>localePath(lang,path);
  const p=await getCachedProperty(id).then(x=>x&&localProperty(x,lang));
  if(!p)notFound();
  const rent=p.listingType==='For Rent';
  const typeName=t.types[p.type]??p.type;
  const at=coordinatesOf(p);
  const project=p.projectId?localProjects(await getCachedProjects().catch(()=>[]),lang).find(x=>x.id===p.projectId):undefined;
  const similar=similarProperties(localProperties(await getCachedProperties().catch(()=>[]),lang),p);
  const message=whatsappLink(fmt(d.waEnquire,{site:siteName(lang),title:p.title,area:areaName(lang,p.area),id:p.id}));
  return <section className="section detail">
    <div className="wrap">
      <nav className="crumbs" aria-label={d.breadcrumb}><Link href={to('/')}>{t.common.home}</Link><span aria-hidden="true">/</span><Link href={to('/properties')}>{t.common.properties}</Link><span aria-hidden="true">/</span><span aria-current="page">{p.title}</span></nav>
      <div className="detail-grid">
        <div className="detail-main">
          <Gallery photos={p.photos}/>
          <header className="detail-head">
            <p className="eyebrow">{rent?t.card.forRent:t.card.forSale} · {typeName}</p>
            <h1>{p.title}</h1>
            <p className="detail-area"><PinIcon size={18}/>{fmt(t.card.areaIn,{area:areaName(lang,p.area)})}</p>
            {project&&<p className="detail-project"><Link className="text-link" href={to(`/projects/${project.id}`)}>{fmt(t.projects.partOf,{project:project.name})}<ArrowIcon size={16}/></Link></p>}
          </header>
          <ul className="facts" aria-label={d.facts}>
            {p.type!=='Land'&&<li><BedIcon size={24}/><b>{p.bedrooms}</b><span>{p.bedrooms===1?d.bedroom:d.bedrooms}</span></li>}
            {p.type!=='Land'&&<li><BathIcon size={24}/><b>{p.bathrooms}</b><span>{p.bathrooms===1?d.bathroom:d.bathrooms}</span></li>}
            <li><AreaIcon size={24}/><b><bdi dir={lang==='en'?'ltr':'rtl'}>{p.size} {t.extras.sqm}</bdi></b><span>{d.size}</span></li>
            <li><HouseIcon size={24}/><b>{typeName}</b><span>{d.type}</span></li>
          </ul>
          {p.amenities?.length?<><h2>{t.extras.amenities}</h2><ul className="amenities">{p.amenities.map(key=><li key={key}><CheckIcon size={18}/>{t.extras.amenityNames[key]??key}</li>)}</ul></>:null}
          <h2>{d.about}</h2>
          <p className="prose" dir="auto">{p.description}</p>
          {at&&<section className="detail-map" aria-labelledby="loc-h">
            <h2 id="loc-h">{t.map.locationTitle}</h2>
            <ListingMap single label={t.map.detailNote} height={320} pins={[{id:p.id,lat:at.lat,lng:at.lng,title:p.title,price:priceLabel(p)+(rent?` ${t.card.perMonth}`:''),short:pinPriceLabel(p),href:to(`/properties/${p.id}`)}]}/>
            <a className="text-link" target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${at.lat},${at.lng}`}>{t.map.openInMaps}<ArrowIcon size={16}/></a>
          </section>}
        </div>
        <aside className="enquiry" aria-label={d.enquiry}>
          <span className={`badge ${rent?'badge-rent':'badge-sale'}`}>{rent?t.card.forRent:t.card.forSale}</span>
          <p className="enquiry-price"><bdi dir="ltr">{priceLabel(p)}</bdi>{rent&&<small> {t.card.perMonth}</small>}</p>
          <a className="btn btn-gold btn-lg btn-block" target="_blank" rel="noopener noreferrer" href={message}><WhatsAppIcon size={20}/>{d.enquireWa}</a>
          <a className="btn btn-outline btn-lg btn-block" href={`tel:${site.phone}`}><PhoneIcon size={20}/>{fmt(d.call,{site:siteName(lang)})}</a>
          <p className="enquiry-ref">{fmt(d.ref,{id:`\u2066${p.id}\u2069`})}</p>
          <ShareButton title={p.title}/>
          <Link className="text-link" href={to('/request')}>{d.similar}<ArrowIcon size={16}/></Link>
        </aside>
      </div>
      {similar.length>0&&<section className="similar" aria-labelledby="similar-h">
        <p className="eyebrow">{t.extras.similarEyebrow}</p>
        <h2 id="similar-h">{t.extras.similarTitle}</h2>
        <div className="grid">{similar.map(s=><PropertyCard key={s.id} property={s} lang={lang} t={t}/>)}</div>
      </section>}
    </div>
  </section>;
}
