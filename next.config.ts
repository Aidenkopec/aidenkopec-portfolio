import createMDX from '@next/mdx';
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
 * worker-src blob: canvas-confetti. img-src data: the blog hero background.
 * www.gstatic.com is omitted because no model in public/models declares
 * KHR_draco_mesh_compression, so drei never loads its DRACO decoder. Adding a
 * compressed model requires allowing that origin.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "worker-src 'self' blob:",
  `connect-src 'self'${isDev ? ' ws: https://va.vercel-scripts.com' : ''}`,
  "object-src 'none'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  'upgrade-insecure-requests',
].join('; ');

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  experimental: {
    useCache: true,
  },
  images: {
    minimumCacheTTL: 86400, // 24 hours

    // No dangerouslyAllowSVG: Next then serves .svg unoptimized, which suits the
    // three local files. contentDispositionType only applied to that proxied path.
  },
  async headers() {
    return [
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
          // frame-ancestors supersedes X-Frame-Options, so that header is absent.
          { key: 'Content-Security-Policy-Report-Only', value: csp },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
