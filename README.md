# CiteGenerator.org

This repo contains:

- `citegenerator-api/`: Hono API deployed on `api.citegenerator.org` (VPS + Docker)
- `citegenerator-web/`: Next.js static export deployed on Cloudflare Pages (`citegenerator.org`)

## Local development

Prereqs: Node.js 20+, `pnpm` (via Corepack).

```bash
corepack enable
pnpm install
cp citegenerator-web/.env.local.example citegenerator-web/.env.local
pnpm dev
```

## API (quick reference)

- `GET /api/health` health + chrome connectivity
- `GET /api/formats` supported styles
- `POST /api/cite` URL → metadata + citation(s) (fast path)
- `POST /api/scrape` URL → metadata
- `POST /api/format` metadata → formatted citation
- `POST /api/track` analytics events (best-effort)
- `GET /api/openapi.json` OpenAPI 3.1 spec

See `docs/API.md` for OpenAPI + SDK notes.

## Tests

```bash
pnpm test
```
