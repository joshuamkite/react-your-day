import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // comment out basePath for local development
  basePath: '/historical-day',
  images: {
    unoptimized: true,
  },
  // comment out assetPrefix for local development
  assetPrefix: '/historical-day',
};

export default nextConfig;