import { Hono } from "hono";
import { z } from "zod";
import { ApiError } from "../lib/errors.js";
import type { CitationService } from "../services/citation.js";

const citationInputSchema = z.object({
  title: z.string().min(1),
  url: z.string().min(1),
  accessDate: z.string().min(1),
  authors: z
    .array(
      z.object({
        fullName: z.string().min(1),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      }),
    )
    .optional(),
  publishedDate: z.string().optional(),
  siteName: z.string().optional(),
  publisher: z.string().optional(),
});

const requestSchema = z
  .object({
    // Deployment doc shape
    citation: citationInputSchema.optional(),
    style: z.string().optional(),
    // Blueprint shape
    metadata: citationInputSchema.optional(),
    format: z.string().optional(),
  })
  .refine((v) => (v.citation && v.style) || (v.metadata && v.format), {
    message: "Missing citation/style",
  });

export function routesFormat(deps: { citation: CitationService }) {
  const router = new Hono();

  router.post("/format", async (c) => {
    const json = await c.req.json().catch(() => null);
    const parsed = requestSchema.safeParse(json);
    if (!parsed.success) {
      throw new ApiError({ status: 400, code: "INVALID_REQUEST", message: "Invalid request body" });
    }

    const input = parsed.data.citation ?? parsed.data.metadata;
    const style = parsed.data.style ?? parsed.data.format;
    if (!input || !style) {
      throw new ApiError({ status: 400, code: "INVALID_REQUEST", message: "Invalid request body" });
    }

    const data = deps.citation.format(input, style);
    c.header("Cache-Control", "private, max-age=3600");
    return c.json({ success: true as const, data });
  });

  return router;
}
