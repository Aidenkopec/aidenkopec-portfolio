import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV !== 'production';

/**
 * Report-only. Flip to Content-Security-Policy once a preview deploy is clean.
 *
 * Both 'unsafe-inline' entries are load bearing and cannot be removed without a
 * nonce minting proxy: next-themes inlines a pre paint theme script, the App
 * Router inlines RSC payload scripts, and styled-jsx plus ~117 style attributes
 * cover style-src. So this is not XSS mitigation. The value is frame-ancestors,
 * object-src, base-uri and form-action.
 *
 * Production needs no external origin: @vercel/analytics is same origin,
 * next/font self hosts, no remote images.
 *
 * img-src data: the blog hero background.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
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

    // No dangerouslyAllowSVG: Next then serves .svg unoptimized, which suits the
    // three local files. contentDispositionType only applied to that proxied path.
  },
  async headers() {
    return [
      {
        // Not immutable: CREDITS.md has these tracks slated for re-sourcing under
        // the same filenames, so a year long immutable cache would strand the old
        // audio on every repeat visitor.
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
          // frame-ancestors will supersede this once the CSP is enforced. While
          // the CSP is report only it reports framing rather than blocking it,
          // so this header is the only thing stopping a clickjacking iframe.
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Content-Security-Policy-Report-Only', value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
