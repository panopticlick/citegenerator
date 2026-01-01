import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { bodyLimit } from "hono/body-limit";

import { createRateLimiter } from "./middleware/rate-limit.js";
import { requestId } from "./middleware/request-id.js";
import { securityHeaders } from "./middleware/security-headers.js";
import { errorHandler } from "./middleware/error-handler.js";

import { createScraperService } from "./services/scraper.js";
import { createCitationService } from "./services/citation.js";
import { createAnalyticsService } from "./services/analytics.js";
import { createMetricsRegistry, createMetricsMiddleware } from "./lib/metrics.js";

import { routesHealth } from "./routes/health.js";
import { routesFormats } from "./routes/formats.js";
import { routesScrape } from "./routes/scrape.js";
import { routesFormat } from "./routes/format.js";
import { routesTrack } from "./routes/track.js";
import { routesCite } from "./routes/cite.js";
import { routesOpenApi } from "./routes/openapi.js";
import { routesDoi } from "./routes/doi.js";
import { routesIsbn } from "./routes/isbn.js";

export interface AppDependencies {
  scraper: ReturnType<typeof createScraperService>;
  citation: ReturnType<typeof createCitationService>;
  rateLimit: ReturnType<typeof createRateLimiter>;
  analytics: ReturnType<typeof createAnalyticsService>;
  metrics: ReturnType<typeof createMetricsRegistry>;
}

function parseCorsOrigins(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function checkMetricsAuth(req: Request): boolean {
  const authHeader = req.headers.get("authorization");
  const expectedToken = process.env.METRICS_AUTH_TOKEN;

  if (!expectedToken) return true;
  if (!authHeader) return false;

  const match = authHeader.match(/^Bearer (.+)$/);
  if (!match) return false;

  return match[1] === expectedToken;
}

export function createApp(overrides: Partial<AppDependencies> = {}) {
  const app = new Hono();

  const corsOrigins = parseCorsOrigins(process.env.CORS_ORIGINS);
  const rateLimit = overrides.rateLimit ?? createRateLimiter();
  const scraper = overrides.scraper ?? createScraperService();
  const citation = overrides.citation ?? createCitationService();
  const analytics = overrides.analytics ?? createAnalyticsService();
  const metrics = overrides.metrics ?? createMetricsRegistry();

  app.onError(errorHandler);

  app.use("*", logger());
  app.use("*", requestId());
  app.use("*", securityHeaders());
  app.use("/api/*", createMetricsMiddleware(metrics));

  app.get("/api/metrics", async (c) => {
    if (!checkMetricsAuth(c.req.raw)) {
      c.header("WWW-Authenticate", 'Bearer realm="Metrics"');
      return c.json(
        {
          success: false,
          error: { code: "UNAUTHORIZED", message: "Invalid or missing auth token" },
        },
        401,
      );
    }

    const acceptHeader = c.req.header("accept");
    const rateLimitStats = rateLimit.getStats();
    const cacheStats = scraper.getCacheStats();
    const circuitBreakerStats = scraper.getCircuitBreakerStats();

    if (acceptHeader?.includes("application/json")) {
      return c.json({
        success: true,
        data: {
          metrics: metrics.getSnapshot(),
          rateLimit: rateLimitStats,
          cache: cacheStats,
          circuitBreaker: circuitBreakerStats,
        },
      });
    }

    c.header("Content-Type", "text/plain; version=0.0.4");
    return c.body(metrics.getMetricsText());
  });

  app.use(
    "/api/*",
    bodyLimit({
      maxSize: Number(process.env.API_BODY_MAX_BYTES || 32 * 1024),
      onError: (c) => {
        c.header("Cache-Control", "no-store");
        return c.json(
          {
            success: false as const,
            error: { code: "PAYLOAD_TOO_LARGE", message: "Request body too large" },
          },
          413,
        );
      },
    }),
  );
  app.use(
    "*",
    cors({
      origin: (origin) => {
        if (!origin) return null;
        if (corsOrigins.length === 0) return origin;
        return corsOrigins.includes(origin) ? origin : null;
      },
      allowMethods: ["GET", "POST", "OPTIONS"],
      allowHeaders: ["Content-Type", "X-Request-ID", "Authorization"],
      exposeHeaders: [
        "X-Request-ID",
        "X-RateLimit-Limit",
        "X-RateLimit-Remaining",
        "X-RateLimit-Reset",
        "X-RateLimit-Scope",
      ],
      maxAge: 86400,
      credentials: false,
    }),
  );

  app.use("/api/*", rateLimit.middleware());

  app.route("/api", routesHealth({ scraper }));
  app.route("/api", routesFormats());
  app.route("/api", routesScrape({ scraper }));
  app.route("/api", routesFormat({ citation }));
  app.route("/api", routesCite({ scraper, citation }));
  app.route("/api", routesTrack({ analytics }));
  app.route("/api", routesDoi({ scraper }));
  app.route("/api", routesIsbn({ scraper }));
  app.route("/api", routesOpenApi());

  return app;
}
