import type { CitationStyle, CitationInput, CitationAuthor } from "./types.js";

export interface StyleTemplate {
  formatHtml(input: CitationInput): string;
  formatText(input: CitationInput): string;
}

function formatAuthors(authors: CitationAuthor[] | undefined, style: CitationStyle): string {
  if (!authors || authors.length === 0) return "";
  switch (style) {
    case "apa":
      return formatAuthorsApa(authors);
    case "mla":
      return formatAuthorsMla(authors);
    case "chicago":
      return formatAuthorsMla(authors);
    case "harvard":
      return formatAuthorsHarvard(authors);
  }
}

function formatAuthorsApa(authors: CitationAuthor[]): string {
  return authors
    .map((a, i) => {
      const lastName = a.lastName || a.fullName.split(" ").pop() || a.fullName;
      const firstInitial = a.firstName?.[0] || a.fullName.split(" ")[0]?.[0] || "";
      const formatted = `${lastName}, ${firstInitial}.`;
      if (i === authors.length - 1 && authors.length > 1) return `& ${formatted}`;
      return formatted;
    })
    .join(" ");
}

function formatAuthorsMla(authors: CitationAuthor[]): string {
  if (authors.length === 1) {
    const a = authors[0]!;
    const lastName = a.lastName || a.fullName.split(" ").pop() || a.fullName;
    const firstName = a.firstName || a.fullName.split(" ").slice(0, -1).join(" ") || "";
    return firstName ? `${lastName}, ${firstName}` : lastName;
  }

  return authors
    .map((a, i) => {
      if (i === 0) {
        const lastName = a.lastName || a.fullName.split(" ").pop() || a.fullName;
        const firstName = a.firstName || a.fullName.split(" ").slice(0, -1).join(" ") || "";
        return firstName ? `${lastName}, ${firstName}` : lastName;
      }
      if (i === authors.length - 1) return `and ${a.fullName}`;
      return a.fullName;
    })
    .join(", ");
}

function formatAuthorsHarvard(authors: CitationAuthor[]): string {
  return authors
    .map((a, i) => {
      const lastName = a.lastName || a.fullName.split(" ").pop() || a.fullName;
      const firstInitial = a.firstName?.[0] || a.fullName.split(" ")[0]?.[0] || "";
      const formatted = `${lastName}, ${firstInitial}.`;
      if (i === authors.length - 1 && authors.length > 1) return `and ${formatted}`;
      return formatted;
    })
    .join(" ");
}

function formatDate(dateStr: string | undefined, style: CitationStyle): string {
  if (!dateStr) return style === "apa" ? "(n.d.)" : "n.d.";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return style === "apa" ? "(n.d.)" : "n.d.";
  const year = date.getFullYear();
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const day = date.getDate();
  switch (style) {
    case "apa":
      return `(${year}, ${month} ${day})`;
    case "mla":
      return `${day} ${month.slice(0, 3)}. ${year}`;
    case "chicago":
      return `${month} ${day}, ${year}`;
    case "harvard":
      return `${year}`;
  }
}

function formatAccessDate(dateStr: string, style: CitationStyle): string {
  const date = new Date(dateStr);
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  switch (style) {
    case "apa":
      return `Retrieved ${month} ${day}, ${year}`;
    case "mla":
      return `Accessed ${day} ${month.slice(0, 3)}. ${year}`;
    case "chicago":
      return `Accessed ${month} ${day}, ${year}`;
    case "harvard":
      return `(Accessed: ${day} ${month} ${year})`;
  }
}

export const templates: Record<CitationStyle, StyleTemplate> = {
  apa: {
    formatHtml(input) {
      const authors = formatAuthors(input.authors, "apa");
      const date = formatDate(input.publishedDate, "apa");
      const title = input.title;
      const siteName = input.siteName || input.publisher || "";
      const url = input.url;
      const accessed = formatAccessDate(input.accessDate, "apa");

      const parts: string[] = [];
      if (authors) parts.push(authors);
      parts.push(date);
      parts.push(`<em>${escapeHtml(title)}</em>.`);
      if (siteName) parts.push(`${escapeHtml(siteName)}.`);
      parts.push(`${accessed}, from <a href="${escapeAttr(url)}">${escapeHtml(url)}</a>`);
      return parts.join(" ");
    },
    formatText(input) {
      const authors = formatAuthors(input.authors, "apa");
      const date = formatDate(input.publishedDate, "apa");
      const title = input.title;
      const siteName = input.siteName || input.publisher || "";
      const url = input.url;
      const accessed = formatAccessDate(input.accessDate, "apa");

      const parts: string[] = [];
      if (authors) parts.push(authors);
      parts.push(date);
      parts.push(`${title}.`);
      if (siteName) parts.push(`${siteName}.`);
      parts.push(`${accessed}, from ${url}`);
      return parts.join(" ");
    },
  },

  mla: {
    formatHtml(input) {
      const authors = formatAuthors(input.authors, "mla");
      const title = input.title;
      const siteName = input.siteName || input.publisher || "";
      const date = formatDate(input.publishedDate, "mla");
      const url = input.url;
      const accessed = formatAccessDate(input.accessDate, "mla");

      const parts: string[] = [];
      if (authors) parts.push(`${escapeHtml(authors)}.`);
      parts.push(`"${escapeHtml(title)}."`);
      if (siteName) parts.push(`<em>${escapeHtml(siteName)}</em>,`);
      if (date !== "n.d.") parts.push(`${escapeHtml(date)},`);
      parts.push(`<a href="${escapeAttr(url)}">${escapeHtml(url)}</a>.`);
      parts.push(`${escapeHtml(accessed)}.`);
      return parts.join(" ");
    },
    formatText(input) {
      const authors = formatAuthors(input.authors, "mla");
      const title = input.title;
      const siteName = input.siteName || input.publisher || "";
      const date = formatDate(input.publishedDate, "mla");
      const url = input.url;
      const accessed = formatAccessDate(input.accessDate, "mla");

      const parts: string[] = [];
      if (authors) parts.push(`${authors}.`);
      parts.push(`"${title}."`);
      if (siteName) parts.push(`${siteName},`);
      if (date !== "n.d.") parts.push(`${date},`);
      parts.push(`${url}.`);
      parts.push(`${accessed}.`);
      return parts.join(" ");
    },
  },

  chicago: {
    formatHtml(input) {
      const authors = formatAuthors(input.authors, "chicago");
      const title = input.title;
      const siteName = input.siteName || input.publisher || "";
      const date = formatDate(input.publishedDate, "chicago");
      const url = input.url;
      const accessed = formatAccessDate(input.accessDate, "chicago");

      const parts: string[] = [];
      if (authors) parts.push(`${escapeHtml(authors)}.`);
      parts.push(`"${escapeHtml(title)}."`);
      if (siteName) parts.push(`<em>${escapeHtml(siteName)}</em>.`);
      if (date !== "n.d.") parts.push(`${escapeHtml(date)}.`);
      parts.push(`${escapeHtml(accessed)}.`);
      parts.push(`<a href="${escapeAttr(url)}">${escapeHtml(url)}</a>.`);
      return parts.join(" ");
    },
    formatText(input) {
      const authors = formatAuthors(input.authors, "chicago");
      const title = input.title;
      const siteName = input.siteName || input.publisher || "";
      const date = formatDate(input.publishedDate, "chicago");
      const url = input.url;
      const accessed = formatAccessDate(input.accessDate, "chicago");

      const parts: string[] = [];
      if (authors) parts.push(`${authors}.`);
      parts.push(`"${title}."`);
      if (siteName) parts.push(`${siteName}.`);
      if (date !== "n.d.") parts.push(`${date}.`);
      parts.push(`${accessed}.`);
      parts.push(`${url}.`);
      return parts.join(" ");
    },
  },

  harvard: {
    formatHtml(input) {
      const authors = formatAuthors(input.authors, "harvard");
      const year = formatDate(input.publishedDate, "harvard");
      const title = input.title;
      const siteName = input.siteName || input.publisher || "";
      const url = input.url;
      const accessed = formatAccessDate(input.accessDate, "harvard");

      const parts: string[] = [];
      if (authors) parts.push(escapeHtml(authors));
      parts.push(`(${escapeHtml(year)})`);
      parts.push(`<em>${escapeHtml(title)}</em>.`);
      if (siteName) parts.push(`${escapeHtml(siteName)}.`);
      parts.push(`Available at: <a href="${escapeAttr(url)}">${escapeHtml(url)}</a>`);
      parts.push(escapeHtml(accessed));
      return parts.join(" ");
    },
    formatText(input) {
      const authors = formatAuthors(input.authors, "harvard");
      const year = formatDate(input.publishedDate, "harvard");
      const title = input.title;
      const siteName = input.siteName || input.publisher || "";
      const url = input.url;
      const accessed = formatAccessDate(input.accessDate, "harvard");

      const parts: string[] = [];
      if (authors) parts.push(authors);
      parts.push(`(${year})`);
      parts.push(`${title}.`);
      if (siteName) parts.push(`${siteName}.`);
      parts.push(`Available at: ${url}`);
      parts.push(accessed);
      return parts.join(" ");
    },
  },
};

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(input: string): string {
  return escapeHtml(input);
}
