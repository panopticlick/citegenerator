const isProd = process.env.NODE_ENV === "production";

export const env = {
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (isProd ? "https://citegenerator.org" : "http://localhost:3000"),
  apiUrl:
    process.env.NEXT_PUBLIC_API_URL ||
    (isProd ? "https://api.citegenerator.org" : "http://localhost:3020"),
  grammarlyAffiliateUrl: process.env.NEXT_PUBLIC_GRAMMARLY_AFFILIATE_URL || "",
};
