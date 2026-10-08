import type { NextConfig } from 'next';

const immutable = 'public, max-age=31536000, immutable';
const security = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const config: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
    formats: ['image/avif', 'image/webp'],
    // Property photos change by URL, so the optimised copies can be kept for a month.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  poweredByHeader: false,
  async headers() {
    return [
      { source: '/:path*', headers: security },
      // Files in /public are revalidated on every visit by default; brand assets are versioned by file name.
      { source: '/(icon.png|apple-icon.png)', headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }] },
      { source: '/brand/:path*', headers: [{ key: 'Cache-Control', value: immutable }] },
    ];
  },
};
export default config;
