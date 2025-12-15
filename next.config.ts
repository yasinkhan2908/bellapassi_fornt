import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  //output: 'export', // tells Next to perform static export
  compress: true,
  reactStrictMode: true,
  distDir: '.next',
  images: {
    domains: ['bellapassi.engineers2.com', 'cdn.yoursite.com'],
    unoptimized: true, // disables /_next/image optimization
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'bellapassiadmin.engineers2.com/',
        port: '8000',
        pathname: '/storage/**',
      },
    ],
  },
  trailingSlash: true, // improves static hosting compatibility
  experimental: {
    forceSwcTransforms: false, // Ensure Babel is used if needed
    optimizeCss: true, // Try enabling this
  },
  async headers() {
    return [
      {
        source: "/img/:all*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
