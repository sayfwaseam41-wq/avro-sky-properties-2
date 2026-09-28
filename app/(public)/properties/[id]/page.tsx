import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getProperty} from '@/lib/property-store';
import {priceLabel} from '@/components/property-card';
import {Gallery} from '@/components/gallery';
import {site,whatsappLink} from '@/config/site';
export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{id:string}>}){const p=await getProperty((await params).id);return {title:p?.title||'Property not found'}}
export default async function Detail({params}:{params:Promise<{id:string}>}){const p=await getProperty((await params).id);if(!p)notFound();return <section className="lux-page lux-detail"><Link className="lux-text-link" href="/properties">All properties</Link><Gallery photos={p.photos}/><div className="lux-detail-grid"><article><p className="lux-eyebrow">{p.listingType} · {p.status}</p><h1>{p.title}</h1><p className="lux-lede">{p.area}, Duhok · {p.bedrooms} beds · {p.bathrooms} baths · {p.size} m²</p><h2>About this property</h2><p>{p.description}</p><p className="lux-muted">Reference {p.id}</p></article><aside><p className="lux-price">{priceLabel(p)}{p.listingType==='For Rent'&&<small> / month</small>}</p><a className="lux-button" target="_blank" rel="noreferrer" href={whatsappLink(`Hello ${site.name}, I’m interested in ${p.title} in ${p.area} (reference ${p.id}). Could you share more details?`)}>Enquire on WhatsApp</a><a className="lux-text-link" href={`tel:${site.phone}`}>Call {site.name}</a></aside></div></section>}
