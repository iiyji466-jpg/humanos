/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: { allowedOrigins: ["*"] } },
  images: { domains: ["avatars.githubusercontent.com", "lh3.googleusercontent.com"] },
}
module.exports = nextConfig
