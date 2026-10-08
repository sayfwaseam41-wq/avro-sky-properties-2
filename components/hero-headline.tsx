import type {CSSProperties} from 'react';

/**
 * HERO TRIAL: headline whose words slide up out of a mask, one after another (CSS only, see public.css).
 * The text stays real words separated by spaces, so screen readers and search engines read it normally.
 */
export function HeroHeadline({a,em,z}:{a:string;em:string;z:string}){
  const words=a.trim().split(/\s+/).filter(Boolean);
  const word=(index:number,content:React.ReactNode)=>
    <span className="hw" key={index}><span className="hw-i" style={{'--i':index} as CSSProperties}>{content}</span></span>;
  return <h1>
    {words.map((text,index)=><span key={index}>{word(index,text)}{' '}</span>)}
    {word(words.length,<><em>{em}</em>{z}</>)}
  </h1>;
}

/** Number of animated words, used to time the stat card so it appears after the headline finishes. */
export const headlineWordCount=(a:string,em:string)=>`${a} ${em}`.trim().split(/\s+/).filter(Boolean).length;
