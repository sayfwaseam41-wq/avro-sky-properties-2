'use client';
import {useState} from 'react';
import {BudgetField} from './budget-field';
import {useI18n} from './i18n-provider';
import {budgetBounds,type Intent} from '@/lib/budget';
import {propertyTypes} from '@/lib/property';

export function HomeSearch({areas}:{areas:string[]}){
  const {t,path}=useI18n();
  const h=t.home;
  const [intent,setIntent]=useState<Intent>('Rent');
  const [budget,setBudget]=useState('');
  const {min,max}=budgetBounds(budget);
  const choose=(next:Intent)=>{setIntent(next);setBudget('');};
  return <form action={path('/properties')} className="search" aria-label={h.searchLabel}>
    <fieldset className="seg"><legend className="sr">{h.iWant}</legend>
      <label><input type="radio" name="listingType" value="For Rent" checked={intent==='Rent'} onChange={()=>choose('Rent')}/><span>{h.rent}</span></label>
      <label><input type="radio" name="listingType" value="For Sale" checked={intent==='Buy'} onChange={()=>choose('Buy')}/><span>{h.buy}</span></label>
    </fieldset>
    <label className="field">{h.propType}<select name="type" defaultValue=""><option value="">{h.anyType}</option>{propertyTypes.map(type=><option key={type} value={type}>{t.types[type]}</option>)}</select></label>
    <label className="field">{h.area}<select name="area" defaultValue=""><option value="">{h.anyArea}</option>{areas.map(a=><option key={a}>{a}</option>)}</select></label>
    <BudgetField key={intent} intent={intent} value={budget} onChange={setBudget} anyLabel/>
    {min&&<input type="hidden" name="minPrice" value={min}/>}
    {max&&<input type="hidden" name="maxPrice" value={max}/>}
    <button className="btn btn-navy btn-lg" type="submit">{h.search}</button>
  </form>;
}
