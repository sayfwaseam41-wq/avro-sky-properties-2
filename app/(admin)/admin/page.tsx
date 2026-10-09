import {AdminLoginForm} from '@/components/admin-login-form';
import {isAdmin} from '@/lib/admin-auth';
import {hasPro,site} from '@/config/site';
import {fmt} from '@/lib/i18n/config';
import {adminDict} from '@/lib/i18n/admin-server';
import Link from 'next/link';
import {logout} from './actions';

export async function generateMetadata(){return {title:(await adminDict()).meta.offers};}
export default async function AdminPage(){
 const a=await adminDict();const o=a.offers;
 if(!await isAdmin()) return <section className="shell admin-login"><p className="kicker">{a.common.private}</p><h1>{fmt(o.loginTitle,{site:site.name})}</h1><p>{o.loginText}</p><AdminLoginForm/></section>;
 return <section className="shell admin-page"><div className="admin-hero"><div><p className="kicker">{a.common.private}</p><h1>{o.title}</h1><p>{o.text}</p></div><form action={logout}><button className="admin-logout" type="submit">{a.common.signOut}</button></form></div><div className="admin-offer-grid"><article className="admin-offer-card"><p className="kicker">{o.offer1}</p><h2>{o.basicTitle}</h2><p>{o.basicText}</p><ul>{o.basicLi.map(x=><li key={x}>{x}</li>)}</ul><Link className="button" href="/admin-basic">{o.basicOpen}</Link></article><article className="admin-offer-card pro"><p className="kicker">{o.offer2}</p><h2>{o.proTitle}</h2><p>{o.proText}</p><ul>{o.proLi.map(x=><li key={x}>{x}</li>)}</ul>{hasPro?<Link className="button" href="/admin-pro">{o.proOpen}</Link>:<p className="admin-locked"><strong>{o.proLocked}</strong><br/>{o.proLockedText}</p>}</article></div></section>;
}
