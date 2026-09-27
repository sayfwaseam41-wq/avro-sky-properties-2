import Link from 'next/link';
import {AdminDashboard} from '@/components/admin-dashboard';
import {getAllProperties} from '@/lib/property-store';
import {logout} from '@/app/admin/actions';

export async function AdminBasicPage(){
 const properties=await getAllProperties();
 return <section className="shell admin-page"><div className="admin-hero"><div><p className="kicker">Offer 01 · Basic</p><h1>Property admin</h1><p>A focused listing manager. Changes appear on the public property catalogue immediately.</p></div><div className="admin-hero-actions"><Link className="button secondary-dark" href="/admin">Compare offers</Link><Link className="button secondary" href="/properties">View website</Link><form action={logout}><button className="admin-logout" type="submit">Sign out</button></form></div></div><AdminDashboard properties={properties}/></section>;
}
