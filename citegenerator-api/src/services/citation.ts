import { ApiError } from "../lib/errors.js";
import { formatCitation, isValidStyle } from "../lib/citation/index.js";
import type { CitationInput, CitationStyle, FormattedCitation } from "../lib/citation/types.js";
import { sanitizeText } from "../lib/validation/sanitize.js";

export interface CitationService {
  format(input: CitationInput, style: string): FormattedCitation;
  listFormats(): Array<{ id: CitationStyle; name: string; description: string; example: string }>;
}

const FORMAT_META: Record<CitationStyle, { name: string; description: string; example: string }> = {
  apa: {
    name: "APA 7th Edition",
    description: "American Psychological Association, 7th edition",
    example: "Author, A. A. (Year). Title. Publisher. URL",
  },
  mla: {
    name: "MLA 9th Edition",
    description: "Modern Language Association, 9th edition",
    example: 'Author. "Title." Publisher, Date, URL.',
  },
  chicago: {
    name: "Chicago 17th Edition",
    description: "Chicago Manual of Style, 17th edition (Notes-Bibliography)",
    example: 'Author. "Title." Site Name. Accessed Month Day, Year. URL.',
  },
  harvard: {
    name: "Harvard",
    description: "Harvard referencing style (common UK university format)",
    example: "Author (Year) Title. Available at: URL (Accessed: Day Month Year).",
  },
};

export function createCitationService(): CitationService {
  return {
    format(input, style) {
      if (!isValidStyle(style)) {
        throw new ApiError({
          status: 400,
          code: "INVALID_REQUEST",
          message: "Unsupported citation style",
          details: `Unsupported style: ${style}`,
        });
      }

      const safe: CitationInput = {
        title: sanitizeText(input.title, 512),
        url: sanitizeText(input.url, 2048),
        accessDate: sanitizeText(input.accessDate, 64),
        authors: input.authors?.map((a) => ({
          fullName: sanitizeText(a.fullName, 128),
          firstName: a.firstName ? sanitizeText(a.firstName, 64) : undefined,
          lastName: a.lastName ? sanitizeText(a.lastName, 64) : undefined,
        })),
        publishedDate: input.publishedDate ? sanitizeText(input.publishedDate, 64) : undefined,
        siteName: input.siteName ? sanitizeText(input.siteName, 128) : undefined,
        publisher: input.publisher ? sanitizeText(input.publisher, 128) : undefined,
      };

      const formatted = formatCitation(safe, { style, includeBibtex: true });
      return formatted;
    },

    listFormats() {
      return (Object.keys(FORMAT_META) as CitationStyle[]).map((id) => ({
        id,
        ...FORMAT_META[id],
      }));
    },
  };
}
