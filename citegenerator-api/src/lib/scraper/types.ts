export interface MetadataResult {
  url: string;
  title: string;
  accessDate: string; // ISO 8601
  authors: Author[];
  publishedDate?: string;
  modifiedDate?: string;
  publisher?: string;
  siteName?: string;
  description?: string;
  language?: string;
  type?: WebPageType;
  _source?: ExtractionSource;
}

export interface Author {
  firstName?: string;
  lastName?: string;
  fullName: string;
}

export type WebPageType = "article" | "website" | "blog" | "news" | "academic" | "unknown";

export type ExtractionSource = "json-ld" | "meta-tags" | "og-tags" | "twitter-tags" | "heuristic";

export interface BrowserConfig {
  browserlessUrl: string;
  timeout: number;
  maxConcurrent: number;
  token?: string;
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
