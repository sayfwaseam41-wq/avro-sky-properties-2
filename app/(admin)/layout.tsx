import type {Metadata} from 'next';
import '../globals.css';
import {site} from '@/config/site';
import {dirOf} from '@/lib/i18n/config';
import {adminDictFor} from '@/lib/i18n/admin';
import {adminLang} from '@/lib/i18n/admin-server';
import {brandCss} from '@/lib/theme';
import {AdminI18nProvider} from '@/components/admin-i18n-provider';

export const metadata:Metadata={title:`${site.name} admin`,robots:{index:false,follow:false}};
export default async function AdminRootLayout({children}:{children:React.ReactNode}){const lang=await adminLang();const css=brandCss();return <html lang={lang} dir={dirOf(lang)}><body>{css&&<style dangerouslySetInnerHTML={{__html:css}}/>}<AdminI18nProvider lang={lang} dict={adminDictFor(lang)}>{children}</AdminI18nProvider></body></html>}
