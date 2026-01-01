import type { Metadata } from "next";
import { GuideTemplate } from "@/components/content/GuideTemplate";
import { HowToJsonLd } from "@/components/seo/HowToJsonLd";
import { BreadcrumbJsonLd, type BreadcrumbItem } from "@/components/seo/BreadcrumbJsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citegenerator.org";

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", url: siteUrl },
  { name: "How to Cite a Book", url: `${siteUrl}/how-to-cite-book` },
];

export const metadata: Metadata = {
  title: "How to Cite a Book (APA, MLA, Chicago) | 2026 Guide",
  description:
    "Learn how to cite a book in APA, MLA, and Chicago formats. Includes examples and common edge cases like multiple authors and editions.",
  keywords: [
    "how to cite a book",
    "book citation",
    "cite a book APA",
    "cite a book MLA",
    "cite a book Chicago",
    "book reference format",
  ].join(", "),
  alternates: { canonical: "/how-to-cite-book" },
  openGraph: {
    title: "How to Cite a Book (APA, MLA, Chicago) | 2026 Guide",
    description: "Learn how to cite a book in APA, MLA, and Chicago formats.",
    url: "/how-to-cite-book",
  },
};

const steps = [
  { name: "Find the author(s)", text: "Use the title page for the correct author name order." },
  { name: "Locate the publication year", text: "Check the copyright page for the year." },
  { name: "Copy the title", text: "Use the exact title from the cover or title page." },
  { name: "Find the publisher", text: "The publisher name is on the title page." },
];

export default function HowToCiteBook() {
  return (
    <>
      <HowToJsonLd name="How to cite a book" steps={steps} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <GuideTemplate
        title="How to Cite a Book"
        updated="January 1, 2026"
        intro="Books follow slightly different rules than websites. This quick guide covers the most common patterns."
        sections={[
          {
            id: "apa",
            heading: "APA (7th) book format",
            body: (
              <p className="text-slate-700">
                Author, A. A. (Year). <em>Title of book</em> (Edition). Publisher.
              </p>
            ),
          },
          {
            id: "mla",
            heading: "MLA (9th) book format",
            body: (
              <p className="text-slate-700">
                Author Last, First. <em>Title of Book</em>. Edition, Publisher, Year.
              </p>
            ),
          },
          {
            id: "chicago",
            heading: "Chicago (17th) book format",
            body: (
              <p className="text-slate-700">
                Author Last, First. <em>Title of Book</em>. Place: Publisher, Year.
              </p>
            ),
          },
        ]}
        showTool
      />
    </>
  );
}
