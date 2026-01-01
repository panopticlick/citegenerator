import type { Metadata } from "next";
import { StyleLandingPage } from "@/components/pages/StyleLandingPage";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citegenerator.org";

const breadcrumbItems = [
  { name: "Home", url: siteUrl },
  { name: "Chicago Citation Generator", url: `${siteUrl}/chicago-citation-generator` },
];

export const metadata: Metadata = {
  title: "Free Chicago Citation Generator 2026 | Notes & Bibliography",
  description:
    "Free Chicago citation generator for footnotes and bibliography. Generate Chicago 17th edition citations for websites and articles in seconds. Try now!",
  keywords: [
    "Chicago citation generator",
    "Chicago 17th edition",
    "Chicago style citation",
    "cite in Chicago",
    "Chicago footnotes",
    "Chicago bibliography",
  ].join(", "),
  alternates: { canonical: "/chicago-citation-generator" },
  openGraph: {
    title: "Free Chicago Citation Generator 2026 | Notes & Bibliography",
    description:
      "Free Chicago citation generator for footnotes and bibliography. Generate Chicago 17th edition citations.",
    url: "/chicago-citation-generator",
  },
};

export default function ChicagoLanding() {
  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <StyleLandingPage
        style="chicago"
        title="Free Chicago Citation Generator (2026)"
        subtitle="Chicago 17th edition (Notes & Bibliography) citations for web sources."
        quickFormat={{
          heading: "Quick Chicago format",
          bullets: [
            'Author. "Title of Page." Site Name. Month Day, Year. Accessed Month Day, Year. URL.',
            "If no date: use n.d.",
            "Access date is commonly included for websites.",
          ],
        }}
      />
    </>
  );
}
