import { describe, expect, it, vi } from "vitest";
import { citeUrl, formatCitation, scrapeUrl } from "./api";

describe("api client", () => {
  it("calls /api/scrape", async () => {
    const fetchMock = vi.fn(async () => {
      return new Response(
        JSON.stringify({
          success: true,
          data: { title: "T", url: "https://x", accessDate: "2024-01-01T00:00:00Z", authors: [] },
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await scrapeUrl("https://example.com");
    expect(res.title).toBe("T");
    expect(fetchMock).toHaveBeenCalled();
  });

  it("calls /api/format", async () => {
    const fetchMock = vi.fn(async () => {
      return new Response(
        JSON.stringify({ success: true, data: { style: "apa", html: "<p>x</p>", text: "x" } }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await formatCitation(
      { title: "T", url: "https://x", accessDate: "2024-01-01T00:00:00Z", authors: [] },
      "apa",
    );
    expect(res.style).toBe("apa");
  });

  it("calls /api/cite", async () => {
    const fetchMock = vi.fn(async () => {
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            metadata: {
              title: "T",
              url: "https://x",
              accessDate: "2024-01-01T00:00:00Z",
              authors: [],
            },
            citations: { apa: { style: "apa", html: "<p>x</p>", text: "x" } },
          },
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await citeUrl("https://example.com", "apa");
    expect(res.metadata.title).toBe("T");
    expect(res.citation.style).toBe("apa");
    expect(fetchMock).toHaveBeenCalled();
  });
});
