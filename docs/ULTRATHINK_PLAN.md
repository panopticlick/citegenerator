# CiteGenerator.org — PM + Architecture + pSEO Execution Plan

**Date:** 2026-01-01

This doc captures a production delivery plan from three lenses:

- **PM**: user value, scope, acceptance criteria
- **Architect**: reliability, performance, security, operability
- **pSEO**: scalable content + internal linking for organic growth

---

## 1) PM (Product) — What “Production-Ready” Means

### Core jobs-to-be-done

1. **Generate** a correct citation from a URL (fast, no sign-up).
2. **Switch** between citation styles without re-entering the URL.
3. **Copy** citation text (and optionally BibTeX) reliably.
4. **Recover** gracefully from failures (blocked URL, timeouts, rate limits).

### Non-negotiable acceptance criteria

- URL → citation succeeds for common public pages within ~10–30s.
- UI never gets stuck in “loading” state; errors are actionable.
- API enforces SSRF protections and rate limiting.
- All key pages have metadata + sitemap + robots.
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` pass.

### KPI-ready instrumentation (privacy preserving)

- Track: start/success/error, copy events, style switches, affiliate clicks.
- Never store PII (no user identifiers, no raw IP collection in app layer).

---

## 2) Architect — System Improvements (Highest ROI)

### Backend

- Add a **single-call endpoint** for the critical path (URL → citation) to reduce latency and round-trips.
- Enforce **request body size limits** to reduce abuse surface.
- Keep rate limiting bounded (avoid unbounded memory growth).
- Normalize and standardize error shapes so the UI can show better messages.

### Frontend

- Avoid N+1 formatting calls on first render; **format only what’s needed** and lazy-load the rest.
- Keep UI resilient: retries and clear states (idle/loading/success/error).

### Operations / observability

- Health endpoint remains: must reflect Chrome connectivity.
- Request ID header enabled end-to-end for debugging.

---

## 3) pSEO — Scalable Page Generation (Programmatic SEO)

### Page model

Generate static pages for combinations of:

- Citation style: `apa | mla | chicago | harvard`
- Source type: `website | book | journal-article | youtube-video | podcast | pdf`

Example: `/cite/apa/website`

### Each page must include

- Unique title + meta description (keyword-aligned, non-spammy)
- Canonical URL
- “How-to” content + examples
- Inline tool (pre-selected style)
- Internal links to related style/source pages
- Included in sitemap

---

## 4) Parallel Workstreams (Agent-style)

- **Backend agent**: `/api/cite`, body limit, bounded rate limiter.
- **Frontend agent**: use `/api/cite` + lazy formatting on style switch.
- **pSEO agent**: generate `/cite/:style/:source` pages + sitemap entries.
