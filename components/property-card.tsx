import Link from 'next/link';
import Image from 'next/image';
import {BedDouble,Bath,Scan,MapPin} from 'lucide-react';
import {site} from '@/config/site';
import type {Property} from '@/lib/property';
export function priceLabel(p:Pick<Property,'price'|'listingType'>){return new Intl.NumberFormat(site.locale,{style:'currency',currency:site.currency,maximumFractionDigits:0}).format(p.price);}
export function PropertyCard({property:p}:{property:Property}){return <article className="property-card"><Link href={`/properties/${p.id}`} className="card-image" aria-label={`View ${p.title}`}>
 {p.photos[0]?<Image src={p.photos[0].url} alt={p.photos[0].alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw"/>:<div className="no-photo">Photography coming soon</div>}
 <span className={`status ${p.status.toLowerCase()}`}>{p.status==='Rented'?'Recently Rented':p.status}</span><span className="listing-type">{p.listingType}</span></Link>
 <div className="card-copy"><div className="price">{priceLabel(p)}{p.listingType==='For Rent'&&<small> / {site.rentalPeriod}</small>}</div><h3><Link href={`/properties/${p.id}`}>{p.title}</Link></h3><p className="location"><MapPin size={15}/>{p.area}</p><div className="facts"><span><BedDouble size={17}/>{p.bedrooms} beds</span><span><Bath size={17}/>{p.bathrooms} baths</span><span><Scan size={17}/>{p.size} m²</span></div></div></article>}
