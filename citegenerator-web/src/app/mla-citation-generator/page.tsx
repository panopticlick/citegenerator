import type { Metadata } from "next";
import { StyleLandingPage } from "@/components/pages/StyleLandingPage";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citegenerator.org";

const breadcrumbItems = [
  { name: "Home", url: siteUrl },
  { name: "MLA Citation Generator", url: `${siteUrl}/mla-citation-generator` },
];

export const metadata: Metadata = {
  title: "Free MLA Citation Generator 2026 | MLA 9th Edition",
  description:
    "Create accurate MLA 9 citations instantly. Free MLA citation generator and works cited builder for websites, books, articles, and videos. Try now!",
  keywords: [
    "MLA citation generator",
    "MLA 9th edition",
    "MLA format citation",
    "cite in MLA",
    "MLA works cited",
    "MLA bibliography generator",
  ].join(", "),
  alternates: { canonical: "/mla-citation-generator" },
  openGraph: {
    title: "Free MLA Citation Generator 2026 | MLA 9th Edition",
    description:
      "Create accurate MLA 9 citations instantly. Free MLA citation generator and works cited builder.",
    url: "/mla-citation-generator",
  },
};

export default function MlaLanding() {
  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <StyleLandingPage
        style="mla"
        title="Free MLA Citation Generator (2026)"
        subtitle="Create MLA 9 citations and works cited entries in seconds."
        quickFormat={{
          heading: "Quick MLA format",
          bullets: [
            'Author. "Title of page." Site Name, Day Mon. Year, URL. Accessed Day Mon. Year.',
            "If no author: start with the title.",
            "If no date: omit the date and include access date.",
          ],
        }}
      />
    </>
  );
}
