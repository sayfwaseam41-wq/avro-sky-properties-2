'use client';
import Link from 'next/link';
export default function ErrorPage({reset}:{reset:()=>void}){return <section className="shell section"><div className="empty-state"><h1>We couldn’t load this page</h1><p>Please try again. You can also send your requirements directly to our team.</p><button className="button" onClick={reset}>Try again</button><p style={{marginTop:20}}><Link href="/request" className="text-link">Request a property</Link></p></div></section>}
