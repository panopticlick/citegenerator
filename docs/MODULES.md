# CiteGenerator.org - Module Architecture

## Module Overview Map

```
                                    +------------------+
                                    |   Next.js App    |
                                    |   (App Router)   |
                                    +--------+---------+
                                             |
              +------------------------------+------------------------------+
              |                              |                              |
    +---------v---------+         +----------v----------+         +---------v---------+
    |    API Routes     |         |     Components      |         |      Pages        |
    |  /api/scrape      |         |  (see COMPONENTS)   |         |   app/page.tsx    |
    |  /api/format      |         |                     |         |                   |
    |  /api/health      |         |                     |         |                   |
    +--------+----------+         +---------------------+         +-------------------+
             |
             +------------------+------------------+------------------+
             |                  |                  |                  |
    +--------v-------+  +-------v--------+  +------v-------+  +------v-------+
    |    Scraper     |  |    Citation    |  |  Validation  |  |  Rate Limit  |
    |    Module      |  |    Module      |  |    Module    |  |    Module    |
    |  lib/scraper/  |  | lib/citation/  |  | lib/validation| | lib/rate-limit|
    +--------+-------+  +-------+--------+  +--------------+  +--------------+
             |                  |
    +--------v-------+  +-------v--------+
    |  browserless   |  |   citation-js  |
    |    /chrome     |  |    library     |
    +----------------+  +----------------+
```

## Dependency Flow

```
Request Flow:
Client -> Rate Limiter -> Validation -> Scraper/Citation -> Response

Module Dependencies:
- API Routes depend on: Scraper, Citation, Validation, Rate Limit
- Scraper depends on: browserless/chrome (external), Validation
- Citation depends on: citation-js (npm package)
- Validation: standalone (no internal dependencies)
- Rate Limit: standalone (no internal dependencies)
```

---

## 1. Scraper Module

**Location**: `lib/scraper/`

### File Structure

```
lib/scraper/
  index.ts          # Main export (facade)
  browser.ts        # Browserless connection pool
  extractor.ts      # DOM parsing logic
  types.ts          # TypeScript interfaces
  __tests__/
    browser.test.ts
    extractor.test.ts
```

### types.ts

```typescript
// lib/scraper/types.ts

export interface MetadataResult {
  // Core fields (always present)
  url: string;
  title: string;
  accessDate: string; // ISO 8601 format

  // Author information
  authors: Author[];

  // Publication details
  publishedDate?: string;
  modifiedDate?: string;
  publisher?: string;
  siteName?: string;

  // Content metadata
  description?: string;
  language?: string;
  type?: WebPageType;

  // Raw extraction source (for debugging)
  _source?: ExtractionSource;
}

export interface Author {
  firstName?: string;
  lastName?: string;
  fullName: string;
}

export type WebPageType =
  | "article"
  | "website"
  | "blog"
  | "news"
  | "academic"
  | "unknown";

export type ExtractionSource =
  | "json-ld"
  | "meta-tags"
  | "og-tags"
  | "twitter-tags"
  | "heuristic";

export interface BrowserConfig {
  browserlessUrl: string;
  timeout: number;
  maxConcurrent: number;
}

export interface ExtractionContext {
  html: string;
  url: string;
  parsedUrl: URL;
}

export interface ScrapeOptions {
  timeout?: number;
  waitForSelector?: string;
  includeRaw?: boolean;
}

export class ScraperError extends Error {
  constructor(
    message: string,
    public readonly code: ScraperErrorCode,
    public readonly url?: string,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = "ScraperError";
  }
}

export type ScraperErrorCode =
  | "BROWSER_CONNECTION_FAILED"
  | "PAGE_LOAD_TIMEOUT"
  | "PAGE_NOT_FOUND"
  | "EXTRACTION_FAILED"
  | "INVALID_URL"
  | "BLOCKED_BY_ROBOTS";
```

### browser.ts

```typescript
// lib/scraper/browser.ts

import puppeteer, { Browser, Page } from "puppeteer-core";
import { BrowserConfig, ScraperError } from "./types";

const DEFAULT_CONFIG: BrowserConfig = {
  browserlessUrl: process.env.BROWSERLESS_URL || "ws://browserless:3000",
  timeout: 30000,
  maxConcurrent: 5,
};

class BrowserPool {
  private browser: Browser | null = null;
  private connecting: Promise<Browser> | null = null;
  private activePages = 0;
  private config: BrowserConfig;

  constructor(config: Partial<BrowserConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async connect(): Promise<Browser> {
    if (this.browser?.isConnected()) {
      return this.browser;
    }

    if (this.connecting) {
      return this.connecting;
    }

    this.connecting = this.createConnection();

    try {
      this.browser = await this.connecting;
      return this.browser;
    } finally {
      this.connecting = null;
    }
  }

  private async createConnection(): Promise<Browser> {
    try {
      const browser = await puppeteer.connect({
        browserWSEndpoint: this.config.browserlessUrl,
      });

      browser.on("disconnected", () => {
        this.browser = null;
        this.activePages = 0;
      });

      return browser;
    } catch (error) {
      throw new ScraperError(
        "Failed to connect to browserless",
        "BROWSER_CONNECTION_FAILED",
        undefined,
        error instanceof Error ? error : undefined,
      );
    }
  }

  async getPage(): Promise<Page> {
    if (this.activePages >= this.config.maxConcurrent) {
      throw new ScraperError(
        "Maximum concurrent pages reached",
        "BROWSER_CONNECTION_FAILED",
      );
    }

    const browser = await this.connect();
    const page = await browser.newPage();
    this.activePages++;

    // Set reasonable defaults
    await page.setUserAgent(
      "Mozilla/5.0 (compatible; CiteGenerator/1.0; +https://citegenerator.org)",
    );
    await page.setViewport({ width: 1280, height: 800 });
    page.setDefaultTimeout(this.config.timeout);

    return page;
  }

  async releasePage(page: Page): Promise<void> {
    try {
      if (!page.isClosed()) {
        await page.close();
      }
    } finally {
      this.activePages = Math.max(0, this.activePages - 1);
    }
  }

  async disconnect(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.activePages = 0;
    }
  }

  getStats(): { activePages: number; isConnected: boolean } {
    return {
      activePages: this.activePages,
      isConnected: this.browser?.isConnected() ?? false,
    };
  }
}

// Singleton instance
let poolInstance: BrowserPool | null = null;

export function getBrowserPool(config?: Partial<BrowserConfig>): BrowserPool {
  if (!poolInstance) {
    poolInstance = new BrowserPool(config);
  }
  return poolInstance;
}

export async function withPage<T>(
  fn: (page: Page) => Promise<T>,
  config?: Partial<BrowserConfig>,
): Promise<T> {
  const pool = getBrowserPool(config);
  const page = await pool.getPage();

  try {
    return await fn(page);
  } finally {
    await pool.releasePage(page);
  }
}

export { BrowserPool };
```

### extractor.ts

```typescript
// lib/scraper/extractor.ts

import { JSDOM } from "jsdom";
import {
  MetadataResult,
  Author,
  WebPageType,
  ExtractionContext,
  ExtractionSource,
} from "./types";

interface JsonLdArticle {
  "@type"?: string;
  headline?: string;
  name?: string;
  author?: JsonLdAuthor | JsonLdAuthor[] | string | string[];
  datePublished?: string;
  dateModified?: string;
  publisher?: { name?: string } | string;
  description?: string;
  inLanguage?: string;
}

interface JsonLdAuthor {
  "@type"?: string;
  name?: string;
  givenName?: string;
  familyName?: string;
}

export function extractMetadata(context: ExtractionContext): MetadataResult {
  const dom = new JSDOM(context.html);
  const document = dom.window.document;

  // Try extraction methods in priority order
  const jsonLd = extractFromJsonLd(document);
  const metaTags = extractFromMetaTags(document);
  const ogTags = extractFromOpenGraph(document);
  const twitterTags = extractFromTwitterCards(document);
  const heuristic = extractHeuristic(document);

  // Merge results with priority: JSON-LD > Meta > OG > Twitter > Heuristic
  const merged = mergeResults([
    jsonLd,
    metaTags,
    ogTags,
    twitterTags,
    heuristic,
  ]);

  return {
    url: context.url,
    title: merged.title || document.title || context.parsedUrl.hostname,
    accessDate: new Date().toISOString(),
    authors: merged.authors || [],
    publishedDate: merged.publishedDate,
    modifiedDate: merged.modifiedDate,
    publisher: merged.publisher || context.parsedUrl.hostname,
    siteName: merged.siteName || context.parsedUrl.hostname,
    description: merged.description,
    language: merged.language || document.documentElement.lang || undefined,
    type: merged.type || "website",
    _source: merged._source,
  };
}

function extractFromJsonLd(document: Document): Partial<MetadataResult> {
  const scripts = document.querySelectorAll(
    'script[type="application/ld+json"]',
  );

  for (const script of scripts) {
    try {
      const data = JSON.parse(script.textContent || "");
      const items = Array.isArray(data) ? data : [data];

      for (const item of items) {
        if (isArticleType(item["@type"])) {
          return parseJsonLdArticle(item);
        }
      }
    } catch {
      // Invalid JSON-LD, continue to next script
    }
  }

  return {};
}

function isArticleType(type?: string | string[]): boolean {
  const articleTypes = [
    "Article",
    "NewsArticle",
    "BlogPosting",
    "ScholarlyArticle",
    "TechArticle",
    "WebPage",
  ];

  if (Array.isArray(type)) {
    return type.some((t) => articleTypes.includes(t));
  }
  return type ? articleTypes.includes(type) : false;
}

function parseJsonLdArticle(item: JsonLdArticle): Partial<MetadataResult> {
  return {
    title: item.headline || item.name,
    authors: parseJsonLdAuthors(item.author),
    publishedDate: item.datePublished,
    modifiedDate: item.dateModified,
    publisher:
      typeof item.publisher === "string"
        ? item.publisher
        : item.publisher?.name,
    description: item.description,
    language: item.inLanguage,
    type: mapJsonLdType(item["@type"]),
    _source: "json-ld",
  };
}

function parseJsonLdAuthors(author: JsonLdArticle["author"]): Author[] {
  if (!author) return [];

  const authorList = Array.isArray(author) ? author : [author];

  return authorList
    .map((a) => {
      if (typeof a === "string") {
        return parseAuthorName(a);
      }
      if (a.name) {
        return {
          fullName: a.name,
          firstName: a.givenName,
          lastName: a.familyName,
        };
      }
      return { fullName: "Unknown" };
    })
    .filter((a) => a.fullName !== "Unknown");
}

function parseAuthorName(name: string): Author {
  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return { fullName: name };
  }

  return {
    fullName: name,
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts[parts.length - 1],
  };
}

function mapJsonLdType(type?: string | string[]): WebPageType {
  const typeStr = Array.isArray(type) ? type[0] : type;

  switch (typeStr) {
    case "NewsArticle":
      return "news";
    case "BlogPosting":
      return "blog";
    case "ScholarlyArticle":
      return "academic";
    case "Article":
    case "TechArticle":
      return "article";
    default:
      return "website";
  }
}

function extractFromMetaTags(document: Document): Partial<MetadataResult> {
  const getMeta = (name: string): string | undefined => {
    const el = document.querySelector(
      `meta[name="${name}"], meta[name="${name.toLowerCase()}"]`,
    );
    return el?.getAttribute("content") || undefined;
  };

  const authorStr = getMeta("author");

  return {
    title: getMeta("title"),
    authors: authorStr ? [parseAuthorName(authorStr)] : [],
    publishedDate: getMeta("article:published_time") || getMeta("date"),
    modifiedDate: getMeta("article:modified_time"),
    description: getMeta("description"),
    language: getMeta("language"),
    _source: "meta-tags",
  };
}

function extractFromOpenGraph(document: Document): Partial<MetadataResult> {
  const getOg = (property: string): string | undefined => {
    const el = document.querySelector(`meta[property="og:${property}"]`);
    return el?.getAttribute("content") || undefined;
  };

  return {
    title: getOg("title"),
    siteName: getOg("site_name"),
    description: getOg("description"),
    type: mapOgType(getOg("type")),
    _source: "og-tags",
  };
}

function mapOgType(type?: string): WebPageType | undefined {
  switch (type) {
    case "article":
      return "article";
    case "website":
      return "website";
    default:
      return undefined;
  }
}

function extractFromTwitterCards(document: Document): Partial<MetadataResult> {
  const getTwitter = (name: string): string | undefined => {
    const el = document.querySelector(
      `meta[name="twitter:${name}"], meta[property="twitter:${name}"]`,
    );
    return el?.getAttribute("content") || undefined;
  };

  const creator = getTwitter("creator");

  return {
    title: getTwitter("title"),
    authors: creator ? [{ fullName: creator.replace(/^@/, "") }] : [],
    description: getTwitter("description"),
    _source: "twitter-tags",
  };
}

function extractHeuristic(document: Document): Partial<MetadataResult> {
  // Fallback extraction using common selectors
  const title =
    document.querySelector("h1")?.textContent?.trim() ||
    document.querySelector('[class*="title"]')?.textContent?.trim();

  const authorEl = document.querySelector(
    '[rel="author"], [class*="author"], [itemprop="author"]',
  );
  const authorName = authorEl?.textContent?.trim();

  const dateEl = document.querySelector(
    'time[datetime], [class*="date"], [itemprop="datePublished"]',
  );
  const dateStr =
    dateEl?.getAttribute("datetime") || dateEl?.textContent?.trim();

  return {
    title,
    authors: authorName ? [parseAuthorName(authorName)] : [],
    publishedDate: dateStr ? normalizeDate(dateStr) : undefined,
    _source: "heuristic",
  };
}

function normalizeDate(dateStr: string): string | undefined {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return undefined;
    return date.toISOString();
  } catch {
    return undefined;
  }
}

function mergeResults(
  results: Partial<MetadataResult>[],
): Partial<MetadataResult> {
  const merged: Partial<MetadataResult> = {};

  for (const result of results) {
    for (const [key, value] of Object.entries(result)) {
      if (value !== undefined && value !== null && value !== "") {
        if (key === "authors" && Array.isArray(value) && value.length > 0) {
          if (!merged.authors || merged.authors.length === 0) {
            merged.authors = value;
            merged._source = result._source;
          }
        } else if (!(key in merged)) {
          (merged as Record<string, unknown>)[key] = value;
        }
      }
    }
  }

  return merged;
}
```

### index.ts

```typescript
// lib/scraper/index.ts

import { Page } from "puppeteer-core";
import { withPage, getBrowserPool, BrowserPool } from "./browser";
import { extractMetadata } from "./extractor";
import {
  MetadataResult,
  ScrapeOptions,
  ScraperError,
  BrowserConfig,
} from "./types";

export * from "./types";
export { getBrowserPool, BrowserPool } from "./browser";

const DEFAULT_OPTIONS: ScrapeOptions = {
  timeout: 30000,
  includeRaw: false,
};

export async function scrapeMetadata(
  url: string,
  options: ScrapeOptions = {},
): Promise<MetadataResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return withPage(async (page: Page) => {
    try {
      const response = await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: opts.timeout,
      });

      if (!response) {
        throw new ScraperError(
          "No response received from page",
          "PAGE_LOAD_TIMEOUT",
          url,
        );
      }

      const status = response.status();
      if (status === 404) {
        throw new ScraperError("Page not found", "PAGE_NOT_FOUND", url);
      }

      if (status >= 400) {
        throw new ScraperError(
          `HTTP error: ${status}`,
          "PAGE_LOAD_TIMEOUT",
          url,
        );
      }

      // Wait for additional selector if specified
      if (opts.waitForSelector) {
        await page.waitForSelector(opts.waitForSelector, {
          timeout: opts.timeout,
        });
      }

      const html = await page.content();
      const parsedUrl = new URL(url);

      const metadata = extractMetadata({ html, url, parsedUrl });

      if (!opts.includeRaw) {
        delete metadata._source;
      }

      return metadata;
    } catch (error) {
      if (error instanceof ScraperError) {
        throw error;
      }

      throw new ScraperError(
        `Failed to scrape ${url}: ${error instanceof Error ? error.message : "Unknown error"}`,
        "EXTRACTION_FAILED",
        url,
        error instanceof Error ? error : undefined,
      );
    }
  });
}

// Health check for browserless connection
export async function checkBrowserHealth(): Promise<boolean> {
  try {
    const pool = getBrowserPool();
    await pool.connect();
    return pool.getStats().isConnected;
  } catch {
    return false;
  }
}
```

### Unit Tests

```typescript
// lib/scraper/__tests__/extractor.test.ts

import { extractMetadata } from "../extractor";
import { ExtractionContext } from "../types";

describe("extractMetadata", () => {
  const createContext = (
    html: string,
    url = "https://example.com/article",
  ): ExtractionContext => ({
    html,
    url,
    parsedUrl: new URL(url),
  });

  describe("JSON-LD extraction", () => {
    it("should extract metadata from JSON-LD Article", () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <script type="application/ld+json">
          {
            "@type": "Article",
            "headline": "Test Article Title",
            "author": {
              "@type": "Person",
              "name": "John Doe",
              "givenName": "John",
              "familyName": "Doe"
            },
            "datePublished": "2024-01-15T10:00:00Z",
            "publisher": { "name": "Example News" }
          }
          </script>
        </head>
        <body></body>
        </html>
      `;

      const result = extractMetadata(createContext(html));

      expect(result.title).toBe("Test Article Title");
      expect(result.authors).toHaveLength(1);
      expect(result.authors[0].fullName).toBe("John Doe");
      expect(result.authors[0].firstName).toBe("John");
      expect(result.authors[0].lastName).toBe("Doe");
      expect(result.publishedDate).toBe("2024-01-15T10:00:00Z");
      expect(result.publisher).toBe("Example News");
    });

    it("should handle multiple authors", () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <script type="application/ld+json">
          {
            "@type": "Article",
            "headline": "Collaborative Article",
            "author": [
              { "name": "Alice Smith" },
              { "name": "Bob Jones" }
            ]
          }
          </script>
        </head>
        <body></body>
        </html>
      `;

      const result = extractMetadata(createContext(html));

      expect(result.authors).toHaveLength(2);
      expect(result.authors[0].fullName).toBe("Alice Smith");
      expect(result.authors[1].fullName).toBe("Bob Jones");
    });
  });

  describe("Meta tag extraction", () => {
    it("should extract from standard meta tags", () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="title" content="Meta Title">
          <meta name="author" content="Jane Smith">
          <meta name="description" content="Article description">
          <meta name="date" content="2024-02-20">
        </head>
        <body></body>
        </html>
      `;

      const result = extractMetadata(createContext(html));

      expect(result.title).toBe("Meta Title");
      expect(result.authors[0].fullName).toBe("Jane Smith");
      expect(result.description).toBe("Article description");
    });
  });

  describe("OpenGraph extraction", () => {
    it("should extract from OG tags", () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta property="og:title" content="OG Title">
          <meta property="og:site_name" content="Example Site">
          <meta property="og:description" content="OG Description">
          <meta property="og:type" content="article">
        </head>
        <body></body>
        </html>
      `;

      const result = extractMetadata(createContext(html));

      expect(result.title).toBe("OG Title");
      expect(result.siteName).toBe("Example Site");
      expect(result.type).toBe("article");
    });
  });

  describe("Fallback extraction", () => {
    it("should use document title as fallback", () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Fallback Title</title>
        </head>
        <body></body>
        </html>
      `;

      const result = extractMetadata(createContext(html));

      expect(result.title).toBe("Fallback Title");
    });

    it("should use hostname as ultimate fallback", () => {
      const html = `<!DOCTYPE html><html><head></head><body></body></html>`;
      const result = extractMetadata(createContext(html));

      expect(result.title).toBe("example.com");
      expect(result.siteName).toBe("example.com");
    });
  });

  describe("Priority merging", () => {
    it("should prefer JSON-LD over meta tags", () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="title" content="Meta Title">
          <script type="application/ld+json">
          { "@type": "Article", "headline": "JSON-LD Title" }
          </script>
        </head>
        <body></body>
        </html>
      `;

      const result = extractMetadata(createContext(html));

      expect(result.title).toBe("JSON-LD Title");
    });
  });
});
```

```typescript
// lib/scraper/__tests__/browser.test.ts

import { BrowserPool } from "../browser";

// Mock puppeteer-core
jest.mock("puppeteer-core", () => ({
  connect: jest.fn(),
}));

describe("BrowserPool", () => {
  let mockBrowser: {
    isConnected: jest.Mock;
    newPage: jest.Mock;
    close: jest.Mock;
    on: jest.Mock;
  };

  let mockPage: {
    setUserAgent: jest.Mock;
    setViewport: jest.Mock;
    setDefaultTimeout: jest.Mock;
    isClosed: jest.Mock;
    close: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockPage = {
      setUserAgent: jest.fn(),
      setViewport: jest.fn(),
      setDefaultTimeout: jest.fn(),
      isClosed: jest.fn().mockReturnValue(false),
      close: jest.fn(),
    };

    mockBrowser = {
      isConnected: jest.fn().mockReturnValue(true),
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
      on: jest.fn(),
    };

    const puppeteer = require("puppeteer-core");
    puppeteer.connect.mockResolvedValue(mockBrowser);
  });

  it("should connect to browserless", async () => {
    const pool = new BrowserPool({ browserlessUrl: "ws://test:3000" });
    await pool.connect();

    const puppeteer = require("puppeteer-core");
    expect(puppeteer.connect).toHaveBeenCalledWith({
      browserWSEndpoint: "ws://test:3000",
    });
  });

  it("should reuse existing connection", async () => {
    const pool = new BrowserPool();

    await pool.connect();
    await pool.connect();

    const puppeteer = require("puppeteer-core");
    expect(puppeteer.connect).toHaveBeenCalledTimes(1);
  });

  it("should get page with defaults set", async () => {
    const pool = new BrowserPool();
    const page = await pool.getPage();

    expect(mockPage.setUserAgent).toHaveBeenCalled();
    expect(mockPage.setViewport).toHaveBeenCalledWith({
      width: 1280,
      height: 800,
    });
    expect(page).toBe(mockPage);
  });

  it("should track active pages", async () => {
    const pool = new BrowserPool();

    expect(pool.getStats().activePages).toBe(0);

    const page = await pool.getPage();
    expect(pool.getStats().activePages).toBe(1);

    await pool.releasePage(page as unknown as import("puppeteer-core").Page);
    expect(pool.getStats().activePages).toBe(0);
  });

  it("should enforce max concurrent pages", async () => {
    const pool = new BrowserPool({ maxConcurrent: 2 });

    await pool.getPage();
    await pool.getPage();

    await expect(pool.getPage()).rejects.toThrow(
      "Maximum concurrent pages reached",
    );
  });
});
```

---

## 2. Citation Module

**Location**: `lib/citation/`

### File Structure

```
lib/citation/
  index.ts          # Main export
  formatter.ts      # citation-js wrapper
  templates.ts      # Format templates
  types.ts          # TypeScript interfaces
  __tests__/
    formatter.test.ts
```

### types.ts

```typescript
// lib/citation/types.ts

export type CitationStyle = "apa" | "mla" | "chicago" | "harvard";

export interface CitationInput {
  // Required
  title: string;
  url: string;
  accessDate: string;

  // Optional
  authors?: CitationAuthor[];
  publishedDate?: string;
  siteName?: string;
  publisher?: string;
}

export interface CitationAuthor {
  firstName?: string;
  lastName?: string;
  fullName: string;
}

export interface FormattedCitation {
  style: CitationStyle;
  html: string;
  text: string;
  bibtex?: string;
}

export interface FormatOptions {
  style: CitationStyle;
  includeBibtex?: boolean;
}

export class CitationError extends Error {
  constructor(
    message: string,
    public readonly code: CitationErrorCode,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = "CitationError";
  }
}

export type CitationErrorCode =
  | "INVALID_INPUT"
  | "UNSUPPORTED_STYLE"
  | "FORMATTING_FAILED";
```

### templates.ts

```typescript
// lib/citation/templates.ts

import { CitationStyle, CitationInput, CitationAuthor } from "./types";

export interface StyleTemplate {
  formatHtml(input: CitationInput): string;
  formatText(input: CitationInput): string;
}

function formatAuthors(
  authors: CitationAuthor[] | undefined,
  style: CitationStyle,
): string {
  if (!authors || authors.length === 0) {
    return "";
  }

  switch (style) {
    case "apa":
      return formatAuthorsApa(authors);
    case "mla":
      return formatAuthorsMla(authors);
    case "chicago":
      return formatAuthorsChicago(authors);
    case "harvard":
      return formatAuthorsHarvard(authors);
  }
}

function formatAuthorsApa(authors: CitationAuthor[]): string {
  // APA: LastName, F. M., & LastName, F. M.
  return authors
    .map((a, i) => {
      const lastName = a.lastName || a.fullName.split(" ").pop() || a.fullName;
      const firstInitial =
        a.firstName?.[0] || a.fullName.split(" ")[0]?.[0] || "";
      const formatted = `${lastName}, ${firstInitial}.`;

      if (i === authors.length - 1 && authors.length > 1) {
        return `& ${formatted}`;
      }
      return formatted;
    })
    .join(" ");
}

function formatAuthorsMla(authors: CitationAuthor[]): string {
  // MLA: LastName, FirstName, and FirstName LastName.
  if (authors.length === 1) {
    const a = authors[0];
    const lastName = a.lastName || a.fullName.split(" ").pop() || a.fullName;
    const firstName =
      a.firstName || a.fullName.split(" ").slice(0, -1).join(" ") || "";
    return firstName ? `${lastName}, ${firstName}` : lastName;
  }

  return authors
    .map((a, i) => {
      if (i === 0) {
        const lastName =
          a.lastName || a.fullName.split(" ").pop() || a.fullName;
        const firstName =
          a.firstName || a.fullName.split(" ").slice(0, -1).join(" ") || "";
        return firstName ? `${lastName}, ${firstName}` : lastName;
      }
      if (i === authors.length - 1) {
        return `and ${a.fullName}`;
      }
      return a.fullName;
    })
    .join(", ");
}

function formatAuthorsChicago(authors: CitationAuthor[]): string {
  // Chicago: LastName, FirstName, and FirstName LastName.
  return formatAuthorsMla(authors); // Same as MLA for web sources
}

function formatAuthorsHarvard(authors: CitationAuthor[]): string {
  // Harvard: LastName, F. and LastName, F.
  return authors
    .map((a, i) => {
      const lastName = a.lastName || a.fullName.split(" ").pop() || a.fullName;
      const firstInitial =
        a.firstName?.[0] || a.fullName.split(" ")[0]?.[0] || "";
      const formatted = `${lastName}, ${firstInitial}.`;

      if (i === authors.length - 1 && authors.length > 1) {
        return `and ${formatted}`;
      }
      return formatted;
    })
    .join(" ");
}

function formatDate(dateStr: string | undefined, style: CitationStyle): string {
  if (!dateStr) {
    return style === "apa" ? "(n.d.)" : "n.d.";
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return style === "apa" ? "(n.d.)" : "n.d.";
  }

  const year = date.getFullYear();
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const day = date.getDate();

  switch (style) {
    case "apa":
      return `(${year}, ${month} ${day})`;
    case "mla":
      return `${day} ${month.slice(0, 3)}. ${year}`;
    case "chicago":
      return `${month} ${day}, ${year}`;
    case "harvard":
      return `${year}`;
  }
}

function formatAccessDate(dateStr: string, style: CitationStyle): string {
  const date = new Date(dateStr);
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();

  switch (style) {
    case "apa":
      return `Retrieved ${month} ${day}, ${year}`;
    case "mla":
      return `Accessed ${day} ${month.slice(0, 3)}. ${year}`;
    case "chicago":
      return `Accessed ${month} ${day}, ${year}`;
    case "harvard":
      return `(Accessed: ${day} ${month} ${year})`;
  }
}

export const templates: Record<CitationStyle, StyleTemplate> = {
  apa: {
    formatHtml(input: CitationInput): string {
      const authors = formatAuthors(input.authors, "apa");
      const date = formatDate(input.publishedDate, "apa");
      const title = input.title;
      const siteName = input.siteName || input.publisher || "";
      const url = input.url;
      const accessed = formatAccessDate(input.accessDate, "apa");

      // APA 7th format for web pages
      const parts = [];
      if (authors) parts.push(authors);
      parts.push(date);
      parts.push(`<em>${title}</em>.`);
      if (siteName) parts.push(`${siteName}.`);
      parts.push(`${accessed}, from <a href="${url}">${url}</a>`);

      return parts.join(" ");
    },
    formatText(input: CitationInput): string {
      const authors = formatAuthors(input.authors, "apa");
      const date = formatDate(input.publishedDate, "apa");
      const title = input.title;
      const siteName = input.siteName || input.publisher || "";
      const url = input.url;
      const accessed = formatAccessDate(input.accessDate, "apa");

      const parts = [];
      if (authors) parts.push(authors);
      parts.push(date);
      parts.push(`${title}.`);
      if (siteName) parts.push(`${siteName}.`);
      parts.push(`${accessed}, from ${url}`);

      return parts.join(" ");
    },
  },

  mla: {
    formatHtml(input: CitationInput): string {
      const authors = formatAuthors(input.authors, "mla");
      const title = input.title;
      const siteName = input.siteName || input.publisher || "";
      const date = formatDate(input.publishedDate, "mla");
      const url = input.url;
      const accessed = formatAccessDate(input.accessDate, "mla");

      // MLA 9th format
      const parts = [];
      if (authors) parts.push(`${authors}.`);
      parts.push(`"${title}."`);
      if (siteName) parts.push(`<em>${siteName}</em>,`);
      if (date !== "n.d.") parts.push(`${date},`);
      parts.push(`<a href="${url}">${url}</a>.`);
      parts.push(accessed + ".");

      return parts.join(" ");
    },
    formatText(input: CitationInput): string {
      const authors = formatAuthors(input.authors, "mla");
      const title = input.title;
      const siteName = input.siteName || input.publisher || "";
      const date = formatDate(input.publishedDate, "mla");
      const url = input.url;
      const accessed = formatAccessDate(input.accessDate, "mla");

      const parts = [];
      if (authors) parts.push(`${authors}.`);
      parts.push(`"${title}."`);
      if (siteName) parts.push(`${siteName},`);
      if (date !== "n.d.") parts.push(`${date},`);
      parts.push(`${url}.`);
      parts.push(accessed + ".");

      return parts.join(" ");
    },
  },

  chicago: {
    formatHtml(input: CitationInput): string {
      const authors = formatAuthors(input.authors, "chicago");
      const title = input.title;
      const siteName = input.siteName || input.publisher || "";
      const date = formatDate(input.publishedDate, "chicago");
      const url = input.url;
      const accessed = formatAccessDate(input.accessDate, "chicago");

      // Chicago 17th format (bibliography)
      const parts = [];
      if (authors) parts.push(`${authors}.`);
      parts.push(`"${title}."`);
      if (siteName) parts.push(`<em>${siteName}</em>.`);
      if (date !== "n.d.") parts.push(`${date}.`);
      parts.push(`${accessed}.`);
      parts.push(`<a href="${url}">${url}</a>.`);

      return parts.join(" ");
    },
    formatText(input: CitationInput): string {
      const authors = formatAuthors(input.authors, "chicago");
      const title = input.title;
      const siteName = input.siteName || input.publisher || "";
      const date = formatDate(input.publishedDate, "chicago");
      const url = input.url;
      const accessed = formatAccessDate(input.accessDate, "chicago");

      const parts = [];
      if (authors) parts.push(`${authors}.`);
      parts.push(`"${title}."`);
      if (siteName) parts.push(`${siteName}.`);
      if (date !== "n.d.") parts.push(`${date}.`);
      parts.push(`${accessed}.`);
      parts.push(`${url}.`);

      return parts.join(" ");
    },
  },

  harvard: {
    formatHtml(input: CitationInput): string {
      const authors = formatAuthors(input.authors, "harvard");
      const year = formatDate(input.publishedDate, "harvard");
      const title = input.title;
      const siteName = input.siteName || input.publisher || "";
      const url = input.url;
      const accessed = formatAccessDate(input.accessDate, "harvard");

      const parts = [];
      if (authors) parts.push(authors);
      parts.push(`(${year})`);
      parts.push(`<em>${title}</em>.`);
      if (siteName) parts.push(`${siteName}.`);
      parts.push(`Available at: <a href="${url}">${url}</a>`);
      parts.push(accessed);

      return parts.join(" ");
    },
    formatText(input: CitationInput): string {
      const authors = formatAuthors(input.authors, "harvard");
      const year = formatDate(input.publishedDate, "harvard");
      const title = input.title;
      const siteName = input.siteName || input.publisher || "";
      const url = input.url;
      const accessed = formatAccessDate(input.accessDate, "harvard");

      const parts = [];
      if (authors) parts.push(authors);
      parts.push(`(${year})`);
      parts.push(`${title}.`);
      if (siteName) parts.push(`${siteName}.`);
      parts.push(`Available at: ${url}`);
      parts.push(accessed);

      return parts.join(" ");
    },
  },
};
```

### formatter.ts

```typescript
// lib/citation/formatter.ts

import Cite from "citation-js";
import { templates } from "./templates";
import {
  CitationStyle,
  CitationInput,
  FormattedCitation,
  FormatOptions,
  CitationError,
} from "./types";

const SUPPORTED_STYLES: CitationStyle[] = ["apa", "mla", "chicago", "harvard"];

export function formatCitation(
  input: CitationInput,
  options: FormatOptions,
): FormattedCitation {
  // Validate style
  if (!SUPPORTED_STYLES.includes(options.style)) {
    throw new CitationError(
      `Unsupported citation style: ${options.style}`,
      "UNSUPPORTED_STYLE",
    );
  }

  // Validate required fields
  if (!input.title || !input.url || !input.accessDate) {
    throw new CitationError(
      "Missing required fields: title, url, and accessDate are required",
      "INVALID_INPUT",
    );
  }

  try {
    const template = templates[options.style];

    const result: FormattedCitation = {
      style: options.style,
      html: template.formatHtml(input),
      text: template.formatText(input),
    };

    if (options.includeBibtex) {
      result.bibtex = generateBibtex(input);
    }

    return result;
  } catch (error) {
    throw new CitationError(
      `Failed to format citation: ${error instanceof Error ? error.message : "Unknown error"}`,
      "FORMATTING_FAILED",
      error instanceof Error ? error : undefined,
    );
  }
}

function generateBibtex(input: CitationInput): string {
  // Create citation-js compatible data
  const citeData = {
    type: "webpage",
    title: input.title,
    URL: input.url,
    accessed: {
      "date-parts": [parseDate(input.accessDate)],
    },
    author: input.authors?.map((a) => ({
      family: a.lastName || a.fullName.split(" ").pop() || a.fullName,
      given: a.firstName || a.fullName.split(" ").slice(0, -1).join(" ") || "",
    })),
    issued: input.publishedDate
      ? { "date-parts": [parseDate(input.publishedDate)] }
      : undefined,
    "container-title": input.siteName,
    publisher: input.publisher,
  };

  try {
    const cite = new Cite(citeData);
    return cite.format("bibtex");
  } catch {
    // Fallback to manual BibTeX generation
    return generateManualBibtex(input);
  }
}

function parseDate(dateStr: string): number[] {
  const date = new Date(dateStr);
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()];
}

function generateManualBibtex(input: CitationInput): string {
  const key = generateBibtexKey(input);
  const authors =
    input.authors?.map((a) => a.fullName).join(" and ") || "Unknown";
  const date = input.publishedDate
    ? new Date(input.publishedDate).getFullYear()
    : "n.d.";
  const accessDate = new Date(input.accessDate).toISOString().split("T")[0];

  return `@misc{${key},
  author = {${authors}},
  title = {${input.title}},
  year = {${date}},
  url = {${input.url}},
  urldate = {${accessDate}},
  note = {${input.siteName || ""}}
}`;
}

function generateBibtexKey(input: CitationInput): string {
  const firstAuthor =
    input.authors?.[0]?.lastName ||
    input.authors?.[0]?.fullName.split(" ").pop() ||
    "unknown";
  const year = input.publishedDate
    ? new Date(input.publishedDate).getFullYear()
    : "nd";
  const titleWord = input.title
    .split(" ")[0]
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  return `${firstAuthor.toLowerCase()}${year}${titleWord}`;
}

export function getSupportedStyles(): CitationStyle[] {
  return [...SUPPORTED_STYLES];
}

export function isValidStyle(style: string): style is CitationStyle {
  return SUPPORTED_STYLES.includes(style as CitationStyle);
}
```

### index.ts

```typescript
// lib/citation/index.ts

export * from "./types";
export { formatCitation, getSupportedStyles, isValidStyle } from "./formatter";
export { templates } from "./templates";
```

### Unit Tests

```typescript
// lib/citation/__tests__/formatter.test.ts

import { formatCitation, getSupportedStyles, isValidStyle } from "../formatter";
import { CitationInput, CitationError } from "../types";

describe("formatCitation", () => {
  const validInput: CitationInput = {
    title: "How to Write Better Code",
    url: "https://example.com/article",
    accessDate: "2024-03-15T10:00:00Z",
    authors: [{ fullName: "John Smith", firstName: "John", lastName: "Smith" }],
    publishedDate: "2024-01-10T00:00:00Z",
    siteName: "Example Blog",
  };

  describe("APA style", () => {
    it("should format APA citation correctly", () => {
      const result = formatCitation(validInput, { style: "apa" });

      expect(result.style).toBe("apa");
      expect(result.text).toContain("Smith, J.");
      expect(result.text).toContain("(2024, January 10)");
      expect(result.text).toContain("How to Write Better Code");
      expect(result.text).toContain("Example Blog");
      expect(result.text).toContain("https://example.com/article");
    });

    it("should include HTML formatting", () => {
      const result = formatCitation(validInput, { style: "apa" });

      expect(result.html).toContain("<em>");
      expect(result.html).toContain("<a href=");
    });
  });

  describe("MLA style", () => {
    it("should format MLA citation correctly", () => {
      const result = formatCitation(validInput, { style: "mla" });

      expect(result.style).toBe("mla");
      expect(result.text).toContain("Smith, John");
      expect(result.text).toContain('"How to Write Better Code."');
    });
  });

  describe("Chicago style", () => {
    it("should format Chicago citation correctly", () => {
      const result = formatCitation(validInput, { style: "chicago" });

      expect(result.style).toBe("chicago");
      expect(result.text).toContain("Smith, John");
      expect(result.text).toContain("Accessed");
    });
  });

  describe("Harvard style", () => {
    it("should format Harvard citation correctly", () => {
      const result = formatCitation(validInput, { style: "harvard" });

      expect(result.style).toBe("harvard");
      expect(result.text).toContain("(2024)");
      expect(result.text).toContain("Available at:");
    });
  });

  describe("Edge cases", () => {
    it("should handle missing author", () => {
      const input: CitationInput = {
        title: "Anonymous Article",
        url: "https://example.com",
        accessDate: "2024-03-15T10:00:00Z",
      };

      const result = formatCitation(input, { style: "apa" });
      expect(result.text).toContain("Anonymous Article");
    });

    it("should handle missing date with (n.d.)", () => {
      const input: CitationInput = {
        title: "Undated Article",
        url: "https://example.com",
        accessDate: "2024-03-15T10:00:00Z",
        authors: [{ fullName: "Jane Doe" }],
      };

      const result = formatCitation(input, { style: "apa" });
      expect(result.text).toContain("(n.d.)");
    });

    it("should handle multiple authors", () => {
      const input: CitationInput = {
        ...validInput,
        authors: [
          { fullName: "Alice Brown", firstName: "Alice", lastName: "Brown" },
          { fullName: "Bob White", firstName: "Bob", lastName: "White" },
        ],
      };

      const result = formatCitation(input, { style: "apa" });
      expect(result.text).toContain("Brown, A.");
      expect(result.text).toContain("& White, B.");
    });
  });

  describe("BibTeX generation", () => {
    it("should generate BibTeX when requested", () => {
      const result = formatCitation(validInput, {
        style: "apa",
        includeBibtex: true,
      });

      expect(result.bibtex).toBeDefined();
      expect(result.bibtex).toContain("@misc{");
      expect(result.bibtex).toContain("author =");
      expect(result.bibtex).toContain("title =");
      expect(result.bibtex).toContain("url =");
    });
  });

  describe("Error handling", () => {
    it("should throw on unsupported style", () => {
      expect(() => {
        formatCitation(validInput, { style: "invalid" as any });
      }).toThrow(CitationError);
    });

    it("should throw on missing required fields", () => {
      expect(() => {
        formatCitation(
          { title: "", url: "", accessDate: "" },
          { style: "apa" },
        );
      }).toThrow(CitationError);
    });
  });
});

describe("getSupportedStyles", () => {
  it("should return all supported styles", () => {
    const styles = getSupportedStyles();
    expect(styles).toContain("apa");
    expect(styles).toContain("mla");
    expect(styles).toContain("chicago");
    expect(styles).toContain("harvard");
  });
});

describe("isValidStyle", () => {
  it("should return true for valid styles", () => {
    expect(isValidStyle("apa")).toBe(true);
    expect(isValidStyle("mla")).toBe(true);
  });

  it("should return false for invalid styles", () => {
    expect(isValidStyle("invalid")).toBe(false);
  });
});
```

---

## 3. Validation Module

**Location**: `lib/validation/`

### File Structure

```
lib/validation/
  index.ts          # Main export
  url.ts            # URL validation with SSRF protection
  sanitize.ts       # Input sanitization
  types.ts          # TypeScript interfaces
  __tests__/
    url.test.ts
    sanitize.test.ts
```

### types.ts

```typescript
// lib/validation/types.ts

export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitized?: string;
}

export interface UrlValidationOptions {
  allowedProtocols?: string[];
  blockedHosts?: string[];
  allowPrivateIps?: boolean;
  maxLength?: number;
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly code: ValidationErrorCode,
    public readonly field?: string,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export type ValidationErrorCode =
  | "INVALID_URL"
  | "BLOCKED_PROTOCOL"
  | "BLOCKED_HOST"
  | "PRIVATE_IP"
  | "SSRF_DETECTED"
  | "INPUT_TOO_LONG"
  | "MALICIOUS_INPUT";
```

### url.ts

```typescript
// lib/validation/url.ts

import {
  ValidationResult,
  UrlValidationOptions,
  ValidationError,
} from "./types";

const DEFAULT_OPTIONS: UrlValidationOptions = {
  allowedProtocols: ["http:", "https:"],
  blockedHosts: [
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    "[::1]",
    "metadata.google.internal",
    "169.254.169.254", // AWS metadata
    "metadata.azure.internal",
  ],
  allowPrivateIps: false,
  maxLength: 2048,
};

// Private IP ranges (RFC 1918, RFC 4193, etc.)
const PRIVATE_IP_PATTERNS = [
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, // 10.0.0.0/8
  /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/, // 172.16.0.0/12
  /^192\.168\.\d{1,3}\.\d{1,3}$/, // 192.168.0.0/16
  /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, // 127.0.0.0/8
  /^169\.254\.\d{1,3}\.\d{1,3}$/, // 169.254.0.0/16 (link-local)
  /^fc[0-9a-f]{2}:/i, // fc00::/7 (IPv6 ULA)
  /^fe80:/i, // fe80::/10 (IPv6 link-local)
];

export function validateUrl(
  url: string,
  options: UrlValidationOptions = {},
): ValidationResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Check length
  if (url.length > (opts.maxLength || 2048)) {
    return {
      valid: false,
      error: `URL exceeds maximum length of ${opts.maxLength} characters`,
    };
  }

  // Parse URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return {
      valid: false,
      error: "Invalid URL format",
    };
  }

  // Check protocol
  if (!opts.allowedProtocols?.includes(parsedUrl.protocol)) {
    return {
      valid: false,
      error: `Protocol ${parsedUrl.protocol} is not allowed. Use ${opts.allowedProtocols?.join(" or ")}.`,
    };
  }

  // Check blocked hosts
  const hostname = parsedUrl.hostname.toLowerCase();
  if (
    opts.blockedHosts?.some(
      (blocked) =>
        hostname === blocked.toLowerCase() ||
        hostname.endsWith("." + blocked.toLowerCase()),
    )
  ) {
    return {
      valid: false,
      error: "This host is not allowed",
    };
  }

  // Check for private IPs (SSRF protection)
  if (!opts.allowPrivateIps && isPrivateIp(hostname)) {
    return {
      valid: false,
      error: "Private IP addresses are not allowed",
    };
  }

  // Check for DNS rebinding attempts
  if (isDnsRebindingAttempt(hostname)) {
    return {
      valid: false,
      error: "Suspicious hostname detected",
    };
  }

  // Normalize and return sanitized URL
  return {
    valid: true,
    sanitized: parsedUrl.href,
  };
}

function isPrivateIp(hostname: string): boolean {
  return PRIVATE_IP_PATTERNS.some((pattern) => pattern.test(hostname));
}

function isDnsRebindingAttempt(hostname: string): boolean {
  // Check for IP-like patterns in subdomains (common rebinding technique)
  const suspiciousPatterns = [
    /\d{1,3}-\d{1,3}-\d{1,3}-\d{1,3}/, // 192-168-1-1.evil.com
    /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\./, // 192.168.1.1.evil.com
    /^[a-f0-9]{32,}\./i, // Long hex strings (potential encoded IPs)
  ];

  return suspiciousPatterns.some((pattern) => pattern.test(hostname));
}

export function assertValidUrl(
  url: string,
  options?: UrlValidationOptions,
): string {
  const result = validateUrl(url, options);

  if (!result.valid) {
    throw new ValidationError(
      result.error || "Invalid URL",
      "INVALID_URL",
      "url",
    );
  }

  return result.sanitized!;
}
```

### sanitize.ts

```typescript
// lib/validation/sanitize.ts

import { ValidationError } from "./types";

const MAX_INPUT_LENGTH = 10000;

// Common XSS patterns
const XSS_PATTERNS = [
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /data:\s*text\/html/gi,
  /<iframe[\s\S]*?>/gi,
  /<object[\s\S]*?>/gi,
  /<embed[\s\S]*?>/gi,
];

// SQL injection patterns
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b)/gi,
  /--/g,
  /;\s*$/g,
  /'\s*OR\s*'1'\s*=\s*'1/gi,
];

export interface SanitizeOptions {
  maxLength?: number;
  allowHtml?: boolean;
  stripNewlines?: boolean;
}

export function sanitizeInput(
  input: string,
  options: SanitizeOptions = {},
): string {
  const {
    maxLength = MAX_INPUT_LENGTH,
    allowHtml = false,
    stripNewlines = false,
  } = options;

  if (typeof input !== "string") {
    throw new ValidationError(
      "Input must be a string",
      "MALICIOUS_INPUT",
      "input",
    );
  }

  let sanitized = input.trim();

  // Check length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }

  // Strip null bytes
  sanitized = sanitized.replace(/\0/g, "");

  // Strip HTML if not allowed
  if (!allowHtml) {
    sanitized = stripHtmlTags(sanitized);
  }

  // Strip newlines if requested
  if (stripNewlines) {
    sanitized = sanitized.replace(/[\r\n]+/g, " ");
  }

  // Normalize whitespace
  sanitized = sanitized.replace(/\s+/g, " ");

  return sanitized;
}

function stripHtmlTags(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}

export function detectXss(input: string): boolean {
  return XSS_PATTERNS.some((pattern) => pattern.test(input));
}

export function detectSqlInjection(input: string): boolean {
  return SQL_INJECTION_PATTERNS.some((pattern) => pattern.test(input));
}

export function assertSafeInput(input: string, fieldName = "input"): string {
  if (detectXss(input)) {
    throw new ValidationError(
      "Potentially malicious input detected",
      "MALICIOUS_INPUT",
      fieldName,
    );
  }

  return sanitizeInput(input);
}

export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  options: SanitizeOptions = {},
): T {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      result[key] = sanitizeInput(value, options);
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        typeof item === "string" ? sanitizeInput(item, options) : item,
      );
    } else if (value && typeof value === "object") {
      result[key] = sanitizeObject(value as Record<string, unknown>, options);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}
```

### index.ts

```typescript
// lib/validation/index.ts

export * from "./types";
export { validateUrl, assertValidUrl } from "./url";
export {
  sanitizeInput,
  sanitizeObject,
  detectXss,
  detectSqlInjection,
  assertSafeInput,
} from "./sanitize";
```

### Unit Tests

```typescript
// lib/validation/__tests__/url.test.ts

import { validateUrl, assertValidUrl } from "../url";
import { ValidationError } from "../types";

describe("validateUrl", () => {
  describe("valid URLs", () => {
    it("should accept valid HTTPS URLs", () => {
      const result = validateUrl("https://example.com/article");
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe("https://example.com/article");
    });

    it("should accept valid HTTP URLs", () => {
      const result = validateUrl("http://example.com");
      expect(result.valid).toBe(true);
    });

    it("should normalize URLs", () => {
      const result = validateUrl("https://EXAMPLE.COM/path");
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe("https://example.com/path");
    });
  });

  describe("protocol validation", () => {
    it("should reject javascript: protocol", () => {
      const result = validateUrl("javascript:alert(1)");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Protocol");
    });

    it("should reject file: protocol", () => {
      const result = validateUrl("file:///etc/passwd");
      expect(result.valid).toBe(false);
    });

    it("should reject ftp: protocol", () => {
      const result = validateUrl("ftp://example.com");
      expect(result.valid).toBe(false);
    });
  });

  describe("SSRF protection", () => {
    it("should block localhost", () => {
      const result = validateUrl("http://localhost:3000");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("not allowed");
    });

    it("should block 127.0.0.1", () => {
      const result = validateUrl("http://127.0.0.1");
      expect(result.valid).toBe(false);
    });

    it("should block private IP 10.x.x.x", () => {
      const result = validateUrl("http://10.0.0.1");
      expect(result.valid).toBe(false);
    });

    it("should block private IP 192.168.x.x", () => {
      const result = validateUrl("http://192.168.1.1");
      expect(result.valid).toBe(false);
    });

    it("should block AWS metadata endpoint", () => {
      const result = validateUrl("http://169.254.169.254/latest/meta-data");
      expect(result.valid).toBe(false);
    });

    it("should detect DNS rebinding attempts", () => {
      const result = validateUrl("http://192-168-1-1.evil.com");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Suspicious");
    });
  });

  describe("length validation", () => {
    it("should reject URLs exceeding max length", () => {
      const longPath = "a".repeat(3000);
      const result = validateUrl(`https://example.com/${longPath}`);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("length");
    });
  });

  describe("custom options", () => {
    it("should allow private IPs when configured", () => {
      const result = validateUrl("http://192.168.1.1", {
        allowPrivateIps: true,
      });
      expect(result.valid).toBe(true);
    });

    it("should allow custom protocols", () => {
      const result = validateUrl("ftp://example.com", {
        allowedProtocols: ["ftp:"],
      });
      expect(result.valid).toBe(true);
    });
  });
});

describe("assertValidUrl", () => {
  it("should return sanitized URL for valid input", () => {
    const url = assertValidUrl("https://example.com");
    expect(url).toBe("https://example.com/");
  });

  it("should throw ValidationError for invalid input", () => {
    expect(() => assertValidUrl("javascript:alert(1)")).toThrow(
      ValidationError,
    );
  });
});
```

```typescript
// lib/validation/__tests__/sanitize.test.ts

import {
  sanitizeInput,
  sanitizeObject,
  detectXss,
  detectSqlInjection,
  assertSafeInput,
} from "../sanitize";
import { ValidationError } from "../types";

describe("sanitizeInput", () => {
  it("should trim whitespace", () => {
    expect(sanitizeInput("  hello world  ")).toBe("hello world");
  });

  it("should normalize multiple spaces", () => {
    expect(sanitizeInput("hello    world")).toBe("hello world");
  });

  it("should strip null bytes", () => {
    expect(sanitizeInput("hello\0world")).toBe("hello world");
  });

  it("should strip HTML tags by default", () => {
    expect(sanitizeInput("<script>alert(1)</script>hello")).toBe(
      "alert(1)hello",
    );
  });

  it("should preserve HTML when allowed", () => {
    const result = sanitizeInput("<b>hello</b>", { allowHtml: true });
    expect(result).toBe("<b>hello</b>");
  });

  it("should truncate long input", () => {
    const longInput = "a".repeat(100);
    const result = sanitizeInput(longInput, { maxLength: 50 });
    expect(result.length).toBe(50);
  });

  it("should strip newlines when requested", () => {
    expect(sanitizeInput("hello\nworld", { stripNewlines: true })).toBe(
      "hello world",
    );
  });
});

describe("detectXss", () => {
  it("should detect script tags", () => {
    expect(detectXss("<script>alert(1)</script>")).toBe(true);
  });

  it("should detect javascript: protocol", () => {
    expect(detectXss("javascript:alert(1)")).toBe(true);
  });

  it("should detect event handlers", () => {
    expect(detectXss("onload=alert(1)")).toBe(true);
    expect(detectXss("onclick=evil()")).toBe(true);
  });

  it("should not flag normal text", () => {
    expect(detectXss("This is a normal article title")).toBe(false);
  });
});

describe("detectSqlInjection", () => {
  it("should detect SELECT statements", () => {
    expect(detectSqlInjection("1'; SELECT * FROM users--")).toBe(true);
  });

  it("should detect UNION attacks", () => {
    expect(detectSqlInjection("1 UNION SELECT password FROM users")).toBe(true);
  });

  it("should detect classic OR injection", () => {
    expect(detectSqlInjection("' OR '1'='1")).toBe(true);
  });

  it("should not flag normal text", () => {
    expect(detectSqlInjection("How to SELECT the best option")).toBe(true); // false positive expected
  });
});

describe("sanitizeObject", () => {
  it("should sanitize all string values", () => {
    const obj = {
      title: "  Hello World  ",
      description: "<script>bad</script>Good content",
    };

    const result = sanitizeObject(obj);
    expect(result.title).toBe("Hello World");
    expect(result.description).toBe("badGood content");
  });

  it("should handle nested objects", () => {
    const obj = {
      meta: {
        author: "  John Doe  ",
      },
    };

    const result = sanitizeObject(obj);
    expect(result.meta.author).toBe("John Doe");
  });

  it("should handle arrays", () => {
    const obj = {
      tags: ["  tag1  ", "  tag2  "],
    };

    const result = sanitizeObject(obj);
    expect(result.tags).toEqual(["tag1", "tag2"]);
  });
});

describe("assertSafeInput", () => {
  it("should return sanitized input for safe content", () => {
    const result = assertSafeInput("Hello World");
    expect(result).toBe("Hello World");
  });

  it("should throw for XSS attempts", () => {
    expect(() => assertSafeInput("<script>alert(1)</script>")).toThrow(
      ValidationError,
    );
  });
});
```

---

## 4. Rate Limiter Module

**Location**: `lib/rate-limit/`

### File Structure

```
lib/rate-limit/
  index.ts          # Main export
  token-bucket.ts   # Token bucket implementation
  types.ts          # TypeScript interfaces
  __tests__/
    token-bucket.test.ts
```

### types.ts

```typescript
// lib/rate-limit/types.ts

export interface RateLimitConfig {
  maxTokens: number; // Maximum tokens in bucket
  refillRate: number; // Tokens added per interval
  refillInterval: number; // Interval in milliseconds
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // Unix timestamp in ms
  retryAfter?: number; // Seconds until next allowed request
}

export interface RateLimitHeaders {
  "X-RateLimit-Limit": string;
  "X-RateLimit-Remaining": string;
  "X-RateLimit-Reset": string;
  "Retry-After"?: string;
}

export class RateLimitError extends Error {
  constructor(
    public readonly remaining: number,
    public readonly resetAt: number,
    public readonly retryAfter: number,
  ) {
    super("Rate limit exceeded");
    this.name = "RateLimitError";
  }
}
```

### token-bucket.ts

```typescript
// lib/rate-limit/token-bucket.ts

import { RateLimitConfig, RateLimitResult, RateLimitHeaders } from "./types";

interface Bucket {
  tokens: number;
  lastRefill: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxTokens: 10, // 10 requests
  refillRate: 10, // Refill 10 tokens
  refillInterval: 60000, // Per minute
};

export class TokenBucket {
  private buckets = new Map<string, Bucket>();
  private config: RateLimitConfig;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.startCleanup();
  }

  consume(key: string, tokens = 1): RateLimitResult {
    const now = Date.now();
    const bucket = this.getBucket(key, now);

    // Refill tokens based on elapsed time
    const elapsed = now - bucket.lastRefill;
    const refillCount = Math.floor(elapsed / this.config.refillInterval);

    if (refillCount > 0) {
      bucket.tokens = Math.min(
        this.config.maxTokens,
        bucket.tokens + refillCount * this.config.refillRate,
      );
      bucket.lastRefill = now;
    }

    // Calculate reset time
    const resetAt = bucket.lastRefill + this.config.refillInterval;

    // Try to consume tokens
    if (bucket.tokens >= tokens) {
      bucket.tokens -= tokens;
      return {
        allowed: true,
        remaining: bucket.tokens,
        resetAt,
      };
    }

    // Rate limited
    const retryAfter = Math.ceil((resetAt - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetAt,
      retryAfter,
    };
  }

  private getBucket(key: string, now: number): Bucket {
    let bucket = this.buckets.get(key);

    if (!bucket) {
      bucket = {
        tokens: this.config.maxTokens,
        lastRefill: now,
      };
      this.buckets.set(key, bucket);
    }

    return bucket;
  }

  getHeaders(result: RateLimitResult): RateLimitHeaders {
    const headers: RateLimitHeaders = {
      "X-RateLimit-Limit": String(this.config.maxTokens),
      "X-RateLimit-Remaining": String(result.remaining),
      "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
    };

    if (result.retryAfter) {
      headers["Retry-After"] = String(result.retryAfter);
    }

    return headers;
  }

  reset(key: string): void {
    this.buckets.delete(key);
  }

  getStatus(key: string): RateLimitResult | null {
    const bucket = this.buckets.get(key);
    if (!bucket) return null;

    return {
      allowed: bucket.tokens > 0,
      remaining: bucket.tokens,
      resetAt: bucket.lastRefill + this.config.refillInterval,
    };
  }

  private startCleanup(): void {
    // Clean up old buckets every 5 minutes
    this.cleanupInterval = setInterval(
      () => {
        const now = Date.now();
        const maxAge = this.config.refillInterval * 10;

        for (const [key, bucket] of this.buckets.entries()) {
          if (now - bucket.lastRefill > maxAge) {
            this.buckets.delete(key);
          }
        }
      },
      5 * 60 * 1000,
    );

    // Don't prevent process exit
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.buckets.clear();
  }
}

// Singleton instance for the application
let rateLimiterInstance: TokenBucket | null = null;

export function getRateLimiter(config?: Partial<RateLimitConfig>): TokenBucket {
  if (!rateLimiterInstance) {
    rateLimiterInstance = new TokenBucket(config);
  }
  return rateLimiterInstance;
}

export function resetRateLimiter(): void {
  if (rateLimiterInstance) {
    rateLimiterInstance.destroy();
    rateLimiterInstance = null;
  }
}
```

### index.ts

```typescript
// lib/rate-limit/index.ts

export * from "./types";
export { TokenBucket, getRateLimiter, resetRateLimiter } from "./token-bucket";

// Convenience middleware for Next.js API routes
import { NextRequest } from "next/server";
import { getRateLimiter } from "./token-bucket";
import { RateLimitResult, RateLimitError } from "./types";

export function getClientIp(request: NextRequest): string {
  // Check common headers for proxied requests
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback (may not be accurate behind proxy)
  return request.ip || "unknown";
}

export function checkRateLimit(
  request: NextRequest,
  prefix = "api",
): RateLimitResult {
  const ip = getClientIp(request);
  const key = `${prefix}:${ip}`;

  const limiter = getRateLimiter();
  return limiter.consume(key);
}

export function assertRateLimit(request: NextRequest, prefix = "api"): void {
  const result = checkRateLimit(request, prefix);

  if (!result.allowed) {
    throw new RateLimitError(
      result.remaining,
      result.resetAt,
      result.retryAfter || 60,
    );
  }
}
```

### Unit Tests

```typescript
// lib/rate-limit/__tests__/token-bucket.test.ts

import { TokenBucket, getRateLimiter, resetRateLimiter } from "../token-bucket";

describe("TokenBucket", () => {
  let bucket: TokenBucket;

  beforeEach(() => {
    bucket = new TokenBucket({
      maxTokens: 5,
      refillRate: 5,
      refillInterval: 1000, // 1 second for easier testing
    });
  });

  afterEach(() => {
    bucket.destroy();
  });

  describe("consume", () => {
    it("should allow requests within limit", () => {
      const result = bucket.consume("test-key");

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);
    });

    it("should track remaining tokens", () => {
      bucket.consume("test-key");
      bucket.consume("test-key");
      bucket.consume("test-key");

      const result = bucket.consume("test-key");
      expect(result.remaining).toBe(1);
    });

    it("should block when tokens exhausted", () => {
      // Consume all tokens
      for (let i = 0; i < 5; i++) {
        bucket.consume("test-key");
      }

      const result = bucket.consume("test-key");

      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.retryAfter).toBeDefined();
    });

    it("should track different keys separately", () => {
      // Exhaust key1
      for (let i = 0; i < 5; i++) {
        bucket.consume("key1");
      }

      // key2 should still have tokens
      const result = bucket.consume("key2");
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);
    });

    it("should refill tokens after interval", async () => {
      // Exhaust tokens
      for (let i = 0; i < 5; i++) {
        bucket.consume("test-key");
      }

      expect(bucket.consume("test-key").allowed).toBe(false);

      // Wait for refill
      await new Promise((resolve) => setTimeout(resolve, 1100));

      const result = bucket.consume("test-key");
      expect(result.allowed).toBe(true);
    });

    it("should consume multiple tokens at once", () => {
      const result = bucket.consume("test-key", 3);

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(2);
    });

    it("should reject if not enough tokens", () => {
      bucket.consume("test-key", 3); // 2 remaining

      const result = bucket.consume("test-key", 3);
      expect(result.allowed).toBe(false);
    });
  });

  describe("getHeaders", () => {
    it("should return proper rate limit headers", () => {
      const result = bucket.consume("test-key");
      const headers = bucket.getHeaders(result);

      expect(headers["X-RateLimit-Limit"]).toBe("5");
      expect(headers["X-RateLimit-Remaining"]).toBe("4");
      expect(headers["X-RateLimit-Reset"]).toBeDefined();
    });

    it("should include Retry-After when blocked", () => {
      for (let i = 0; i < 5; i++) {
        bucket.consume("test-key");
      }

      const result = bucket.consume("test-key");
      const headers = bucket.getHeaders(result);

      expect(headers["Retry-After"]).toBeDefined();
    });
  });

  describe("reset", () => {
    it("should reset a specific key", () => {
      for (let i = 0; i < 5; i++) {
        bucket.consume("test-key");
      }

      bucket.reset("test-key");

      const result = bucket.consume("test-key");
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);
    });
  });

  describe("getStatus", () => {
    it("should return null for unknown key", () => {
      expect(bucket.getStatus("unknown")).toBeNull();
    });

    it("should return current status", () => {
      bucket.consume("test-key");
      bucket.consume("test-key");

      const status = bucket.getStatus("test-key");
      expect(status?.remaining).toBe(3);
    });
  });
});

describe("getRateLimiter singleton", () => {
  afterEach(() => {
    resetRateLimiter();
  });

  it("should return same instance", () => {
    const limiter1 = getRateLimiter();
    const limiter2 = getRateLimiter();

    expect(limiter1).toBe(limiter2);
  });

  it("should reset singleton", () => {
    const limiter1 = getRateLimiter();
    resetRateLimiter();
    const limiter2 = getRateLimiter();

    expect(limiter1).not.toBe(limiter2);
  });
});
```

---

## 5. API Routes

**Location**: `app/api/`

### POST /api/scrape

**File**: `app/api/scrape/route.ts`

```typescript
// app/api/scrape/route.ts

import { NextRequest, NextResponse } from "next/server";
import { scrapeMetadata, ScraperError } from "@/lib/scraper";
import { assertValidUrl, ValidationError } from "@/lib/validation";
import {
  checkRateLimit,
  getRateLimiter,
  RateLimitError,
} from "@/lib/rate-limit";

// Request body type
interface ScrapeRequest {
  url: string;
}

// Response types
interface ScrapeSuccessResponse {
  success: true;
  data: {
    title: string;
    url: string;
    accessDate: string;
    authors: Array<{
      firstName?: string;
      lastName?: string;
      fullName: string;
    }>;
    publishedDate?: string;
    modifiedDate?: string;
    publisher?: string;
    siteName?: string;
    description?: string;
    language?: string;
    type?: string;
  };
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ScrapeSuccessResponse | ErrorResponse>> {
  // Rate limiting
  const rateLimitResult = checkRateLimit(request, "scrape");
  const limiter = getRateLimiter();
  const headers = limiter.getHeaders(rateLimitResult);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RATE_LIMITED",
          message: `Rate limit exceeded. Try again in ${rateLimitResult.retryAfter} seconds.`,
        },
      },
      { status: 429, headers },
    );
  }

  try {
    // Parse request body
    const body: ScrapeRequest = await request.json();

    if (!body.url) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "URL is required",
          },
        },
        { status: 400, headers },
      );
    }

    // Validate URL (SSRF protection)
    const validUrl = assertValidUrl(body.url);

    // Scrape metadata
    const metadata = await scrapeMetadata(validUrl);

    return NextResponse.json(
      {
        success: true,
        data: metadata,
      },
      { status: 200, headers },
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status: 400, headers },
      );
    }

    if (error instanceof ScraperError) {
      const statusCode = error.code === "PAGE_NOT_FOUND" ? 404 : 502;
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status: statusCode, headers },
      );
    }

    console.error("Scrape error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
        },
      },
      { status: 500, headers },
    );
  }
}
```

### POST /api/format

**File**: `app/api/format/route.ts`

```typescript
// app/api/format/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  formatCitation,
  CitationError,
  CitationStyle,
  CitationInput,
  FormattedCitation,
  isValidStyle,
} from "@/lib/citation";
import { sanitizeObject, ValidationError } from "@/lib/validation";
import { checkRateLimit, getRateLimiter } from "@/lib/rate-limit";

// Request body type
interface FormatRequest {
  citation: CitationInput;
  style: CitationStyle;
  includeBibtex?: boolean;
}

// Response types
interface FormatSuccessResponse {
  success: true;
  data: FormattedCitation;
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<FormatSuccessResponse | ErrorResponse>> {
  // Rate limiting (more lenient for formatting)
  const rateLimitResult = checkRateLimit(request, "format");
  const limiter = getRateLimiter();
  const headers = limiter.getHeaders(rateLimitResult);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RATE_LIMITED",
          message: `Rate limit exceeded. Try again in ${rateLimitResult.retryAfter} seconds.`,
        },
      },
      { status: 429, headers },
    );
  }

  try {
    // Parse and sanitize request body
    const body: FormatRequest = await request.json();
    const sanitizedBody = sanitizeObject(body);

    // Validate required fields
    if (!sanitizedBody.citation) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Citation data is required",
          },
        },
        { status: 400, headers },
      );
    }

    if (!sanitizedBody.style || !isValidStyle(sanitizedBody.style)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_STYLE",
            message:
              "Valid citation style is required (apa, mla, chicago, harvard)",
          },
        },
        { status: 400, headers },
      );
    }

    // Format citation
    const formatted = formatCitation(sanitizedBody.citation, {
      style: sanitizedBody.style,
      includeBibtex: sanitizedBody.includeBibtex,
    });

    return NextResponse.json(
      {
        success: true,
        data: formatted,
      },
      { status: 200, headers },
    );
  } catch (error) {
    if (error instanceof CitationError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status: 400, headers },
      );
    }

    if (error instanceof ValidationError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status: 400, headers },
      );
    }

    console.error("Format error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
        },
      },
      { status: 500, headers },
    );
  }
}
```

### GET /api/health

**File**: `app/api/health/route.ts`

```typescript
// app/api/health/route.ts

import { NextResponse } from "next/server";
import { checkBrowserHealth, getBrowserPool } from "@/lib/scraper";

interface HealthResponse {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  checks: {
    browserless: {
      status: "up" | "down";
      activeConnections?: number;
    };
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
  };
}

export async function GET(): Promise<NextResponse<HealthResponse>> {
  const timestamp = new Date().toISOString();
  const version = process.env.npm_package_version || "1.0.0";

  // Check browserless connection
  const browserlessUp = await checkBrowserHealth();
  const browserPool = getBrowserPool();
  const browserStats = browserPool.getStats();

  // Check memory usage
  const memoryUsage = process.memoryUsage();
  const usedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
  const totalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);

  const response: HealthResponse = {
    status: browserlessUp ? "healthy" : "degraded",
    timestamp,
    version,
    checks: {
      browserless: {
        status: browserlessUp ? "up" : "down",
        activeConnections: browserStats.activePages,
      },
      memory: {
        used: usedMB,
        total: totalMB,
        percentage: Math.round((usedMB / totalMB) * 100),
      },
    },
  };

  const statusCode = response.status === "healthy" ? 200 : 503;

  return NextResponse.json(response, {
    status: statusCode,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
```

---

## 6. Component Modules

Components are detailed in `COMPONENTS.md`. Summary of component locations:

```
components/
  ui/                     # Shared UI components (Button, Input, etc.)
  citation/
    UrlInput.tsx          # URL input form
    StyleSelector.tsx     # Citation style dropdown
    CitationCard.tsx      # Display formatted citation
    CopyButton.tsx        # Copy to clipboard
    CitationHistory.tsx   # Recent citations (localStorage)
  layout/
    Header.tsx            # Site header
    Footer.tsx            # Site footer
```

---

## 7. Testing Strategy

### Test Structure

```
__tests__/
  unit/
    lib/
      scraper/
      citation/
      validation/
      rate-limit/
  integration/
    api/
      scrape.test.ts
      format.test.ts
      health.test.ts
  e2e/
    citation-flow.test.ts
```

### Jest Configuration

```typescript
// jest.config.ts

import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  collectCoverageFrom: [
    "lib/**/*.{ts,tsx}",
    "app/api/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

export default createJestConfig(config);
```

### Mock Strategies

```typescript
// __mocks__/puppeteer-core.ts

export const mockPage = {
  goto: jest.fn().mockResolvedValue({ status: () => 200 }),
  content: jest.fn().mockResolvedValue("<html></html>"),
  setUserAgent: jest.fn(),
  setViewport: jest.fn(),
  setDefaultTimeout: jest.fn(),
  waitForSelector: jest.fn(),
  close: jest.fn(),
  isClosed: jest.fn().mockReturnValue(false),
};

export const mockBrowser = {
  isConnected: jest.fn().mockReturnValue(true),
  newPage: jest.fn().mockResolvedValue(mockPage),
  close: jest.fn(),
  on: jest.fn(),
};

export default {
  connect: jest.fn().mockResolvedValue(mockBrowser),
};
```

```typescript
// __tests__/integration/api/scrape.test.ts

import { createMocks } from "node-mocks-http";
import { POST } from "@/app/api/scrape/route";

// Mock the scraper module
jest.mock("@/lib/scraper", () => ({
  scrapeMetadata: jest.fn().mockResolvedValue({
    url: "https://example.com",
    title: "Test Article",
    accessDate: "2024-03-15T10:00:00Z",
    authors: [{ fullName: "John Doe" }],
  }),
  ScraperError: class ScraperError extends Error {
    constructor(
      message: string,
      public code: string,
    ) {
      super(message);
    }
  },
}));

describe("POST /api/scrape", () => {
  it("should scrape metadata successfully", async () => {
    const request = new Request("http://localhost/api/scrape", {
      method: "POST",
      body: JSON.stringify({ url: "https://example.com/article" }),
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.title).toBe("Test Article");
  });

  it("should reject invalid URLs", async () => {
    const request = new Request("http://localhost/api/scrape", {
      method: "POST",
      body: JSON.stringify({ url: "javascript:alert(1)" }),
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });
});
```

---

## 8. Error Boundaries

### Error Types by Module

| Module     | Error Class       | Error Codes                                                                                                                 |
| ---------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Scraper    | `ScraperError`    | `BROWSER_CONNECTION_FAILED`, `PAGE_LOAD_TIMEOUT`, `PAGE_NOT_FOUND`, `EXTRACTION_FAILED`, `INVALID_URL`, `BLOCKED_BY_ROBOTS` |
| Citation   | `CitationError`   | `INVALID_INPUT`, `UNSUPPORTED_STYLE`, `FORMATTING_FAILED`                                                                   |
| Validation | `ValidationError` | `INVALID_URL`, `BLOCKED_PROTOCOL`, `BLOCKED_HOST`, `PRIVATE_IP`, `SSRF_DETECTED`, `INPUT_TOO_LONG`, `MALICIOUS_INPUT`       |
| Rate Limit | `RateLimitError`  | (single type, includes `retryAfter` and `resetAt`)                                                                          |

### API Error Responses

All API routes return consistent error responses:

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string; // Machine-readable error code
    message: string; // Human-readable message
  };
}
```

### HTTP Status Code Mapping

| Error Type        | HTTP Status |
| ----------------- | ----------- |
| Validation errors | 400         |
| Rate limit        | 429         |
| Page not found    | 404         |
| Scraper errors    | 502         |
| Internal errors   | 500         |

### React Error Boundary

```typescript
// components/ErrorBoundary.tsx

'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-red-800 font-semibold">Something went wrong</h2>
          <p className="text-red-600 text-sm mt-1">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 text-sm text-red-700 underline"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## 9. Module Dependencies Graph

```
External Dependencies:
  puppeteer-core      -> lib/scraper/browser.ts
  citation-js         -> lib/citation/formatter.ts
  jsdom               -> lib/scraper/extractor.ts

Internal Dependencies:
  app/api/scrape      -> lib/scraper, lib/validation, lib/rate-limit
  app/api/format      -> lib/citation, lib/validation, lib/rate-limit
  app/api/health      -> lib/scraper (for health check)

  lib/scraper         -> lib/validation (URL validation before scrape)
  lib/citation        -> (standalone)
  lib/validation      -> (standalone)
  lib/rate-limit      -> (standalone)
```

---

## 10. Environment Variables

```env
# .env.local (example)

# Browserless Configuration
BROWSERLESS_URL=ws://browserless:3000
BROWSERLESS_TOKEN=optional-auth-token

# Rate Limiting
RATE_LIMIT_MAX=10
RATE_LIMIT_WINDOW=60000

# Application
NODE_ENV=development
```

---

## Quick Reference: File Locations

| Purpose             | Location                         |
| ------------------- | -------------------------------- |
| Scraper entry       | `lib/scraper/index.ts`           |
| Browser pool        | `lib/scraper/browser.ts`         |
| Metadata extraction | `lib/scraper/extractor.ts`       |
| Citation formatter  | `lib/citation/formatter.ts`      |
| Citation templates  | `lib/citation/templates.ts`      |
| URL validation      | `lib/validation/url.ts`          |
| Input sanitization  | `lib/validation/sanitize.ts`     |
| Rate limiter        | `lib/rate-limit/token-bucket.ts` |
| Scrape API          | `app/api/scrape/route.ts`        |
| Format API          | `app/api/format/route.ts`        |
| Health API          | `app/api/health/route.ts`        |
| Jest config         | `jest.config.ts`                 |
| Mocks               | `__mocks__/`                     |
