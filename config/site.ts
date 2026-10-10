/**
 * Everything that identifies the company comes from environment variables (see .env.example).
 * There are no company-specific fallbacks here: a new client is set up by filling in the environment, not by editing code.
 * NEXT_PUBLIC_* values are written out literally so Next.js can inline them into client components.
 */
const plan = process.env.NEXT_PUBLIC_PLAN === 'pro' ? 'pro' : 'basic';

const centre=(process.env.NEXT_PUBLIC_MAP_CENTER||'36.867,42.950').split(',').map(part=>Number(part.trim()));
const mapCenter:[number,number]=centre.length===2&&centre.every(Number.isFinite)&&Math.abs(centre[0])<=90&&Math.abs(centre[1])<=180?[centre[0],centre[1]]:[36.867,42.95];

/** The company name as visitors read it in each language. Set NEXT_PUBLIC_COMPANY_NAME_AR / _CKB to your own spelling; Avro Sky has built-in ones. */
const knownNames:Record<string,{ar:string;ckb:string}>={'avro sky':{ar:'أفرو سكاي',ckb:'ئەڤرۆ سکای'}};
const nameFor=(english:string,lang:'ar'|'ckb',override:string)=>override||knownNames[english.trim().toLowerCase()]?.[lang]||english;

export const site = {
  name: process.env.NEXT_PUBLIC_COMPANY_NAME || '',
  logo: process.env.NEXT_PUBLIC_LOGO_PATH || '',
  tagline: process.env.NEXT_PUBLIC_TAGLINE || '',
  about: process.env.NEXT_PUBLIC_ABOUT || '',
  /** Optional brand colour overrides (hex). When empty, the stylesheet's default palette is used. */
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || '',
  secondaryColor: process.env.NEXT_PUBLIC_SECONDARY_COLOR || '',
  phone: process.env.NEXT_PUBLIC_PHONE || '',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || '',
  tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || '',
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || '',
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || '',
  address: process.env.NEXT_PUBLIC_ADDRESS || '',
  email: process.env.COMPANY_EMAIL || '',
  emailFrom: process.env.RESEND_FROM_EMAIL || '',
  currency: process.env.NEXT_PUBLIC_CURRENCY || 'USD',
  locale: process.env.NEXT_PUBLIC_LOCALE || 'en-US',
  rentalPeriod: process.env.NEXT_PUBLIC_RENTAL_PERIOD || 'month',
  /** Where maps open when no listing has a location yet, as [latitude, longitude]. */
  mapCenter,
  /** Map tile server. The default is OpenStreetMap's public server, which is fine for a small site. */
  mapTileUrl: process.env.NEXT_PUBLIC_MAP_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  plan: plan as 'basic' | 'pro',
};
/** True when this deployment includes the Pro management system. */
export const hasPro = site.plan === 'pro';
export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}

/** Company name for the visitor's language, so Arabic and Kurdish pages never show the English spelling. */
export function siteName(lang:'en'|'ar'|'ckb'){
  if(lang==='en')return site.name;
  return nameFor(site.name,lang,lang==='ar'?(process.env.NEXT_PUBLIC_COMPANY_NAME_AR||''):(process.env.NEXT_PUBLIC_COMPANY_NAME_CKB||''));
}
