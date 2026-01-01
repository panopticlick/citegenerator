export type CitationStyle = "apa" | "mla" | "chicago" | "harvard";

export interface CitationInput {
  title: string;
  url: string;
  accessDate: string;
  authors?: CitationAuthor[];
  publishedDate?: string;
  siteName?: string;
  publisher?: string;
}

export interface CitationAuthor {
  firstName?: string;
  lastName?: string;
  fullName: string;
}

export interface FormattedCitation {
  style: CitationStyle;
  html: string;
  text: string;
  bibtex?: string;
}

export interface FormatOptions {
  style: CitationStyle;
  includeBibtex?: boolean;
}

export class CitationError extends Error {
  constructor(
    message: string,
    public readonly code: CitationErrorCode,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = "CitationError";
  }
}

export type CitationErrorCode = "INVALID_INPUT" | "UNSUPPORTED_STYLE" | "FORMATTING_FAILED";
