import { Hono } from "hono";
import { z } from "zod";
import { ApiError } from "../lib/errors.js";
import type { CitationService } from "../services/citation.js";
import type { ScraperService } from "../services/scraper.js";

const styleSchema = z.enum(["apa", "mla", "chicago", "harvard"]);

const requestSchema = z
  .object({
    url: z.string().min(1),
    style: styleSchema.optional(),
    styles: z.array(styleSchema).min(1).max(4).optional(),
  })
  .refine((v) => !(v.style && v.styles), {
    message: "Use either style or styles (not both)",
  });

export function routesCite(deps: { scraper: ScraperService; citation: CitationService }) {
  const router = new Hono();

  router.post("/cite", async (c) => {
    const json = await c.req.json().catch(() => null);
    const parsed = requestSchema.safeParse(json);
    if (!parsed.success) {
      throw new ApiError({ status: 400, code: "INVALID_REQUEST", message: "Invalid request body" });
    }

    const styles = parsed.data.styles ?? (parsed.data.style ? [parsed.data.style] : ["apa"]);

    const metadata = await deps.scraper.scrape(parsed.data.url);
    const citations = Object.fromEntries(
      styles.map((s) => [s, deps.citation.format(metadata, s)]),
    ) as Record<z.infer<typeof styleSchema>, ReturnType<CitationService["format"]>>;

    c.header("Cache-Control", "private, max-age=3600");
    return c.json({ success: true as const, data: { metadata, citations } });
  });

  return router;
}
