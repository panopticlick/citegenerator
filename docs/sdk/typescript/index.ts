export type CitationStyle = "apa" | "mla" | "chicago" | "harvard";

export interface Author {
  fullName: string;
  firstName?: string;
  lastName?: string;
}

export interface MetadataResult {
  url: string;
  title: string;
  accessDate: string;
  authors: Author[];
  publishedDate?: string;
  modifiedDate?: string;
  publisher?: string;
  siteName?: string;
  description?: string;
  language?: string;
  type?: "article" | "website" | "blog" | "news" | "academic" | "unknown";
  _source?: "json-ld" | "meta-tags" | "og-tags" | "twitter-tags" | "heuristic";
}

export interface FormattedCitation {
  style: CitationStyle;
  html: string;
  text: string;
  bibtex?: string;
}

export type ApiErrorCode =
  | "INVALID_URL"
  | "URL_BLOCKED"
  | "FETCH_FAILED"
  | "TIMEOUT"
  | "METADATA_MISSING"
  | "RATE_LIMITED"
  | "CORS_ERROR"
  | "INVALID_REQUEST"
  | "INTERNAL_ERROR"
  | "PAYLOAD_TOO_LARGE";

export interface ErrorResponse {
  success: false;
  error: { code: ApiErrorCode; message: string; details?: string };
}

export class CiteGeneratorError extends Error {
  public readonly status: number;
  public readonly code: ApiErrorCode | "UNKNOWN_ERROR";
  public readonly details?: string;
  public readonly requestId?: string;

  constructor(opts: {
    status: number;
    code: ApiErrorCode | "UNKNOWN_ERROR";
    message: string;
    details?: string;
    requestId?: string;
  }) {
    super(opts.message);
    this.name = "CiteGeneratorError";
    this.status = opts.status;
    this.code = opts.code;
    this.details = opts.details;
    this.requestId = opts.requestId;
  }
}

type FetchLike = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

function joinUrl(baseUrl: string, path: string) {
  const base = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

async function readJsonSafe(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export function createCiteGeneratorClient(opts: {
  baseUrl: string;
  fetch?: FetchLike;
}) {
  const f = opts.fetch ?? fetch;

  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await f(joinUrl(opts.baseUrl, path), init);
    const requestId = res.headers.get("x-request-id") || undefined;

    if (!res.ok) {
      const json = (await readJsonSafe(res)) as ErrorResponse | null;
      if (
        json &&
        typeof json === "object" &&
        "success" in json &&
        (json as ErrorResponse).success === false
      ) {
        throw new CiteGeneratorError({
          status: res.status,
          code: json.error.code,
          message: json.error.message,
          details: json.error.details,
          requestId,
        });
      }
      throw new CiteGeneratorError({
        status: res.status,
        code: "UNKNOWN_ERROR",
        message: `Request failed (${res.status})`,
        requestId,
      });
    }

    return (await res.json()) as T;
  }

  return {
    health: () =>
      request<{
        status: "healthy" | "degraded";
        timestamp: string;
        services: { app: boolean; chrome: boolean };
        version: string;
        uptime: number;
      }>("/api/health"),

    formats: () =>
      request<{
        formats: Array<{
          id: CitationStyle;
          name: string;
          description: string;
          example: string;
        }>;
      }>("/api/formats"),

    scrape: (body: { url: string }) =>
      request<{ success: true; data: MetadataResult }>("/api/scrape", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      }),

    cite: (body: {
      url: string;
      style?: CitationStyle;
      styles?: CitationStyle[];
    }) =>
      request<{
        success: true;
        data: {
          metadata: MetadataResult;
          citations: Record<string, FormattedCitation>;
        };
      }>("/api/cite", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      }),

    format: (
      body:
        | {
            style: CitationStyle;
            citation: {
              title: string;
              url: string;
              accessDate: string;
              authors?: Author[];
              publishedDate?: string;
              siteName?: string;
              publisher?: string;
            };
          }
        | {
            format: CitationStyle;
            metadata: {
              title: string;
              url: string;
              accessDate: string;
              authors?: Author[];
              publishedDate?: string;
              siteName?: string;
              publisher?: string;
            };
          },
    ) =>
      request<{ success: true; data: FormattedCitation }>("/api/format", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      }),

    track: (body: {
      event: string;
      properties?: Record<string, string | number | boolean>;
      anonymousId?: string;
    }) =>
      request<{ success: true }>("/api/track", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
        keepalive: true,
      }),

    openapi: () => request<Record<string, unknown>>("/api/openapi.json"),
  };
}
