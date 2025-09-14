/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@safargo/ui', '@safargo/shared'],
  images: {
    domains: ['images.unsplash.com', 'localhost'],
  },
}