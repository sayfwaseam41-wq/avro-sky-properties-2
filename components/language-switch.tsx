'use client';

/** The EN/AR pill shared by the public header and the admin header. `target` is the language it switches to. */
export function LanguageSwitch({target,label,href,onClick}:{target:string;label:string;href:string;onClick?:React.MouseEventHandler<HTMLAnchorElement>}){
  return <a className="lang-switch" href={href} hrefLang={target} lang={target} onClick={onClick}>{label}</a>;
}
