# CiteGenerator.org Development Roadmap

> **Last Updated**: 2025-12-31
> **Status**: Phase 0 - Foundation
> **Target Launch**: MVP by end of Phase 1

---

## Overview

CiteGenerator.org is a free citation generator that converts URLs into properly formatted citations. This roadmap outlines the development phases from initial scaffolding to a fully monetized, scalable product.

**Tech Stack**: Next.js 14 | TypeScript | Tailwind CSS | Puppeteer | browserless/chrome

---

## Phase 0: Foundation (Current)

### 0.1 Project Scaffolding

- [ ] **Initialize Next.js 14 with App Router**

  - **Files**: `package.json`, `next.config.js`, `tsconfig.json`, `app/layout.tsx`, `app/page.tsx`
  - **Dependencies**: None
  - **Acceptance Criteria**: `npm run dev` starts without errors, TypeScript compiles
  - **Testing**: Visit `localhost:3000`, verify blank page renders

- [ ] **Configure Tailwind CSS**

  - **Files**: `tailwind.config.ts`, `app/globals.css`, `postcss.config.js`
  - **Dependencies**: 0.1 scaffolding complete
  - **Acceptance Criteria**: Tailwind classes apply correctly
  - **Testing**: Add `className="text-red-500"` to any element, verify red text

- [ ] **ESLint & Prettier Setup**

  - **Files**: `.eslintrc.json`, `.prettierrc`, `.prettierignore`
  - **Dependencies**: 0.1 scaffolding complete
  - **Acceptance Criteria**: `npm run lint` passes, auto-format on save works
  - **Testing**: Introduce a linting error, verify it is caught

- [ ] **Environment Configuration**
  - **Files**: `.env.example`, `.env.local` (gitignored), `lib/env.ts`
  - **Dependencies**: None
  - **Acceptance Criteria**: Environment variables load correctly
  - **Testing**: `console.log(process.env.NEXT_PUBLIC_APP_URL)` outputs value

### 0.2 Docker Setup

- [ ] **Create Dockerfile for Next.js**

  - **Files**: `Dockerfile`, `.dockerignore`
  - **Dependencies**: 0.1 complete
  - **Acceptance Criteria**: `docker build -t citegenerator .` succeeds
  - **Testing**: Run container, access via mapped port

- [ ] **Docker Compose with browserless/chrome**

  - **Files**: `docker-compose.yml`, `Makefile`
  - **Dependencies**: Dockerfile complete
  - **Acceptance Criteria**: `make deploy` brings up both services
  - **Testing**: `curl http://localhost:3000` returns HTML, browserless responds on its port

- [ ] **Production Docker Configuration**
  - **Files**: `docker-compose.prod.yml`, `.env.production`
  - **Dependencies**: Docker Compose complete
  - **Acceptance Criteria**: Production build runs with optimizations
  - **Testing**: Compare image size and startup time vs dev

### 0.3 Basic CI/CD

- [ ] **GitHub Actions Workflow**
  - **Files**: `.github/workflows/ci.yml`
  - **Dependencies**: ESLint setup complete
  - **Acceptance Criteria**: Push triggers lint, type-check, build
  - **Testing**: Create PR, verify checks run and pass

---

## Phase 1: Core MVP

### 1.1 URL Input Form

- [ ] **Create Citation Form Component**

  - **Files**: `components/CitationForm.tsx`, `components/ui/Input.tsx`, `components/ui/Button.tsx`
  - **Dependencies**: Phase 0 complete
  - **Acceptance Criteria**: Form renders, accepts URL input, has submit button
  - **Testing**: Enter URL, submit, verify form data captured

- [ ] **Form Validation**

  - **Files**: `lib/validators.ts`, `components/CitationForm.tsx`
  - **Dependencies**: Form component exists
  - **Acceptance Criteria**: Invalid URLs show error, valid URLs proceed
  - **Testing**: Submit `notaurl`, verify error. Submit `https://example.com`, verify no error

- [ ] **Loading States**
  - **Files**: `components/ui/Spinner.tsx`, `components/CitationForm.tsx`
  - **Dependencies**: Form component exists
  - **Acceptance Criteria**: Spinner shows during API call
  - **Testing**: Submit URL, observe spinner, verify it disappears after response

### 1.2 Scraper API with Puppeteer

- [ ] **Create Scrape API Route**

  - **Files**: `app/api/scrape/route.ts`
  - **Dependencies**: Docker with browserless running
  - **Acceptance Criteria**: POST with URL returns scraped metadata
  - **Testing**: `curl -X POST http://localhost:3000/api/scrape -d '{"url":"https://example.com"}'`

- [ ] **Puppeteer Connection to browserless**

  - **Files**: `lib/scraper.ts`, `lib/browser.ts`
  - **Dependencies**: browserless container running
  - **Acceptance Criteria**: Puppeteer connects via WebSocket
  - **Testing**: Scrape a known URL, verify console logs connection success

- [ ] **Metadata Extraction Logic**

  - **Files**: `lib/extractors/metadata.ts`, `lib/extractors/og-tags.ts`, `lib/extractors/schema.ts`
  - **Dependencies**: Puppeteer connection works
  - **Acceptance Criteria**: Extracts title, author, date, publisher from page
  - **Testing**: Scrape Wikipedia article, verify all fields populated

- [ ] **Fallback Extraction Strategies**
  - **Files**: `lib/extractors/fallback.ts`
  - **Dependencies**: Primary extraction works
  - **Acceptance Criteria**: When OG tags missing, falls back to meta tags, then DOM parsing
  - **Testing**: Scrape minimal HTML page, verify fallback kicks in

### 1.3 APA Format Output

- [ ] **Citation Formatter - APA**

  - **Files**: `lib/formatters/apa.ts`, `lib/formatters/types.ts`
  - **Dependencies**: Metadata extraction works
  - **Acceptance Criteria**: Returns correctly formatted APA 7th edition citation
  - **Testing**: Pass known metadata, compare output to manual APA citation

- [ ] **Citation Display Component**
  - **Files**: `components/CitationOutput.tsx`, `components/ui/Card.tsx`
  - **Dependencies**: APA formatter exists
  - **Acceptance Criteria**: Renders formatted citation with proper italics/punctuation
  - **Testing**: Visual inspection, compare to APA style guide

### 1.4 Copy to Clipboard

- [ ] **Clipboard Functionality**

  - **Files**: `hooks/useClipboard.ts`, `components/CopyButton.tsx`
  - **Dependencies**: Citation display exists
  - **Acceptance Criteria**: Click button copies citation text to clipboard
  - **Testing**: Click copy, paste in text editor, verify citation pasted

- [ ] **Copy Confirmation UI**
  - **Files**: `components/CopyButton.tsx`
  - **Dependencies**: Clipboard hook works
  - **Acceptance Criteria**: Button shows "Copied!" feedback for 2 seconds
  - **Testing**: Click copy, observe button text change and revert

### 1.5 Error Handling

- [ ] **API Error Responses**

  - **Files**: `lib/errors.ts`, `app/api/scrape/route.ts`
  - **Dependencies**: API route exists
  - **Acceptance Criteria**: Returns appropriate status codes and messages
  - **Testing**: Send invalid request, verify 400 response with message

- [ ] **User-Friendly Error Display**

  - **Files**: `components/ErrorMessage.tsx`, `components/CitationForm.tsx`
  - **Dependencies**: API returns errors
  - **Acceptance Criteria**: Errors display in UI with actionable messages
  - **Testing**: Submit blocked URL, verify friendly error shows

- [ ] **Timeout Handling**
  - **Files**: `lib/scraper.ts`, `lib/errors.ts`
  - **Dependencies**: Scraper works
  - **Acceptance Criteria**: 30-second timeout with graceful error
  - **Testing**: Scrape slow-loading page, verify timeout error after 30s

### 1.6 Mobile Responsive

- [ ] **Responsive Layout**

  - **Files**: `app/page.tsx`, `components/CitationForm.tsx`, `components/CitationOutput.tsx`
  - **Dependencies**: All components exist
  - **Acceptance Criteria**: Usable on 320px-1920px viewport widths
  - **Testing**: Chrome DevTools device emulation for mobile, tablet, desktop

- [ ] **Touch-Friendly UI**
  - **Files**: Various component files
  - **Dependencies**: Responsive layout done
  - **Acceptance Criteria**: Buttons minimum 44px touch target, adequate spacing
  - **Testing**: Test on actual mobile device

---

## Phase 2: Format Expansion

### 2.1 MLA Format

- [ ] **MLA 9th Edition Formatter**
  - **Files**: `lib/formatters/mla.ts`
  - **Dependencies**: Phase 1 complete
  - **Acceptance Criteria**: Output matches MLA 9th edition style
  - **Testing**: Compare output against Purdue OWL examples

### 2.2 Chicago Format

- [ ] **Chicago 17th Edition Formatter (Notes-Bibliography)**
  - **Files**: `lib/formatters/chicago.ts`
  - **Dependencies**: Phase 1 complete
  - **Acceptance Criteria**: Output matches Chicago style
  - **Testing**: Compare output against Chicago Manual examples

### 2.3 Harvard Format

- [ ] **Harvard Formatter**
  - **Files**: `lib/formatters/harvard.ts`
  - **Dependencies**: Phase 1 complete
  - **Acceptance Criteria**: Output matches Harvard referencing style
  - **Testing**: Compare output against university style guides

### 2.4 Format Selector UI

- [ ] **Format Dropdown/Tabs Component**

  - **Files**: `components/FormatSelector.tsx`, `components/ui/Tabs.tsx`
  - **Dependencies**: Multiple formatters exist
  - **Acceptance Criteria**: User can switch between formats, output updates
  - **Testing**: Generate citation, switch formats, verify output changes

- [ ] **Persist Format Preference**
  - **Files**: `hooks/useFormatPreference.ts`
  - **Dependencies**: Format selector works
  - **Acceptance Criteria**: Selected format persists across page refreshes (localStorage)
  - **Testing**: Select MLA, refresh page, verify MLA still selected

---

## Phase 3: Monetization

### 3.1 Grammarly Affiliate Integration

- [ ] **Affiliate Link Component**

  - **Files**: `components/affiliates/GrammarlyBanner.tsx`, `lib/affiliates/config.ts`
  - **Dependencies**: Phase 1 complete
  - **Acceptance Criteria**: Banner renders with proper affiliate tracking URL
  - **Testing**: Verify link contains correct affiliate ID, click tracks correctly

- [ ] **Strategic Placement**
  - **Files**: `app/page.tsx`, `components/CitationOutput.tsx`
  - **Dependencies**: Affiliate component exists
  - **Acceptance Criteria**: Banner appears after citation generation (high intent moment)
  - **Testing**: Generate citation, verify banner appears, test on mobile

### 3.2 Ad Placement Optimization

- [ ] **Ad Slot Components**

  - **Files**: `components/ads/AdSlot.tsx`, `components/ads/types.ts`
  - **Dependencies**: None
  - **Acceptance Criteria**: Placeholder slots ready for ad network integration
  - **Testing**: Verify slots render in correct positions

- [ ] **Ad Network Integration (Google AdSense)**
  - **Files**: `components/ads/GoogleAd.tsx`, `app/layout.tsx`
  - **Dependencies**: Ad slots exist, AdSense account approved
  - **Acceptance Criteria**: Ads load and display correctly
  - **Testing**: Verify ads appear, no console errors, CLS acceptable

### 3.3 Click Tracking

- [ ] **Event Tracking Setup**

  - **Files**: `lib/analytics/events.ts`, `lib/analytics/tracker.ts`
  - **Dependencies**: None
  - **Acceptance Criteria**: Custom events fire on key actions
  - **Testing**: Check network tab for tracking requests on click

- [ ] **Affiliate Click Attribution**
  - **Files**: `lib/affiliates/tracking.ts`
  - **Dependencies**: Event tracking works
  - **Acceptance Criteria**: Affiliate clicks logged with session context
  - **Testing**: Click affiliate link, verify event logged

---

## Phase 4: SEO & Content

### 4.1 Landing Pages Per Format

- [ ] **APA Citation Generator Page**

  - **Files**: `app/apa-citation-generator/page.tsx`, `app/apa-citation-generator/layout.tsx`
  - **Dependencies**: APA formatter works
  - **Acceptance Criteria**: SEO-optimized page targeting "APA citation generator"
  - **Testing**: Check meta tags, heading structure, content relevance

- [ ] **MLA Citation Generator Page**

  - **Files**: `app/mla-citation-generator/page.tsx`
  - **Dependencies**: MLA formatter works
  - **Acceptance Criteria**: SEO-optimized page targeting "MLA citation generator"
  - **Testing**: Same as APA page

- [ ] **Chicago/Harvard Landing Pages**
  - **Files**: `app/chicago-citation-generator/page.tsx`, `app/harvard-citation-generator/page.tsx`
  - **Dependencies**: Respective formatters work
  - **Acceptance Criteria**: SEO-optimized pages for each format
  - **Testing**: Same as above

### 4.2 How-To Guides

- [ ] **Guide Template Component**

  - **Files**: `components/content/GuideTemplate.tsx`, `components/content/TableOfContents.tsx`
  - **Dependencies**: None
  - **Acceptance Criteria**: Reusable template for educational content
  - **Testing**: Render sample guide, verify TOC links work

- [ ] **APA Format Guide**

  - **Files**: `app/guides/apa-format/page.tsx`, `content/guides/apa-format.mdx`
  - **Dependencies**: Guide template exists
  - **Acceptance Criteria**: Comprehensive guide with examples
  - **Testing**: Read through, verify accuracy against APA manual

- [ ] **Additional Format Guides**
  - **Files**: `app/guides/mla-format/page.tsx`, `app/guides/chicago-format/page.tsx`
  - **Dependencies**: Guide template exists
  - **Acceptance Criteria**: Guides for each supported format
  - **Testing**: Content review

### 4.3 Schema Markup

- [ ] **WebApplication Schema**

  - **Files**: `lib/seo/schema.ts`, `app/layout.tsx`
  - **Dependencies**: None
  - **Acceptance Criteria**: Valid WebApplication schema on all pages
  - **Testing**: Google Rich Results Test passes

- [ ] **HowTo Schema for Guides**

  - **Files**: `lib/seo/schema.ts`, `components/content/GuideTemplate.tsx`
  - **Dependencies**: Guides exist
  - **Acceptance Criteria**: HowTo schema on guide pages
  - **Testing**: Rich Results Test passes

- [ ] **FAQ Schema**
  - **Files**: `components/content/FAQ.tsx`, `lib/seo/schema.ts`
  - **Dependencies**: None
  - **Acceptance Criteria**: FAQ sections have valid schema
  - **Testing**: Rich Results Test passes

### 4.4 Sitemap Generation

- [ ] **Dynamic Sitemap**

  - **Files**: `app/sitemap.ts`
  - **Dependencies**: All pages exist
  - **Acceptance Criteria**: `/sitemap.xml` returns valid sitemap with all pages
  - **Testing**: Access sitemap, validate XML, check all URLs included

- [ ] **Robots.txt**
  - **Files**: `app/robots.ts`
  - **Dependencies**: None
  - **Acceptance Criteria**: Proper crawler directives
  - **Testing**: Verify `/robots.txt` accessible and correct

---

## Phase 5: Advanced Features

### 5.1 Citation History (localStorage)

- [ ] **History Storage Hook**

  - **Files**: `hooks/useHistory.ts`, `lib/storage.ts`
  - **Dependencies**: Phase 1 complete
  - **Acceptance Criteria**: Citations saved to localStorage, retrievable
  - **Testing**: Generate citation, refresh, verify in history

- [ ] **History UI**
  - **Files**: `components/CitationHistory.tsx`, `components/HistoryItem.tsx`
  - **Dependencies**: History storage works
  - **Acceptance Criteria**: View, copy, delete past citations
  - **Testing**: Add multiple citations, verify all CRUD operations

### 5.2 Batch URL Processing

- [ ] **Bulk Input UI**

  - **Files**: `components/BulkCitationForm.tsx`, `components/ui/Textarea.tsx`
  - **Dependencies**: Single URL works
  - **Acceptance Criteria**: Accept multiple URLs (one per line), process all
  - **Testing**: Paste 5 URLs, submit, verify 5 citations generated

- [ ] **Batch Processing API**

  - **Files**: `app/api/scrape/batch/route.ts`, `lib/queue.ts`
  - **Dependencies**: Single scrape works
  - **Acceptance Criteria**: Process URLs concurrently with rate limiting
  - **Testing**: Submit 10 URLs, verify all processed without overwhelming browserless

- [ ] **Export Options**
  - **Files**: `lib/export/bibtex.ts`, `lib/export/ris.ts`, `components/ExportButton.tsx`
  - **Dependencies**: Batch processing works
  - **Acceptance Criteria**: Export citations as BibTeX, RIS, plain text
  - **Testing**: Generate batch, export each format, import into reference manager

### 5.3 Browser Extension

- [ ] **Extension Scaffolding**

  - **Files**: `extension/manifest.json`, `extension/popup.html`, `extension/popup.js`
  - **Dependencies**: Core API works
  - **Acceptance Criteria**: Extension loads in Chrome
  - **Testing**: Load unpacked extension, verify popup renders

- [ ] **One-Click Citation**
  - **Files**: `extension/content.js`, `extension/background.js`
  - **Dependencies**: Extension scaffolding complete
  - **Acceptance Criteria**: Click extension on any page, get citation
  - **Testing**: Visit article, click extension, verify citation generated

### 5.4 API for Developers

- [ ] **Public API Endpoints**

  - **Files**: `app/api/v1/cite/route.ts`, `lib/api/rateLimit.ts`
  - **Dependencies**: Core scraping works
  - **Acceptance Criteria**: RESTful API with rate limiting
  - **Testing**: Make API requests, verify responses and rate limits

- [ ] **API Documentation**

  - **Files**: `app/api/docs/page.tsx`, `lib/api/openapi.ts`
  - **Dependencies**: API endpoints exist
  - **Acceptance Criteria**: Interactive API docs (Swagger/OpenAPI)
  - **Testing**: Access docs, try sample requests

- [ ] **API Key Management**
  - **Files**: `app/api/keys/route.ts`, `lib/api/auth.ts`
  - **Dependencies**: API exists
  - **Acceptance Criteria**: Users can generate and manage API keys
  - **Testing**: Create key, use in request, verify authentication

---

## Phase 6: Scale & Reliability

### 6.1 Database Integration

- [ ] **Schema Design**

  - **Files**: `prisma/schema.prisma`, `lib/db/client.ts`
  - **Dependencies**: None
  - **Acceptance Criteria**: Citation, User, APIKey models defined
  - **Testing**: `npx prisma db push` succeeds

- [ ] **Citation Persistence**
  - **Files**: `lib/db/citations.ts`, `app/api/citations/route.ts`
  - **Dependencies**: Schema exists
  - **Acceptance Criteria**: Citations saved to database
  - **Testing**: Generate citation, query database, verify record exists

### 6.2 User Accounts (Optional)

- [ ] **Authentication Setup**

  - **Files**: `lib/auth/config.ts`, `app/api/auth/[...nextauth]/route.ts`
  - **Dependencies**: Database works
  - **Acceptance Criteria**: Users can sign up/sign in (OAuth or email)
  - **Testing**: Complete auth flow, verify session created

- [ ] **User Dashboard**
  - **Files**: `app/dashboard/page.tsx`, `components/dashboard/CitationList.tsx`
  - **Dependencies**: Auth works, citations saved
  - **Acceptance Criteria**: Logged-in users see their citation history
  - **Testing**: Log in, verify personal citations displayed

### 6.3 Analytics Dashboard

- [ ] **Usage Metrics Collection**

  - **Files**: `lib/analytics/metrics.ts`, `lib/db/analytics.ts`
  - **Dependencies**: Database works
  - **Acceptance Criteria**: Track citations generated, formats used, errors
  - **Testing**: Generate citations, query metrics, verify counts accurate

- [ ] **Admin Dashboard**
  - **Files**: `app/admin/page.tsx`, `components/admin/Charts.tsx`
  - **Dependencies**: Metrics collection works
  - **Acceptance Criteria**: View usage charts, error rates, popular domains
  - **Testing**: Access dashboard, verify data displayed

### 6.4 CDN for Static Assets

- [ ] **CDN Configuration**

  - **Files**: `next.config.js`, deployment config
  - **Dependencies**: Production deployment exists
  - **Acceptance Criteria**: Static assets served from CDN
  - **Testing**: Check network tab, verify CDN URLs for assets

- [ ] **Image Optimization**
  - **Files**: `next.config.js`, image components
  - **Dependencies**: CDN configured
  - **Acceptance Criteria**: Images optimized and cached
  - **Testing**: Lighthouse performance audit passes

---

## Development Order (Recommended Sequence)

### Sprint 1: Foundation (Week 1)

1. Project scaffolding (0.1)
2. Docker setup (0.2)
3. URL input form (1.1)

### Sprint 2: Core Scraping (Week 2)

4. Scraper API (1.2)
5. APA formatter (1.3)
6. Copy to clipboard (1.4)

### Sprint 3: Polish MVP (Week 3)

7. Error handling (1.5)
8. Mobile responsive (1.6)
9. Basic CI/CD (0.3)

**MVP Launch Point**

### Sprint 4: Format Expansion (Week 4)

10. MLA format (2.1)
11. Chicago format (2.2)
12. Format selector (2.4)

### Sprint 5: Monetization (Week 5)

13. Affiliate integration (3.1)
14. Click tracking (3.3)
15. Ad placement (3.2)

### Sprint 6: SEO (Week 6-7)

16. Landing pages (4.1)
17. Schema markup (4.3)
18. Sitemap (4.4)

### Sprint 7: Advanced Features (Week 8-10)

19. Citation history (5.1)
20. Batch processing (5.2)
21. Export options

### Sprint 8: Scale (Week 11-12)

22. Database integration (6.1)
23. Analytics (6.3)
24. Performance optimization (6.4)

---

## Risk Register

| Risk                                         | Likelihood | Impact | Mitigation                                                                 |
| -------------------------------------------- | ---------- | ------ | -------------------------------------------------------------------------- |
| **Puppeteer timeout on slow sites**          | High       | Medium | 30s timeout, retry once, fallback to HEAD request for basic metadata       |
| **Rate limiting by target sites**            | High       | Medium | Rotate user agents, implement delays between requests, cache results       |
| **browserless container memory leaks**       | Medium     | High   | Health checks, auto-restart policy, max concurrent pages limit             |
| **Invalid/blocked URLs**                     | High       | Low    | URL validation, blocklist known problematic domains, clear error messages  |
| **Citation format accuracy issues**          | Medium     | High   | Comprehensive test suite with known-good examples, user feedback mechanism |
| **Mobile performance issues**                | Medium     | Medium | Lazy loading, optimized images, minimal JavaScript                         |
| **Ad revenue lower than expected**           | Medium     | Low    | Multiple monetization streams (affiliate, ads, premium API)                |
| **SEO rankings slow to improve**             | High       | Medium | Long-term content strategy, quality backlinks, technical SEO foundation    |
| **Compliance issues (GDPR, etc.)**           | Low        | High   | Privacy policy, cookie consent, minimal data collection                    |
| **browserless service unavailable**          | Low        | High   | Fallback to local Puppeteer, health monitoring with alerts                 |
| **API abuse/scraping**                       | Medium     | Medium | Rate limiting from Phase 1, CAPTCHA if needed, API keys for heavy users    |
| **Maintenance burden with multiple formats** | Medium     | Low    | Shared formatter base class, comprehensive tests, format-specific modules  |

---

## Success Metrics

### MVP (Phase 1)

- [ ] 95% uptime
- [ ] < 5s average citation generation time
- [ ] < 5% error rate
- [ ] Mobile Lighthouse score > 80

### Growth (Phase 2-4)

- [ ] 1,000 citations/day
- [ ] 10,000 monthly organic visitors
- [ ] $100/month affiliate revenue

### Scale (Phase 5-6)

- [ ] 10,000 citations/day
- [ ] 100,000 monthly organic visitors
- [ ] 1,000 registered users
- [ ] $1,000/month total revenue

---

## Notes

- **Priority**: Get MVP live quickly, iterate based on user feedback
- **Testing**: Each phase should have passing tests before moving on
- **Documentation**: Update this roadmap as priorities shift
- **Tech Debt**: Address during each phase, don't let it accumulate

---

_This is a living document. Update progress by checking off completed items and adding dates._

**Progress Log:**
| Date | Phase | Milestone | Notes |
|------|-------|-----------|-------|
| 2025-12-31 | 0 | Roadmap created | Initial planning complete |
