import {notFound} from 'next/navigation';

/** Any address that matches no page lands here, so the 404 is drawn inside the site layout. */
export default function CatchAll(){notFound();}
