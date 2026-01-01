import type { CitationStyle } from "@/lib/api";

export const CITE_SOURCES = [
  "website",
  "book",
  "journal-article",
  "newspaper-article",
  "blog-post",
  "report",
  "government-document",
  "thesis",
  "conference-paper",
  "dataset",
  "youtube-video",
  "podcast",
  "pdf",
] as const;

export type CiteSource = (typeof CITE_SOURCES)[number];

export const CITE_STYLES: CitationStyle[] = ["apa", "mla", "chicago", "harvard"];

export interface CitePageDefinition {
  style: CitationStyle;
  source: CiteSource;
  updated: string; // human readable
  title: string;
  description: string;
  intro: string;
  quickFormat: string;
  steps: Array<{ name: string; text: string }>;
}

export function citePath(style: CitationStyle, source: CiteSource) {
  return `/cite/${style}/${source}`;
}

function styleLabel(style: CitationStyle) {
  switch (style) {
    case "apa":
      return "APA 7th";
    case "mla":
      return "MLA 9th";
    case "chicago":
      return "Chicago 17th";
    case "harvard":
      return "Harvard";
  }
}

function sourceLabel(source: CiteSource) {
  switch (source) {
    case "website":
      return "Website";
    case "book":
      return "Book";
    case "journal-article":
      return "Journal Article";
    case "newspaper-article":
      return "Newspaper Article";
    case "blog-post":
      return "Blog Post";
    case "report":
      return "Report";
    case "government-document":
      return "Government Document";
    case "thesis":
      return "Thesis / Dissertation";
    case "conference-paper":
      return "Conference Paper";
    case "dataset":
      return "Dataset";
    case "youtube-video":
      return "YouTube Video";
    case "podcast":
      return "Podcast";
    case "pdf":
      return "PDF";
  }
}

function quickFormat(style: CitationStyle, source: CiteSource) {
  if (source === "website" || source === "blog-post") {
    if (style === "apa") return "Author, A. A. (Year, Month Day). Title of page. Site Name. URL";
    if (style === "mla")
      return 'Author. "Title of Page." Site Name, Day Mon. Year, URL. Accessed Day Mon. Year.';
    if (style === "chicago")
      return 'Author. "Title of Page." Site Name. Month Day, Year. Accessed Month Day, Year. URL.';
    return "Author (Year) Title of page. Available at: URL (Accessed: Day Month Year).";
  }
  if (source === "book") {
    if (style === "apa") return "Author, A. A. (Year). Title of book. Publisher.";
    if (style === "mla") return "Author. Title of Book. Publisher, Year.";
    if (style === "chicago") return "Author. Title of Book. Publisher, Year.";
    return "Author (Year) Title of book. Publisher.";
  }
  if (source === "journal-article") {
    if (style === "apa")
      return "Author, A. A. (Year). Title of article. Journal Title, volume(issue), pages. DOI/URL";
    if (style === "mla")
      return 'Author. "Title of Article." Journal Title, vol. X, no. X, Year, pp. X–X. DOI/URL.';
    if (style === "chicago")
      return 'Author. "Title of Article." Journal Title volume, no. issue (Year): pages. DOI/URL.';
    return "Author (Year) Title of article. Journal Title, volume(issue), pages. DOI/URL";
  }
  if (source === "newspaper-article") {
    if (style === "apa")
      return "Author, A. A. (Year, Month Day). Title of article. Newspaper Name. URL";
    if (style === "mla")
      return 'Author. "Title of Article." Newspaper Name, Day Mon. Year, URL. Accessed Day Mon. Year.';
    if (style === "chicago")
      return 'Author. "Title of Article." Newspaper Name, Month Day, Year. URL (accessed Month Day, Year).';
    return "Author (Year) Title of article. Newspaper Name. Available at: URL (Accessed: Day Month Year).";
  }
  if (source === "report" || source === "government-document") {
    if (style === "apa") return "Organization. (Year). Title of report. Publisher. URL";
    if (style === "mla") return "Organization. Title of Report. Publisher, Year. URL.";
    if (style === "chicago") return "Organization. Title of Report. Publisher, Year. URL.";
    return "Organization (Year) Title of report. Publisher. Available at: URL (Accessed: Day Month Year).";
  }
  if (source === "thesis") {
    if (style === "apa")
      return "Author, A. A. (Year). Title of thesis [Master’s thesis/Doctoral dissertation, University]. Database/Repository. URL";
    if (style === "mla")
      return "Author. Title of Thesis. Year. University, Master’s thesis/Doctoral dissertation. Database/Repository. URL.";
    if (style === "chicago")
      return "Author. Title of Thesis. Master’s thesis/Doctoral dissertation, University, Year. URL.";
    return "Author (Year) Title of thesis. Thesis (University). Available at: URL (Accessed: Day Month Year).";
  }
  if (source === "conference-paper") {
    if (style === "apa")
      return "Author, A. A. (Year, Month). Title of paper. In Proceedings Title (pp. X–X). Publisher. DOI/URL";
    if (style === "mla")
      return 'Author. "Title of Paper." Proceedings Title, edited by Editor, Publisher, Year, pp. X–X. DOI/URL.';
    if (style === "chicago")
      return 'Author. "Title of Paper." In Proceedings Title, edited by Editor, pages. Place: Publisher, Year. DOI/URL.';
    return "Author (Year) Title of paper. Proceedings Title. DOI/URL";
  }
  if (source === "dataset") {
    if (style === "apa")
      return "Author/Organization. (Year). Title of dataset (Version) [Data set]. Publisher/Repository. DOI/URL";
    if (style === "mla")
      return "Author/Organization. Title of Dataset. Version, Publisher/Repository, Year. DOI/URL.";
    if (style === "chicago")
      return "Author/Organization. Title of Dataset. Version. Publisher/Repository, Year. DOI/URL.";
    return "Author/Organization (Year) Title of dataset. Publisher/Repository. DOI/URL";
  }
  if (source === "youtube-video") {
    if (style === "apa")
      return "Channel Name. (Year, Month Day). Title of video [Video]. YouTube. URL";
    if (style === "mla")
      return '"Title of Video." YouTube, uploaded by Channel Name, Day Mon. Year, URL.';
    if (style === "chicago")
      return '"Title of Video." YouTube video, length. Posted by Channel Name, Month Day, Year. URL.';
    return "Channel Name (Year) Title of video. YouTube video. Available at: URL (Accessed: Day Month Year).";
  }
  if (source === "podcast") {
    if (style === "apa")
      return "Host, H. H. (Host). (Year, Month Day). Episode title (No. X) [Audio podcast episode]. In Podcast Name. Publisher. URL";
    if (style === "mla")
      return '"Episode Title." Podcast Name, hosted by Host Name, Publisher, Day Mon. Year, URL.';
    if (style === "chicago")
      return '"Episode Title." Podcast Name. Podcast audio, length. Month Day, Year. URL.';
    return "Host (Year) Episode title. Podcast Name [Podcast]. Available at: URL (Accessed: Day Month Year).";
  }
  // pdf
  if (style === "apa") return "Author, A. A. (Year). Title of document [PDF]. Site/Publisher. URL";
  if (style === "mla") return "Author. Title of Document. Site/Publisher, Year. PDF file. URL.";
  if (style === "chicago") return "Author. Title of Document. Site/Publisher, Year. PDF. URL.";
  return "Author (Year) Title of document. Available at: URL (Accessed: Day Month Year).";
}

function defaultSteps(source: CiteSource): Array<{ name: string; text: string }> {
  switch (source) {
    case "website":
      return [
        {
          name: "Identify the author or organization",
          text: "Use a byline, About page, or organization name.",
        },
        {
          name: "Find a publication date",
          text: "Use the page date, or omit/use n.d. if missing.",
        },
        { name: "Copy the page title", text: "Use the exact page title (not the site name)." },
        {
          name: "Use a clean URL",
          text: "Remove tracking parameters like utm_* for a cleaner citation.",
        },
      ];
    case "blog-post":
      return [
        {
          name: "Use the post author",
          text: "Prefer the author byline (or the organization if none is listed).",
        },
        { name: "Use the publish date", text: "Use the date shown on the post; omit if missing." },
        { name: "Keep the title exactly as shown", text: "Use the post title, not the blog name." },
        {
          name: "Use the canonical URL",
          text: "Prefer the clean/canonical link (no tracking parameters).",
        },
      ];
    case "book":
      return [
        { name: "Find the author(s)", text: "Use the book’s title page or library record." },
        { name: "Find the year", text: "Use the publication year from the title/copyright page." },
        {
          name: "Record the title and publisher",
          text: "Include edition if required by your style/instructor.",
        },
      ];
    case "journal-article":
      return [
        {
          name: "Collect article details",
          text: "Author(s), year, article title, and journal title.",
        },
        { name: "Add volume/issue/pages", text: "Use the journal record or PDF header/footer." },
        { name: "Prefer DOI when available", text: "Use a DOI link (or stable URL if no DOI)." },
      ];
    case "newspaper-article":
      return [
        {
          name: "Capture the headline and author",
          text: "Use the article headline and the byline.",
        },
        { name: "Use the publication date", text: "News citations usually require the full date." },
        {
          name: "Use the newspaper name",
          text: "Include the publication (and edition/section if required).",
        },
        {
          name: "Prefer the stable URL",
          text: "Remove tracking parameters and paywall redirect links when possible.",
        },
      ];
    case "report":
      return [
        {
          name: "Use the authoring organization",
          text: "For most reports, the organization is the author.",
        },
        {
          name: "Record the report title and year",
          text: "Use the title page or executive summary metadata.",
        },
        {
          name: "Include publisher/repository",
          text: "Add the agency, think tank, or publisher when applicable.",
        },
        { name: "Link to the report URL", text: "Use a stable URL (or DOI) if provided." },
      ];
    case "government-document":
      return [
        { name: "Use the government body as author", text: "E.g., Department/Agency name." },
        {
          name: "Capture the document title and year",
          text: "Use the official title and publication date.",
        },
        {
          name: "Include report/act identifiers",
          text: "Add report numbers, bill/act names, or statute citations if required.",
        },
        {
          name: "Link to the official source",
          text: "Prefer official government domains over reposts.",
        },
      ];
    case "thesis":
      return [
        { name: "Use the thesis author", text: "Use the student’s name as the author." },
        {
          name: "Include degree + institution",
          text: "Master’s/Doctoral + university name are often required.",
        },
        {
          name: "Use the year of submission",
          text: "Use the year shown in the repository record.",
        },
        {
          name: "Link to the repository record",
          text: "Prefer the official university repository URL.",
        },
      ];
    case "conference-paper":
      return [
        { name: "Use the paper author(s)", text: "Same as an article: author list is primary." },
        {
          name: "Include proceedings details",
          text: "Proceedings title, editors, and page range when available.",
        },
        { name: "Prefer DOI if available", text: "DOI is more stable than a generic PDF link." },
        {
          name: "Include conference date/location if required",
          text: "Some styles/instructors expect it.",
        },
      ];
    case "dataset":
      return [
        {
          name: "Use the dataset creator",
          text: "Person, lab, or organization responsible for the data.",
        },
        {
          name: "Record version and year",
          text: "Datasets often change; include a version if provided.",
        },
        {
          name: "Prefer DOI or repository link",
          text: "Use a DOI when available for a stable reference.",
        },
        {
          name: "Include publisher/repository",
          text: "E.g., Zenodo, Figshare, Dryad, or institutional repo.",
        },
      ];
    case "youtube-video":
      return [
        { name: "Use the channel name", text: "Treat the channel/uploader as the author." },
        { name: "Copy the upload date", text: "Use the published date shown under the video." },
        { name: "Copy the title and URL", text: "Use the exact video title and the share URL." },
      ];
    case "podcast":
      return [
        {
          name: "Use host/producer info",
          text: "Use the host as author when required by the style.",
        },
        {
          name: "Capture episode details",
          text: "Episode title, podcast name, date, and episode number if available.",
        },
        {
          name: "Include the platform/publisher",
          text: "Use the podcast publisher or platform if required.",
        },
      ];
    case "pdf":
      return [
        {
          name: "Identify the document source",
          text: "Treat it like a webpage if it’s hosted online.",
        },
        {
          name: "Use author/title/date from the document",
          text: "Prefer the PDF’s first page or metadata.",
        },
        { name: "Link to the PDF URL", text: "Use the direct URL where the PDF can be accessed." },
      ];
  }
}

const UPDATED = "January 1, 2026";

export const CITE_PAGES: CitePageDefinition[] = CITE_STYLES.flatMap((style) =>
  CITE_SOURCES.map((source) => ({
    style,
    source,
    updated: UPDATED,
    title: `${styleLabel(style)} ${sourceLabel(source)} Citation Generator`,
    description: `Generate a ${styleLabel(style)} citation for a ${sourceLabel(source).toLowerCase()} in seconds. Includes examples and a quick step-by-step guide.`,
    intro: `Use this page to cite a ${sourceLabel(source).toLowerCase()} in ${styleLabel(style)}. Paste a URL and we’ll extract metadata automatically (then you can copy the citation).`,
    quickFormat: quickFormat(style, source),
    steps: defaultSteps(source),
  })),
);

export function getCitePage(
  style: CitationStyle,
  source: CiteSource,
): CitePageDefinition | undefined {
  return CITE_PAGES.find((p) => p.style === style && p.source === source);
}
