/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  trailingSlash: false,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ||
      (isProd ? "https://api.citegenerator.org" : "http://localhost:3020"),
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL ||
      (isProd ? "https://citegenerator.org" : "http://localhost:3000"),
    NEXT_PUBLIC_GRAMMARLY_AFFILIATE_URL: process.env.NEXT_PUBLIC_GRAMMARLY_AFFILIATE_URL || "",
  },
};

export default nextConfig;
