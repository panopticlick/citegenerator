import { describe, expect, it } from "vitest";
import { createApp } from "../app.js";
import { ValidationError } from "../lib/validation/types.js";
import type { CacheStats } from "../services/cache.js";
import type { CircuitBreakerStats } from "../lib/circuit-breaker.js";

const mockCacheStats: CacheStats = { hits: 0, misses: 0, size: 0, hitRate: 0 };

const mockCircuitBreakerStats: CircuitBreakerStats = {
  state: "closed",
  failureCount: 0,
  successCount: 0,
  totalCalls: 0,
  totalFailures: 0,
  totalSuccesses: 0,
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

describe("POST /api/scrape", () => {
  it("rejects invalid body", async () => {
    const app = createApp({ scraper: mockScraper });

    const res = await app.request("http://localhost/api/scrape", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });

    expect(res.status).toBe(400);
    const json = (await res.json()) as unknown as { success: boolean; error: { code: string } };
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("INVALID_REQUEST");
  });

  it("maps ValidationError to URL_BLOCKED/INVALID_URL", async () => {
    const app = createApp({
      scraper: {
        ...mockScraper,
        scrape: async () => {
          throw new ValidationError("Blocked host", "BLOCKED_HOST", "url");
        },
      },
    });

    const res = await app.request("http://localhost/api/scrape", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url: "http://127.0.0.1" }),
    });

    expect(res.status).toBe(400);
    const json = (await res.json()) as unknown as { success: boolean; error: { code: string } };
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("URL_BLOCKED");
  });
});
