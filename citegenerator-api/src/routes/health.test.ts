import { describe, expect, it } from "vitest";
import { createApp } from "../app.js";
import type { CacheStats } from "../services/cache.js";
import type { CircuitBreakerStats } from "../lib/circuit-breaker.js";

const mockCacheStats: CacheStats = { hits: 10, misses: 5, size: 20, hitRate: 0.666 };

const mockCircuitBreakerStats: CircuitBreakerStats = {
  state: "closed",
  failureCount: 2,
  successCount: 98,
  totalCalls: 100,
  totalFailures: 2,
  totalSuccesses: 98,
};

const mockScraper = {
  scrape: async () => ({
    url: "https://example.com",
    title: "Example",
    accessDate: new Date().toISOString(),
    authors: [],
  }),
  checkHealth: async () => true,
  getCacheStats: () => mockCacheStats,
  getCircuitBreakerStats: () => mockCircuitBreakerStats,
};

describe("GET /api/health", () => {
  it("returns healthy status", async () => {
    const app = createApp({ scraper: mockScraper });

    const res = await app.request("http://localhost/api/health");
    expect(res.status).toBe(200);
    const json = (await res.json()) as unknown as {
      status: string;
      services: { chrome: boolean };
      version: string;
      cache?: { hits: number; misses: number; size: number; hitRate: string };
      circuitBreaker?: { state: string; calls: number; failures: number; successes: number };
    };
    expect(json.status).toBe("healthy");
    expect(json.services.chrome).toBe(true);
    expect(json.version).toBe("1.1.0");
    expect(json.cache).toEqual({ hits: 10, misses: 5, size: 20, hitRate: "66.6%" });
    expect(json.circuitBreaker).toEqual({
      state: "closed",
      calls: 100,
      failures: 2,
      successes: 98,
    });
  });

  it("returns degraded when chrome is down", async () => {
    const app = createApp({
      scraper: {
        ...mockScraper,
        checkHealth: async () => false,
      },
    });

    const res = await app.request("http://localhost/api/health");
    expect(res.status).toBe(200);
    const json = (await res.json()) as unknown as { status: string; services: { chrome: boolean } };
    expect(json.status).toBe("degraded");
    expect(json.services.chrome).toBe(false);
  });
});
