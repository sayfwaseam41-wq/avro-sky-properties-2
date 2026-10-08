import type {Metadata} from 'next';
import '../globals.css';

export const metadata:Metadata={title:'Avro Sky admin',robots:{index:false,follow:false}};
export default function AdminRootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
