import type {Metadata} from 'next';
import {Bodoni_Moda,Jost} from 'next/font/google';
import {site} from '@/config/site';
import {PublicChrome} from '@/components/public-chrome';
import {PublicScene} from '@/components/public-scene';

const display=Bodoni_Moda({subsets:['latin'],weight:'400',variable:'--font-display'});
const sans=Jost({subsets:['latin'],weight:['300','400'],variable:'--font-sans'});
export const metadata:Metadata={title:{default:`${site.name} | Property in Duhok`,template:`%s | ${site.name}`},description:site.about};
export default function PublicLayout({children}:{children:React.ReactNode}){return <div className={`public-route ${display.variable} ${sans.variable}`} dir="ltr"><PublicScene/><PublicChrome/><main id="main" className="public-main">{children}</main></div>}
