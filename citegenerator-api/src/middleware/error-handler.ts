import type { Context } from "hono";
import { ApiError, toApiError } from "../lib/errors.js";

export function errorHandler(err: unknown, c: Context) {
  const apiError = toApiError(err);
  const requestId = c.get("requestId") as string | undefined;
  type JsonStatus = 400 | 404 | 413 | 429 | 500 | 502 | 504;
  const status = (apiError.status as JsonStatus) || 500;

  const payload = {
    success: false as const,
    error: {
      code: apiError.code,
      message: apiError.message,
      details: apiError.details,
    },
  };

  if (requestId) {
    c.header("X-Request-ID", requestId);
  }

  // Avoid caching errors
  c.header("Cache-Control", "no-store");

  return c.json(payload, status);
}

export function badRequest(message: string, details?: string) {
  return new ApiError({ status: 400, code: "INVALID_REQUEST", message, details });
}
