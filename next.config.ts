import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/auth/verify-email',
        destination: '/verify-email',
        permanent: true,
      },
      {
        source: '/auth/reset-password',
        destination: '/reset-password',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
