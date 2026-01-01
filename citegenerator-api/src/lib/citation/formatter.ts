import Cite from "citation-js";
import { templates } from "./templates.js";
import type { CitationStyle, CitationInput, FormattedCitation, FormatOptions } from "./types.js";
import { CitationError } from "./types.js";

const SUPPORTED_STYLES: CitationStyle[] = ["apa", "mla", "chicago", "harvard"];

export function formatCitation(input: CitationInput, options: FormatOptions): FormattedCitation {
  if (!SUPPORTED_STYLES.includes(options.style)) {
    throw new CitationError(`Unsupported citation style: ${options.style}`, "UNSUPPORTED_STYLE");
  }
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
  const citeData: Record<string, unknown> = {
    type: "webpage",
    title: input.title,
    URL: input.url,
    accessed: { "date-parts": [parseDate(input.accessDate)] },
    author: input.authors?.map((a) => ({
      family: a.lastName || a.fullName.split(" ").pop() || a.fullName,
      given: a.firstName || a.fullName.split(" ").slice(0, -1).join(" ") || "",
    })),
    issued: input.publishedDate ? { "date-parts": [parseDate(input.publishedDate)] } : undefined,
    "container-title": input.siteName,
    publisher: input.publisher,
  };

  try {
    const cite = new Cite(citeData);
    return cite.format("bibtex");
  } catch {
    return generateManualBibtex(input);
  }
}

function parseDate(dateStr: string): number[] {
  const date = new Date(dateStr);
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()];
}

function generateManualBibtex(input: CitationInput): string {
  const key = generateBibtexKey(input);
  const authors = input.authors?.map((a) => a.fullName).join(" and ") || "Unknown";
  const year = input.publishedDate ? new Date(input.publishedDate).getFullYear() : "n.d.";
  const accessDate = new Date(input.accessDate).toISOString().split("T")[0];

  return `@misc{${key},
  author = {${authors}},
  title = {${input.title}},
  year = {${year}},
  url = {${input.url}},
  urldate = {${accessDate}},
  note = {${input.siteName || ""}}
}`;
}

function generateBibtexKey(input: CitationInput): string {
  const firstAuthor =
    input.authors?.[0]?.lastName || input.authors?.[0]?.fullName.split(" ").pop() || "unknown";
  const year = input.publishedDate ? new Date(input.publishedDate).getFullYear() : "nd";
  const titleWord =
    input.title
      .split(" ")[0]
      ?.toLowerCase()
      .replace(/[^a-z]/g, "") || "cite";
  return `${String(firstAuthor).toLowerCase()}${year}${titleWord}`;
}

export function getSupportedStyles(): CitationStyle[] {
  return [...SUPPORTED_STYLES];
}

export function isValidStyle(style: string): style is CitationStyle {
  return SUPPORTED_STYLES.includes(style as CitationStyle);
}
