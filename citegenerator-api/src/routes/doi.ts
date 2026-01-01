import { Hono } from "hono";
import { z } from "zod";
import { ApiError } from "../lib/errors.js";
import type { ScraperService } from "../services/scraper.js";

const bodySchema = z.object({
  doi: z.string().min(1, "DOI is required"),
});

export function routesDoi(deps: { scraper: ScraperService }) {
  const router = new Hono();

  router.post("/doi", async (c) => {
    const json = await c.req.json().catch(() => null);
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      throw new ApiError({
        status: 400,
        code: "INVALID_REQUEST",
        message: "Invalid request body",
        details: parsed.error.errors[0]?.message,
      });
    }

    const data = await deps.scraper.scrapeDoi(parsed.data.doi);
    c.header("Cache-Control", "private, max-age=3600");
    return c.json({ success: true as const, data });
  });

  return router;
}
