/**
 * Everything that identifies the company comes from environment variables (see .env.example).
 * There are no company-specific fallbacks here: a new client is set up by filling in the environment, not by editing code.
 * NEXT_PUBLIC_* values are written out literally so Next.js can inline them into client components.
 */
const plan = process.env.NEXT_PUBLIC_PLAN === 'pro' ? 'pro' : 'basic';

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
  address: process.env.NEXT_PUBLIC_ADDRESS || '',
  email: process.env.COMPANY_EMAIL || '',
  emailFrom: process.env.RESEND_FROM_EMAIL || '',
  currency: process.env.NEXT_PUBLIC_CURRENCY || 'USD',
  locale: process.env.NEXT_PUBLIC_LOCALE || 'en-US',
  rentalPeriod: process.env.NEXT_PUBLIC_RENTAL_PERIOD || 'month',
  plan: plan as 'basic' | 'pro',
};
/** True when this deployment includes the Pro management system. */
export const hasPro = site.plan === 'pro';
export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}
