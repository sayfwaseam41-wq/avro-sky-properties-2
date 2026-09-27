import {AdminBasicPage} from '@/components/admin-basic-page';
import {AdminLoginForm} from '@/components/admin-login-form';
import {isAdmin} from '@/lib/admin-auth';

export const metadata={title:'Basic property admin'};
export default async function Page(){
 if(!await isAdmin()) return <section className="shell admin-login"><p className="kicker">Offer 01 · Basic</p><h1>Property admin</h1><p>Sign in to manage property listings and photos.</p><AdminLoginForm next="/admin-basic"/></section>;
 return <AdminBasicPage/>;
}
