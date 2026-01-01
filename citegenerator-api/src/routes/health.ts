import { Hono } from "hono";
import type { CacheStats } from "../services/cache.js";
import type { CircuitBreakerStats } from "../lib/circuit-breaker.js";

export function routesHealth(deps: {
  scraper: {
    checkHealth: () => Promise<boolean>;
    getCacheStats?: () => CacheStats;
    getCircuitBreakerStats?: () => CircuitBreakerStats;
  };
}) {
  const router = new Hono();

  const startedAt = Date.now();
  const version = "1.1.0";

  router.get("/health", async (c) => {
    const chrome = await deps.scraper.checkHealth();
    const status = chrome ? "healthy" : "degraded";

    const response: Record<string, unknown> = {
      status,
      timestamp: new Date().toISOString(),
      services: { app: true, chrome },
      version,
      uptime: Math.floor((Date.now() - startedAt) / 1000),
    };

    if (deps.scraper.getCacheStats) {
      const cacheStats = deps.scraper.getCacheStats();
      response.cache = {
        hits: cacheStats.hits,
        misses: cacheStats.misses,
        size: cacheStats.size,
        hitRate: Math.round(cacheStats.hitRate * 1000) / 10 + "%",
      };
    }

    if (deps.scraper.getCircuitBreakerStats) {
      const cbStats = deps.scraper.getCircuitBreakerStats();
      response.circuitBreaker = {
        state: cbStats.state,
        calls: cbStats.totalCalls,
        failures: cbStats.totalFailures,
        successes: cbStats.totalSuccesses,
      };
    }

    c.header("Cache-Control", "no-store");
    return c.json(response);
  });

  return router;
}
