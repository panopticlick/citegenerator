import type { Metadata } from "next";
import { GuideTemplate } from "@/components/content/GuideTemplate";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { BreadcrumbJsonLd, type BreadcrumbItem } from "@/components/seo/BreadcrumbJsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citegenerator.org";

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", url: siteUrl },
  { name: "Guides", url: `${siteUrl}/guides` },
  { name: "MLA Format", url: `${siteUrl}/guides/mla-format` },
];

export const metadata: Metadata = {
  title: "MLA Format Guide (9th Edition) | 2026",
  description:
    "A practical MLA 9th edition guide for works cited entries, core elements, and common edge cases.",
  keywords: [
    "MLA format",
    "MLA 9th edition",
    "MLA works cited",
    "MLA citation style",
    "how to cite in MLA",
    "MLA formatting guide",
  ].join(", "),
  alternates: { canonical: "/guides/mla-format" },
  openGraph: {
    title: "MLA Format Guide (9th Edition) | 2026",
    description: "A practical MLA 9th edition guide for works cited entries.",
    url: "/guides/mla-format",
  },
};

const updated = "January 1, 2026";
const datePublished = "2026-01-01";

export default function MlaGuide() {
  return (
    <>
      <ArticleJsonLd
        headline="MLA Format Guide (9th Edition) | 2026"
        description="A practical MLA 9th edition guide for works cited entries, core elements, and common edge cases."
        datePublished={datePublished}
        dateModified={updated}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <GuideTemplate
        title="MLA Format (9th Edition) – Practical Guide"
        updated={updated}
        intro="MLA works cited entries use core elements. This guide covers the most common website patterns."
        sections={[
          {
            id: "core-elements",
            heading: "Core elements",
            body: (
              <p className="text-slate-700">
                MLA typically follows: Author. Title of source. Title of container, other
                contributors, version, number, publisher, publication date, location.
              </p>
            ),
          },
          {
            id: "web",
            heading: "Citing a website (MLA)",
            body: (
              <p className="text-slate-700">
                Author. "Title of Page." <em>Site Name</em>, Day Mon. Year, URL. Accessed Day Mon.
                Year.
              </p>
            ),
          },
        ]}
        showTool
        toolDefaultStyle="mla"
      />
    </>
  );
}
