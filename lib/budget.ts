/** Single source for budget presets used by the home search and the request form. Edit the ranges here. */
export const OTHER_BUDGET='Other (enter your own budget)';

export const RENT_BUDGETS=['$200 - $400','$400 - $600','$600 - $900','$900 - $1,500'] as const;
export const BUY_BUDGETS=['$75,000 - $100,000','$100,000 - $150,000','$150,000 - $250,000'] as const;

export type Intent='Rent'|'Buy';
export const budgetPresets=(intent:Intent):readonly string[]=>intent==='Buy'?BUY_BUDGETS:RENT_BUDGETS;

/** Turns a chosen preset ("$75,000 - $100,000") or a typed number into price bounds for the listings filter. */
export function budgetBounds(value:string):{min:string;max:string}{
  const range=value.match(/^\$?([\d,]+)\s*-\s*\$?([\d,]+)$/);
  if(range)return {min:range[1].replace(/,/g,''),max:range[2].replace(/,/g,'')};
  const single=Number(value.replace(/[$,\s]/g,''));
  return Number.isFinite(single)&&single>0?{min:'',max:String(single)}:{min:'',max:''};
}
