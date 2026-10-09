import type {Metadata,Viewport} from 'next';
import {Cairo,Cormorant_Garamond,Jost} from 'next/font/google';
import {site} from '@/config/site';
import {dirOf,langs} from '@/lib/i18n/config';
import {getDict} from '@/lib/i18n/dict';
import {alternates,langFrom,type LangParams} from '@/lib/i18n/server';
import {brandCss} from '@/lib/theme';
import {I18nProvider} from '@/components/i18n-provider';
import {SiteHeader} from '@/components/site-header';
import {SiteFooter} from '@/components/site-footer';
import './public.css';

const sans=Jost({subsets:['latin'],display:'swap',variable:'--font-sans'});
const display=Cormorant_Garamond({subsets:['latin'],weight:'600',display:'swap',variable:'--font-display'});
// Not preloaded: the file is only downloaded when Arabic text is actually on the page.
const arabic=Cairo({subsets:['arabic'],display:'swap',variable:'--font-arabic',preload:false});

const origin=process.env.NEXT_PUBLIC_SITE_URL||(process.env.VERCEL_PROJECT_PRODUCTION_URL?`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`:'http://localhost:3000');

export function generateStaticParams(){return langs.map(lang=>({lang}));}

export async function generateMetadata({params}:LangParams):Promise<Metadata>{
  const lang=await langFrom(params);
  const t=getDict(lang);
  const about=lang==='en'&&site.about?site.about:t.about;
  return {
    metadataBase:new URL(origin),
    title:{default:`${site.name} | ${t.siteTitle}`,template:`%s | ${site.name}`},
    description:about,
    alternates:alternates(lang,'/'),
    openGraph:{type:'website',siteName:site.name,locale:lang==='ar'?'ar_IQ':'en_US',title:`${site.name} | ${t.siteTitle}`,description:about},
    twitter:{card:'summary_large_image'},
  };
}
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:site.secondaryColor||'#0b1b33'};

export default async function SiteLayout({children,params}:{children:React.ReactNode}&LangParams){
  const lang=await langFrom(params);
  const t=getDict(lang);
  const css=brandCss();
  return <html lang={lang} dir={dirOf(lang)} className={`${sans.variable} ${display.variable} ${arabic.variable}`}>
    <body>
      {css&&<style dangerouslySetInnerHTML={{__html:css}}/>}
      <I18nProvider lang={lang} dict={t}>
        <div className="site"><a className="skip" href="#main">{t.common.skip}</a><SiteHeader lang={lang} t={t}/><main id="main">{children}</main><SiteFooter lang={lang} t={t}/></div>
      </I18nProvider>
    </body>
  </html>;
}
