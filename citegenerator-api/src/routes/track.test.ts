import { describe, expect, it, vi } from "vitest";
import { createApp } from "../app.js";
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

describe("POST /api/track", () => {
  it("rejects invalid body", async () => {
    const app = createApp({ scraper: mockScraper });
    const res = await app.request("http://localhost/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
    const json = (await res.json()) as unknown as { success: boolean };
    expect(json.success).toBe(false);
  });

  it("forwards events to analytics service (best-effort)", async () => {
    const track = vi.fn(async (opts: unknown) => {
      void opts;
    });
    const app = createApp({
      analytics: { track },
      scraper: mockScraper,
    });

    const res = await app.request("http://localhost/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        event: "test_event",
        properties: { style: "apa", ok: true },
        anonymousId: "anon_123",
      }),
    });
    expect(res.status).toBe(200);
    const json = (await res.json()) as unknown as { success: boolean };
    expect(json.success).toBe(true);

    expect(track).toHaveBeenCalledTimes(1);
    expect(track.mock.calls[0]?.[0]).toMatchObject({
      event: "test_event",
      anonymousId: "anon_123",
    });
  });
});
