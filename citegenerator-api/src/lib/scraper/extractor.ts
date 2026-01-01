import { JSDOM } from "jsdom";
import type {
  MetadataResult,
  Author,
  WebPageType,
  ExtractionContext,
  ExtractionSource,
} from "./types.js";

interface JsonLdArticle {
  "@type"?: string | string[];
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

  const jsonLd = extractFromJsonLd(document);
  const metaTags = extractFromMetaTags(document);
  const ogTags = extractFromOpenGraph(document);
  const twitterTags = extractFromTwitterCards(document);
  const heuristic = extractHeuristic(document);

  const merged = mergeResults([jsonLd, metaTags, ogTags, twitterTags, heuristic]);

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
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  for (const script of Array.from(scripts)) {
    try {
      const json = JSON.parse(script.textContent || "");
      const items = Array.isArray(json) ? json : [json];
      for (const item of items) {
        if (isArticleType(item["@type"])) {
          return parseJsonLdArticle(item as JsonLdArticle);
        }
      }
    } catch {
      // ignore invalid json-ld
    }
  }
  return {};
}

function isArticleType(type?: string | string[]): boolean {
  const articleTypes = new Set([
    "Article",
    "NewsArticle",
    "BlogPosting",
    "ScholarlyArticle",
    "TechArticle",
    "WebPage",
  ]);

  if (Array.isArray(type)) return type.some((t) => articleTypes.has(t));
  return type ? articleTypes.has(type) : false;
}

function parseJsonLdArticle(item: JsonLdArticle): Partial<MetadataResult> {
  return {
    title: item.headline || item.name,
    authors: parseJsonLdAuthors(item.author),
    publishedDate: item.datePublished,
    modifiedDate: item.dateModified,
    publisher: typeof item.publisher === "string" ? item.publisher : item.publisher?.name,
    description: item.description,
    language: item.inLanguage,
    type: mapJsonLdType(item["@type"]),
    _source: "json-ld",
  };
}

function parseJsonLdAuthors(author: JsonLdArticle["author"]): Author[] {
  if (!author) return [];
  const list = Array.isArray(author) ? author : [author];
  return list
    .map((a) => {
      if (typeof a === "string") return parseAuthorName(a);
      if (a && typeof a === "object") {
        const obj = a as JsonLdAuthor;
        if (obj.name)
          return { fullName: obj.name, firstName: obj.givenName, lastName: obj.familyName };
      }
      return { fullName: "Unknown" };
    })
    .filter((a) => a.fullName !== "Unknown");
}

function parseAuthorName(name: string): Author {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return { fullName: name };
  return { fullName: name, firstName: parts.slice(0, -1).join(" "), lastName: parts.at(-1) };
}

function mapJsonLdType(type?: string | string[]): WebPageType {
  const t = Array.isArray(type) ? type[0] : type;
  switch (t) {
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
    const el = document.querySelector(`meta[name="${name}"], meta[name="${name.toLowerCase()}"]`);
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
  const title =
    document.querySelector("h1")?.textContent?.trim() ||
    document.querySelector('[class*="title"]')?.textContent?.trim();

  const authorEl = document.querySelector('[rel="author"], [class*="author"], [itemprop="author"]');
  const authorName = authorEl?.textContent?.trim();

  const dateEl = document.querySelector(
    'time[datetime], [class*="date"], [itemprop="datePublished"]',
  );
  const dateStr = dateEl?.getAttribute("datetime") || dateEl?.textContent?.trim();

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
    if (Number.isNaN(date.getTime())) return undefined;
    return date.toISOString();
  } catch {
    return undefined;
  }
}

function mergeResults(results: Partial<MetadataResult>[]): Partial<MetadataResult> {
  const merged: Partial<MetadataResult> = {};

  for (const result of results) {
    for (const [key, value] of Object.entries(result)) {
      if (value === undefined || value === null || value === "") continue;
      if (key === "authors" && Array.isArray(value) && value.length > 0) {
        if (!merged.authors || merged.authors.length === 0) {
          merged.authors = value as Author[];
          merged._source = result._source as ExtractionSource | undefined;
        }
      } else if (!(key in merged)) {
        (merged as Record<string, unknown>)[key] = value;
      }
    }
  }

  return merged;
}
