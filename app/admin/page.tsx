import Link from 'next/link';
import {AdminDashboard} from '@/components/admin-dashboard';
import {AdminLoginForm} from '@/components/admin-login-form';
import {isAdmin} from '@/lib/admin-auth';
import {getAllProperties} from '@/lib/property-store';
import {login,logout} from './actions';

export const metadata={title:'Admin'};
export default async function AdminPage(){
 if(!await isAdmin()) return <section className="shell admin-login"><p className="kicker">Private area</p><h1>Property admin</h1><p>Sign in to manage the listings shown on Avro Sky.</p><AdminLoginForm/></section>;
 const properties=await getAllProperties();
 return <section className="shell admin-page"><div className="admin-hero"><div><p className="kicker">Private area</p><h1>Property admin</h1><p>Changes appear on the public property catalogue immediately.</p></div><div className="admin-hero-actions"><Link className="button secondary" href="/properties">View website</Link><form action={logout}><button className="admin-logout" type="submit">Sign out</button></form></div></div><AdminDashboard properties={properties}/></section>;
}
