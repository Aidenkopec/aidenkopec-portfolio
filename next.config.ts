import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    useCache: true, // Enable 'use cache' directive for Next.js 15.4.6
  },
  images: {
    // Enable modern image formats for better compression
    formats: ['image/webp', 'image/avif'],

    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],

    // Image sizes for different use cases
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Minimum cache TTL for optimized images (in seconds)
    minimumCacheTTL: 86400, // 24 hours

    // Enable SVG support with security measures
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
