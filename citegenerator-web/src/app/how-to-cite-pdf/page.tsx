import type { Metadata } from "next";
import { GuideTemplate } from "@/components/content/GuideTemplate";
import { HowToJsonLd } from "@/components/seo/HowToJsonLd";
import { BreadcrumbJsonLd, type BreadcrumbItem } from "@/components/seo/BreadcrumbJsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citegenerator.org";

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", url: siteUrl },
  { name: "How to Cite a PDF", url: `${siteUrl}/how-to-cite-pdf` },
];

export const metadata: Metadata = {
  title: "How to Cite a PDF (APA, MLA, Chicago) | 2026 Guide",
  description:
    "Learn how to cite a PDF in APA, MLA, and Chicago formats. Covers reports, handouts, and PDFs hosted on websites.",
  keywords: [
    "how to cite a PDF",
    "PDF citation",
    "cite a PDF file",
    "PDF reference format",
    "electronic document citation",
    "PDF source",
  ].join(", "),
  alternates: { canonical: "/how-to-cite-pdf" },
  openGraph: {
    title: "How to Cite a PDF (APA, MLA, Chicago) | 2026 Guide",
    description: "Learn how to cite a PDF in APA, MLA, and Chicago formats.",
    url: "/how-to-cite-pdf",
  },
};

const steps = [
  { name: "Identify the source type", text: "Determine if the PDF is a report, article, or book." },
  { name: "Find the author", text: "Use the author or organization name." },
  { name: "Get the title", text: "Use the title from the first page." },
  { name: "Find the publication date", text: "Check the document header or footer." },
  { name: "Copy the URL", text: "Use the direct link to the PDF." },
];

export default function HowToCitePdf() {
  return (
    <>
      <HowToJsonLd name="How to cite a PDF" steps={steps} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <GuideTemplate
        title="How to Cite a PDF"
        updated="January 1, 2026"
        intro="A PDF is usually cited like the source type it represents (report, article, book chapter). Use the PDF URL if that's how you accessed it."
        sections={[
          {
            id: "general",
            heading: "General approach",
            body: (
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Identify what the PDF is (report, journal article, etc.).</li>
                <li>Use the author/organization and publication date.</li>
                <li>Include the title and the URL where you accessed it.</li>
              </ul>
            ),
          },
          {
            id: "apa",
            heading: "APA (7th) PDF format (common report)",
            body: (
              <p className="text-slate-700">
                Organization Name. (Year). <em>Title of report</em> (Report No. X). Publisher. URL
              </p>
            ),
          },
        ]}
        showTool
      />
    </>
  );
}
