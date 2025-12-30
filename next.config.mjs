// Force webpack and explicitly disable Turbopack across all environments
process.env.NEXT_USE_TURBOPACK = process.env.NEXT_USE_TURBOPACK ?? "0"
process.env.NEXT_DISABLE_TURBOPACK = process.env.NEXT_DISABLE_TURBOPACK ?? "1"
process.env.__NEXT_DISABLE_TURBOPACK = process.env.__NEXT_DISABLE_TURBOPACK ?? "1"

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
  // Force webpack builder for Netlify compatibility and clearer error reporting
  webpack: (config) => config
}

export default nextConfig
