import { describe, expect, it } from "vitest";
import {
  sanitizeUrl,
  sanitizeUrlDetailed,
  stripTrackingParams,
  removeAuthFromUrl,
  removeFragmentFromUrl,
  hasAuthCredentials,
} from "./sanitize-url.js";

describe("sanitizeUrl", () => {
  it("returns original URL if no changes needed", () => {
    const result = sanitizeUrl("https://example.com/path");
    expect(result).toBe("https://example.com/path");
  });

  it("removes tracking parameters", () => {
    const url = "https://example.com/path?utm_source=google&utm_medium=email&id=123";
    const result = sanitizeUrl(url);
    expect(result).toBe("https://example.com/path?id=123");
  });

  it("removes gclid", () => {
    expect(sanitizeUrl("https://example.com?gclid=123abc")).toBe("https://example.com/");
  });

  it("removes fbclid", () => {
    expect(sanitizeUrl("https://example.com?fbclid=xyz")).toBe("https://example.com/");
  });

  it("removes fragment", () => {
    expect(sanitizeUrl("https://example.com/path#section")).toBe("https://example.com/path");
  });

  it("removes auth credentials", () => {
    expect(sanitizeUrl("https://user:pass@example.com/path")).toBe("https://example.com/path");
  });

  it("handles multiple tracking params", () => {
    const url = "https://example.com?utm_source=x&utm_medium=y&gclid=a&fbclid=b&ref=other";
    const result = sanitizeUrl(url);
    expect(result).toContain("ref=other");
    expect(result).not.toContain("utm_source");
  });

  it("preserves non-tracking params", () => {
    const url = "https://example.com?page=1&sort=name";
    const result = sanitizeUrl(url);
    expect(result).toContain("page=1");
    expect(result).toContain("sort=name");
  });
});

describe("sanitizeUrlDetailed", () => {
  it("returns no changes for clean URL", () => {
    const result = sanitizeUrlDetailed("https://example.com/path");
    expect(result.sanitized).toBe("https://example.com/path");
    expect(result.changes.authRemoved).toBe(false);
    expect(result.changes.fragmentRemoved).toBe(false);
    expect(result.changes.trackingParamsRemoved).toEqual([]);
  });

  it("reports auth removal", () => {
    const result = sanitizeUrlDetailed("https://user:pass@example.com/path");
    expect(result.changes.authRemoved).toBe(true);
    expect(result.sanitized).toBe("https://example.com/path");
  });

  it("reports fragment removal", () => {
    const result = sanitizeUrlDetailed("https://example.com/path#section");
    expect(result.changes.fragmentRemoved).toBe(true);
    expect(result.sanitized).toBe("https://example.com/path");
  });

  it("reports tracking params removed", () => {
    const result = sanitizeUrlDetailed("https://example.com?utm_source=x&utm_medium=y");
    expect(result.changes.trackingParamsRemoved).toEqual(["utm_source", "utm_medium"]);
  });

  it("includes original URL", () => {
    const result = sanitizeUrlDetailed("https://user:pass@example.com?utm_source=x#top");
    expect(result.original).toBe("https://user:pass@example.com?utm_source=x#top");
    expect(result.sanitized).not.toContain("user:pass");
    expect(result.changes.authRemoved).toBe(true);
    expect(result.changes.fragmentRemoved).toBe(true);
    expect(result.changes.trackingParamsRemoved).toEqual(["utm_source"]);
  });
});

describe("stripTrackingParams", () => {
  it("removes all tracking params", () => {
    const url = "https://example.com?utm_source=x&id=1&fbclid=y";
    const result = stripTrackingParams(url);
    expect(result).toContain("id=1");
    expect(result).not.toContain("utm_source");
  });

  it("returns URL unchanged if no tracking params", () => {
    const url = "https://example.com?page=1";
    expect(stripTrackingParams(url)).toBe(url);
  });

  it("handles URLs with no search params", () => {
    const url = "https://example.com/path";
    expect(stripTrackingParams(url)).toBe(url);
  });
});

describe("hasAuthCredentials", () => {
  it("detects username:password in URL", () => {
    expect(hasAuthCredentials("https://user:pass@example.com")).toBe(true);
  });

  it("returns false for URLs without auth", () => {
    expect(hasAuthCredentials("https://example.com")).toBe(false);
  });

  it("returns false for URLs with only username", () => {
    expect(hasAuthCredentials("https://user@example.com")).toBe(false);
  });
});

describe("removeAuthFromUrl", () => {
  it("removes username and password", () => {
    expect(removeAuthFromUrl("https://user:pass@example.com/path")).toBe(
      "https://example.com/path",
    );
  });

  it("preserves URL without auth", () => {
    expect(removeAuthFromUrl("https://example.com/path")).toBe("https://example.com/path");
  });
});

describe("removeFragmentFromUrl", () => {
  it("removes hash fragment", () => {
    expect(removeFragmentFromUrl("https://example.com/path#section")).toBe(
      "https://example.com/path",
    );
  });

  it("preserves URL without fragment", () => {
    expect(removeFragmentFromUrl("https://example.com/path")).toBe("https://example.com/path");
  });
});
