import {AdminLoginForm} from '@/components/admin-login-form';
import {verifiedStaff} from '@/lib/admin-auth';
import {logout} from '@/app/(admin)/admin/actions';
import {getProData} from '@/lib/admin-store';
import {getAllProperties} from '@/lib/property-store';
import {adminDict} from '@/lib/i18n/admin-server';
import {ProAdminDashboard} from '@/components/pro-admin-dashboard';

export async function generateMetadata(){return {title:(await adminDict()).meta.pro};}
export default async function Page(){
 const a=await adminDict();const p=a.pro;
 const staff=await verifiedStaff();
 if(!staff) return <section className="shell admin-login"><p className="kicker">{p.kicker}</p><h1>{p.loginTitle}</h1><p>{p.loginText}</p><AdminLoginForm next="/admin-pro"/></section>;
 const [data,properties]=await Promise.all([getProData(staff.role),getAllProperties()]);
 return <section className="shell admin-page"><div className="admin-hero"><div><p className="kicker">{p.kicker}</p><h1>{p.title}</h1><p>{p.text}</p></div><form action={logout}><button className="admin-logout" type="submit">{a.common.signOut}</button></form></div><ProAdminDashboard properties={properties} data={data} role={staff.role} adminId={staff.id} adminName={staff.name}/></section>;
}
