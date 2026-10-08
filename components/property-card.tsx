import Link from 'next/link';
import Image from 'next/image';
import {site,whatsappLink} from '@/config/site';
import {fmt,localePath,type Lang} from '@/lib/i18n/config';
import type {Dict} from '@/lib/i18n/en';
import type {Property} from '@/lib/property';
import {AreaIcon,BathIcon,BedIcon,PinIcon,WhatsAppIcon} from './icons';

const money=new Intl.NumberFormat('en-US',{style:'currency',currency:site.currency,maximumFractionDigits:0});
export function priceLabel(p:Pick<Property,'price'|'listingType'>){return money.format(p.price);}

type Props={property:Property;lang:Lang;t:Dict;eager?:boolean;heading?:'h2'|'h3'};

/** Used by server pages and by the client-side browser, so text and language come in as props. */
export function PropertyCard({property:p,lang,t,eager=false,heading:Heading='h3'}:Props){
  const rent=p.listingType==='For Rent';
  const href=localePath(lang,`/properties/${p.id}`);
  const c=t.card;
  return <article className="card">
    <Link href={href} className="card-media" tabIndex={-1} aria-hidden="true">
      {p.photos[0]
        ?<Image src={p.photos[0].url} alt={p.photos[0].alt} fill sizes="(min-width:1024px) 360px,(min-width:640px) 50vw,100vw" loading={eager?'eager':'lazy'} fetchPriority={eager?'high':'auto'}/>
        :<span className="card-placeholder" aria-hidden="true"><Image src="/brand/mark-96.webp" alt="" width={72} height={81} unoptimized/></span>}
      <span className={`badge ${rent?'badge-rent':'badge-sale'}`}>{rent?c.forRent:c.forSale}</span>
      <span className="card-type">{t.types[p.type]??p.type}</span>
    </Link>
    <div className="card-body">
      <p className="card-price"><bdi dir="ltr">{priceLabel(p)}</bdi>{rent&&<small> {c.perMonth}</small>}</p>
      <Heading><Link href={href}>{p.title}</Link></Heading>
      <p className="card-area"><PinIcon size={16}/>{fmt(c.areaIn,{area:p.area})}</p>
      <ul className="specs" aria-label={c.keyDetails}>
        {p.type!=='Land'&&<li><BedIcon size={18}/>{p.bedrooms} <span>{p.bedrooms===1?c.bed:c.beds}</span></li>}
        {p.type!=='Land'&&<li><BathIcon size={18}/>{p.bathrooms} <span>{p.bathrooms===1?c.bath:c.baths}</span></li>}
        <li><AreaIcon size={18}/><bdi dir="ltr">{p.size} m²</bdi></li>
      </ul>
      <div className="card-actions">
        <Link className="btn btn-outline btn-sm" href={href}>{c.viewDetails}</Link>
        <a className="icon-btn" href={whatsappLink(fmt(c.waProperty,{site:site.name,title:p.title,area:p.area,id:p.id}))} target="_blank" rel="noopener noreferrer" aria-label={fmt(c.enquire,{title:p.title})}><WhatsAppIcon size={20}/></a>
      </div>
    </div>
  </article>;
}
