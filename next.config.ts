import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
