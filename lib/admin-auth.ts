import 'server-only';
import {createHmac, timingSafeEqual} from 'crypto';
import {cookies} from 'next/headers';

const cookieName='avro_sky_admin';

function secret(){
  const value=process.env.ADMIN_SESSION_SECRET;
  if(!value || value.length<32) throw new Error('ADMIN_SESSION_SECRET must be set to a value of at least 32 characters.');
  return value;
}
function signature(value:string){return createHmac('sha256',secret()).update(value).digest('base64url');}

export async function isAdmin(){
  try {
    const value=(await cookies()).get(cookieName)?.value;
    if(!value) return false;
    const [expires,provided]=value.split('.');
    if(!expires || !provided || Number(expires)<Date.now()) return false;
    const expected=signature(expires);
    return provided.length===expected.length && timingSafeEqual(Buffer.from(provided),Buffer.from(expected));
  } catch { return false; }
}

export async function startAdminSession(password:string){
  const configured=process.env.ADMIN_PASSWORD;
  if(!configured) return false;
  const passwordBytes=Buffer.from(password);
  const configuredBytes=Buffer.from(configured);
  if(passwordBytes.length!==configuredBytes.length || !timingSafeEqual(passwordBytes,configuredBytes)) return false;
  const expires=String(Date.now()+1000*60*60*12);
  (await cookies()).set(cookieName,`${expires}.${signature(expires)}`,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/admin',expires:new Date(Number(expires))});
  return true;
}

export async function endAdminSession(){(await cookies()).delete(cookieName);}

export async function requireAdmin(){if(!await isAdmin()) throw new Error('Unauthorized');}
