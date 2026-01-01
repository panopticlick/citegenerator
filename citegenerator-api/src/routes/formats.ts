import { Hono } from "hono";
import { createCitationService } from "../services/citation.js";

export function routesFormats() {
  const router = new Hono();
  const citation = createCitationService();

  router.get("/formats", (c) => {
    c.header("Cache-Control", "public, max-age=3600");
    return c.json({ formats: citation.listFormats() });
  });

  return router;
}
