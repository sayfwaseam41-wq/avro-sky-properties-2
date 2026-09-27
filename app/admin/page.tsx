import {AdminLoginForm} from '@/components/admin-login-form';
import {isAdmin} from '@/lib/admin-auth';
import Link from 'next/link';
import {logout} from './actions';

export const metadata={title:'Admin offers'};
export default async function AdminPage(){
 if(!await isAdmin()) return <section className="shell admin-login"><p className="kicker">Private area</p><h1>Avro Sky admin</h1><p>Sign in to view the two management-system options.</p><AdminLoginForm/></section>;
 return <section className="shell admin-page"><div className="admin-hero"><div><p className="kicker">Private area</p><h1>Choose your system</h1><p>Compare the simple property manager with the full real-estate management system.</p></div><form action={logout}><button className="admin-logout" type="submit">Sign out</button></form></div><div className="admin-offer-grid"><article className="admin-offer-card"><p className="kicker">Offer 01</p><h2>Basic property admin</h2><p>Manage property listings, availability, public visibility, descriptions, prices, and photos.</p><ul><li>Add, edit, and remove listings</li><li>Upload property photos</li><li>Publish available listings to the website</li></ul><Link className="button" href="/admin-basic">Open Basic system</Link></article><article className="admin-offer-card pro"><p className="kicker">Offer 02</p><h2>Pro company management</h2><p>A complete operations workspace for properties, clients, rent, payments, sales, and team work.</p><ul><li>Rental payment reminders and WhatsApp messages</li><li>Sales, commissions, expenses, and profit tracking</li><li>Client records, staff roles, and company dashboard</li></ul><Link className="button" href="/admin-pro">Open Pro preview</Link></article></div></section>;
}
