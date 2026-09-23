import type { NextConfig } from 'next';
const config: NextConfig = { images: { remotePatterns: [{protocol:'https',hostname:'**.airtableusercontent.com'},{protocol:'https',hostname:'images.unsplash.com'}] }, poweredByHeader:false };
export default config;
