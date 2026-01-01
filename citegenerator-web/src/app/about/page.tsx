import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { BreadcrumbJsonLd, type BreadcrumbItem } from "@/components/seo/BreadcrumbJsonLd";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citegenerator.org";

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", url: siteUrl },
  { name: "About", url: `${siteUrl}/about` },
];

export const metadata: Metadata = {
  title: "About CiteGenerator | Free Citation Tool | 2026",
  description:
    "Learn what CiteGenerator is, how it works, and why we built a fast, free citation generator for students.",
  keywords: [
    "about CiteGenerator",
    "free citation generator",
    "student tools",
    "academic citation tool",
  ].join(", "),
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About CiteGenerator | Free Citation Tool | 2026",
    description:
      "Learn what CiteGenerator is, how it works, and why we built a free citation generator.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <OrganizationJsonLd />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <Container className="py-10 sm:py-14">
        <h1 className="text-3xl font-extrabold text-slate-900">About CiteGenerator</h1>
        <p className="mt-4 text-lg text-slate-600 leading-relaxed">
          CiteGenerator is a free, fast citation generator that turns a URL into an academic
          citation. We focus on a clean experience: no account required, minimal data collection,
          and citations you can copy instantly.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">What we support</h2>
            <ul className="mt-3 space-y-2 text-slate-600">
              <li>APA (7th edition)</li>
              <li>MLA (9th edition)</li>
              <li>Chicago (17th edition)</li>
              <li>Harvard</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">How it works</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              When you paste a URL, our backend fetches the page, extracts metadata (title, author,
              date, publisher), and formats it into citations. Always review citations against your
              instructor's requirements.
            </p>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Why CiteGenerator?</h2>
          <p className="mt-3 text-slate-600">
            We built CiteGenerator to provide a straightforward, privacy-focused alternative to
            complicated citation tools. Students deserve free tools that respect their time and
            data.
          </p>
        </section>
      </Container>
    </>
  );
}
