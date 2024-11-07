import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Match all API routes
        destination: 'http://localhost:5001/api/:path*', // Forward to Flask backend
      },
    ];
  },
};

export default nextConfig;
