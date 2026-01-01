import { describe, expect, it } from "vitest";
import { formatCitation, getSupportedStyles, isValidStyle } from "./formatter.js";
import type { CitationInput } from "./types.js";
import { CitationError } from "./types.js";

describe("formatCitation", () => {
  const validInput: CitationInput = {
    title: "How to Write Better Code",
    url: "https://example.com/article",
    accessDate: "2024-03-15T10:00:00Z",
    authors: [{ fullName: "John Smith", firstName: "John", lastName: "Smith" }],
    publishedDate: "2024-01-10T00:00:00Z",
    siteName: "Example Blog",
  };

  it("formats APA", () => {
    const result = formatCitation(validInput, { style: "apa" });
    expect(result.style).toBe("apa");
    expect(result.text).toContain("Smith, J.");
    expect(result.text).toContain("(2024,");
    expect(result.html).toContain("<em>");
  });

  it("formats MLA", () => {
    const result = formatCitation(validInput, { style: "mla" });
    expect(result.style).toBe("mla");
    expect(result.text).toContain('"How to Write Better Code."');
  });

  it("formats Chicago", () => {
    const result = formatCitation(validInput, { style: "chicago" });
    expect(result.text).toContain("Accessed");
  });

  it("formats Harvard", () => {
    const result = formatCitation(validInput, { style: "harvard" });
    expect(result.text).toContain("(2024)");
    expect(result.text).toContain("Available at:");
  });

  it("handles missing author", () => {
    const input: CitationInput = {
      title: "Anonymous Article",
      url: "https://example.com",
      accessDate: validInput.accessDate,
    };
    const result = formatCitation(input, { style: "apa" });
    expect(result.text).toContain("Anonymous Article");
  });

  it("generates BibTeX when requested", () => {
    const result = formatCitation(validInput, { style: "apa", includeBibtex: true });
    expect(result.bibtex).toContain("@misc{");
    expect(result.bibtex).toContain("title =");
  });

  it("throws for unsupported style", () => {
    const options = { style: "invalid" } as unknown as import("./types.js").FormatOptions;
    expect(() => formatCitation(validInput, options)).toThrow(CitationError);
  });

  it("throws for missing required fields", () => {
    expect(() => formatCitation({ title: "", url: "", accessDate: "" }, { style: "apa" })).toThrow(
      CitationError,
    );
  });
});

describe("getSupportedStyles", () => {
  it("returns supported styles", () => {
    const styles = getSupportedStyles();
    expect(styles).toContain("apa");
    expect(styles).toContain("mla");
    expect(styles).toContain("chicago");
    expect(styles).toContain("harvard");
  });
});

describe("isValidStyle", () => {
  it("detects valid styles", () => {
    expect(isValidStyle("apa")).toBe(true);
    expect(isValidStyle("mla")).toBe(true);
  });

  it("detects invalid styles", () => {
    expect(isValidStyle("invalid")).toBe(false);
  });
});
