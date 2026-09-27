import Link from 'next/link';
import {AdminLoginForm} from '@/components/admin-login-form';
import {isAdmin} from '@/lib/admin-auth';
import {logout} from '@/app/admin/actions';

const modules=[
 ['Properties','Add listings, photos, owners, public visibility, and availability.'],
 ['Clients','Keep buyers, tenants, landlords, sellers, investors, and owners in one place.'],
 ['Rentals & payments','Track leases, monthly rent, due dates, deposits, paid rent, due soon, and overdue balances.'],
 ['Sales & profit','Record purchase price, sale price, expenses, commission, and the real net profit.'],
 ['WhatsApp reminders','Create editable message templates and open a ready-to-send WhatsApp message for each tenant.'],
 ['Staff & roles','Give Admins full access and Agents access to the property and client work they need.'],
];

export const metadata={title:'Pro management preview'};
export default async function Page(){
 if(!await isAdmin()) return <section className="shell admin-login"><p className="kicker">Offer 02 · Pro</p><h1>Company management</h1><p>Sign in to view the Pro system preview.</p><AdminLoginForm next="/admin-pro"/></section>;
 return <section className="shell admin-page"><div className="admin-hero"><div><p className="kicker">Offer 02 · Pro</p><h1>Real-estate management system</h1><p>The complete company workspace: designed to manage the business, not only property listings.</p></div><div className="admin-hero-actions"><Link className="button secondary-dark" href="/admin">Compare offers</Link><form action={logout}><button className="admin-logout" type="submit">Sign out</button></form></div></div><section className="pro-dashboard-preview"><aside className="pro-sidebar"><strong>Avro Sky</strong><span>Dashboard</span><span>Properties</span><span>Clients</span><span>Rentals</span><span>Sales & profit</span><span>Messages</span><span>Staff</span></aside><div className="pro-main"><div className="pro-heading"><div><p className="kicker">Dashboard</p><h2>Company overview</h2></div><span>Example view</span></div><div className="pro-metric-grid"><div className="pro-metric paid"><small>Paid rents</small><strong>$12,400</strong><span>Green: received this month</span></div><div className="pro-metric due"><small>Due within 5 days</small><strong>$2,100</strong><span>Blue: payment reminders</span></div><div className="pro-metric overdue"><small>Overdue rent</small><strong>$1,350</strong><span>Red: needs follow-up</span></div><div className="pro-metric profit"><small>Net sales profit</small><strong>$18,600</strong><span>After expenses and commission</span></div></div><div className="pro-alert"><strong>Payment attention</strong><p>Tenants with overdue or upcoming payments appear here, with a button to prepare their WhatsApp message.</p><button className="button" type="button">Send payment reminder</button></div></div></section><section className="pro-module-section"><div><p className="kicker">What the Pro system includes</p><h2>Every important part of the company, connected.</h2></div><div className="pro-module-grid">{modules.map(([title,copy],index)=><article key={title}><span>0{index+1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section><p className="pro-note">This is the Pro system presentation page. The Basic system is ready today; these Pro modules are the next build once your client chooses this offer.</p></section>;
}
