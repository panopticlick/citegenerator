import puppeteer, { type Browser, type Page } from "puppeteer-core";
import { BrowserConfig, ScraperError } from "./types.js";

const DEFAULT_CONFIG: BrowserConfig = {
  browserlessUrl: process.env.CHROME_WS_ENDPOINT || "ws://chrome-headless:3000",
  timeout: Number(process.env.SCRAPE_TIMEOUT_MS || 30_000),
  maxConcurrent: 5,
  token: process.env.BROWSERLESS_TOKEN || undefined,
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
    if (this.browser?.isConnected()) return this.browser;
    if (this.connecting) return this.connecting;

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
      const browserWSEndpoint = this.config.token
        ? `${this.config.browserlessUrl}?token=${encodeURIComponent(this.config.token)}`
        : this.config.browserlessUrl;

      const browser = await puppeteer.connect({ browserWSEndpoint });
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
      throw new ScraperError("Maximum concurrent pages reached", "BROWSER_CONNECTION_FAILED");
    }

    const browser = await this.connect();
    const page = await browser.newPage();
    this.activePages += 1;

    await page.setUserAgent(
      "Mozilla/5.0 (compatible; CiteGenerator/1.0; +https://citegenerator.org)",
    );
    await page.setViewport({ width: 1280, height: 800 });
    page.setDefaultTimeout(this.config.timeout);

    // Reduce bandwidth / flakiness
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const type = req.resourceType();
      if (type === "image" || type === "media" || type === "font") return req.abort();
      return req.continue();
    });

    return page;
  }

  async releasePage(page: Page): Promise<void> {
    try {
      if (!page.isClosed()) await page.close();
    } finally {
      this.activePages = Math.max(0, this.activePages - 1);
    }
  }

  async disconnect(): Promise<void> {
    if (!this.browser) return;
    await this.browser.close();
    this.browser = null;
    this.activePages = 0;
  }

  getStats(): { activePages: number; isConnected: boolean } {
    return { activePages: this.activePages, isConnected: this.browser?.isConnected() ?? false };
  }
}

let poolInstance: BrowserPool | null = null;

export function getBrowserPool(config?: Partial<BrowserConfig>): BrowserPool {
  if (!poolInstance) poolInstance = new BrowserPool(config);
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
