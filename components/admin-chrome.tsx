import Link from 'next/link';
import Image from 'next/image';
import {site} from '@/config/site';
import {isAdmin} from '@/lib/admin-auth';
import {AdminLanguageSwitch} from '@/components/admin-language-switch';

/**
 * The admin area is its own application: no public header, footer or navigation.
 * Signed-out visitors get a bare, centred sign-in screen; signed-in pages get a slim app bar
 * (the Pro dashboard passes bar={false} because its sidebar is the navigation).
 */
export async function AdminChrome({children,bar=true}:{children:React.ReactNode;bar?:boolean}){
  const signedIn=await isAdmin();
  return <div className={`admin-app ${signedIn?'is-authed':'is-guest'}${bar?'':' no-bar'}`}>
    {!signedIn&&<div className="admin-guest-lang"><AdminLanguageSwitch/></div>}
    {signedIn&&bar&&<header className="admin-topbar"><Link href="/admin" className="admin-brand" aria-label={site.name}>{site.logo?<Image src={site.logo} width={142} height={52} alt={site.name} priority/>:<strong>{site.name}</strong>}</Link><AdminLanguageSwitch/></header>}
    <main id="main">{children}</main>
  </div>;
}
