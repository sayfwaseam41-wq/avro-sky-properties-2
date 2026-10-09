import {redirect} from 'next/navigation';
import {hasPro} from '@/config/site';
import {AdminChrome} from '@/components/admin-chrome';
export default function Layout({children}:{children:React.ReactNode}){
  // The Pro system is part of the Pro plan only; Basic deployments are sent to the Basic admin.
  if(!hasPro)redirect('/admin-basic');
  return <AdminChrome bar={false}>{children}</AdminChrome>;
}
