import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { FAQ } from "@/components/content/FAQ";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { BreadcrumbJsonLd, type BreadcrumbItem } from "@/components/seo/BreadcrumbJsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citegenerator.org";

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", url: siteUrl },
  { name: "FAQ", url: `${siteUrl}/faq` },
];

export const metadata: Metadata = {
  title: "Frequently Asked Questions | CiteGenerator | 2026",
  description:
    "Answers to common questions about CiteGenerator and citation styles. Learn about accuracy, supported formats, privacy, and more.",
  keywords: [
    "citation generator FAQ",
    "how to use citation generator",
    "is this citation generator free",
    "citation accuracy",
    "APA MLA questions",
  ].join(", "),
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Frequently Asked Questions | CiteGenerator | 2026",
    description: "Answers to common questions about CiteGenerator and citation styles.",
    url: "/faq",
  },
};

export default function FaqPage() {
  return (
    <>
      <FAQJsonLd />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <Container className="py-10 sm:py-14">
        <h1 className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h1>
        <p className="mt-3 text-slate-600">
          Quick answers about accuracy, supported styles, privacy, and exporting.
        </p>
        <div className="mt-8">
          <FAQ />
        </div>
      </Container>
    </>
  );
}
