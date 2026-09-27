import {NextResponse} from 'next/server';
import {site} from '@/config/site';
import {leadSchema,leadSummary} from '@/lib/lead';
import {isRateLimited} from '@/lib/rate-limit';
export const runtime='nodejs';
export async function POST(request:Request){
 const address=request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';
 if(isRateLimited(`property-request:${address}`,8,15*60*1000))return NextResponse.json({error:'Too many requests. Please try again later.'},{status:429});
 let raw:unknown;
 try{raw=await request.json();}catch{return NextResponse.json({error:'Invalid request.'},{status:400});}
 const parsed=leadSchema.safeParse(raw);
 if(!parsed.success)return NextResponse.json({error:'Please correct the highlighted information.',issues:parsed.error.issues.map(i=>({path:i.path[0],message:i.message}))},{status:422});
 const lead=parsed.data;if(lead.website)return NextResponse.json({ok:true});
 const token=process.env.RESEND_API_KEY;
 if(!token)return NextResponse.json({error:'Email delivery is not configured yet. Please contact us on WhatsApp.'},{status:503});
 const budgetFormatted=lead.budget.startsWith('$')||lead.budget.toLowerCase().startsWith('usd')?lead.budget:`USD ${lead.budget}`;
 const lines=[['Property type',lead.propertyType],['Preferred area',lead.area],['Bedrooms',String(lead.bedrooms)],['Budget',budgetFormatted],['Looking to',lead.intent],['Timeline',lead.timeline],['Name',lead.name],['Phone / WhatsApp',lead.phone],['Message',lead.message||'—']].map(([label,value])=>`<tr><th style="text-align:left;padding:10px;border-bottom:1px solid #e5e7eb;color:#475569">${label}</th><td style="padding:10px;border-bottom:1px solid #e5e7eb">${value.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</td></tr>`).join('');
 const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({from:site.emailFrom,to:[site.email],subject:`New property request — ${lead.intent} in ${lead.area}`,html:`<main style="font-family:Arial,sans-serif;max-width:680px;margin:auto"><h1 style="color:#14283f">New property request</h1><p>A visitor has sent requirements through ${site.name}.</p><table style="border-collapse:collapse;width:100%">${lines}</table><p style="color:#64748b;margin-top:24px">WhatsApp summary: ${leadSummary(lead).replace(/&/g,'&amp;').replace(/</g,'&lt;')}</p></main>`})});
 if(!response.ok){console.error('Resend failed',response.status);return NextResponse.json({error:'We couldn’t send your request. Please try WhatsApp instead.'},{status:502});}
 return NextResponse.json({ok:true});
}
