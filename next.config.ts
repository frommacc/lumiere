import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        hostname: 'images.unsplash.com',
      },
      {
        hostname: 'lh3.googleusercontent.com',
      },
      {
        hostname: 'res.cloudinary.com',
      },
    ],
  },
}

export default nextConfig
