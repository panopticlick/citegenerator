import { Hono } from "hono";
import { z } from "zod";
import { ApiError } from "../lib/errors.js";
import { ValidationError } from "../lib/validation/types.js";
import type { ScraperService } from "../services/scraper.js";

const bodySchema = z.object({
  url: z.string().min(1),
});

export function routesScrape(deps: { scraper: ScraperService }) {
  const router = new Hono();

  router.post("/scrape", async (c) => {
    const json = await c.req.json().catch(() => null);
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      throw new ApiError({ status: 400, code: "INVALID_REQUEST", message: "Invalid request body" });
    }

    try {
      const data = await deps.scraper.scrape(parsed.data.url);
      c.header("Cache-Control", "private, max-age=3600");
      return c.json({ success: true as const, data });
    } catch (err) {
      if (err instanceof ValidationError) {
        const code =
          err.code === "BLOCKED_HOST" || err.code === "SSRF_DETECTED"
            ? "URL_BLOCKED"
            : "INVALID_URL";
        throw new ApiError({
          status: 400,
          code,
          message: "Invalid or blocked URL",
          details: err.message,
        });
      }
      throw err;
    }
  });

  return router;
}
