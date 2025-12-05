import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      // For URLs like: https://ibb.co.com/...
      {
        protocol: 'https',
        hostname: 'ibb.co.com',
        pathname: '/**',
      },
      // For URLs like: https://i.ibb.co.com/... (with the extra .com)
      {
        protocol: 'https',
        hostname: 'i.ibb.co.com',
        pathname: '/**',
      },
      // For URLs like: https://i.ibb.co/... (without .com)
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        pathname: '/**',
      },
      // For any subdomain of ibb.co
      {
        protocol: 'https',
        hostname: '*.ibb.co',
        pathname: '/**',
      },
      // Other image hosts
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // Local development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
    // Optional: Add these for better error handling
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;