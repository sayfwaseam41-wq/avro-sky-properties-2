import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:{default:'Avro Sky | Property in Duhok',template:'%s | Avro Sky'},description:'Property in Duhok, Iraq.',icons:{icon:'/Gold_Black_Modern_Real_Estate_Logo.png'}};
export const viewport={width:'device-width',initialScale:1};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
