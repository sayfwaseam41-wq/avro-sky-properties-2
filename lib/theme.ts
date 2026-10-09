import {site} from '@/config/site';

const hex=/^#[0-9a-f]{6}$/i;
/** Blends a colour towards white (positive) or black (negative) by the given share. */
function shade(color:string,share:number){
  const target=share<0?0:255;const amount=Math.abs(share);
  const channel=(start:number)=>Math.round(parseInt(color.slice(start,start+2),16)*(1-amount)+target*amount).toString(16).padStart(2,'0');
  return `#${channel(1)}${channel(3)}${channel(5)}`;
}

/** CSS that applies NEXT_PUBLIC_PRIMARY_COLOR / NEXT_PUBLIC_SECONDARY_COLOR over the default palette. Empty when neither is set. */
export function brandCss(){
  const p=hex.test(site.primaryColor)?site.primaryColor:'';
  const s=hex.test(site.secondaryColor)?site.secondaryColor:'';
  const pub:string[]=[];const adm:string[]=[];
  if(p){
    pub.push(`--gold:${p}`,`--gold-btn:${shade(p,.12)}`,`--gold-hover:${shade(p,.25)}`,`--gold-light:${shade(p,.4)}`,`--gold-text:${shade(p,-.2)}`);
    adm.push(`--gold:${p}`,`--gold-light:${shade(p,.4)}`,`--gold-deep:${shade(p,-.35)}`);
  }
  if(s){
    pub.push(`--navy:${s}`,`--navy-2:${shade(s,.12)}`,`--navy-deep:${shade(s,-.45)}`);
    adm.push(`--navy:${s}`,`--navy-deep:${shade(s,-.5)}`,`--navy-soft:${shade(s,.08)}`);
  }
  return `${pub.length?`html .site{${pub.join(';')}}`:''}${adm.length?`html:root{${adm.join(';')}}`:''}`;
}
