import {AdminBasicPage} from '@/components/admin-basic-page';
import {AdminLoginForm} from '@/components/admin-login-form';
import {isAdmin} from '@/lib/admin-auth';
import {adminDict} from '@/lib/i18n/admin-server';

export async function generateMetadata(){return {title:(await adminDict()).meta.basic};}
export default async function Page(){
 if(!await isAdmin()){const b=(await adminDict()).basic;return <section className="shell admin-login"><p className="kicker">{b.kicker}</p><h1>{b.loginTitle}</h1><p>{b.loginText}</p><AdminLoginForm next="/admin-basic"/></section>;}
 return <AdminBasicPage/>;
}
