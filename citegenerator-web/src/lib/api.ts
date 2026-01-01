import { env } from "./env";

export interface MetadataResult {
  title: string;
  url: string;
  accessDate: string;
  authors: Array<{ firstName?: string; lastName?: string; fullName: string }>;
  publishedDate?: string;
  siteName?: string;
  publisher?: string;
}

export type CitationStyle = "apa" | "mla" | "chicago" | "harvard";

export interface FormattedCitation {
  style: CitationStyle;
  html: string;
  text: string;
  bibtex?: string;
}

export async function citeUrl(
  url: string,
  style: CitationStyle,
): Promise<{
  metadata: MetadataResult;
  citation: FormattedCitation;
}> {
  const response = await fetch(`${env.apiUrl}/api/cite`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, style }),
  });

  const data = (await response.json()) as
    | {
        success: true;
        data: {
          metadata: MetadataResult;
          citations: Partial<Record<CitationStyle, FormattedCitation>>;
        };
      }
    | { success: false; error?: { message?: string } };

  if (!response.ok || !("success" in data) || data.success !== true) {
    const message =
      "error" in data && data.error?.message ? data.error.message : "Failed to generate citation";
    throw new Error(message);
  }

  const citation = data.data.citations[style];
  if (!citation) {
    throw new Error("Failed to generate citation");
  }

  return { metadata: data.data.metadata, citation };
}

export async function scrapeUrl(url: string): Promise<MetadataResult> {
  const response = await fetch(`${env.apiUrl}/api/scrape`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  const data = (await response.json()) as
    | { success: true; data: MetadataResult }
    | { success: false; error?: { message?: string } };

  if (!response.ok || !("success" in data) || data.success !== true) {
    const message =
      "error" in data && data.error?.message ? data.error.message : "Failed to scrape URL";
    throw new Error(message);
  }

  return data.data;
}

export async function formatCitation(
  citation: MetadataResult,
  style: CitationStyle,
): Promise<FormattedCitation> {
  const response = await fetch(`${env.apiUrl}/api/format`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ citation, style }),
  });

  const data = (await response.json()) as
    | { success: true; data: FormattedCitation }
    | { success: false; error?: { message?: string } };

  if (!response.ok || !("success" in data) || data.success !== true) {
    const message =
      "error" in data && data.error?.message ? data.error.message : "Failed to format citation";
    throw new Error(message);
  }

  return data.data;
}

function getAnonymousId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const key = "cg_anon_id";
  try {
    const existing = window.localStorage.getItem(key);
    if (existing) return existing;

    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? (crypto.randomUUID() as string)
        : `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    window.localStorage.setItem(key, id);
    return id;
  } catch {
    return undefined;
  }
}

export async function trackEvent(
  event: string,
  properties?: Record<string, string | number | boolean>,
) {
  try {
    const anonymousId = getAnonymousId();
    const path =
      typeof window !== "undefined" && window.location
        ? window.location.pathname + window.location.search
        : undefined;

    await fetch(`${env.apiUrl}/api/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        anonymousId,
        properties: { ...(properties || {}), ...(path ? { path } : {}) },
      }),
      keepalive: true,
    });
  } catch {
    // best-effort
  }
}
