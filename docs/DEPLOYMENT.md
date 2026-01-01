# CiteGenerator Deployment Guide

**Architecture: Cloudflare Pages (Frontend) + VPS Docker (API)**

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│                              INTERNET                                     │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 │
         ┌───────────────────────┴───────────────────────┐
         │                                               │
         ▼                                               ▼
┌─────────────────────────┐                 ┌─────────────────────────────┐
│   CLOUDFLARE PAGES      │                 │      VPS 107.174.42.198     │
│   citegenerator.org     │                 │   api.citegenerator.org     │
├─────────────────────────┤   HTTPS API     ├─────────────────────────────┤
│                         │    Requests     │                             │
│  ┌───────────────────┐  │ ──────────────► │  ┌─────────────────────┐    │
│  │  Static Frontend  │  │                 │  │    nginx-proxy      │    │
│  │  (React/Next.js)  │  │                 │  │  (SSL + Routing)    │    │
│  │                   │  │                 │  └──────────┬──────────┘    │
│  │  - Homepage       │  │                 │             │               │
│  │  - Citation Form  │  │                 │  ┌──────────▼──────────┐    │
│  │  - Results UI     │  │ ◄────────────── │  │   citegenerator-api │    │
│  │  - Style Guides   │  │   JSON Response │  │    (Hono/Express)   │    │
│  └───────────────────┘  │                 │  │    - /api/scrape    │    │
│                         │                 │  │    - /api/format    │    │
│  Global CDN Edge        │                 │  │    - /api/health    │    │
│  - Auto SSL             │                 │  └──────────┬──────────┘    │
│  - DDoS Protection      │                 │             │ WebSocket     │
│  - Edge Caching         │                 │  ┌──────────▼──────────┐    │
│                         │                 │  │   chrome-headless   │    │
└─────────────────────────┘                 │  │   (browserless)     │    │
                                            │  └─────────────────────┘    │
                                            └─────────────────────────────┘
```

## Deployment Summary

| Component   | Location         | Domain                | Technology           |
| ----------- | ---------------- | --------------------- | -------------------- |
| Frontend    | Cloudflare Pages | citegenerator.org     | React/Next.js Static |
| API Backend | VPS Docker       | api.citegenerator.org | Hono + Node.js       |
| Chrome      | VPS Docker       | Internal only         | browserless/chrome   |

---

## Part 1: Backend API (VPS Docker)

### 1.1 Project Structure

```
/opt/docker-projects/standalone-apps/citegenerator-api/
├── docker-compose.yml
├── Dockerfile
├── Makefile
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts              # Entry point
    ├── routes/
    │   ├── scrape.ts         # POST /api/scrape
    │   ├── format.ts         # POST /api/format
    │   ├── cite.ts           # POST /api/cite
    │   └── health.ts         # GET /api/health
    ├── services/
    │   ├── scraper.ts        # Puppeteer logic
    │   └── citation.ts       # citation-js wrapper
    ├── middleware/
    │   ├── cors.ts           # CORS configuration
    │   ├── rate-limit.ts     # Rate limiting
    │   └── validation.ts     # URL validation
    └── lib/
        ├── browser-pool.ts   # Browser connection pool
        └── errors.ts         # Error definitions
```

### 1.2 docker-compose.yml

```yaml
version: "3.8"

services:
  # ===================
  # API Server (Hono)
  # ===================
  citegenerator-api:
    build:
      context: .
      dockerfile: Dockerfile
    image: citegenerator-api:1.0.0
    container_name: citegenerator-api
    restart: unless-stopped
    env_file: .env
    environment:
      - NODE_ENV=production
      - PORT=3000
      - CHROME_WS_ENDPOINT=ws://chrome-headless:3000
      - API_BODY_MAX_BYTES=32768
      - VIRTUAL_HOST=api.citegenerator.org
      - LETSENCRYPT_HOST=api.citegenerator.org
      - LETSENCRYPT_EMAIL=admin@citegenerator.org
      - VIRTUAL_PORT=3000
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
          memory: 512M
          cpus: "1.0"
        reservations:
          memory: 256M
          cpus: "0.25"
    healthcheck:
      test:
        ["CMD", "wget", "-q", "--spider", "http://127.0.0.1:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 20s
    logging:
      driver: "json-file"
      options:
        max-size: "20m"
        max-file: "5"
    security_opt:
      - no-new-privileges:true

  # ===================
  # Browserless Chrome
  # ===================
  chrome-headless:
    image: browserless/chrome:1.61.1-puppeteer-21.4.1
    container_name: citegenerator-chrome
    restart: unless-stopped
    environment:
      - CONNECTION_TIMEOUT=120000
      - MAX_CONCURRENT_SESSIONS=5
      - MAX_QUEUE_LENGTH=10
      - PREBOOT_CHROME=true
      - KEEP_ALIVE=true
      - DEMO_MODE=false
      - ENABLE_DEBUGGER=false
      - DISABLE_AUTO_SET_DOWNLOAD_BEHAVIOR=true
      - DEFAULT_BLOCK_ADS=true
      - DEFAULT_STEALTH=true
      - TOKEN=${BROWSERLESS_TOKEN:-}
      - FUNCTION_ENABLE_INCOGNITO_MODE=true
    ports:
      - "127.0.0.1:3021:3000"
    networks:
      - internal
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: "2.0"
        reservations:
          memory: 512M
          cpus: "0.5"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/pressure"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s
    logging:
      driver: "json-file"
      options:
        max-size: "20m"
        max-file: "3"
    security_opt:
      - no-new-privileges:true
    tmpfs:
      - /tmp:size=512M
    shm_size: "1gb"

networks:
  proxy-tier:
    external: true
    name: nginx-proxy_default
  internal:
    driver: bridge
```

### 1.3 Dockerfile (API)

```dockerfile
# syntax=docker/dockerfile:1

# ==============================================================================
# Stage 1: Base
# ==============================================================================
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.15.1 --activate

# ==============================================================================
# Stage 2: Dependencies
# ==============================================================================
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# ==============================================================================
# Stage 3: Builder
# ==============================================================================
FROM base AS builder
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# ==============================================================================
# Stage 4: Production Runner
# ==============================================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install wget for healthcheck
RUN apk add --no-cache wget

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S citegen -u 1001 -G nodejs

# Copy production files
COPY --from=deps --chown=citegen:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=citegen:nodejs /app/dist ./dist
COPY --from=builder --chown=citegen:nodejs /app/package.json ./

USER citegen

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

### 1.4 API Source Code

**package.json:**

```json
{
  "name": "citegenerator-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "hono": "^4.6.0",
    "@hono/node-server": "^1.13.0",
    "puppeteer-core": "^21.4.1",
    "citation-js": "^0.7.0",
    "jsdom": "^25.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "typescript": "^5.7.0",
    "tsx": "^4.19.0"
  }
}
```

**src/index.ts:**

```typescript
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { rateLimiter } from "hono/rate-limiter";

import { scrapeRoutes } from "./routes/scrape.js";
import { formatRoutes } from "./routes/format.js";
import { healthRoutes } from "./routes/health.js";

const app = new Hono();

// ===================
// Middleware
// ===================

// CORS - Allow frontend domain
app.use(
  "/*",
  cors({
    origin: [
      "https://citegenerator.org",
      "https://www.citegenerator.org",
      // Dev
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "X-Request-ID"],
    exposeHeaders: [
      "X-RateLimit-Limit",
      "X-RateLimit-Remaining",
      "X-RateLimit-Reset",
    ],
    maxAge: 86400,
    credentials: false,
  }),
);

// Logging
app.use("/*", logger());

// Rate limiting - 30 requests per minute per IP
app.use(
  "/api/scrape",
  rateLimiter({
    windowMs: 60 * 1000,
    limit: 30,
    keyGenerator: (c) =>
      c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "unknown",
  }),
);

app.use(
  "/api/format",
  rateLimiter({
    windowMs: 60 * 1000,
    limit: 60,
    keyGenerator: (c) =>
      c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "unknown",
  }),
);

// ===================
// Routes
// ===================
app.route("/api", scrapeRoutes);
app.route("/api", formatRoutes);
app.route("/api", healthRoutes);

// Root redirect
app.get("/", (c) => c.redirect("https://citegenerator.org"));

// ===================
// Start Server
// ===================
const port = parseInt(process.env.PORT || "3000");

console.log(`🚀 CiteGenerator API starting on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
```

**src/routes/scrape.ts:**

```typescript
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { scrapeMetadata } from "../services/scraper.js";
import { validateUrl, ValidationError } from "../middleware/validation.js";

const scrapeRoutes = new Hono();

const scrapeSchema = z.object({
  url: z.string().url("Invalid URL format"),
});

scrapeRoutes.post("/scrape", zValidator("json", scrapeSchema), async (c) => {
  const { url } = c.req.valid("json");

  try {
    // Validate URL (SSRF protection)
    const validatedUrl = validateUrl(url);

    // Scrape metadata
    const metadata = await scrapeMetadata(validatedUrl);

    return c.json({
      success: true,
      data: metadata,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return c.json(
        {
          success: false,
          error: { code: error.code, message: error.message },
        },
        400,
      );
    }

    console.error("Scrape error:", error);
    return c.json(
      {
        success: false,
        error: {
          code: "SCRAPE_FAILED",
          message: "Failed to scrape the URL",
        },
      },
      502,
    );
  }
});

export { scrapeRoutes };
```

**src/routes/format.ts:**

```typescript
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { formatCitation } from "../services/citation.js";

const formatRoutes = new Hono();

const formatSchema = z.object({
  citation: z.object({
    title: z.string(),
    url: z.string().url(),
    accessDate: z.string(),
    authors: z
      .array(
        z.object({
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          fullName: z.string(),
        }),
      )
      .optional(),
    publishedDate: z.string().optional(),
    siteName: z.string().optional(),
    publisher: z.string().optional(),
  }),
  style: z.enum(["apa", "mla", "chicago", "harvard"]),
  includeBibtex: z.boolean().optional(),
});

formatRoutes.post("/format", zValidator("json", formatSchema), async (c) => {
  const body = c.req.valid("json");

  try {
    const formatted = formatCitation(body.citation, {
      style: body.style,
      includeBibtex: body.includeBibtex,
    });

    return c.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("Format error:", error);
    return c.json(
      {
        success: false,
        error: {
          code: "FORMAT_FAILED",
          message: "Failed to format citation",
        },
      },
      400,
    );
  }
});

export { formatRoutes };
```

**src/routes/health.ts:**

```typescript
import { Hono } from "hono";
import { checkBrowserHealth } from "../services/scraper.js";

const healthRoutes = new Hono();

const startTime = Date.now();

healthRoutes.get("/health", async (c) => {
  const chromeHealthy = await checkBrowserHealth();

  const health = {
    status: chromeHealthy ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    uptime: Math.floor((Date.now() - startTime) / 1000),
    services: {
      api: true,
      chrome: chromeHealthy,
    },
  };

  return c.json(health, chromeHealthy ? 200 : 503);
});

export { healthRoutes };
```

### 1.5 .env.example

```bash
# =============================================================================
# CiteGenerator API Environment
# =============================================================================

# Server
NODE_ENV=production
PORT=3000

# Chrome (Browserless)
CHROME_WS_ENDPOINT=ws://chrome-headless:3000
BROWSERLESS_TOKEN=

# nginx-proxy (auto-discovery)
VIRTUAL_HOST=api.citegenerator.org
LETSENCRYPT_HOST=api.citegenerator.org
LETSENCRYPT_EMAIL=admin@citegenerator.org

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=30

# CORS (frontend domains)
CORS_ORIGINS=https://citegenerator.org,https://www.citegenerator.org
```

### 1.6 Makefile

```makefile
.PHONY: help dev build deploy logs down validate restart status

PROJECT_NAME := citegenerator-api
COMPOSE := docker compose

help:
	@echo "CiteGenerator API Commands"
	@echo "=========================="
	@echo "  make dev       - Run locally"
	@echo "  make build     - Build Docker images"
	@echo "  make deploy    - Deploy to production"
	@echo "  make logs      - View logs"
	@echo "  make down      - Stop services"
	@echo "  make status    - Show status"

dev:
	pnpm install
	pnpm dev

build:
	$(COMPOSE) build --no-cache

validate:
	@echo "=== Pre-Deploy Validation ==="
	@test -f .env || (echo "ERROR: .env missing!" && exit 1)
	@docker network inspect nginx-proxy_default > /dev/null 2>&1 || (echo "ERROR: nginx-proxy_default not found!" && exit 1)
	@echo "=== Validation OK ==="

deploy: validate build
	$(COMPOSE) up -d
	@sleep 5
	$(COMPOSE) ps
	@echo ""
	@echo "API deployed: https://api.citegenerator.org"

logs:
	$(COMPOSE) logs -f --tail=100

logs-api:
	$(COMPOSE) logs -f --tail=100 citegenerator-api

logs-chrome:
	$(COMPOSE) logs -f --tail=100 chrome-headless

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) restart

status:
	@echo "=== Container Status ==="
	$(COMPOSE) ps
	@echo ""
	@echo "=== Health Check ==="
	@curl -s http://localhost:3020/api/health | jq . || echo "API not responding"
```

---

## Part 2: Frontend (Cloudflare Pages)

### 2.1 Project Structure

```
citegenerator-web/
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── wrangler.toml              # Cloudflare config
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Homepage
│   │   ├── about/page.tsx
│   │   ├── faq/page.tsx
│   │   └── [...style]/page.tsx  # /apa, /mla, /chicago
│   ├── components/
│   │   ├── CitationForm.tsx
│   │   ├── CitationResult.tsx
│   │   ├── StyleSelector.tsx
│   │   └── ui/
│   └── lib/
│       ├── api.ts             # API client
│       └── config.ts          # Environment config
└── .env.local
```

### 2.2 next.config.mjs (Static Export)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Static export for Cloudflare Pages
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

### 2.3 API Client

**src/lib/api.ts:**

```typescript
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.citegenerator.org";

export interface MetadataResult {
  title: string;
  url: string;
  accessDate: string;
  authors: Array<{ firstName?: string; lastName?: string; fullName: string }>;
  publishedDate?: string;
  siteName?: string;
  publisher?: string;
}

export interface FormattedCitation {
  style: string;
  html: string;
  text: string;
  bibtex?: string;
}

export async function scrapeUrl(url: string): Promise<MetadataResult> {
  const response = await fetch(`${API_URL}/api/scrape`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error?.message || "Failed to scrape URL");
  }

  return data.data;
}

export async function formatCitation(
  citation: MetadataResult,
  style: "apa" | "mla" | "chicago" | "harvard",
): Promise<FormattedCitation> {
  const response = await fetch(`${API_URL}/api/format`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ citation, style }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error?.message || "Failed to format citation");
  }

  return data.data;
}
```

### 2.4 Environment Variables

**.env.local (development):**

```bash
NEXT_PUBLIC_API_URL=http://localhost:3020
```

**Cloudflare Pages Environment Variables (production):**

| Variable              | Value                           |
| --------------------- | ------------------------------- |
| `NEXT_PUBLIC_API_URL` | `https://api.citegenerator.org` |

### 2.5 Cloudflare Pages Deployment

**Option A: Git Integration (Recommended)**

1. Push code to GitHub/GitLab
2. Connect to Cloudflare Pages
3. Configure build:
   - Build command: `pnpm build`
   - Output directory: `out`
   - Node.js version: `20`

**Option B: Direct Upload**

```bash
# Build locally
pnpm build

# Deploy with Wrangler
npx wrangler pages deploy out --project-name=citegenerator
```

**wrangler.toml:**

```toml
name = "citegenerator"
compatibility_date = "2024-01-01"

[site]
bucket = "./out"
```

---

## Part 3: DNS Configuration

### 3.1 DNS Records

| Type  | Name | Value                   | Proxy     |
| ----- | ---- | ----------------------- | --------- |
| CNAME | @    | citegenerator.pages.dev | Proxied ✓ |
| CNAME | www  | citegenerator.pages.dev | Proxied ✓ |
| A     | api  | 107.174.42.198          | DNS only  |

### 3.2 Cloudflare Settings

**For citegenerator.org (Pages):**

- SSL: Full (strict)
- Always Use HTTPS: On
- Auto Minify: CSS, JavaScript, HTML

**For api.citegenerator.org:**

- SSL handled by nginx-proxy on VPS
- No Cloudflare proxy (gray cloud) - direct to VPS

---

## Part 4: Deployment Steps

### 4.1 Deploy Backend API (VPS)

```bash
# SSH into server
ssh root@107.174.42.198

# Create project directory
mkdir -p /opt/docker-projects/standalone-apps/citegenerator-api
cd /opt/docker-projects/standalone-apps/citegenerator-api

# Transfer files (from local)
# Option A: SCP
scp -r ./citegenerator-api/* root@107.174.42.198:/opt/docker-projects/standalone-apps/citegenerator-api/

# Option B: Git
git clone <repo-url> .

# Setup environment
cp .env.example .env
nano .env  # Edit values

# Deploy
make validate
make deploy

# Verify
make status
curl https://api.citegenerator.org/api/health
```

### 4.2 Deploy Frontend (Cloudflare Pages)

```bash
# Local development
cd citegenerator-web
pnpm install
pnpm dev  # http://localhost:3000

# Build for production
pnpm build

# Deploy to Cloudflare Pages
# Option A: Git push (auto-deploy)
git push origin main

# Option B: Manual
npx wrangler pages deploy out --project-name=citegenerator
```

### 4.3 Verify Full Deployment

```bash
# Check API
curl -X POST https://api.citegenerator.org/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# Check Frontend
curl -I https://citegenerator.org

# Check CORS
curl -I -X OPTIONS https://api.citegenerator.org/api/scrape \
  -H "Origin: https://citegenerator.org"
```

---

## Part 5: Monitoring & Troubleshooting

### 5.1 Health Endpoints

| Service           | Health URL                               |
| ----------------- | ---------------------------------------- |
| API               | https://api.citegenerator.org/api/health |
| Chrome (internal) | http://localhost:3021/pressure           |

### 5.2 Logs

```bash
# API logs
make logs-api

# Chrome logs
make logs-chrome

# All logs
make logs
```

### 5.3 Common Issues

**CORS Errors:**

```bash
# Check CORS headers
curl -I -X OPTIONS https://api.citegenerator.org/api/scrape \
  -H "Origin: https://citegenerator.org" \
  -H "Access-Control-Request-Method: POST"

# Should return:
# Access-Control-Allow-Origin: https://citegenerator.org
```

**API Not Responding:**

```bash
# Check container status
docker ps | grep citegenerator

# Restart containers
make restart

# Check health
curl http://localhost:3020/api/health
```

**SSL Issues:**

```bash
# Check certificate
openssl s_client -connect api.citegenerator.org:443 -servername api.citegenerator.org

# Force renewal
cd /opt/docker-projects/nginx-proxy
docker compose exec letsencrypt /app/force_renew
```

---

## Part 6: Quick Reference

### Commands

| Task            | Command                                         |
| --------------- | ----------------------------------------------- |
| Deploy API      | `cd /opt/.../citegenerator-api && make deploy`  |
| Deploy Frontend | `git push` or `npx wrangler pages deploy out`   |
| View API logs   | `make logs`                                     |
| Restart API     | `make restart`                                  |
| Check health    | `curl https://api.citegenerator.org/api/health` |

### URLs

| Service              | URL                                      |
| -------------------- | ---------------------------------------- |
| Frontend             | https://citegenerator.org                |
| API                  | https://api.citegenerator.org            |
| API Health           | https://api.citegenerator.org/api/health |
| Cloudflare Dashboard | https://dash.cloudflare.com              |
| Logs (Dozzle)        | https://logs.expertbeacon.com            |

### Ports

| Container            | Internal | External |
| -------------------- | -------- | -------- |
| citegenerator-api    | 3000     | 3020     |
| citegenerator-chrome | 3000     | 3021     |

---

**Architecture Benefits:**

1. **Frontend CDN** - Global edge caching, fast load times
2. **Reduced VPS Load** - Only API requests hit server
3. **Scalability** - Frontend scales infinitely via Cloudflare
4. **Cost Efficient** - Cloudflare Pages free tier is generous
5. **Simpler Updates** - Frontend deploys independently

**Trade-offs:**

1. **CORS Required** - API must handle cross-origin requests
2. **Two Deployments** - Frontend and backend deploy separately
3. **No SSR** - Static export only (good enough for SEO with proper meta tags)
