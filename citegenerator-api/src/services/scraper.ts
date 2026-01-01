import { LRUCache } from "lru-cache";
import { ApiError } from "../lib/errors.js";
import { validatePublicHttpUrl } from "../lib/validation/url.js";
import {
  scrapeMetadata,
  checkBrowserHealth,
  scrapeDoi,
  scrapeIsbn,
  ScraperError,
} from "../lib/scraper/index.js";
import { createTieredCache, createCacheKey, type CacheStats } from "./cache.js";
import { createCircuitBreaker, type CircuitBreakerStats } from "../lib/circuit-breaker.js";
import type { MetadataResult } from "../lib/scraper/types.js";

export interface ScraperService {
  scrape(url: string): Promise<MetadataResult>;
  scrapeDoi(doi: string): Promise<MetadataResult>;
  scrapeIsbn(isbn: string): Promise<MetadataResult>;
  checkHealth(): Promise<boolean>;
  getCacheStats(): CacheStats;
  getCircuitBreakerStats(): CircuitBreakerStats;
}

export function createScraperService(): ScraperService {
  const ttl = Number(process.env.SCRAPE_CACHE_TTL_MS || 3_600_000);
  const legacyCache = new LRUCache<string, MetadataResult>({
    max: 500,
    ttl,
  });

  const cache = createTieredCache({
    l1MaxItems: 100,
    l1TtlMs: 5 * 60 * 1000,
    l2Enabled: process.env.REDIS_URL !== undefined,
    l2RedisUrl: process.env.REDIS_URL,
  });

  const circuitBreaker = createCircuitBreaker(
    "scraper",
    {
      failureThreshold: Number(process.env.CIRCUIT_FAILURE_THRESHOLD || 5),
      successThreshold: Number(process.env.CIRCUIT_SUCCESS_THRESHOLD || 2),
      timeoutMs: Number(process.env.CIRCUIT_TIMEOUT_MS || 60_000),
    },
    {
      onError: (err) => console.error("[Scraper] Circuit breaker error:", err.message),
    },
  );

  return {
    async scrape(urlString: string) {
      const url = await validatePublicHttpUrl(urlString);
      const normalized = url.toString();
      const cacheKey = createCacheKey(["scrape", normalized], "scraper");

      const cached = await cache.get<MetadataResult>(cacheKey);
      if (cached) {
        console.log("[Scraper] Cache hit for: " + normalized);
        return cached;
      }

      const data = await circuitBreaker.execute(async () => {
        try {
          const result = await scrapeMetadata(normalized);
          await cache.set(cacheKey, result, ttl);
          return result;
        } catch (err) {
          if (isScraperError(err)) {
            const code = err.code;
            if (code === "PAGE_NOT_FOUND") {
              throw new ApiError({ status: 404, code: "FETCH_FAILED", message: "Page not found" });
            }
            if (code === "PAGE_LOAD_TIMEOUT") {
              throw new ApiError({
                status: 504,
                code: "TIMEOUT",
                message: "Page load timed out",
                details: "Connection timed out after 30 seconds",
              });
            }
          }
          throw new ApiError({
            status: 502,
            code: "FETCH_FAILED",
            message: "Unable to load the requested URL",
            details: err instanceof Error ? err.message : undefined,
          });
        }
      });

      return data;
    },

    async checkHealth() {
      return checkBrowserHealth();
    },

    async scrapeDoi(doi: string) {
      const cacheKey = createCacheKey(["doi", doi], "scraper");

      const cached = await cache.get<MetadataResult>(cacheKey);
      if (cached) {
        console.log("[Scraper] DOI cache hit for: " + doi);
        return cached;
      }

      try {
        const result = await scrapeDoi(doi);
        await cache.set(cacheKey, result, ttl);
        return result;
      } catch (err) {
        if (err instanceof ScraperError) {
          if (err.code === "PAGE_NOT_FOUND") {
            throw new ApiError({ status: 404, code: "FETCH_FAILED", message: "DOI not found" });
          }
          if (err.code === "INVALID_URL") {
            throw new ApiError({
              status: 400,
              code: "INVALID_REQUEST",
              message: "Invalid DOI format",
              details: err.message,
            });
          }
        }
        throw new ApiError({
          status: 502,
          code: "FETCH_FAILED",
          message: "Unable to fetch DOI metadata",
          details: err instanceof Error ? err.message : undefined,
        });
      }
    },

    async scrapeIsbn(isbn: string) {
      const cacheKey = createCacheKey(["isbn", isbn], "scraper");

      const cached = await cache.get<MetadataResult>(cacheKey);
      if (cached) {
        console.log("[Scraper] ISBN cache hit for: " + isbn);
        return cached;
      }

      try {
        const result = await scrapeIsbn(isbn);
        await cache.set(cacheKey, result, ttl);
        return result;
      } catch (err) {
        if (err instanceof ScraperError) {
          if (err.code === "PAGE_NOT_FOUND") {
            throw new ApiError({ status: 404, code: "FETCH_FAILED", message: "ISBN not found" });
          }
          if (err.code === "INVALID_URL") {
            throw new ApiError({
              status: 400,
              code: "INVALID_REQUEST",
              message: "Invalid ISBN format",
              details: err.message,
            });
          }
        }
        throw new ApiError({
          status: 502,
          code: "FETCH_FAILED",
          message: "Unable to fetch ISBN metadata",
          details: err instanceof Error ? err.message : undefined,
        });
      }
    },

    getCacheStats() {
      return cache.getStats();
    },

    getCircuitBreakerStats() {
      return circuitBreaker.getStats();
    },
  };
}

function isScraperError(err: unknown): err is Error & { code: string } {
  return err instanceof Error && typeof (err as { code?: unknown }).code === "string";
}
