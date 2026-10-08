'use server';

import {revalidatePath,updateTag} from 'next/cache';
import {propertiesTag} from '@/lib/public-data';
import {redirect} from 'next/navigation';
import {headers} from 'next/headers';
import {endAdminSession,requireAdmin,requireRole,startAdminSession} from '@/lib/admin-auth';
import {createProperty,deleteProperty,updateProperty} from '@/lib/property-store';
import {createClient,createRental,createSale,createStaff,markPayment,saveTemplate} from '@/lib/admin-store';
import {isRateLimited} from '@/lib/rate-limit';

export type ActionState={error?:string};
const badCredentials={error:'Email or password is not correct.'};

export async function login(_:ActionState,formData:FormData):Promise<ActionState>{
  const password=String(formData.get('password')||'');const email=String(formData.get('email')||'');
  const address=(await headers()).get('x-forwarded-for')?.split(',')[0]?.trim()||email.toLowerCase()||'unknown';
  if(isRateLimited(`admin-login:${address}`,5,15*60*1000))return {error:'Too many sign-in attempts. Please try again in 15 minutes.'};
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
  updateTag(propertiesTag);revalidatePath('/[lang]','layout');revalidatePath('/admin');
  return {};
}
export async function create(_:ActionState,formData:FormData){return save(formData);}
export async function update(_:ActionState,formData:FormData){return save(formData,String(formData.get('id')||''));}
export async function remove(_:ActionState,formData:FormData):Promise<ActionState>{
  try {await requireAdmin();await deleteProperty(String(formData.get('id')||''));}
  catch(error){return {error:error instanceof Error?error.message:'Unable to delete this property.'};}
  updateTag(propertiesTag);revalidatePath('/[lang]','layout');revalidatePath('/admin');return {};
}
async function proSave(formData:FormData,task:()=>Promise<void>,roles:('Admin'|'Agent')[]):Promise<ActionState>{try{await requireRole(...roles);await task();}catch(error){return {error:error instanceof Error?error.message:'Unable to save.'};}updateTag(propertiesTag);revalidatePath('/[lang]','layout');revalidatePath('/admin-pro');revalidatePath('/admin');revalidatePath('/admin-basic');return {};}
export async function addClient(_:ActionState,formData:FormData){return proSave(formData,()=>createClient(formData),['Admin','Agent']);}
export async function addRental(_:ActionState,formData:FormData){return proSave(formData,()=>createRental(formData),['Admin']);}
export async function payRent(_:ActionState,formData:FormData){return proSave(formData,()=>markPayment(formData),['Admin']);}
export async function addTemplate(_:ActionState,formData:FormData){return proSave(formData,()=>saveTemplate(formData),['Admin']);}
export async function addSale(_:ActionState,formData:FormData){return proSave(formData,()=>createSale(formData),['Admin']);}
export async function addStaff(_:ActionState,formData:FormData){return proSave(formData,()=>createStaff(formData),['Admin']);}
