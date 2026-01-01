import type { MiddlewareHandler } from "hono";
import { ApiError } from "../lib/errors.js";

type RateLimitKey = string;

interface Bucket {
  resetAt: number;
  count: number;
}

export interface RateLimiter {
  middleware(): MiddlewareHandler;
  getStats(): RateLimitStats;
}

export interface RateLimitStats {
  totalRequests: number;
  blockedRequests: number;
  activeBuckets: number;
  byEndpoint: Record<string, { requests: number; blocked: number }>;
}

const ENDPOINT_LIMITS: Record<string, number> = {
  "/health": 100,
  "/cite": 30,
  "/scrape": 20,
  "/format": 50,
  "/formats": 100,
  "/track": 100,
  "/metrics": 10,
};

function getEndpointLimit(pathname: string, defaultLimit: number): number {
  for (const [endpoint, limit] of Object.entries(ENDPOINT_LIMITS)) {
    if (pathname.endsWith(endpoint)) {
      return limit;
    }
  }
  return defaultLimit;
}

function getClientIp(req: Request): string {
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) {
    console.log("[RateLimit] Using Cloudflare IP: " + cf);
    return cf;
  }
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const ip = xff.split(",")[0]?.trim() || "unknown";
    console.log("[RateLimit] Using X-Forwarded-For IP: " + ip);
    return ip;
  }
  const xRealIp = req.headers.get("x-real-ip");
  if (xRealIp) {
    console.log("[RateLimit] Using X-Real-IP IP: " + xRealIp);
    return xRealIp;
  }
  console.log("[RateLimit] Using unknown IP (no proxy headers)");
  return "unknown";
}

export function createRateLimiter(): RateLimiter {
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
  const max = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 30);
  const maxBuckets = Number(process.env.RATE_LIMIT_MAX_BUCKETS || 10_000);
  const buckets = new Map<RateLimitKey, Bucket>();
  let lastCleanupAt = 0;

  const stats: RateLimitStats = {
    totalRequests: 0,
    blockedRequests: 0,
    activeBuckets: 0,
    byEndpoint: {},
  };

  return {
    middleware(): MiddlewareHandler {
      return async (c, next) => {
        if (c.req.method === "OPTIONS") return next();

        const url = new URL(c.req.url);
        const pathname = url.pathname;
        const endpointLimit = getEndpointLimit(pathname, max);

        const key = getClientIp(c.req.raw) + ":" + pathname;
        const now = Date.now();

        stats.totalRequests++;
        if (!stats.byEndpoint[pathname]) {
          stats.byEndpoint[pathname] = { requests: 0, blocked: 0 };
        }
        stats.byEndpoint[pathname].requests++;

        if (now - lastCleanupAt > windowMs) {
          for (const [k, b] of buckets) {
            if (now >= b.resetAt) buckets.delete(k);
          }
          lastCleanupAt = now;
        }
        if (buckets.size > maxBuckets) {
          for (const k of buckets.keys()) {
            buckets.delete(k);
            if (buckets.size <= maxBuckets) break;
          }
        }

        const current = buckets.get(key);

        let bucket = current;
        if (!bucket || now >= bucket.resetAt) {
          bucket = { resetAt: now + windowMs, count: 0 };
          buckets.set(key, bucket);
        }

        bucket.count += 1;
        stats.activeBuckets = buckets.size;

        const remaining = Math.max(0, endpointLimit - bucket.count);
        c.header("X-RateLimit-Limit", String(endpointLimit));
        c.header("X-RateLimit-Remaining", String(remaining));
        c.header("X-RateLimit-Reset", String(Math.floor(bucket.resetAt / 1000)));
        c.header("X-RateLimit-Scope", pathname);

        if (bucket.count > endpointLimit) {
          stats.blockedRequests++;
          stats.byEndpoint[pathname].blocked++;
          console.log(
            "[RateLimit] Blocked " +
              pathname +
              " for " +
              getClientIp(c.req.raw) +
              " (limit: " +
              endpointLimit +
              ")",
          );
          throw new ApiError({
            status: 429,
            code: "RATE_LIMITED",
            message: "Too many requests. Please try again shortly.",
          });
        }

        await next();
      };
    },

    getStats(): RateLimitStats {
      return {
        totalRequests: stats.totalRequests,
        blockedRequests: stats.blockedRequests,
        activeBuckets: buckets.size,
        byEndpoint: { ...stats.byEndpoint },
      };
    },
  };
}
