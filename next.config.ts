import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: false,
  images: {
    qualities: [70, 75, 80],
  },
}

export default nextConfig
