import {AdminLoginForm} from '@/components/admin-login-form';
import {currentStaff,isAdmin} from '@/lib/admin-auth';
import {logout} from '@/app/(admin)/admin/actions';
import {getProData} from '@/lib/admin-store';
import {getAllProperties} from '@/lib/property-store';
import {adminDict} from '@/lib/i18n/admin-server';
import {ProAdminDashboard} from '@/components/pro-admin-dashboard';

export async function generateMetadata(){return {title:(await adminDict()).meta.pro};}
export default async function Page(){
 const a=await adminDict();const p=a.pro;
 if(!await isAdmin()) return <section className="shell admin-login"><p className="kicker">{p.kicker}</p><h1>{p.loginTitle}</h1><p>{p.loginText}</p><AdminLoginForm next="/admin-pro"/></section>;
 const [data,properties,session]=await Promise.all([getProData(),getAllProperties(),currentStaff()]);
 if(!session) return null;
 return <section className="shell admin-page"><div className="admin-hero"><div><p className="kicker">{p.kicker}</p><h1>{p.title}</h1><p>{p.text}</p></div><form action={logout}><button className="admin-logout" type="submit">{a.common.signOut}</button></form></div><ProAdminDashboard properties={properties} data={data} role={session.role}/></section>;
}
