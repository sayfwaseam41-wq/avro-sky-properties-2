'use client';
import {useState} from 'react';
import {ShareIcon} from './icons';
import {useI18n} from './i18n-provider';

/** Opens the phone's share sheet when there is one, otherwise copies the page address. */
export function ShareButton({title}:{title:string}){
  const {t}=useI18n();
  const [copied,setCopied]=useState(false);
  async function share(){
    const url=window.location.href;
    try{
      if(typeof navigator.share==='function'){await navigator.share({title,url});return;}
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(()=>setCopied(false),2500);
    }catch{
      // The visitor closed the share sheet, or the browser refused to copy. Nothing to report.
    }
  }
  return <button type="button" className="btn btn-outline btn-block share-btn" onClick={share}><ShareIcon size={18}/><span role="status" aria-live="polite">{copied?t.extras.copied:t.extras.share}</span></button>;
}
