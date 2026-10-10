import type {ReactNode} from 'react';

/** Small inline icon set so the public site ships no icon library. */
function Icon({children,size=20,fill=false,flip=false}:{children:ReactNode;size?:number;fill?:boolean;flip?:boolean}){
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={fill?'currentColor':'none'} stroke={fill?'none':'currentColor'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" className={flip?'rtl-flip':undefined}>{children}</svg>;
}
type P={size?:number};

export const BedIcon=(p:P)=><Icon {...p}><path d="M3 18V6M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="1.6"/></Icon>;
export const BathIcon=(p:P)=><Icon {...p}><path d="M4 12h16v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-2ZM6 12V6a2 2 0 0 1 3.4-1.4M7 18l-1 2M17 18l1 2"/></Icon>;
export const AreaIcon=(p:P)=><Icon {...p}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></Icon>;
export const PinIcon=(p:P)=><Icon {...p}><path d="M12 21s7-6.2 7-11.2A7 7 0 0 0 5 9.8C5 14.8 12 21 12 21Z"/><circle cx="12" cy="10" r="2.5"/></Icon>;
export const PhoneIcon=(p:P)=><Icon {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></Icon>;
export const ArrowIcon=(p:P)=><Icon {...p} flip><path d="M5 12h14M13 6l6 6-6 6"/></Icon>;
export const ChevronLeftIcon=(p:P)=><Icon {...p} flip><path d="m15 6-6 6 6 6"/></Icon>;
export const ChevronRightIcon=(p:P)=><Icon {...p} flip><path d="m9 6 6 6-6 6"/></Icon>;
export const MenuIcon=(p:P)=><Icon {...p}><path d="M4 7h16M4 12h16M4 17h16"/></Icon>;
export const CloseIcon=(p:P)=><Icon {...p}><path d="M6 6l12 12M18 6 6 18"/></Icon>;
export const CheckIcon=(p:P)=><Icon {...p}><path d="m5 12.5 4.5 4.5L19 7.5"/></Icon>;
export const MailIcon=(p:P)=><Icon {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></Icon>;
export const WhatsAppIcon=(p:P)=><Icon {...p}><path d="M3 21l1.6-4.8A9 9 0 1 1 8 19.4L3 21Z"/><path d="M9.5 8.5c.3 2.2 2.8 4.7 5 5l1-1.2-1.8-1-.9.8c-.8-.3-1.6-1.1-1.9-1.9l.8-.9-1-1.8-1.2 1Z"/></Icon>;

export const ApartmentIcon=(p:P)=><Icon {...p}><path d="M5 21V4h9v17M14 9h5v12M3 21h18M8 8h2M8 12h2M8 16h2M17 13h0M17 17h0"/></Icon>;
export const HouseIcon=(p:P)=><Icon {...p}><path d="m3 11 9-7 9 7M5 10v11h14V10M10 21v-6h4v6"/></Icon>;
export const VillaIcon=(p:P)=><Icon {...p}><path d="M2 21h20M4 21V12l5-4 5 4v9M14 21v-7l4-3 4 3v7M7 21v-4h4v4"/></Icon>;
export const LandIcon=(p:P)=><Icon {...p}><path d="M3 18 9 6l4 8 3-5 5 9M3 21h18"/></Icon>;
export const OfficeIcon=(p:P)=><Icon {...p}><rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3"/></Icon>;
export const ShareIcon=(p:P)=><Icon {...p}><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="m8.3 10.7 7.4-4.1M8.3 13.3l7.4 4.1"/></Icon>;
