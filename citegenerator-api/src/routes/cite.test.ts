import { describe, expect, it } from "vitest";
import { createApp } from "../app.js";
import { createCitationService } from "../services/citation.js";
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

describe("POST /api/cite", () => {
  it("generates metadata + a single citation style", async () => {
    const app = createApp({
      citation: createCitationService(),
      scraper: {
        scrape: async () => ({
          url: "https://example.com",
          title: "Example",
          accessDate: "2024-03-15T10:00:00Z",
          authors: [{ fullName: "John Smith", firstName: "John", lastName: "Smith" }],
          publishedDate: "2024-01-10T00:00:00Z",
          siteName: "Example",
        }),
        checkHealth: async () => true,
        getCacheStats: () => mockCacheStats,
        getCircuitBreakerStats: () => mockCircuitBreakerStats,
      },
    });

    const res = await app.request("http://localhost/api/cite", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url: "https://example.com", style: "apa" }),
    });

    expect(res.status).toBe(200);
    const json = (await res.json()) as unknown as {
      success: boolean;
      data: {
        metadata: { title: string };
        citations: Record<string, { style: string; text: string }>;
      };
    };
    expect(json.success).toBe(true);
    expect(json.data.metadata.title).toBe("Example");
    expect(json.data.citations.apa.style).toBe("apa");
    expect(json.data.citations.apa.text).toContain("Smith");
  });

  it("supports generating multiple styles", async () => {
    const app = createApp({
      citation: createCitationService(),
      scraper: {
        scrape: async () => ({
          url: "https://example.com",
          title: "Example",
          accessDate: "2024-03-15T10:00:00Z",
          authors: [],
        }),
        checkHealth: async () => true,
        getCacheStats: () => mockCacheStats,
        getCircuitBreakerStats: () => mockCircuitBreakerStats,
      },
    });

    const res = await app.request("http://localhost/api/cite", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url: "https://example.com", styles: ["mla", "chicago"] }),
    });

    expect(res.status).toBe(200);
    const json = (await res.json()) as unknown as {
      success: boolean;
      data: { citations: Record<string, { style: string }> };
    };
    expect(json.success).toBe(true);
    expect(Object.keys(json.data.citations)).toEqual(["mla", "chicago"]);
  });

  it("supports generating all four styles in parallel", async () => {
    const app = createApp({
      citation: createCitationService(),
      scraper: {
        scrape: async () => ({
          url: "https://example.com/article",
          title: "Test Article",
          accessDate: "2024-03-15T10:00:00Z",
          authors: [{ fullName: "Jane Doe", firstName: "Jane", lastName: "Doe" }],
        }),
        checkHealth: async () => true,
        getCacheStats: () => mockCacheStats,
        getCircuitBreakerStats: () => mockCircuitBreakerStats,
      },
    });

    const res = await app.request("http://localhost/api/cite", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        url: "https://example.com/article",
        styles: ["apa", "mla", "chicago", "harvard"],
      }),
    });

    expect(res.status).toBe(200);
    const json = (await res.json()) as unknown as {
      success: boolean;
      data: { citations: Record<string, { style: string }> };
    };
    expect(json.success).toBe(true);
    expect(Object.keys(json.data.citations)).toEqual(["apa", "mla", "chicago", "harvard"]);
  });

  it("rejects requests with both style and styles", async () => {
    const app = createApp({
      citation: createCitationService(),
      scraper: {
        scrape: async () => ({
          url: "https://example.com",
          title: "Example",
          accessDate: "2024-03-15T10:00:00Z",
          authors: [],
        }),
        checkHealth: async () => true,
        getCacheStats: () => mockCacheStats,
        getCircuitBreakerStats: () => mockCircuitBreakerStats,
      },
    });

    const res = await app.request("http://localhost/api/cite", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url: "https://example.com", style: "apa", styles: ["mla"] }),
    });

    expect(res.status).toBe(400);
    const json = (await res.json()) as unknown as { success: boolean; error: { code: string } };
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("INVALID_REQUEST");
  });
});
