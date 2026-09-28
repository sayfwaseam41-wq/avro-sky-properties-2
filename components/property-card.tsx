import Link from 'next/link';
import Image from 'next/image';
import {BedDouble,Bath,Scan,MapPin,MessageCircle} from 'lucide-react';
import {site,whatsappLink} from '@/config/site';
import type {Property} from '@/lib/property';

export function priceLabel(p:Pick<Property,'price'|'listingType'>){return new Intl.NumberFormat(site.locale,{style:'currency',currency:site.currency,maximumFractionDigits:0}).format(p.price);}

export function PropertyCard({property:p}:{property:Property}){return <article className="lux-card"><Link href={`/properties/${p.id}`} className="lux-card-art" aria-label={`View ${p.title}`}>{p.photos[0]?<Image src={p.photos[0].url} alt={p.photos[0].alt} fill sizes="(max-width: 700px) 100vw, 50vw"/>:<svg viewBox="0 0 300 170" aria-hidden="true"><path d="M30 150h240M55 150V80l95-52 95 52v70M125 150v-45h50v45M75 100h30v25H75zM195 100h30v25h-30zM150 28v-14"/></svg>}<span>{p.listingType==='For Rent'?'For rent':'For sale'}</span></Link><div className="lux-card-body"><h3><Link href={`/properties/${p.id}`}>{p.title}</Link></h3><p>{p.area} · {p.bedrooms} beds, {p.bathrooms} baths, {p.size} m²</p><div><strong>{priceLabel(p)}{p.listingType==='For Rent'&&<small> / {site.rentalPeriod}</small>}</strong><a className="lux-button" href={whatsappLink(`Hello ${site.name}, I’m interested in ${p.title} in ${p.area} (reference ${p.id}).`)} target="_blank" rel="noopener noreferrer">Enquire</a></div></div></article>}
