import type { Metadata } from "next";
import { GuideTemplate } from "@/components/content/GuideTemplate";
import { HowToJsonLd } from "@/components/seo/HowToJsonLd";
import { BreadcrumbJsonLd, type BreadcrumbItem } from "@/components/seo/BreadcrumbJsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citegenerator.org";

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", url: siteUrl },
  { name: "How to Cite a Website", url: `${siteUrl}/how-to-cite-website` },
];

export const metadata: Metadata = {
  title: "How to Cite a Website (APA, MLA, Chicago) | 2026 Guide",
  description:
    "Learn how to cite a website in APA, MLA, and Chicago formats with step-by-step instructions, examples, and a free citation generator.",
  keywords: [
    "how to cite a website",
    "website citation",
    "cite a website APA",
    "cite a website MLA",
    "web source citation",
    "online source reference",
  ].join(", "),
  alternates: { canonical: "/how-to-cite-website" },
  openGraph: {
    title: "How to Cite a Website (APA, MLA, Chicago) | 2026 Guide",
    description: "Learn how to cite a website in APA, MLA, and Chicago formats.",
    url: "/how-to-cite-website",
  },
};

const steps = [
  { name: "Find the author", text: "Look for a byline, About page, or organization name." },
  {
    name: "Find the publication date",
    text: "Check under the title or in metadata (use n.d. if missing).",
  },
  { name: "Copy the page title", text: "Use the exact page title (not the site name)." },
  { name: "Identify the website name", text: "Use the overall website or publisher name." },
  { name: "Copy a clean URL", text: "Remove tracking parameters like utm_* for a clean citation." },
];

export default function HowToCiteWebsite() {
  return (
    <>
      <HowToJsonLd name="How to cite a website" steps={steps} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <GuideTemplate
        title="How to Cite a Website"
        updated="January 1, 2026"
        intro="Use this guide to cite websites correctly in APA, MLA, and Chicago styles. Always confirm with your instructor's rules."
        sections={[
          {
            id: "quick-reference",
            heading: "Quick reference",
            body: (
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>
                  <strong>APA:</strong> Author. (Year, Month Day). <em>Title</em>. Site Name. URL
                </li>
                <li>
                  <strong>MLA:</strong> Author. "Title." <em>Site Name</em>, Day Mon. Year, URL.
                  Accessed Day Mon. Year.
                </li>
                <li>
                  <strong>Chicago:</strong> Author. "Title." <em>Site Name</em>. Month Day, Year.
                  Accessed Month Day, Year. URL.
                </li>
              </ul>
            ),
          },
          {
            id: "steps",
            heading: "Step-by-step",
            body: (
              <ol className="list-decimal pl-5 space-y-2 text-slate-700">
                <li>Identify the author or organization.</li>
                <li>Find a publication date (or use n.d.).</li>
                <li>Use the exact page title.</li>
                <li>Use the website name (often the publisher).</li>
                <li>Use a clean URL without tracking parameters.</li>
              </ol>
            ),
          },
        ]}
        showTool
      />
    </>
  );
}
