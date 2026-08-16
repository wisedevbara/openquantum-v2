import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Enable output standalone for Docker optimization
  output: 'standalone',
  // Configure image domains if needed
  images: {
    domains: ['localhost', 'openquantum.id'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['@react-three/fiber', '@react-three/drei', 'three'],
  },
}

export default nextConfig