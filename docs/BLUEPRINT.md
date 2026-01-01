# CiteGenerator.org - Master Architecture Blueprint

**Version:** 1.0.0
**Last Updated:** 2025-12-31
**Status:** Production-Ready Design
**Domain:** https://citegenerator.org

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture](#2-system-architecture)
3. [Container Topology](#3-container-topology)
4. [Data Flow](#4-data-flow)
5. [API Contracts](#5-api-contracts)
6. [Security Model](#6-security-model)
7. [Performance Targets](#7-performance-targets)
8. [Integration Points](#8-integration-points)
9. [Error Handling Strategy](#9-error-handling-strategy)
10. [Monitoring & Observability](#10-monitoring--observability)

---

## 1. Executive Summary

### 1.1 Project Vision

CiteGenerator.org is a free, fast citation generator that transforms any URL into properly formatted academic citations. The MVP focuses on APA and MLA formats with a clean, ad-supported monetization model.

### 1.2 Core Value Proposition

| Aspect           | Description                                      |
| ---------------- | ------------------------------------------------ |
| **What**         | Free citation generator for APA/MLA formats      |
| **Why**          | Existing tools are cluttered, slow, or paywalled |
| **For Whom**     | Students, researchers, content writers           |
| **Monetization** | Affiliate ads (Grammarly, writing tools)         |

### 1.3 Core User Flow

```
[User] --> [Enter URL] --> [Scrape Metadata] --> [Format Citation] --> [Copy to Clipboard]
                                   |
                                   v
                          [Title, Author, Date, Publisher]
                                   |
                                   v
                          [citation-js formatting]
                                   |
                                   v
                          [APA/MLA output + Affiliate Ads]
```

### 1.4 Tech Stack Summary

| Layer     | Technology         | Version     | Purpose                           |
| --------- | ------------------ | ----------- | --------------------------------- |
| Frontend  | Next.js            | 14.x        | Static export, React components   |
| Hosting   | Cloudflare Pages   | -           | Global CDN, edge deployment       |
| API       | Hono               | Latest      | Lightweight Node.js API server    |
| Runtime   | Node.js            | 20 (Alpine) | API server runtime                |
| UI        | Tailwind CSS       | 3.x         | Styling, responsive design        |
| Scraping  | puppeteer-core     | Latest      | Metadata extraction via connect() |
| Chrome    | browserless/chrome | 1.61.1      | Headless Chrome container         |
| Citations | citation-js        | Latest      | Citation formatting (server-side) |
| Container | Docker Compose     | Latest      | API service orchestration         |
| Proxy     | nginx-proxy        | Latest      | SSL termination, API routing      |

---

## 2. System Architecture

### 2.1 Architecture Diagram

```
                                         INTERNET
                                             |
              +------------------------------+------------------------------+
              |                                                             |
              v                                                             v
+================================+                         +================================+
|      CLOUDFLARE PAGES          |                         |    VPS 107.174.42.198          |
|      citegenerator.org         |                         |    api.citegenerator.org       |
+================================+                         +================================+
|                                |                         |                                |
|   Global CDN Edge Network      |    HTTPS API Calls      |      NGINX-PROXY LAYER         |
|   ┌────────────────────────┐   |   ─────────────────►    |   (SSL, Rate Limiting)         |
|   │   Static Frontend      │   |                         |                                |
|   │   (Next.js Export)     │   |                         +================================+
|   │                        │   |                                        |
|   │  ┌──────────────────┐  │   |                                        v
|   │  │  /               │  │   |                         +================================+
|   │  │  Homepage        │  │   |                         |   CITEGENERATOR-API CONTAINER  |
|   │  │  - URL input     │  │   |                         |   (Hono + Node.js)             |
|   │  │  - Format select │  │   |                         +================================+
|   │  │  - Citation view │  │   |                         |                                |
|   │  └──────────────────┘  │   |                         |   ┌────────────────────────┐   |
|   │  ┌──────────────────┐  │   |                         |   │     API ROUTES         │   |
|   │  │  /about          │  │   |                         |   │  POST /api/scrape      │   |
|   │  │  /faq            │  │   |                         |   │  POST /api/format      │   |
|   │  └──────────────────┘  │   |                         |   │  GET  /api/health      │   |
|   └────────────────────────┘   |                         |   └───────────┬────────────┘   |
|                                |                         |               │                |
|   Features:                    |                         |   ┌───────────▼────────────┐   |
|   - Instant global delivery    |                         |   │   SERVICE LAYER        │   |
|   - DDoS protection            |                         |   │  - ScraperService      │   |
|   - Automatic SSL              |                         |   │  - CitationService     │   |
|   - Zero server cost           |                         |   │  - ValidationService   │   |
|                                |                         |   └───────────┬────────────┘   |
+================================+                         |               │                |
                                                           |        :3000  │                |
                                                           +===============|================+
                                                                           |
                                                                           | WebSocket
                                                                           v
                                                           +================================+
                                                           |   CHROME-HEADLESS CONTAINER    |
                                                           |   browserless/chrome:1.61.1    |
                                                           +================================+
                                                           |                                |
                                                           |   ┌────────────────────────┐   |
                                                           |   │   Chrome Process       │   |
                                                           |   │   - MAX_CONCURRENT=5   │   |
                                                           |   │   - PREBOOT_CHROME     │   |
                                                           |   │   - Stealth mode       │   |
                                                           |   └───────────┬────────────┘   |
                                                           |               │                |
                                                           |        :3000  │ (internal)     |
                                                           +===============|================+
                                                                           |
                                                                           | HTTP requests
                                                                           v
                                                           +================================+
                                                           |      EXTERNAL WEBSITES         |
                                                           |   - News articles              |
                                                           |   - Blog posts                 |
                                                           |   - Academic papers            |
                                                           +================================+
```

### 2.2 Key Design Decisions

| Decision         | Choice                         | Rationale                                                  |
| ---------------- | ------------------------------ | ---------------------------------------------------------- |
| Split Deployment | Cloudflare Pages + VPS API     | CDN for frontend, reduced server load, global distribution |
| API Framework    | Hono                           | Lightweight, fast, excellent TypeScript support            |
| Frontend Export  | Next.js static export          | Full React features, Cloudflare Pages compatible           |
| Chrome Runtime   | Separate browserless container | Memory isolation, restart independence, proven stability   |
| Puppeteer Mode   | `connect()` not `launch()`     | Shared browser pool, faster cold starts                    |
| Citation Library | citation-js (server-side)      | Smaller bundle, faster client, security                    |
| Styling          | Tailwind CSS                   | Rapid prototyping, small bundle size                       |

---

## 3. Container Topology

> **Note:** Only the API backend runs on VPS. The frontend is hosted on Cloudflare Pages.

### 3.1 Docker Compose Configuration (API Only)

```yaml
# /opt/docker-projects/standalone-apps/citegenerator/docker-compose.yml
version: "3.8"

services:
  # ===================
  # Hono API Server
  # ===================
  citegenerator-api:
    build:
      context: ./api
      dockerfile: Dockerfile
    image: citegenerator-api:1.0.0
    container_name: citegenerator-api
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - CHROME_WS_ENDPOINT=ws://chrome-headless:3000
      - VIRTUAL_HOST=api.citegenerator.org
      - LETSENCRYPT_HOST=api.citegenerator.org
      - LETSENCRYPT_EMAIL=admin@expertbeacon.com
      - CORS_ORIGINS=https://citegenerator.org,https://www.citegenerator.org
    ports:
      - "127.0.0.1:3020:3000"
    networks:
      - proxy-tier
      - internal
    depends_on:
      chrome-headless:
        condition: service_healthy
    deploy:
      resources:
        limits:
          memory: 256M
        reservations:
          memory: 128M
    healthcheck:
      test:
        ["CMD", "wget", "-q", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s

  # ===================
  # Browserless Chrome
  # ===================
  chrome-headless:
    image: browserless/chrome:1.61.1-puppeteer-21.4.1
    container_name: citegenerator-chrome
    restart: unless-stopped
    environment:
      - MAX_CONCURRENT_SESSIONS=5
      - MAX_QUEUE_LENGTH=10
      - DEFAULT_BLOCK_ADS=true
      - DEFAULT_STEALTH=true
      - PREBOOT_CHROME=true
      - KEEP_ALIVE=true
      - DEFAULT_TIMEOUT=30000
      - CONNECTION_TIMEOUT=60000
    ports:
      - "127.0.0.1:3021:3000"
    networks:
      - internal
    deploy:
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G
    shm_size: "1gb"
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 20s

networks:
  proxy-tier:
    external: true
    name: nginx-proxy_default
  internal:
    driver: bridge
```

### 3.2 API Dockerfile

```dockerfile
# /opt/docker-projects/standalone-apps/citegenerator/api/Dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Build the application
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/dist ./dist
COPY --from=builder --chown=hono:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=hono:nodejs /app/package.json ./

USER hono

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

### 3.3 Resource Allocation

| Service           | Memory Limit | Memory Reserved | Purpose                         |
| ----------------- | ------------ | --------------- | ------------------------------- |
| citegenerator-api | 256MB        | 128MB           | Hono API, citation processing   |
| chrome-headless   | 2GB          | 1GB             | Headless Chrome, page rendering |
| **Total (VPS)**   | **2.25GB**   | **1.125GB**     | Reduced load vs full-stack      |
| Frontend (CDN)    | 0            | 0               | Hosted on Cloudflare Pages      |

### 3.4 Port Mapping

| Service           | Internal Port | External Port          | Protocol   |
| ----------------- | ------------- | ---------------------- | ---------- |
| citegenerator-api | 3000          | 3020 (via nginx-proxy) | HTTP       |
| chrome-headless   | 3000          | 3021 (internal only)   | WS/HTTP    |
| nginx-proxy       | -             | 443/80                 | HTTPS/HTTP |

### 3.5 Domain Configuration

| Domain                | Target             | Purpose        |
| --------------------- | ------------------ | -------------- |
| citegenerator.org     | Cloudflare Pages   | Frontend (CDN) |
| www.citegenerator.org | Cloudflare Pages   | Frontend (CDN) |
| api.citegenerator.org | VPS 107.174.42.198 | API backend    |

---

## 4. Data Flow

### 4.1 Citation Request Lifecycle (Split Architecture)

```
CITATION REQUEST FLOW (Cloudflare Pages + VPS API)
==================================================

+------------------+     +------------------+     +------------------+     +------------------+
|   CLOUDFLARE     |     |   VPS API        |     | CHROME-HEADLESS  |     | EXTERNAL         |
|   PAGES (CDN)    |     |   Hono Server    |     | browserless      |     | WEBSITES         |
+--------+---------+     +--------+---------+     +--------+---------+     +--------+---------+
         |                        |                        |                        |
         | User enters URL        |                        |                        |
         | in React form          |                        |                        |
         |                        |                        |                        |
         | 1. POST api.citegenerator.org/api/scrape        |                        |
         | {url} + CORS headers   |                        |                        |
         +----------------------->|                        |                        |
         |                        |                        |                        |
         |                        | 2. Validate URL        |                        |
         |                        | - CORS check           |                        |
         |                        | - Blocklist check      |                        |
         |                        |                        |                        |
         |                        | 3. Connect to Chrome   |                        |
         |                        | puppeteer.connect()    |                        |
         |                        +----------------------->|                        |
         |                        |                        |                        |
         |                        |<-----------------------+                        |
         |                        | 4. WebSocket connected |                        |
         |                        |                        |                        |
         |                        | 5. page.goto(url)      |                        |
         |                        +----------------------->+----------------------->|
         |                        |                        |                        |
         |                        |                        | 6. Fetch & render      |
         |                        |                        |<-----------------------+
         |                        |<-----------------------+                        |
         |                        | 7. Return metadata     |                        |
         |                        |                        |                        |
         | 8. Return scraped data |                        |                        |
         | {title, author, ...}   |                        |                        |
         |<-----------------------+                        |                        |
         |                        |                        |                        |
         | 9. POST api.citegenerator.org/api/format        |                        |
         | {metadata, format}     |                        |                        |
         +----------------------->|                        |                        |
         |                        |                        |                        |
         |                        | 10. citation-js        |                        |
         |                        | format citation        |                        |
         |                        |                        |                        |
         | 11. Return citation    |                        |                        |
         | {citation string}      |                        |                        |
         |<-----------------------+                        |                        |
         |                        |                        |                        |
         | 12. Display to user    |                        |                        |
         | + Copy to clipboard    |                        |                        |
         |                        |                        |                        |
+--------+---------+     +--------+---------+     +--------+---------+     +--------+---------+
```

### 4.2 Metadata Extraction Strategy

```typescript
// Priority order for metadata extraction
interface MetadataSource {
  title: ["og:title", "twitter:title", 'meta[name="title"]', "h1", "title"];
  author: [
    'meta[name="author"]',
    'meta[property="article:author"]',
    '[rel="author"]',
    ".author-name",
    ".byline",
  ];
  date: [
    'meta[property="article:published_time"]',
    'meta[name="date"]',
    "time[datetime]",
    'meta[name="DC.date.issued"]',
    ".publish-date",
  ];
  publisher: [
    'meta[property="og:site_name"]',
    'meta[name="publisher"]',
    ".publisher-name",
    // Fallback: extract from URL domain
  ];
}
```

### 4.3 Citation Output Example

**Input URL:** `https://www.nytimes.com/2025/01/15/technology/ai-advances.html`

**Extracted Metadata:**

```json
{
  "title": "New AI Advances Transform Industry",
  "author": "Jane Smith",
  "date": "2025-01-15",
  "publisher": "The New York Times",
  "url": "https://www.nytimes.com/2025/01/15/technology/ai-advances.html",
  "accessDate": "2025-12-31"
}
```

**APA Format Output:**

```
Smith, J. (2025, January 15). New AI Advances Transform Industry. The New York Times. https://www.nytimes.com/2025/01/15/technology/ai-advances.html
```

**MLA Format Output:**

```
Smith, Jane. "New AI Advances Transform Industry." The New York Times, 15 Jan. 2025, www.nytimes.com/2025/01/15/technology/ai-advances.html.
```

---

## 5. API Contracts

> **Base URL:** `https://api.citegenerator.org` > **CORS:** Enabled for `citegenerator.org` and `www.citegenerator.org`

### 5.1 POST /api/scrape

**Description:** Scrape metadata from a URL using headless Chrome.

**Request:**

```typescript
// POST https://api.citegenerator.org/api/scrape
// Content-Type: application/json

interface ScrapeRequest {
  url: string;  // Required: URL to scrape
}

// Example
{
  "url": "https://example.com/article"
}
```

**Success Response (200):**

```typescript
interface ScrapeResponse {
  success: true;
  data: {
    title: string;
    author: string | null;
    date: string | null;
    publisher: string | null;
    url: string;
    accessDate: string;  // ISO date of access
  };
}

// Example
{
  "success": true,
  "data": {
    "title": "Article Title",
    "author": "John Smith",
    "date": "2025-01-15",
    "publisher": "Example Publisher",
    "url": "https://example.com/article",
    "accessDate": "2025-12-31"
  }
}
```

### 5.2 POST /api/format

**Description:** Format metadata into a citation string.

**Request:**

```typescript
// POST https://api.citegenerator.org/api/format
// Content-Type: application/json

interface FormatRequest {
  metadata: {
    title: string;
    author?: string | null;
    date?: string | null;
    publisher?: string | null;
    url: string;
    accessDate: string;
  };
  format: 'apa' | 'mla';
}

// Example
{
  "metadata": {
    "title": "Article Title",
    "author": "John Smith",
    "date": "2025-01-15",
    "publisher": "Example Publisher",
    "url": "https://example.com/article",
    "accessDate": "2025-12-31"
  },
  "format": "apa"
}
```

**Success Response (200):**

```typescript
interface FormatResponse {
  success: true;
  citation: string;
  format: 'apa' | 'mla';
}

// Example
{
  "success": true,
  "citation": "Smith, J. (2025, January 15). Article Title. Example Publisher. https://example.com/article",
  "format": "apa"
}
```

### 5.3 Error Response (All Endpoints)

```typescript
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;        // Machine-readable error code
    message: string;     // Human-readable message
    details?: string;    // Additional context (non-sensitive)
  };
}

// Error codes
type ErrorCode =
  | 'INVALID_URL'        // URL failed validation
  | 'URL_BLOCKED'        // URL on blocklist
  | 'FETCH_FAILED'       // Could not load page
  | 'TIMEOUT'            // Page load timeout
  | 'METADATA_MISSING'   // Insufficient metadata
  | 'RATE_LIMITED'       // Too many requests
  | 'CORS_ERROR'         // Origin not allowed
  | 'INTERNAL_ERROR';    // Server error

// Example
{
  "success": false,
  "error": {
    "code": "FETCH_FAILED",
    "message": "Unable to load the requested URL",
    "details": "Connection timed out after 30 seconds"
  }
}
```

### 5.4 GET /api/health

**Description:** Health check endpoint for monitoring.

**Response (200):**

```typescript
interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    app: boolean;
    chrome: boolean;
  };
  version: string;
  uptime: number;        // Seconds
}

// Example
{
  "status": "healthy",
  "timestamp": "2025-12-31T10:00:00Z",
  "services": {
    "app": true,
    "chrome": true
  },
  "version": "1.0.0",
  "uptime": 86400
}
```

### 5.5 GET /api/formats

**Description:** List available citation formats.

**Response (200):**

```typescript
interface FormatsResponse {
  formats: Array<{
    id: string;
    name: string;
    description: string;
    example: string;
  }>;
}

// Example
{
  "formats": [
    {
      "id": "apa",
      "name": "APA 7th Edition",
      "description": "American Psychological Association, 7th edition",
      "example": "Author, A. A. (Year). Title. Publisher. URL"
    },
    {
      "id": "mla",
      "name": "MLA 9th Edition",
      "description": "Modern Language Association, 9th edition",
      "example": "Author. \"Title.\" Publisher, Date, URL."
    }
  ]
}
```

### 5.6 Request/Response Headers

**Request Headers:**

```http
Content-Type: application/json
Accept: application/json
Origin: https://citegenerator.org
X-Request-ID: <uuid>           # Optional: For request tracing
```

**Response Headers:**

```http
Content-Type: application/json
Access-Control-Allow-Origin: https://citegenerator.org
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Request-ID
X-Request-ID: <uuid>           # Echoed from request or generated
X-RateLimit-Limit: 30          # Requests per window
X-RateLimit-Remaining: 25      # Remaining requests
X-RateLimit-Reset: 1704020400  # Unix timestamp of reset
Cache-Control: private, max-age=3600
```

---

## 6. Security Model

### 6.1 CORS Configuration

```typescript
// /api/src/middleware/cors.ts
import { cors } from "hono/cors";

export const corsMiddleware = cors({
  origin: [
    "https://citegenerator.org",
    "https://www.citegenerator.org",
    // Development
    "http://localhost:3000",
  ],
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: ["Content-Type", "X-Request-ID"],
  exposeHeaders: [
    "X-Request-ID",
    "X-RateLimit-Limit",
    "X-RateLimit-Remaining",
    "X-RateLimit-Reset",
  ],
  maxAge: 86400, // 24 hours preflight cache
  credentials: false,
});
```

### 6.2 URL Validation

```typescript
// /src/lib/validation.ts

const BLOCKED_PATTERNS = [
  /^file:\/\//i, // Local files
  /^javascript:/i, // JavaScript URLs
  /^data:/i, // Data URLs
  /localhost/i, // Localhost
  /127\.0\.0\.1/, // IPv4 loopback
  /\[::1\]/, // IPv6 loopback
  /192\.168\./, // Private IPv4
  /10\.\d+\.\d+\.\d+/, // Private IPv4
  /172\.(1[6-9]|2\d|3[01])\./, // Private IPv4
  /\.local$/i, // Local domains
  /\.internal$/i, // Internal domains
];

const ALLOWED_PROTOCOLS = ["http:", "https:"];

export function validateUrl(urlString: string): ValidationResult {
  try {
    const url = new URL(urlString);

    // Protocol check
    if (!ALLOWED_PROTOCOLS.includes(url.protocol)) {
      return { valid: false, error: "INVALID_PROTOCOL" };
    }

    // Blocklist check
    for (const pattern of BLOCKED_PATTERNS) {
      if (pattern.test(urlString)) {
        return { valid: false, error: "URL_BLOCKED" };
      }
    }

    // DNS rebinding protection (additional check at fetch time)
    return { valid: true, url: url.toString() };
  } catch {
    return { valid: false, error: "INVALID_URL" };
  }
}
```

### 6.3 Rate Limiting

```typescript
// /src/middleware/rate-limit.ts

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  max: number; // Max requests per window
  keyGenerator: (req: Request) => string;
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // API endpoint limits
  "/api/cite": {
    windowMs: 60 * 1000, // 1 minute
    max: 30, // 30 requests per minute
    keyGenerator: (req) => req.headers.get("x-forwarded-for") || "unknown",
  },
  // Health check (higher limit)
  "/api/health": {
    windowMs: 60 * 1000,
    max: 120,
    keyGenerator: (req) => req.headers.get("x-forwarded-for") || "unknown",
  },
};
```

### 6.4 Content Security Policy

```typescript
// next.config.js - Security Headers

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];
```

### 6.5 Chrome Sandbox Configuration

```yaml
# browserless/chrome security settings
environment:
  - DEFAULT_STEALTH=true # Evade bot detection
  - DEFAULT_BLOCK_ADS=true # Block ad scripts
  - DISABLE_AUTO_SET_DOWNLOAD_BEHAVIOR=true
  - FUNCTION_ENABLE_INCOGNITO_MODE=true
  # Token required for external access (internal only = no token needed)
  - TOKEN=${BROWSERLESS_TOKEN:-}
```

### 6.6 Environment Variables

```bash
# /opt/docker-projects/standalone-apps/citegenerator/.env

# Application
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://citegenerator.org

# Chrome Connection
CHROME_WS_ENDPOINT=ws://chrome-headless:3000
BROWSERLESS_TOKEN=your-secret-token

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=30

# Timeouts
SCRAPE_TIMEOUT_MS=30000
PAGE_LOAD_TIMEOUT_MS=25000

# Affiliate (Grammarly)
NEXT_PUBLIC_GRAMMARLY_AFFILIATE_ID=your-affiliate-id
```

---

## 7. Performance Targets

### 7.1 Response Time SLOs

| Metric             | Target  | Max Acceptable | Measurement             |
| ------------------ | ------- | -------------- | ----------------------- |
| P50 Citation Time  | < 3s    | 5s             | End-to-end API response |
| P95 Citation Time  | < 8s    | 15s            | End-to-end API response |
| P99 Citation Time  | < 15s   | 30s            | End-to-end API response |
| Page Load (cached) | < 500ms | 1s             | Initial page render     |
| Health Check       | < 100ms | 500ms          | /api/health response    |

### 7.2 Throughput Targets

| Metric                      | Target | Notes                               |
| --------------------------- | ------ | ----------------------------------- |
| Concurrent Sessions         | 5      | Browserless MAX_CONCURRENT_SESSIONS |
| Requests/minute (burst)     | 30     | Per IP, rate limited                |
| Requests/minute (sustained) | 100    | Total across all users              |
| Daily Citations             | 5,000  | Estimated capacity                  |

### 7.3 Resource Budgets

```
RESOURCE ALLOCATION
===================

Container: citegenerator
├── Memory: 512MB max (256MB reserved)
├── CPU: 0.5 cores (shared)
└── Disk: Ephemeral only

Container: chrome-headless
├── Memory: 2GB max (1GB reserved)
├── CPU: 1.0 cores (shared)
├── shm_size: 1GB (required for Chrome)
└── Disk: Ephemeral only

Total Server Impact:
├── Memory: ~2.5GB
├── CPU: 1.5 cores
└── Network: ~100KB per citation request
```

### 7.4 Caching Strategy

```typescript
// Caching layers

// 1. In-memory citation cache (short-lived)
const CITATION_CACHE_TTL = 3600; // 1 hour

// 2. Browser page caching (within session)
// browserless handles connection pooling

// 3. Static asset caching (CDN/nginx)
const STATIC_CACHE_HEADERS = {
  "public, max-age=31536000, immutable": ["/_next/static/*"],
  "public, max-age=86400": ["/favicon.ico", "/robots.txt"],
  "private, max-age=3600": ["/api/cite responses"],
};
```

---

## 8. Integration Points

### 8.1 Cloudflare Pages Integration (Frontend)

```javascript
// wrangler.toml (optional - for Cloudflare Pages configuration)
name = "citegenerator";
compatibility_date = "2025-01-01"[site];
bucket = "./out"; // Next.js static export directory
```

```javascript
// next.config.mjs - Static export for Cloudflare Pages
const nextConfig = {
  output: "export", // Static HTML export
  trailingSlash: false,
  images: {
    unoptimized: true, // Required for static export
  },
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "https://api.citegenerator.org",
  },
};

export default nextConfig;
```

### 8.2 nginx-proxy Integration (API Only)

```yaml
# Integration with existing nginx-proxy on 107.174.42.198
# Only for API subdomain - frontend is on Cloudflare

# Environment variables for auto-discovery
environment:
  - VIRTUAL_HOST=api.citegenerator.org
  - LETSENCRYPT_HOST=api.citegenerator.org
  - LETSENCRYPT_EMAIL=admin@expertbeacon.com

# Network connection
networks:
  proxy-tier:
    external: true
    name: nginx-proxy_default
```

### 8.3 Browserless Integration

```typescript
// /src/lib/scraper.ts

import puppeteer, { Browser, Page } from "puppeteer-core";

const CHROME_WS_ENDPOINT =
  process.env.CHROME_WS_ENDPOINT || "ws://chrome-headless:3000";
const PAGE_TIMEOUT = parseInt(process.env.PAGE_LOAD_TIMEOUT_MS || "25000");

export async function withBrowser<T>(
  fn: (browser: Browser) => Promise<T>,
): Promise<T> {
  const browser = await puppeteer.connect({
    browserWSEndpoint: CHROME_WS_ENDPOINT,
  });

  try {
    return await fn(browser);
  } finally {
    browser.disconnect(); // Don't close - it's shared
  }
}

export async function scrapeMetadata(url: string): Promise<Metadata> {
  return withBrowser(async (browser) => {
    const page = await browser.newPage();

    try {
      // Set reasonable viewport
      await page.setViewport({ width: 1280, height: 800 });

      // Block unnecessary resources
      await page.setRequestInterception(true);
      page.on("request", (req) => {
        const type = req.resourceType();
        if (["image", "font", "media"].includes(type)) {
          req.abort();
        } else {
          req.continue();
        }
      });

      // Navigate with timeout
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: PAGE_TIMEOUT,
      });

      // Extract metadata
      const metadata = await page.evaluate(() => {
        const getMeta = (selectors: string[]): string | null => {
          for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el) {
              return (
                el.getAttribute("content") || el.textContent?.trim() || null
              );
            }
          }
          return null;
        };

        return {
          title: getMeta([
            'meta[property="og:title"]',
            'meta[name="title"]',
            "title",
          ]),
          author: getMeta([
            'meta[name="author"]',
            'meta[property="article:author"]',
            '[rel="author"]',
          ]),
          date: getMeta([
            'meta[property="article:published_time"]',
            'meta[name="date"]',
            "time[datetime]",
          ]),
          publisher: getMeta([
            'meta[property="og:site_name"]',
            'meta[name="publisher"]',
          ]),
        };
      });

      return metadata;
    } finally {
      await page.close();
    }
  });
}
```

### 8.4 citation-js Integration

```typescript
// /src/lib/citation.ts

import Cite from "citation-js";

interface CitationInput {
  title: string;
  author?: string | null;
  date?: string | null;
  publisher?: string | null;
  url: string;
  accessDate: string;
}

export function formatCitation(
  input: CitationInput,
  format: "apa" | "mla",
): string {
  // Build CSL-JSON entry
  const cslEntry = {
    type: "webpage",
    title: input.title,
    URL: input.url,
    accessed: {
      "date-parts": [parseDate(input.accessDate)],
    },
    ...(input.author && {
      author: parseAuthors(input.author),
    }),
    ...(input.date && {
      issued: {
        "date-parts": [parseDate(input.date)],
      },
    }),
    ...(input.publisher && {
      "container-title": input.publisher,
    }),
  };

  // Create citation
  const cite = new Cite(cslEntry);

  // Format based on style
  const style = format === "apa" ? "apa" : "modern-language-association";

  return cite
    .format("bibliography", {
      format: "text",
      template: style,
      lang: "en-US",
    })
    .trim();
}

function parseAuthors(
  authorString: string,
): Array<{ family: string; given: string }> {
  // Handle "John Smith" or "Smith, John" formats
  const parts = authorString.split(/,\s*/).reverse();
  if (parts.length === 2) {
    return [{ given: parts[0], family: parts[1] }];
  }
  const nameParts = authorString.split(/\s+/);
  return [
    {
      given: nameParts.slice(0, -1).join(" "),
      family: nameParts[nameParts.length - 1],
    },
  ];
}

function parseDate(dateString: string): [number, number?, number?] {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return [new Date().getFullYear()];
  }
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()];
}
```

### 8.5 Future: Database Integration (Optional)

```yaml
# If citation history/analytics needed in future

# PostgreSQL via existing Supabase
environment:
  DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@supabase-db:5432/postgres?schema=citegenerator

networks:
  supabase-tier:
    external: true
    name: supabase_default
```

---

## 9. Error Handling Strategy

### 9.1 Error Classification

```typescript
// /src/lib/errors.ts

export enum ErrorCategory {
  USER_ERROR = "user", // Bad input, fixable by user
  EXTERNAL_ERROR = "external", // Target site issues
  SYSTEM_ERROR = "system", // Our infrastructure issues
}

export const ERROR_DEFINITIONS: Record<
  string,
  {
    category: ErrorCategory;
    httpStatus: number;
    retryable: boolean;
    userMessage: string;
  }
> = {
  INVALID_URL: {
    category: ErrorCategory.USER_ERROR,
    httpStatus: 400,
    retryable: false,
    userMessage: "Please enter a valid URL starting with http:// or https://",
  },
  URL_BLOCKED: {
    category: ErrorCategory.USER_ERROR,
    httpStatus: 403,
    retryable: false,
    userMessage: "This URL cannot be cited. Please try a different source.",
  },
  FETCH_FAILED: {
    category: ErrorCategory.EXTERNAL_ERROR,
    httpStatus: 502,
    retryable: true,
    userMessage:
      "Unable to access this webpage. Please check the URL and try again.",
  },
  TIMEOUT: {
    category: ErrorCategory.EXTERNAL_ERROR,
    httpStatus: 504,
    retryable: true,
    userMessage: "The webpage took too long to load. Please try again.",
  },
  METADATA_MISSING: {
    category: ErrorCategory.EXTERNAL_ERROR,
    httpStatus: 422,
    retryable: false,
    userMessage:
      "Could not find enough information to create a citation. Try citing manually.",
  },
  RATE_LIMITED: {
    category: ErrorCategory.USER_ERROR,
    httpStatus: 429,
    retryable: true,
    userMessage: "Too many requests. Please wait a moment and try again.",
  },
  CHROME_UNAVAILABLE: {
    category: ErrorCategory.SYSTEM_ERROR,
    httpStatus: 503,
    retryable: true,
    userMessage:
      "Service temporarily unavailable. Please try again in a few seconds.",
  },
  INTERNAL_ERROR: {
    category: ErrorCategory.SYSTEM_ERROR,
    httpStatus: 500,
    retryable: true,
    userMessage: "Something went wrong. Please try again.",
  },
};
```

### 9.2 Error Response Flow

```
ERROR HANDLING FLOW
===================

[Error Occurs]
      |
      v
+------------------+
| Classify Error   |
| - Parse message  |
| - Match to code  |
+--------+---------+
         |
         v
+------------------+
| Log Error        |
| - Full stack     |
| - Request ID     |
| - Context        |
+--------+---------+
         |
         v
+------------------+
| Sanitize Output  |
| - Remove paths   |
| - Remove secrets |
| - Generic msg    |
+--------+---------+
         |
         v
+------------------+
| Return Response  |
| {                |
|   success: false |
|   error: {...}   |
| }                |
+------------------+
```

### 9.3 Graceful Degradation

```typescript
// /src/lib/graceful-degradation.ts

interface DegradationState {
  chromeHealthy: boolean;
  lastCheck: Date;
  consecutiveFailures: number;
}

const DEGRADATION_THRESHOLD = 3; // Failures before degrading

export async function checkChromeHealth(): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.CHROME_WS_ENDPOINT.replace("ws://", "http://")}/`,
    );
    return response.ok;
  } catch {
    return false;
  }
}

export function handleDegradation(state: DegradationState): void {
  if (state.consecutiveFailures >= DEGRADATION_THRESHOLD) {
    // Alert (future: send to monitoring)
    console.error("[DEGRADATION] Chrome service unhealthy", {
      failures: state.consecutiveFailures,
      lastCheck: state.lastCheck,
    });

    // Could implement fallback strategies:
    // 1. Return cached results only
    // 2. Show maintenance message
    // 3. Queue requests for later
  }
}
```

### 9.4 Retry Logic

```typescript
// /src/lib/retry.ts

interface RetryConfig {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

const DEFAULT_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {},
): Promise<T> {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= cfg.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry non-retryable errors
      if (!isRetryableError(error)) {
        throw error;
      }

      if (attempt < cfg.maxAttempts) {
        const delay = Math.min(
          cfg.baseDelayMs * Math.pow(2, attempt - 1),
          cfg.maxDelayMs,
        );
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

function isRetryableError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("ECONNRESET") ||
    message.includes("ETIMEDOUT") ||
    message.includes("Navigation timeout") ||
    message.includes("Protocol error")
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

---

## 10. Monitoring & Observability

### 10.1 Health Check Endpoint

```typescript
// /src/app/api/health/route.ts

import { NextResponse } from "next/server";

interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  services: {
    app: boolean;
    chrome: boolean;
  };
  version: string;
  uptime: number;
}

const startTime = Date.now();

export async function GET(): Promise<NextResponse<HealthStatus>> {
  const chromeHealthy = await checkChromeHealth();

  const status: HealthStatus = {
    status: chromeHealthy ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    services: {
      app: true,
      chrome: chromeHealthy,
    },
    version: process.env.npm_package_version || "1.0.0",
    uptime: Math.floor((Date.now() - startTime) / 1000),
  };

  const httpStatus = status.status === "healthy" ? 200 : 503;
  return NextResponse.json(status, { status: httpStatus });
}

async function checkChromeHealth(): Promise<boolean> {
  try {
    const wsEndpoint =
      process.env.CHROME_WS_ENDPOINT || "ws://chrome-headless:3000";
    const httpEndpoint = wsEndpoint.replace("ws://", "http://");
    const response = await fetch(httpEndpoint, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
```

### 10.2 Logging Strategy

```typescript
// /src/lib/logger.ts

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  requestId?: string;
  context?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

export function log(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
): void {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };

  // Structured JSON logging for container logs
  const output = JSON.stringify(entry);

  switch (level) {
    case "error":
      console.error(output);
      break;
    case "warn":
      console.warn(output);
      break;
    default:
      console.log(output);
  }
}

// Convenience methods
export const logger = {
  debug: (msg: string, ctx?: Record<string, unknown>) => log("debug", msg, ctx),
  info: (msg: string, ctx?: Record<string, unknown>) => log("info", msg, ctx),
  warn: (msg: string, ctx?: Record<string, unknown>) => log("warn", msg, ctx),
  error: (msg: string, error?: Error, ctx?: Record<string, unknown>) => {
    log("error", msg, {
      ...ctx,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    });
  },
};
```

### 10.3 Metrics to Track

```
METRICS DASHBOARD
=================

+------------------------------------------------------------------+
|                     CITEGENERATOR METRICS                         |
+------------------------------------------------------------------+
|                                                                   |
|  REQUEST METRICS                                                  |
|  +------------------------+       +------------------------+      |
|  |                        |       |                        |      |
|  |   Requests/min         |       |   Error Rate           |      |
|  |   ████████░░ 45        |       |   ██░░░░░░░░ 2.1%      |      |
|  |                        |       |                        |      |
|  +------------------------+       +------------------------+      |
|                                                                   |
|  LATENCY (P50/P95/P99)            CHROME POOL                     |
|  +------------------------+       +------------------------+      |
|  |                        |       |                        |      |
|  |   2.3s / 5.8s / 12.1s  |       |   Active: 3/5          |      |
|  |   ████░░░░░░ Target    |       |   Queue: 2             |      |
|  |                        |       |                        |      |
|  +------------------------+       +------------------------+      |
|                                                                   |
|  TOP ERRORS (24h)                 CITATIONS BY FORMAT             |
|  +------------------------+       +------------------------+      |
|  |                        |       |                        |      |
|  |   TIMEOUT: 45          |       |   APA: ████████ 78%    |      |
|  |   FETCH_FAILED: 23     |       |   MLA: ███░░░░░ 22%    |      |
|  |   METADATA_MISSING: 12 |       |                        |      |
|  |                        |       |                        |      |
|  +------------------------+       +------------------------+      |
|                                                                   |
+------------------------------------------------------------------+
```

### 10.4 Container Health Checks

```yaml
# Docker healthcheck configuration

services:
  citegenerator:
    healthcheck:
      test:
        ["CMD", "wget", "-q", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  chrome-headless:
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 20s
```

### 10.5 Alerting Rules (Future)

| Alert            | Condition             | Severity | Action                          |
| ---------------- | --------------------- | -------- | ------------------------------- |
| Chrome Down      | Health check fails 3x | Critical | Restart container, page on-call |
| High Error Rate  | >10% errors in 5min   | High     | Investigate logs                |
| Slow Responses   | P95 > 15s             | Medium   | Check Chrome pool               |
| Rate Limit Spike | >50 429 responses/min | Low      | Potential abuse, review IPs     |

---

## Appendix A: File Structure (Split Architecture)

### Frontend (Cloudflare Pages)

```
citegenerator-frontend/
├── package.json                 # Frontend dependencies
├── next.config.mjs              # Next.js static export config
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Homepage (citation form)
│   │   ├── about/page.tsx       # About page
│   │   └── faq/page.tsx         # FAQ page
│   ├── components/
│   │   ├── CitationForm.tsx     # URL input form
│   │   ├── CitationResult.tsx   # Citation display + copy
│   │   ├── FormatSelector.tsx   # APA/MLA toggle
│   │   ├── AffiliateAd.tsx      # Grammarly affiliate
│   │   └── ui/                  # Reusable UI components
│   └── lib/
│       ├── api.ts               # API client for backend
│       └── types.ts             # Shared TypeScript types
├── public/
│   ├── favicon.ico
│   └── robots.txt
└── out/                         # Static export output (deployed to CF Pages)
```

### Backend API (VPS Docker)

```
/opt/docker-projects/standalone-apps/citegenerator/
├── docker-compose.yml           # Service orchestration
├── .env                         # Environment variables (not committed)
├── .env.example                 # Environment template
├── Makefile                     # Deployment commands
├── api/
│   ├── Dockerfile               # API container
│   ├── package.json             # API dependencies
│   ├── tsconfig.json            # TypeScript configuration
│   └── src/
│       ├── index.ts             # Hono app entry point
│       ├── routes/
│       │   ├── scrape.ts        # POST /api/scrape
│       │   ├── format.ts        # POST /api/format
│       │   └── health.ts        # GET /api/health
│       ├── services/
│       │   ├── scraper.ts       # Puppeteer integration
│       │   ├── citation.ts      # citation-js wrapper
│       │   └── validation.ts    # URL validation
│       ├── middleware/
│       │   ├── cors.ts          # CORS configuration
│       │   ├── rate-limit.ts    # Rate limiting
│       │   └── error-handler.ts # Error handling
│       └── lib/
│           ├── errors.ts        # Error definitions
│           ├── retry.ts         # Retry logic
│           └── logger.ts        # Structured logging
└── docs/
    └── BLUEPRINT.md             # This document
```

---

## Appendix B: Makefile Commands

```makefile
# /opt/docker-projects/standalone-apps/citegenerator/Makefile
# API Backend deployment (VPS)

.PHONY: deploy down logs validate build test

# Deploy all services
deploy:
	docker compose up -d --build

# Stop all services
down:
	docker compose down

# View logs
logs:
	docker compose logs -f

# View API logs only
logs-api:
	docker compose logs -f citegenerator-api

# View chrome logs only
logs-chrome:
	docker compose logs -f chrome-headless

# Validate configuration
validate:
	docker compose config

# Build without starting
build:
	docker compose build

# Restart services
restart:
	docker compose restart

# Check health
health:
	curl -s http://localhost:3020/api/health | jq

# Shell into API container
shell:
	docker compose exec citegenerator-api sh

# Tail chrome logs for debugging
debug-chrome:
	docker compose logs -f chrome-headless --tail=100
```

### Frontend Deployment (Cloudflare Pages)

```bash
# In frontend directory
cd citegenerator-frontend

# Build static export
npm run build

# Deploy to Cloudflare Pages (via Git or Wrangler)
npx wrangler pages deploy out --project-name=citegenerator

# Or connect GitHub repo for automatic deployments
```

---

## Appendix C: Environment Variables Reference

### Backend API (.env on VPS)

```bash
# /opt/docker-projects/standalone-apps/citegenerator/.env

# ===================
# Application
# ===================
NODE_ENV=production

# ===================
# CORS Configuration
# ===================
CORS_ORIGINS=https://citegenerator.org,https://www.citegenerator.org

# ===================
# Chrome Integration
# ===================
CHROME_WS_ENDPOINT=ws://chrome-headless:3000

# ===================
# Timeouts (milliseconds)
# ===================
SCRAPE_TIMEOUT_MS=30000
PAGE_LOAD_TIMEOUT_MS=25000

# ===================
# Rate Limiting
# ===================
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=30

# ===================
# nginx-proxy (auto-discovery)
# ===================
VIRTUAL_HOST=api.citegenerator.org
LETSENCRYPT_HOST=api.citegenerator.org
LETSENCRYPT_EMAIL=admin@expertbeacon.com
```

### Frontend (.env.local for development, Cloudflare env for production)

```bash
# citegenerator-frontend/.env.local

# ===================
# API Configuration
# ===================
NEXT_PUBLIC_API_URL=https://api.citegenerator.org

# ===================
# Site Configuration
# ===================
NEXT_PUBLIC_SITE_URL=https://citegenerator.org

# ===================
# Affiliate Configuration
# ===================
NEXT_PUBLIC_GRAMMARLY_AFFILIATE_ID=your-grammarly-id
NEXT_PUBLIC_GRAMMARLY_AFFILIATE_URL=https://grammarly.com/ref=citegenerator

# ===================
# Analytics (Optional)
# ===================
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
# NEXT_PUBLIC_UMAMI_WEBSITE_ID=
```

---

## Appendix D: Deployment Checklist

### Pre-Deployment (DNS)

- [ ] `citegenerator.org` CNAME -> `citegenerator.pages.dev` (Cloudflare proxied)
- [ ] `www.citegenerator.org` CNAME -> `citegenerator.pages.dev` (Cloudflare proxied)
- [ ] `api.citegenerator.org` A record -> `107.174.42.198` (DNS only)

### Backend API Deployment (VPS)

```bash
cd /opt/docker-projects/standalone-apps/citegenerator
make validate   # Check docker-compose syntax
make deploy     # Build and start services
make health     # Verify health endpoint
```

- [ ] Health check returns `healthy`
- [ ] API responds at `https://api.citegenerator.org/api/health`
- [ ] CORS headers present for citegenerator.org origin
- [ ] SSL certificate active

### Frontend Deployment (Cloudflare Pages)

```bash
cd citegenerator-frontend
npm run build   # Creates static export in ./out
npx wrangler pages deploy out --project-name=citegenerator
```

- [ ] Site accessible at `https://citegenerator.org`
- [ ] API calls succeed (no CORS errors)
- [ ] Citation form works end-to-end
- [ ] Affiliate links configured

### Post-Deployment Verification

- [ ] Enter URL and generate APA citation
- [ ] Enter URL and generate MLA citation
- [ ] Copy to clipboard works
- [ ] Rate limiting responds with 429 after threshold
- [ ] Mobile responsive design works

### Rollback Procedure

**Backend (VPS):**

```bash
make down
docker compose logs --tail=500
git checkout HEAD~1
make deploy
```

**Frontend (Cloudflare Pages):**

```bash
# Rollback via Cloudflare Dashboard
# or redeploy previous commit
git checkout HEAD~1
npm run build
npx wrangler pages deploy out --project-name=citegenerator
```

---

**Document Owner:** Engineering
**Review Cycle:** Monthly
**Next Review:** 2026-01-31
**Status:** Production-Ready Design
