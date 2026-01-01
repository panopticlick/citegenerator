import type { Metadata } from "next";
import { GuideTemplate } from "@/components/content/GuideTemplate";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { BreadcrumbJsonLd, type BreadcrumbItem } from "@/components/seo/BreadcrumbJsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citegenerator.org";

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", url: siteUrl },
  { name: "Guides", url: `${siteUrl}/guides` },
  { name: "APA Format", url: `${siteUrl}/guides/apa-format` },
];

export const metadata: Metadata = {
  title: "APA Format Guide (7th Edition) | 2026",
  description:
    "A practical APA 7th edition guide for citations, reference lists, and common edge cases like missing authors and dates.",
  keywords: [
    "APA format",
    "APA 7th edition",
    "APA citation style",
    "APA reference list",
    "how to cite in APA",
    "APA formatting guide",
  ].join(", "),
  alternates: { canonical: "/guides/apa-format" },
  openGraph: {
    title: "APA Format Guide (7th Edition) | 2026",
    description: "A practical APA 7th edition guide for citations, reference lists.",
    url: "/guides/apa-format",
  },
};

const updated = "January 1, 2026";
const datePublished = "2026-01-01";

export default function ApaGuide() {
  return (
    <>
      <ArticleJsonLd
        headline="APA Format Guide (7th Edition) | 2026"
        description="A practical APA 7th edition guide for citations, reference lists, and common edge cases."
        datePublished={datePublished}
        dateModified={updated}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <GuideTemplate
        title="APA Format (7th Edition) – Practical Guide"
        updated={updated}
        intro="This guide summarizes common APA 7th patterns for online sources. Always check your instructor's requirements."
        sections={[
          {
            id: "reference-list",
            heading: "Reference list basics",
            body: (
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Use a hanging indent in your final bibliography.</li>
                <li>Use sentence case for titles (capitalize the first word and proper nouns).</li>
                <li>Use (n.d.) when no date is available.</li>
              </ul>
            ),
          },
          {
            id: "web",
            heading: "Citing a website (APA)",
            body: (
              <p className="text-slate-700">
                Author, A. A. (Year, Month Day). <em>Title of page</em>. Site Name. URL
              </p>
            ),
          },
        ]}
        showTool
        toolDefaultStyle="apa"
      />
    </>
  );
}
