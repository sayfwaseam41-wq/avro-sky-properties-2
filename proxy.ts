import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

/**
 * Public pages live under app/(site)/[lang]. English is served at the root without a prefix (/properties),
 * Arabic under /ar. Admin, API routes and files are excluded by the matcher.
 * Paths that already start with a language are left alone (the proxy also sees the rewritten /en/... URL).
 */
export function proxy(request:NextRequest){
  const {pathname}=request.nextUrl;
  const first=pathname.split('/')[1];
  if(first==='ar'||first==='en')return NextResponse.next();
  const url=request.nextUrl.clone();
  url.pathname=`/en${pathname==='/'?'':pathname}`;
  return NextResponse.rewrite(url);
}

export const config={matcher:['/((?!admin|api|_next|.*[.].*).*)']};
