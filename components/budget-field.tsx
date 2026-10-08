'use client';
import {useId,useState} from 'react';
import {OTHER_BUDGET,budgetPresets,type Intent} from '@/lib/budget';
import {useI18n} from './i18n-provider';

/**
 * Preset budget ranges plus "Other". `value` is what gets submitted: the chosen range, or the typed amount.
 * Re-mount with `key={intent}` when the intent changes so the choice resets.
 */
export function BudgetField({intent,value,onChange,anyLabel=false,className='field'}:{intent:Intent;value:string;onChange:(value:string)=>void;anyLabel?:boolean;className?:string}){
  const {t}=useI18n();
  const presets=budgetPresets(intent);
  const [other,setOther]=useState(()=>value!==''&&!presets.includes(value));
  const id=useId();
  const selected=other?OTHER_BUDGET:value;
  return <div className={className}>
    <label htmlFor={`${id}-select`}>{t.budget.label}</label>
    <select id={`${id}-select`} value={selected} onChange={e=>{const next=e.target.value;if(next===OTHER_BUDGET){setOther(true);onChange('');}else{setOther(false);onChange(next);}}}>
      <option value="">{anyLabel?t.budget.any:t.budget.select}</option>
      {presets.map(range=><option key={range} value={range}>{range}</option>)}
      <option value={OTHER_BUDGET}>{t.budget.other}</option>
    </select>
    {other&&<input type="number" dir="ltr" min="1" inputMode="numeric" required autoFocus value={value} onChange={e=>onChange(e.target.value)} placeholder={t.budget.enter} aria-label={t.budget.enterAria}/>}
  </div>;
}
