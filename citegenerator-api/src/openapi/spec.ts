import type { ApiErrorCode } from "../lib/errors.js";

type CitationStyle = "apa" | "mla" | "chicago" | "harvard";

export const OPENAPI_SPEC = {
  openapi: "3.1.0",
  info: {
    title: "CiteGenerator API",
    version: "1.0.0",
    description:
      "API for scraping metadata and generating formatted citations (APA/MLA/Chicago/Harvard).",
  },
  servers: [
    { url: "https://api.citegenerator.org" },
    { url: "http://localhost:3020", description: "Local dev" },
  ],
  tags: [
    { name: "health" },
    { name: "formats" },
    { name: "scrape" },
    { name: "cite" },
    { name: "format" },
    { name: "analytics" },
    { name: "openapi" },
  ],
  paths: {
    "/api/health": {
      get: {
        tags: ["health"],
        summary: "Health check",
        responses: {
          200: {
            description: "Service health status",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" },
              },
            },
          },
        },
      },
    },
    "/api/formats": {
      get: {
        tags: ["formats"],
        summary: "List supported citation formats",
        responses: {
          200: {
            description: "Supported formats",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/FormatsResponse" },
              },
            },
          },
        },
      },
    },
    "/api/scrape": {
      post: {
        tags: ["scrape"],
        summary: "Scrape metadata from a URL",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ScrapeRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Scraped metadata",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ScrapeResponse" },
              },
            },
          },
          400: { $ref: "#/components/responses/Error400" },
          404: { $ref: "#/components/responses/Error404" },
          413: { $ref: "#/components/responses/Error413" },
          429: { $ref: "#/components/responses/Error429" },
          502: { $ref: "#/components/responses/Error502" },
          504: { $ref: "#/components/responses/Error504" },
        },
      },
    },
    "/api/cite": {
      post: {
        tags: ["cite"],
        summary: "Generate citation(s) from a URL",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CiteRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Metadata + citations",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CiteResponse" },
              },
            },
          },
          400: { $ref: "#/components/responses/Error400" },
          404: { $ref: "#/components/responses/Error404" },
          413: { $ref: "#/components/responses/Error413" },
          429: { $ref: "#/components/responses/Error429" },
          502: { $ref: "#/components/responses/Error502" },
          504: { $ref: "#/components/responses/Error504" },
        },
      },
    },
    "/api/format": {
      post: {
        tags: ["format"],
        summary: "Format an existing metadata object into a citation",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/FormatRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Formatted citation",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/FormatResponse" },
              },
            },
          },
          400: { $ref: "#/components/responses/Error400" },
          413: { $ref: "#/components/responses/Error413" },
          429: { $ref: "#/components/responses/Error429" },
          500: { $ref: "#/components/responses/Error500" },
        },
      },
    },
    "/api/track": {
      post: {
        tags: ["analytics"],
        summary: "Track an analytics event (best-effort)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TrackRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Accepted",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TrackResponse" },
              },
            },
          },
          400: { $ref: "#/components/responses/Error400" },
          413: { $ref: "#/components/responses/Error413" },
          429: { $ref: "#/components/responses/Error429" },
          500: { $ref: "#/components/responses/Error500" },
        },
      },
    },
    "/api/openapi.json": {
      get: {
        tags: ["openapi"],
        summary: "OpenAPI spec",
        responses: {
          200: {
            description: "OpenAPI 3.1 spec JSON",
            content: {
              "application/json": {
                schema: { type: "object" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    responses: {
      Error400: {
        description: "Bad Request",
        content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
      },
      Error404: {
        description: "Not Found",
        content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
      },
      Error413: {
        description: "Payload Too Large",
        content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
      },
      Error429: {
        description: "Too Many Requests",
        content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
      },
      Error500: {
        description: "Internal Server Error",
        content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
      },
      Error502: {
        description: "Bad Gateway",
        content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
      },
      Error504: {
        description: "Gateway Timeout",
        content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
      },
    },
    schemas: {
      CitationStyle: {
        type: "string",
        enum: ["apa", "mla", "chicago", "harvard"],
      },
      ApiErrorCode: {
        type: "string",
        description: "Known API error codes",
        enum: [
          "INVALID_URL",
          "URL_BLOCKED",
          "FETCH_FAILED",
          "TIMEOUT",
          "METADATA_MISSING",
          "RATE_LIMITED",
          "CORS_ERROR",
          "INVALID_REQUEST",
          "INTERNAL_ERROR",
          "PAYLOAD_TOO_LARGE",
        ] satisfies Array<ApiErrorCode | "PAYLOAD_TOO_LARGE">,
      },
      ErrorResponse: {
        type: "object",
        required: ["success", "error"],
        properties: {
          success: { const: false },
          error: {
            type: "object",
            required: ["code", "message"],
            properties: {
              code: { $ref: "#/components/schemas/ApiErrorCode" },
              message: { type: "string" },
              details: { type: "string", nullable: true },
            },
          },
        },
      },
      Author: {
        type: "object",
        required: ["fullName"],
        properties: {
          fullName: { type: "string" },
          firstName: { type: "string" },
          lastName: { type: "string" },
        },
      },
      MetadataResult: {
        type: "object",
        required: ["url", "title", "accessDate", "authors"],
        properties: {
          url: { type: "string" },
          title: { type: "string" },
          accessDate: { type: "string", description: "ISO 8601" },
          authors: { type: "array", items: { $ref: "#/components/schemas/Author" } },
          publishedDate: { type: "string" },
          modifiedDate: { type: "string" },
          publisher: { type: "string" },
          siteName: { type: "string" },
          description: { type: "string" },
          language: { type: "string" },
          type: {
            type: "string",
            enum: ["article", "website", "blog", "news", "academic", "unknown"],
          },
          _source: {
            type: "string",
            enum: ["json-ld", "meta-tags", "og-tags", "twitter-tags", "heuristic"],
          },
        },
      },
      FormattedCitation: {
        type: "object",
        required: ["style", "html", "text"],
        properties: {
          style: { $ref: "#/components/schemas/CitationStyle" },
          html: { type: "string" },
          text: { type: "string" },
          bibtex: { type: "string" },
        },
      },
      HealthResponse: {
        type: "object",
        required: ["status", "timestamp", "services", "version", "uptime"],
        properties: {
          status: { type: "string", enum: ["healthy", "degraded"] },
          timestamp: { type: "string" },
          services: {
            type: "object",
            required: ["app", "chrome"],
            properties: { app: { type: "boolean" }, chrome: { type: "boolean" } },
          },
          version: { type: "string" },
          uptime: { type: "integer" },
        },
      },
      FormatsResponse: {
        type: "object",
        required: ["formats"],
        properties: {
          formats: {
            type: "array",
            items: {
              type: "object",
              required: ["id", "name", "description", "example"],
              properties: {
                id: { $ref: "#/components/schemas/CitationStyle" },
                name: { type: "string" },
                description: { type: "string" },
                example: { type: "string" },
              },
            },
          },
        },
      },
      ScrapeRequest: {
        type: "object",
        required: ["url"],
        properties: { url: { type: "string" } },
      },
      ScrapeResponse: {
        type: "object",
        required: ["success", "data"],
        properties: {
          success: { const: true },
          data: { $ref: "#/components/schemas/MetadataResult" },
        },
      },
      CiteRequest: {
        type: "object",
        required: ["url"],
        properties: {
          url: { type: "string" },
          style: { $ref: "#/components/schemas/CitationStyle" },
          styles: {
            type: "array",
            items: { $ref: "#/components/schemas/CitationStyle" },
            minItems: 1,
            maxItems: 4,
          },
        },
        allOf: [
          {
            not: {
              required: ["style", "styles"],
            },
          },
        ],
      },
      CiteResponse: {
        type: "object",
        required: ["success", "data"],
        properties: {
          success: { const: true },
          data: {
            type: "object",
            required: ["metadata", "citations"],
            properties: {
              metadata: { $ref: "#/components/schemas/MetadataResult" },
              citations: {
                type: "object",
                additionalProperties: { $ref: "#/components/schemas/FormattedCitation" },
              },
            },
          },
        },
      },
      FormatRequest: {
        oneOf: [
          {
            type: "object",
            required: ["citation", "style"],
            properties: {
              style: { $ref: "#/components/schemas/CitationStyle" },
              citation: { $ref: "#/components/schemas/MetadataInput" },
            },
          },
          {
            type: "object",
            required: ["metadata", "format"],
            properties: {
              format: { $ref: "#/components/schemas/CitationStyle" },
              metadata: { $ref: "#/components/schemas/MetadataInput" },
            },
          },
        ],
      },
      MetadataInput: {
        type: "object",
        required: ["title", "url", "accessDate"],
        properties: {
          title: { type: "string" },
          url: { type: "string" },
          accessDate: { type: "string" },
          authors: { type: "array", items: { $ref: "#/components/schemas/Author" } },
          publishedDate: { type: "string" },
          siteName: { type: "string" },
          publisher: { type: "string" },
        },
      },
      FormatResponse: {
        type: "object",
        required: ["success", "data"],
        properties: {
          success: { const: true },
          data: { $ref: "#/components/schemas/FormattedCitation" },
        },
      },
      TrackRequest: {
        type: "object",
        required: ["event"],
        properties: {
          event: { type: "string", minLength: 1, maxLength: 64 },
          anonymousId: { type: "string", minLength: 1, maxLength: 128 },
          properties: {
            type: "object",
            additionalProperties: {
              oneOf: [{ type: "string" }, { type: "number" }, { type: "boolean" }],
            },
          },
        },
      },
      TrackResponse: {
        type: "object",
        required: ["success"],
        properties: { success: { const: true } },
      },
    },
  },
} as const;

export type OpenApiSpec = typeof OPENAPI_SPEC;
export type OpenApiCitationStyle = CitationStyle;
