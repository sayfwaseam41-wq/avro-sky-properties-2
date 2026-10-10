import Link from 'next/link';
import {ContentManager} from '@/components/admin-content';
import {getProjects,getReviews,getTeam} from '@/lib/content-store';
import {adminDict} from '@/lib/i18n/admin-server';
import {logout} from '@/app/(admin)/admin/actions';

export async function AdminContentPage(){
  const [projects,team,reviews,a]=await Promise.all([getProjects(false),getTeam(false),getReviews(false),adminDict()]);
  const c=a.content;
  return <section className="shell admin-page">
    <div className="admin-hero"><div><p className="kicker">{c.kicker}</p><h1>{c.title}</h1><p>{c.text}</p></div><div className="admin-hero-actions"><Link className="button secondary-dark" href="/admin-basic">{c.back}</Link><form action={logout}><button className="admin-logout" type="submit">{a.common.signOut}</button></form></div></div>
    <ContentManager projects={projects} team={team} reviews={reviews}/>
  </section>;
}
