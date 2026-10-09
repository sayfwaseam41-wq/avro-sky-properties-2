import Link from 'next/link';
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
 const actions=<><Link href="/admin">{a.common.allSystems}</Link><form action={logout}><button className="admin-logout" type="submit">{a.common.signOut}</button></form></>;
 return <ProAdminDashboard properties={properties} data={data} role={staff.role} adminId={staff.id} adminName={staff.name} actions={actions}/>;
}
