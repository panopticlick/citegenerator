import { z } from "zod";
import type { MetadataResult, Author } from "./types.js";
import { ScraperError } from "./types.js";

const ISBN10_REGEX = /^(?:\d{9}[\dXx]|\d{1,5}[- ]?\d{1,7}[- ]?\d{1,7}[- ]?[\dXx])$/;
const ISBN13_REGEX = /^(?:97[89]\d{10}|97[89][- ]?\d{1,5}[- ]?\d{1,7}[- ]?\d{1,7}[- ]?\d)$/;

const OpenLibraryAuthorSchema = z.object({
  name: z.string(),
  url: z.string().optional(),
});

const OpenLibraryPublisherSchema = z.object({
  name: z.string(),
});

const OpenLibraryIdentifiersSchema = z.object({
  isbn_10: z.array(z.string()).optional(),
  isbn_13: z.array(z.string()).optional(),
  openlibrary: z.array(z.string()).optional(),
});

const OpenLibraryBookSchema = z.object({
  title: z.string(),
  authors: z.array(OpenLibraryAuthorSchema).optional(),
  publishers: z.array(OpenLibraryPublisherSchema).optional(),
  publish_date: z.string().optional(),
  number_of_pages: z.number().optional(),
  subjects: z.array(z.object({ name: z.string() })).optional(),
  url: z.string().optional(),
  cover: z
    .object({
      small: z.string().optional(),
      medium: z.string().optional(),
      large: z.string().optional(),
    })
    .optional(),
  identifiers: OpenLibraryIdentifiersSchema.optional(),
  notes: z.string().optional(),
});

export function validateIsbn(input: string): string {
  const cleaned = input.replace(/[- ]/g, "").toUpperCase();
  if (ISBN10_REGEX.test(input.replace(/[- ]/g, "")) && cleaned.length === 10) {
    if (!validateIsbn10Checksum(cleaned)) {
      throw new ScraperError("Invalid ISBN-10 checksum", "INVALID_URL", input);
    }
    return cleaned;
  }
  if (ISBN13_REGEX.test(input.replace(/[- ]/g, "")) && cleaned.length === 13) {
    if (!validateIsbn13Checksum(cleaned)) {
      throw new ScraperError("Invalid ISBN-13 checksum", "INVALID_URL", input);
    }
    return cleaned;
  }
  throw new ScraperError("Invalid ISBN format", "INVALID_URL", input);
}

function validateIsbn10Checksum(isbn: string): boolean {
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(isbn[i], 10) * (10 - i);
  }
  const check = isbn[9] === "X" ? 10 : parseInt(isbn[9], 10);
  sum += check;
  return sum % 11 === 0;
}

function validateIsbn13Checksum(isbn: string): boolean {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(isbn[i], 10) * (i % 2 === 0 ? 1 : 3);
  }
  const check = (10 - (sum % 10)) % 10;
  return check === parseInt(isbn[12], 10);
}

function parsePublishDate(dateStr: string | undefined): string | undefined {
  if (!dateStr) return undefined;
  const yearMatch = dateStr.match(/\b(1[0-9]{3}|20[0-2][0-9])\b/);
  if (yearMatch) {
    return yearMatch[1];
  }
  return undefined;
}

function parseAuthors(authors: z.infer<typeof OpenLibraryAuthorSchema>[] | undefined): Author[] {
  if (!authors) return [];
  return authors.map((a) => {
    const parts = a.name.split(/\s+/);
    if (parts.length > 1) {
      return {
        firstName: parts.slice(0, -1).join(" "),
        lastName: parts[parts.length - 1],
        fullName: a.name,
      };
    }
    return { fullName: a.name };
  });
}

export async function scrapeIsbn(isbn: string): Promise<MetadataResult> {
  const validIsbn = validateIsbn(isbn);
  const apiUrl = `https://openlibrary.org/api/books?bibkeys=ISBN:${validIsbn}&format=json&jscmd=data`;

  const response = await fetch(apiUrl, {
    headers: {
      Accept: "application/json",
      "User-Agent": "CiteGenerator/1.0 (https://citegenerator.com)",
    },
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new ScraperError(`OpenLibrary API error: ${response.status}`, "EXTRACTION_FAILED", isbn);
  }

  const json: Record<string, unknown> = await response.json();
  const bookKey = `ISBN:${validIsbn}`;

  if (!json[bookKey]) {
    throw new ScraperError("ISBN not found", "PAGE_NOT_FOUND", isbn);
  }

  const parsed = OpenLibraryBookSchema.safeParse(json[bookKey]);

  if (!parsed.success) {
    throw new ScraperError("Failed to parse OpenLibrary response", "EXTRACTION_FAILED", isbn);
  }

  const book = parsed.data;
  const publisher = book.publishers?.[0]?.name;

  return {
    url: book.url || `https://openlibrary.org/isbn/${validIsbn}`,
    title: book.title,
    accessDate: new Date().toISOString(),
    authors: parseAuthors(book.authors),
    publishedDate: parsePublishDate(book.publish_date),
    publisher,
    siteName: "Open Library",
    description: book.notes?.slice(0, 500),
    type: "academic",
    _source: "json-ld",
  };
}
