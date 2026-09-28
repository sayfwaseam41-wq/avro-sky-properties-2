import {RequestForm} from '@/components/request-form';
import {site,whatsappLink} from '@/config/site';
export const metadata={title:'Request a property'};
export default function Request(){return <section className="lux-page lux-request"><div><p className="lux-eyebrow">We’ll help you look</p><h1>Tell us what you need.</h1><p className="lux-lede">Share the essentials. Our team will review your request and get in touch with suitable options.</p><a className="lux-text-link" href={whatsappLink(`Hello ${site.name}, I’m looking for a property.`)} target="_blank" rel="noreferrer">Message us on WhatsApp</a></div><RequestForm/></section>}
