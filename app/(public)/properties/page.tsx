import {getProperties} from '@/lib/property-store';
import {PropertyBrowser} from '@/components/property-browser';
export const metadata={title:'Properties'};export const dynamic='force-dynamic';
export default async function Properties(){return <section className="lux-page"><p className="lux-eyebrow">Avro Sky collection</p><h1>Find room for what’s next.</h1><p className="lux-lede">Explore current homes, land, and workspaces in Duhok.</p><PropertyBrowser properties={await getProperties()}/></section>}
