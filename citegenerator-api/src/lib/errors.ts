export type ApiErrorCode =
  | "INVALID_URL"
  | "URL_BLOCKED"
  | "FETCH_FAILED"
  | "TIMEOUT"
  | "METADATA_MISSING"
  | "RATE_LIMITED"
  | "CORS_ERROR"
  | "INVALID_REQUEST"
  | "INTERNAL_ERROR";

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: ApiErrorCode;
  public readonly details?: string;

  constructor(opts: { status: number; code: ApiErrorCode; message: string; details?: string }) {
    super(opts.message);
    this.name = "ApiError";
    this.status = opts.status;
    this.code = opts.code;
    this.details = opts.details;
  }
}

export function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;
  if (err instanceof Error) {
    return new ApiError({
      status: 500,
      code: "INTERNAL_ERROR",
      message: "Internal server error",
      details: err.message,
    });
  }
  return new ApiError({
    status: 500,
    code: "INTERNAL_ERROR",
    message: "Internal server error",
  });
}
