'use server';

import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {endAdminSession,requireAdmin,startAdminSession} from '@/lib/admin-auth';
import {createProperty,deleteProperty,updateProperty} from '@/lib/property-store';

export type ActionState={error?:string};
const badCredentials={error:'Email or password is not correct.'};

export async function login(_:ActionState,formData:FormData):Promise<ActionState>{
  const password=String(formData.get('password')||'');const email=String(formData.get('email')||'');
  if(!await startAdminSession(email,password)) return badCredentials;
  const next=String(formData.get('next')||'/admin');
  redirect(next==='/admin-basic'||next==='/admin-pro'?next:'/admin');
}

export async function logout(){await endAdminSession();redirect('/admin');}

async function save(formData:FormData,id?:string):Promise<ActionState>{
  try {
    await requireAdmin();
    if(id) await updateProperty(id,formData); else await createProperty(formData);
  } catch(error) { return {error:error instanceof Error?error.message:'Unable to save this property.'}; }
  revalidatePath('/');revalidatePath('/properties');revalidatePath('/admin');
  return {};
}
export async function create(_:ActionState,formData:FormData){return save(formData);}
export async function update(_:ActionState,formData:FormData){return save(formData,String(formData.get('id')||''));}
export async function remove(_:ActionState,formData:FormData):Promise<ActionState>{
  try {await requireAdmin();await deleteProperty(String(formData.get('id')||''));}
  catch(error){return {error:error instanceof Error?error.message:'Unable to delete this property.'};}
  revalidatePath('/');revalidatePath('/properties');revalidatePath('/admin');return {};
}
