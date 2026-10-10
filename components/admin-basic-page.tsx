import Link from 'next/link';
import {AdminDashboard} from '@/components/admin-dashboard';
import {getAllProperties} from '@/lib/property-store';
import {getProjects} from '@/lib/content-store';
import {adminDict} from '@/lib/i18n/admin-server';
import {logout} from '@/app/(admin)/admin/actions';

export async function AdminBasicPage(){
 const [properties,a,projects]=await Promise.all([getAllProperties(),adminDict(),getProjects(false).catch(()=>[])]);const b=a.basic;
 return <section className="shell admin-page"><div className="admin-hero"><div><p className="kicker">{b.kicker}</p><h1>{b.title}</h1><p>{b.text}</p></div><div className="admin-hero-actions"><Link className="button secondary-dark" href="/admin-basic/content">{a.content.link}</Link><Link className="button secondary-dark" href="/admin">{b.compare}</Link><Link className="button secondary" href="/properties">{b.viewSite}</Link><form action={logout}><button className="admin-logout" type="submit">{a.common.signOut}</button></form></div></div><AdminDashboard properties={properties} projects={projects}/></section>;
}
