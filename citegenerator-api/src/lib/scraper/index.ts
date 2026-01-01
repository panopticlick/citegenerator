import type { Page } from "puppeteer-core";
import { withPage, getBrowserPool } from "./browser.js";
import { extractMetadata } from "./extractor.js";
import type { MetadataResult, ScrapeOptions, ScraperError } from "./types.js";
import { ScraperError as ScraperErrorClass } from "./types.js";

export * from "./types.js";
export { getBrowserPool, BrowserPool } from "./browser.js";
export { scrapeDoi, validateDoi } from "./doi.js";
export { scrapeIsbn, validateIsbn } from "./isbn.js";

const DEFAULT_OPTIONS: ScrapeOptions = {
  timeout: Number(process.env.SCRAPE_TIMEOUT_MS || 30_000),
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
        throw new ScraperErrorClass("No response received from page", "PAGE_LOAD_TIMEOUT", url);
      }

      const status = response.status();
      if (status === 404) {
        throw new ScraperErrorClass("Page not found", "PAGE_NOT_FOUND", url);
      }
      if (status >= 400) {
        throw new ScraperErrorClass(`HTTP error: ${status}`, "PAGE_LOAD_TIMEOUT", url);
      }

      if (opts.waitForSelector) {
        await page.waitForSelector(opts.waitForSelector, { timeout: opts.timeout });
      }

      const html = await page.content();
      const parsedUrl = new URL(url);
      const metadata = extractMetadata({ html, url, parsedUrl });
      if (!opts.includeRaw) delete metadata._source;
      return metadata;
    } catch (error) {
      if (error instanceof ScraperErrorClass) throw error;
      throw new ScraperErrorClass(
        `Failed to scrape ${url}: ${error instanceof Error ? error.message : "Unknown error"}`,
        "EXTRACTION_FAILED",
        url,
        error instanceof Error ? error : undefined,
      );
    }
  });
}

export async function checkBrowserHealth(): Promise<boolean> {
  try {
    const pool = getBrowserPool();
    await pool.connect();
    return pool.getStats().isConnected;
  } catch {
    return false;
  }
}

export type { ScraperError };
