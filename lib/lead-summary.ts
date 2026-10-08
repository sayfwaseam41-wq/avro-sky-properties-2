export type Lead = {propertyType:string;area:string;bedrooms:string;budget:string;intent:'Rent'|'Buy';timeline:string;name:string;phone:string;message?:string;website?:string};

/** Wording for the WhatsApp message. The site passes its translated version; the API route uses the English default. */
export type SummaryLabels = {
  template:string;
  intents:Record<string,string>;
  bedsText:string;
  note:string;
  types?:Record<string,string>;
  beds?:Record<string,string>;
  timelines?:Record<string,string>;
};

const english:SummaryLabels = {
  template:'Hello, I’m {name}. I’m looking to {intent} a {bedsText}{type} in {area}, with a budget of {budget}. Timeline: {timeline}. My contact: {phone}.{note}',
  intents:{Rent:'rent',Buy:'buy'},
  bedsText:'{beds} ',
  note:' Note: {note}',
};

const fill = (text:string, values:Record<string,string>) => text.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');

export function leadSummary(lead: Lead, labels: SummaryLabels = english) {
  const budget = lead.budget.startsWith('$') || lead.budget.toLowerCase().startsWith('usd')
    ? lead.budget
    : `$${lead.budget}`;
  const type = labels.types?.[lead.propertyType] ?? lead.propertyType.toLowerCase();
  const beds = labels.beds?.[lead.bedrooms] ?? lead.bedrooms;
  return fill(labels.template, {
    name: lead.name,
    intent: labels.intents[lead.intent] ?? lead.intent.toLowerCase(),
    bedsText: lead.bedrooms === 'Any beds' ? '' : fill(labels.bedsText, {beds}),
    type,
    area: lead.area,
    budget,
    timeline: labels.timelines?.[lead.timeline] ?? lead.timeline,
    phone: lead.phone,
    note: lead.message ? fill(labels.note, {note: lead.message}) : '',
  });
}
