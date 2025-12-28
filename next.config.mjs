/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
  // Force webpack builder for Netlify compatibility and clearer error reporting
  webpack: (config) => config
}

export default nextConfig
