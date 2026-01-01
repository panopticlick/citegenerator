import type { Metadata } from "next";
import { StyleLandingPage } from "@/components/pages/StyleLandingPage";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citegenerator.org";

const breadcrumbItems = [
  { name: "Home", url: siteUrl },
  { name: "Harvard Citation Generator", url: `${siteUrl}/harvard-citation-generator` },
];

export const metadata: Metadata = {
  title: "Free Harvard Citation Generator 2026 | UK Referencing",
  description:
    "Free Harvard citation generator for website references. Create Harvard citations instantly — includes access dates and clean URLs. Try now!",
  keywords: [
    "Harvard citation generator",
    "Harvard referencing",
    "Harvard style citation",
    "cite in Harvard",
    "UK referencing",
    "Harvard bibliography",
  ].join(", "),
  alternates: { canonical: "/harvard-citation-generator" },
  openGraph: {
    title: "Free Harvard Citation Generator 2026 | UK Referencing",
    description:
      "Free Harvard citation generator for website references. Create Harvard citations instantly.",
    url: "/harvard-citation-generator",
  },
};

export default function HarvardLanding() {
  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <StyleLandingPage
        style="harvard"
        title="Free Harvard Citation Generator (2026)"
        subtitle="Harvard referencing style (common UK format) for online sources."
        quickFormat={{
          heading: "Quick Harvard format",
          bullets: [
            "Author (Year) Title. Available at: URL (Accessed: Day Month Year).",
            "If no author: start with the title.",
            "If no date: use n.d. for the year.",
          ],
        }}
      />
    </>
  );
}
