import type {Metadata} from 'next';
import type {CSSProperties} from 'react';
import Link from 'next/link';
import {site,whatsappLink} from '@/config/site';
import {Header} from '@/components/header';
import './globals.css';
export const metadata:Metadata={title:{default:`${site.name} | Property in Duhok`,template:`%s | ${site.name}`},description:site.about,icons:{icon:site.logo}};
export const viewport={width:'device-width',initialScale:1};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body style={{'--accent':site.primaryColor,'--ink':site.secondaryColor} as CSSProperties}><a href="#main" className="skip-link">Skip to content</a><Header/><main id="main">{children}</main><footer><div className="shell footer-grid"><div><Link href="/" className="footer-brand"><span className="logo-lockup"><img src={site.logo} alt=""/><span>{site.name}</span></span></Link><p>Property. People. Possibility.</p><p>{site.address}</p></div><div><h2>Explore</h2><Link href="/properties">All properties</Link><Link href="/request">Request a property</Link></div><div><h2>Let’s talk</h2><a href={`tel:${site.phone}`}>{site.phone}</a><a href={`mailto:${site.email}`}>{site.email}</a><a className="footer-whatsapp" href={whatsappLink(`Hello ${site.name}, I would like to ask about a property.`)} target="_blank" rel="noopener noreferrer">WhatsApp</a>{site.instagram&&<a href={site.instagram}>Instagram</a>}</div></div><div className="shell footer-bottom"><span>© {new Date().getFullYear()} {site.name}</span>{site.demo&&<span>Demo catalog. Sample listings and illustrative photography.</span>}</div></footer></body></html>}
