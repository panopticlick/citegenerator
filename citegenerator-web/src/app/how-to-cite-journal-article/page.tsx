import type { Metadata } from "next";
import { GuideTemplate } from "@/components/content/GuideTemplate";
import { HowToJsonLd } from "@/components/seo/HowToJsonLd";
import { BreadcrumbJsonLd, type BreadcrumbItem } from "@/components/seo/BreadcrumbJsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citegenerator.org";

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", url: siteUrl },
  { name: "How to Cite a Journal Article", url: `${siteUrl}/how-to-cite-journal-article` },
];

export const metadata: Metadata = {
  title: "How to Cite a Journal Article (APA, MLA, Chicago) | 2026 Guide",
  description:
    "Learn how to cite a journal article in APA, MLA, and Chicago styles. Includes common fields like volume, issue, pages, and DOI.",
  keywords: [
    "how to cite a journal article",
    "journal article citation",
    "cite an article APA",
    "cite an article MLA",
    "DOI citation",
    "academic journal citation",
  ].join(", "),
  alternates: { canonical: "/how-to-cite-journal-article" },
  openGraph: {
    title: "How to Cite a Journal Article (APA, MLA, Chicago) | 2026 Guide",
    description: "Learn how to cite a journal article in APA, MLA, and Chicago styles.",
    url: "/how-to-cite-journal-article",
  },
};

const steps = [
  { name: "Find the author", text: "Use the author list from the article header." },
  { name: "Get the article title", text: "Copy the exact title from the article." },
  { name: "Find the journal name", text: "This is usually at the top or bottom of the page." },
  { name: "Get volume and issue", text: "Find these in the citation or header." },
  { name: "Locate the page numbers", text: "Use the first and last page of the article." },
  { name: "Find the DOI", text: "The DOI is usually near the top or abstract." },
];

export default function HowToCiteJournalArticle() {
  return (
    <>
      <HowToJsonLd name="How to cite a journal article" steps={steps} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <GuideTemplate
        title="How to Cite a Journal Article"
        updated="January 1, 2026"
        intro="Journal articles usually include volume, issue, pages, and a DOI. Use your database export if available, and double-check formatting."
        sections={[
          {
            id: "apa",
            heading: "APA (7th) journal format",
            body: (
              <p className="text-slate-700">
                Author, A. A. (Year). Title of article. <em>Journal Title</em>, <em>Volume</em>
                (Issue), pages. DOI
              </p>
            ),
          },
          {
            id: "mla",
            heading: "MLA (9th) journal format",
            body: (
              <p className="text-slate-700">
                Author Last, First. "Title of Article." <em>Journal Title</em>, vol. X, no. Y, Year,
                pp. Z–Z. DOI.
              </p>
            ),
          },
        ]}
        showTool
      />
    </>
  );
}
