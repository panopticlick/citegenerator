import type { MiddlewareHandler } from "hono";
import crypto from "node:crypto";

declare module "hono" {
  interface ContextVariableMap {
    requestId: string;
  }
}

export function requestId(): MiddlewareHandler {
  return async (c, next) => {
    const incoming = c.req.header("x-request-id");
    const id = incoming && incoming.trim().length > 0 ? incoming.trim() : crypto.randomUUID();
    c.set("requestId", id);
    c.header("X-Request-ID", id);
    await next();
  };
}
