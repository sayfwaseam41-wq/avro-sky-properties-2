import {z} from 'zod';
export const leadSchema=z.object({
 propertyType:z.enum(['Apartment','House','Villa','Land','Office']),
 area:z.string().trim().min(2,'Enter a preferred area.').max(100),
 bedrooms:z.coerce.number().int().min(0).max(20),
 budget:z.coerce.number().positive('Enter a positive budget.').max(1000000000),
 intent:z.enum(['Rent','Buy']),
 timeline:z.enum(['ASAP','Within a month','Just looking']),
 name:z.string().trim().min(2,'Enter your name.').max(100),
 phone:z.string().trim().min(6,'Enter a phone or WhatsApp number.').max(50),
 message:z.string().trim().max(2000).optional().default(''),
 website:z.string().max(0).optional().default(''),
});
export type Lead=z.infer<typeof leadSchema>;
export function leadSummary(lead:Lead){return `Hello, I’m ${lead.name}. I’m looking to ${lead.intent.toLowerCase()} a ${lead.bedrooms}-bedroom ${lead.propertyType.toLowerCase()} in ${lead.area}, with a budget up to ${lead.budget}. Timeline: ${lead.timeline}. My contact: ${lead.phone}.${lead.message ? ` Note: ${lead.message}` : ''}`;}
