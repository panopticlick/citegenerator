import { describe, expect, it } from "vitest";
import { extractMetadata } from "./extractor.js";
import type { ExtractionContext } from "./types.js";

describe("extractMetadata", () => {
  const createContext = (html: string, url = "https://example.com/article"): ExtractionContext => ({
    html,
    url,
    parsedUrl: new URL(url),
  });

  it("extracts from JSON-LD Article", () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <script type="application/ld+json">
            {
              "@type": "Article",
              "headline": "Test Article Title",
              "author": { "@type": "Person", "name": "John Doe", "givenName": "John", "familyName": "Doe" },
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
    expect(result.authors[0]?.fullName).toBe("John Doe");
    expect(result.authors[0]?.firstName).toBe("John");
    expect(result.authors[0]?.lastName).toBe("Doe");
    expect(result.publishedDate).toBe("2024-01-15T10:00:00Z");
    expect(result.publisher).toBe("Example News");
  });

  it("extracts from meta tags", () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="title" content="Meta Title" />
          <meta name="author" content="Jane Smith" />
          <meta name="description" content="Article description" />
          <meta name="date" content="2024-02-20" />
        </head>
        <body></body>
      </html>
    `;
    const result = extractMetadata(createContext(html));
    expect(result.title).toBe("Meta Title");
    expect(result.authors[0]?.fullName).toBe("Jane Smith");
    expect(result.description).toBe("Article description");
  });

  it("extracts from OG tags", () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="og:title" content="OG Title" />
          <meta property="og:site_name" content="Example Site" />
          <meta property="og:description" content="OG Description" />
          <meta property="og:type" content="article" />
        </head>
        <body></body>
      </html>
    `;
    const result = extractMetadata(createContext(html));
    expect(result.title).toBe("OG Title");
    expect(result.siteName).toBe("Example Site");
    expect(result.type).toBe("article");
  });

  it("falls back to document title then hostname", () => {
    const html = `<!DOCTYPE html><html><head><title>Fallback Title</title></head><body></body></html>`;
    const result = extractMetadata(createContext(html));
    expect(result.title).toBe("Fallback Title");

    const html2 = `<!DOCTYPE html><html><head></head><body></body></html>`;
    const result2 = extractMetadata(createContext(html2));
    expect(result2.title).toBe("example.com");
    expect(result2.siteName).toBe("example.com");
  });

  it("prefers JSON-LD over meta tags", () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="title" content="Meta Title" />
          <script type="application/ld+json">{ "@type": "Article", "headline": "JSON-LD Title" }</script>
        </head>
        <body></body>
      </html>
    `;
    const result = extractMetadata(createContext(html));
    expect(result.title).toBe("JSON-LD Title");
  });
});
