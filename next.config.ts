import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV !== 'production';

/**
 * Content Security Policy. Sent as report only, so browsers log violations to
 * the console but block nothing.
 *
 * 'unsafe-inline' is required because next-themes, the App Router and
 * styled-jsx inject inline scripts and styles.
 * The dev only entries allow hot reload and the analytics debug script.
 * img-src data: allows the inline SVG background on the blog hero.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  `connect-src 'self'${isDev ? ' ws: https://va.vercel-scripts.com' : ''}`,
  "object-src 'none'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  'upgrade-insecure-requests',
].join('; ');

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 86400, // 24 hours
  },
  async headers() {
    return [
      {
        // Not immutable: tracks may be replaced under the same filenames.
        source: '/music/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800' }],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
          // Blocks framing while the CSP (and its frame-ancestors) is report only.
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Content-Security-Policy-Report-Only', value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
