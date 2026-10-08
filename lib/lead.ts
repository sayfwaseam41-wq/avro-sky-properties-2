import {z} from 'zod';

export const leadSchema = z.object({
  propertyType: z.enum(['Apartment', 'House', 'Villa', 'Land', 'Office']),
  area: z.string().trim().min(2, 'Enter a preferred area.').max(100),
  bedrooms: z.union([
    z.string().trim().min(1, 'Select number of bedrooms.'),
    z.number().int().min(0).max(20),
  ]).transform(val => String(val)),
  budget: z.union([
    z.string().trim().min(1, 'Enter or select your budget.').max(100),
    z.number().positive('Enter a positive budget.').max(1000000000),
  ]).transform(val => String(val)),
  intent: z.enum(['Rent', 'Buy']),
  timeline: z.enum(['ASAP', 'Within a month', 'Just looking']),
  name: z.string().trim().min(2, 'Enter your name.').max(100),
  phone: z.string().trim().min(6, 'Enter a phone or WhatsApp number.').max(50),
  message: z.string().trim().max(2000).optional().default(''),
  website: z.string().max(0).optional().default(''),
});

export type Lead = z.infer<typeof leadSchema>;

export {leadSummary} from './lead-summary';
