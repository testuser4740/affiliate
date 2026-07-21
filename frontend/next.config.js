/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep the dev server's build cache isolated from `next build` (production)
  // so running a production build never clobbers the running dev server's
  // compiled CSS/Tailwind output (which previously broke styling).
  distDir: process.env.NODE_ENV === "production" ? ".next" : ".next-dev",
  reactStrictMode: true,
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  webpack: (config) => {
    config.resolve.alias['@'] = require('path').join(__dirname, 'src');
    return config;
  }
}
module.exports = nextConfig

