import {getProperties} from '@/lib/airtable';
import {PropertyBrowser} from '@/components/property-browser';
export const metadata={title:'Properties'};
export const dynamic='force-dynamic';
export default async function Properties(){const properties=await getProperties();return <div className="shell section"><div className="page-heading"><p className="kicker">Find your place in Duhok</p><h1>Room for what’s next.</h1><p>Explore homes, land, and workspaces. Narrow the search to what matters to you.</p></div><PropertyBrowser properties={properties}/></div>}
