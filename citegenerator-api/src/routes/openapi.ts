import { Hono } from "hono";
import { OPENAPI_SPEC } from "../openapi/spec.js";

export function routesOpenApi() {
  const router = new Hono();

  router.get("/openapi.json", (c) => {
    c.header("Cache-Control", "public, max-age=3600");
    return c.json(OPENAPI_SPEC);
  });

  return router;
}
