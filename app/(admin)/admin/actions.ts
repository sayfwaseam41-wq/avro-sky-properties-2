'use server';

import {revalidatePath,updateTag} from 'next/cache';
import {propertiesTag} from '@/lib/public-data';
import {redirect} from 'next/navigation';
import {headers} from 'next/headers';
import {hasPro} from '@/config/site';
import {endAdminSession,requireAdmin,requireRole,startAdminSession} from '@/lib/admin-auth';
import {createProperty,deleteProperty,updateProperty} from '@/lib/property-store';
import {createClient,createRental,createSale,createStaff,deleteClient,deleteTemplate,endRental,logActivity,markPayment,saveTemplate,updateClient,updateStaff} from '@/lib/admin-store';
import {isRateLimited} from '@/lib/rate-limit';

export type ActionState={error?:string};
const badCredentials={error:'Email or password is not correct.'};

export async function login(_:ActionState,formData:FormData):Promise<ActionState>{
  const password=String(formData.get('password')||'');const email=String(formData.get('email')||'');
  const address=(await headers()).get('x-forwarded-for')?.split(',')[0]?.trim()||email.toLowerCase()||'unknown';
  if(isRateLimited(`admin-login:${address}`,5,15*60*1000))return {error:'Too many sign-in attempts. Please try again in 15 minutes.'};
  if(!await startAdminSession(email,password)) return badCredentials;
  const next=String(formData.get('next')||'/admin');
  redirect(next==='/admin-basic'||(next==='/admin-pro'&&hasPro)?next:'/admin');
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

/** Runs a Pro-only change: the plan must include Pro, the caller must hold one of the roles, and the change is written to the activity log. */
async function proSave(formData:FormData,task:(staff:{id:string})=>Promise<void>,roles:('Admin'|'Agent')[],action:string,entity:string):Promise<ActionState>{
  if(!hasPro)return {error:'This feature is not available on your plan.'};
  try{
    const staff=await requireRole(...roles);
    await task(staff);
    await logActivity(staff.id,action,entity,String(formData.get('name')||formData.get('title')||''));
  }catch(error){return {error:error instanceof Error?error.message:'Unable to save.'};}
  updateTag(propertiesTag);revalidatePath('/[lang]','layout');revalidatePath('/admin-pro');revalidatePath('/admin');revalidatePath('/admin-basic');return {};
}
export async function addClient(_:ActionState,formData:FormData){return proSave(formData,()=>createClient(formData),['Admin','Agent'],'Added client','client');}
export async function editClient(_:ActionState,formData:FormData){return proSave(formData,()=>updateClient(formData),['Admin','Agent'],'Updated client','client');}
export async function removeClient(_:ActionState,formData:FormData){return proSave(formData,()=>deleteClient(formData),['Admin'],'Removed client','client');}
export async function addRental(_:ActionState,formData:FormData){return proSave(formData,()=>createRental(formData),['Admin'],'Created lease','rental');}
export async function closeRental(_:ActionState,formData:FormData){return proSave(formData,()=>endRental(formData),['Admin'],'Ended lease','rental');}
export async function payRent(_:ActionState,formData:FormData){return proSave(formData,()=>markPayment(formData),['Admin'],'Recorded rent payment','payment');}
export async function addTemplate(_:ActionState,formData:FormData){return proSave(formData,()=>saveTemplate(formData),['Admin'],'Saved message template','template');}
export async function removeTemplate(_:ActionState,formData:FormData){return proSave(formData,()=>deleteTemplate(formData),['Admin'],'Deleted message template','template');}
export async function addSale(_:ActionState,formData:FormData){return proSave(formData,()=>createSale(formData),['Admin'],'Recorded sale','sale');}
export async function addStaff(_:ActionState,formData:FormData){return proSave(formData,()=>createStaff(formData),['Admin'],'Added staff member','staff');}
export async function editStaff(_:ActionState,formData:FormData){return proSave(formData,staff=>updateStaff(formData,staff.id),['Admin'],'Updated staff member','staff');}
