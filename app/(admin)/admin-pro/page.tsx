import {AdminLoginForm} from '@/components/admin-login-form';
import {currentStaff,isAdmin} from '@/lib/admin-auth';
import {logout} from '@/app/(admin)/admin/actions';
import {getProData} from '@/lib/admin-store';
import {getAllProperties} from '@/lib/property-store';
import {ProAdminDashboard} from '@/components/pro-admin-dashboard';

export const metadata={title:'Pro management preview'};
export default async function Page(){
 if(!await isAdmin()) return <section className="shell admin-login"><p className="kicker">Offer 02 · Pro</p><h1>Company management</h1><p>Sign in to view the Pro system preview.</p><AdminLoginForm next="/admin-pro"/></section>;
 const [data,properties,session]=await Promise.all([getProData(),getAllProperties(),currentStaff()]);
 if(!session) return null;
 return <section className="shell admin-page"><div className="admin-hero"><div><p className="kicker">Offer 02 · Pro</p><h1>Real-estate management</h1><p>Live company workspace for properties, clients, rentals, payments, sales, and staff.</p></div><form action={logout}><button className="admin-logout" type="submit">Sign out</button></form></div><ProAdminDashboard properties={properties} data={data} role={session.role}/></section>;
}
