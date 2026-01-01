import { Hono } from "hono";
import { z } from "zod";
import type { AnalyticsService } from "../services/analytics.js";

const schema = z.object({
  event: z.string().min(1).max(64),
  properties: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  anonymousId: z.string().min(1).max(128).optional(),
});

export function routesTrack(deps: { analytics: AnalyticsService }) {
  const router = new Hono();

  router.post("/track", async (c) => {
    const json = await c.req.json().catch(() => null);
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return c.json(
        { success: false, error: { code: "INVALID_REQUEST", message: "Invalid request body" } },
        400,
      );
    }

    // Best-effort: never block product flows on analytics.
    // Privacy-preserving: do not log IP or PII; use optional anonymousId for session-ish grouping.
    try {
      const requestId = c.get("requestId") as string | undefined;
      await deps.analytics.track({
        event: parsed.data.event,
        properties: parsed.data.properties,
        anonymousId: parsed.data.anonymousId,
        requestId,
      });
    } catch {
      // ignore
    }
    return c.json({ success: true });
  });

  return router;
}
