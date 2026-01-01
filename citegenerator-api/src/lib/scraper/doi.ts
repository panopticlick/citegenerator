import { z } from "zod";
import type { MetadataResult, Author } from "./types.js";
import { ScraperError } from "./types.js";

const DOI_REGEX = /^10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+$/;

const CrossRefAuthorSchema = z.object({
  given: z.string().optional(),
  family: z.string().optional(),
  name: z.string().optional(),
});

const CrossRefDatePartsSchema = z.object({
  "date-parts": z.array(z.array(z.number())).optional(),
});

const CrossRefWorkSchema = z.object({
  title: z.array(z.string()).optional(),
  author: z.array(CrossRefAuthorSchema).optional(),
  publisher: z.string().optional(),
  "container-title": z.array(z.string()).optional(),
  published: CrossRefDatePartsSchema.optional(),
  "published-print": CrossRefDatePartsSchema.optional(),
  "published-online": CrossRefDatePartsSchema.optional(),
  created: CrossRefDatePartsSchema.optional(),
  deposited: CrossRefDatePartsSchema.optional(),
  DOI: z.string().optional(),
  URL: z.string().optional(),
  type: z.string().optional(),
  abstract: z.string().optional(),
  language: z.string().optional(),
  volume: z.string().optional(),
  issue: z.string().optional(),
  page: z.string().optional(),
  ISSN: z.array(z.string()).optional(),
  ISBN: z.array(z.string()).optional(),
});

const CrossRefResponseSchema = z.object({
  status: z.string(),
  "message-type": z.string(),
  message: CrossRefWorkSchema,
});

export function validateDoi(input: string): string {
  const cleaned = input.trim().replace(/^https?:\/\/(dx\.)?doi\.org\//, "");
  if (!DOI_REGEX.test(cleaned)) {
    throw new ScraperError("Invalid DOI format", "INVALID_URL", input);
  }
  return cleaned;
}

function parseDateParts(dateParts: number[][] | undefined): string | undefined {
  if (!dateParts || dateParts.length === 0 || dateParts[0].length === 0) {
    return undefined;
  }
  const [year, month, day] = dateParts[0];
  if (!year) return undefined;
  const parts = [year.toString().padStart(4, "0")];
  if (month) parts.push(month.toString().padStart(2, "0"));
  if (day) parts.push(day.toString().padStart(2, "0"));
  return parts.join("-");
}

function parseAuthors(authors: z.infer<typeof CrossRefAuthorSchema>[] | undefined): Author[] {
  if (!authors) return [];
  return authors
    .map((a) => {
      if (a.name) {
        return { fullName: a.name };
      }
      if (a.family) {
        return {
          firstName: a.given,
          lastName: a.family,
          fullName: [a.given, a.family].filter(Boolean).join(" "),
        };
      }
      return null;
    })
    .filter((a): a is Author => a !== null);
}

export async function scrapeDoi(doi: string): Promise<MetadataResult> {
  const validDoi = validateDoi(doi);
  const apiUrl = "https://api.crossref.org/works/" + encodeURIComponent(validDoi);

  const response = await fetch(apiUrl, {
    headers: {
      Accept: "application/json",
      "User-Agent":
        "CiteGenerator/1.0 (https://citegenerator.com; mailto:support@citegenerator.com)",
    },
    signal: AbortSignal.timeout(15_000),
  });

  if (response.status === 404) {
    throw new ScraperError("DOI not found", "PAGE_NOT_FOUND", doi);
  }

  if (!response.ok) {
    throw new ScraperError("CrossRef API error: " + response.status, "EXTRACTION_FAILED", doi);
  }

  const json = await response.json();
  const parsed = CrossRefResponseSchema.safeParse(json);

  if (!parsed.success) {
    throw new ScraperError("Failed to parse CrossRef response", "EXTRACTION_FAILED", doi);
  }

  const work = parsed.data.message;
  const title = work.title?.[0] || "DOI: " + validDoi;

  const publishedDate =
    parseDateParts(work.published?.["date-parts"]) ||
    parseDateParts(work["published-print"]?.["date-parts"]) ||
    parseDateParts(work["published-online"]?.["date-parts"]) ||
    parseDateParts(work.created?.["date-parts"]);

  const doiUrl = work.URL || "https://doi.org/" + validDoi;
  const containerTitle = work["container-title"]?.[0];

  return {
    url: doiUrl,
    title,
    accessDate: new Date().toISOString(),
    authors: parseAuthors(work.author),
    publishedDate,
    publisher: work.publisher,
    siteName: containerTitle || work.publisher,
    description: work.abstract?.replace(/<[^>]*>/g, "").slice(0, 500),
    language: work.language,
    type: "academic",
    _source: "json-ld",
  };
}
