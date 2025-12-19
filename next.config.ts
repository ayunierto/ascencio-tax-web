import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Transpile the local shared package so Next can handle its TypeScript sources
  transpilePackages: ['@ascencio/shared'],
};

export default nextConfig;
