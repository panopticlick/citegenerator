import type { Metadata } from "next";
import { StyleLandingPage } from "@/components/pages/StyleLandingPage";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citegenerator.org";

const breadcrumbItems = [
  { name: "Home", url: siteUrl },
  { name: "APA Citation Generator", url: `${siteUrl}/apa-citation-generator` },
];

export const metadata: Metadata = {
  title: "Free APA Citation Generator 2026 | APA 7th Edition",
  description:
    "Generate perfect APA 7th edition citations in seconds. Free APA citation generator for websites, books, journals, and more — no sign-up required. Try now!",
  keywords: [
    "APA citation generator",
    "APA 7th edition",
    "APA format citation",
    "cite in APA",
    "APA reference generator",
    "APA bibliography",
  ].join(", "),
  alternates: { canonical: "/apa-citation-generator" },
  openGraph: {
    title: "Free APA Citation Generator 2026 | APA 7th Edition",
    description:
      "Generate perfect APA 7th edition citations in seconds. Free APA citation generator for websites, books, journals, and more.",
    url: "/apa-citation-generator",
  },
};

export default function ApaLanding() {
  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <StyleLandingPage
        style="apa"
        title="Free APA Citation Generator (2026)"
        subtitle="Generate APA 7th Edition citations instantly for websites and online sources."
        quickFormat={{
          heading: "Quick APA format",
          bullets: [
            "Author, A. A. (Year, Month Day). Title of page. Site Name. URL",
            "If no author: start with the title.",
            "If no date: use (n.d.).",
          ],
        }}
      />
    </>
  );
}
