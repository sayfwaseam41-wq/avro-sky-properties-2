import Link from 'next/link';
export default function NotFound(){return <section className="shell section"><h1>Property not available</h1><p>This listing may no longer be on the market.</p><Link className="button" href="/properties">Browse current properties</Link></section>}
