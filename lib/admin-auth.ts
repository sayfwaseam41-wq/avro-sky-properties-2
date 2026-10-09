import 'server-only';
import {createHmac, timingSafeEqual} from 'crypto';
import {cookies} from 'next/headers';
import {findStaff,getStaffById,passwordMatches,type StaffRole} from './admin-store';

const cookieName='avro_sky_admin';

function secret(){
  const value=process.env.ADMIN_SESSION_SECRET;
  if(!value || value.length<32) throw new Error('ADMIN_SESSION_SECRET must be set to a value of at least 32 characters.');
  return value;
}
type Session={id:string;role:StaffRole;expires:number};
function signature(value:string){return createHmac('sha256',secret()).update(value).digest('base64url');}
function parseSession(value?:string):Session|undefined{try{if(!value)return;const [encoded,provided]=value.split('.');const expected=signature(encoded);if(!encoded||!provided||provided.length!==expected.length||!timingSafeEqual(Buffer.from(provided),Buffer.from(expected)))return;const data=JSON.parse(Buffer.from(encoded,'base64url').toString()) as Session;return data.expires>Date.now()?data:undefined;}catch{return;}}

/** The signed-in staff member, re-read from the database so a deactivated account or changed role takes effect immediately. */
export async function verifiedStaff(){
  const session=parseSession((await cookies()).get(cookieName)?.value);
  if(!session)return;
  const staff=await getStaffById(session.id);
  return staff&&staff.active?staff:undefined;
}

export async function isAdmin(){
  return Boolean(await verifiedStaff());
}

export async function startAdminSession(email:string,password:string){
  const staff=await findStaff(email);if(!staff||!staff.active||!await passwordMatches(password,staff.password_hash))return false;
  const data:Session={id:staff.id,role:staff.role,expires:Date.now()+1000*60*60*12};const encoded=Buffer.from(JSON.stringify(data)).toString('base64url');
  (await cookies()).set(cookieName,`${encoded}.${signature(encoded)}`,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',expires:new Date(data.expires)});
  return true;
}

export async function endAdminSession(){(await cookies()).delete(cookieName);}

export async function requireAdmin(){const staff=await verifiedStaff();if(!staff)throw new Error('Unauthorized');return staff;}
export async function requireRole(...roles:StaffRole[]){const staff=await requireAdmin();if(!roles.includes(staff.role))throw new Error('You do not have permission for that action.');return staff;}
