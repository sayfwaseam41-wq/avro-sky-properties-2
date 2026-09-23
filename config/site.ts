/** Edit this file to reskin the template for another company. Secrets stay in environment variables. */
export const site = {
  name: process.env.NEXT_PUBLIC_COMPANY_NAME || 'Avro Sky',
  logo: '/logo.svg',
  tagline: 'A place for your next chapter.',
  about: 'Find your next home, workspace, or investment in Duhok. Explore clear property details, check current availability, and speak directly with our team about the places that interest you.',
  primaryColor: '#1858a8',
  secondaryColor: '#14283f',
  phone: process.env.NEXT_PUBLIC_PHONE || '+9647504071719',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '9647504071719',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
  address: 'Duhok, Kurdistan Region, Iraq',
  email: process.env.COMPANY_EMAIL || 'sayfwaseam41@gmail.com',
  airtableBaseId: process.env.AIRTABLE_BASE_ID || 'appqc7Oq3PYBXqBn4',
  airtableTableName: process.env.AIRTABLE_TABLE_NAME || 'Properties',
  emailFrom: process.env.RESEND_FROM_EMAIL || 'Avro Sky <onboarding@resend.dev>',
  currency: 'USD',
  locale: 'en-US',
  rentalPeriod: 'month',
  demo: true,
};
export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}
