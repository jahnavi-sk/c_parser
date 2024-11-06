import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true, // Optional, but recommended

  async rewrites() {
    return [
      {
        source: '/api/:path*', // Match all API routes
        destination: 'http://localhost:5000/api/:path*', // Forward to Flask backend
      },
    ];
  },
};

export default nextConfig;
