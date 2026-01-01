import type { Metadata } from "next";
import { GuideTemplate } from "@/components/content/GuideTemplate";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { BreadcrumbJsonLd, type BreadcrumbItem } from "@/components/seo/BreadcrumbJsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citegenerator.org";

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", url: siteUrl },
  { name: "Guides", url: `${siteUrl}/guides` },
  { name: "Harvard vs APA", url: `${siteUrl}/guides/harvard-vs-apa` },
];

export const metadata: Metadata = {
  title: "Harvard vs APA Citation Style | Key Differences | 2026",
  description:
    "Compare Harvard and APA referencing styles. Learn the differences in formatting, when to use each, and see side-by-side citation examples.",
  keywords: [
    "Harvard vs APA",
    "difference between Harvard and APA",
    "Harvard referencing",
    "APA citation style",
    "Harvard APA comparison",
    "UK vs US citation styles",
  ].join(", "),
  alternates: { canonical: "/guides/harvard-vs-apa" },
  openGraph: {
    title: "Harvard vs APA Citation Style | Key Differences | 2026",
    description: "Compare Harvard and APA referencing styles with examples.",
    url: "/guides/harvard-vs-apa",
  },
};

const updated = "January 1, 2026";
const datePublished = "2026-01-01";

export default function HarvardVsApaGuide() {
  return (
    <>
      <ArticleJsonLd
        headline="Harvard vs APA Citation Style | Key Differences"
        description="Compare Harvard and APA referencing styles. Learn the differences in formatting, when to use each, and see side-by-side citation examples."
        datePublished={datePublished}
        dateModified={updated}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <GuideTemplate
        title="Harvard vs APA: Key Differences"
        updated={updated}
        intro="Harvard and APA are both author-date citation systems that look similar at first glance. However, they have important differences in formatting and usage. This guide helps you understand when to use each and how they differ."
        sections={[
          {
            id: "overview",
            heading: "Overview",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  <strong>Harvard referencing</strong> is widely used in UK, Australian, and other
                  Commonwealth universities. Unlike APA, Harvard is not governed by a single
                  organization—different institutions may have slightly different Harvard
                  guidelines.
                </p>
                <p>
                  <strong>APA style</strong> (American Psychological Association, 7th edition) is
                  standardized globally and commonly used in US institutions. It has strict,
                  detailed rules published in the official APA manual.
                </p>
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 mt-4">
                  <p className="text-amber-900">
                    <strong>Key insight:</strong> Harvard and APA are often confused because both
                    use author-date in-text citations. The main differences are in punctuation,
                    capitalization, and specific formatting details.
                  </p>
                </div>
              </div>
            ),
          },
          {
            id: "when-to-use",
            heading: "When to Use Each Style",
            body: (
              <div className="grid md:grid-cols-2 gap-6 text-slate-700">
                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                  <h3 className="font-semibold text-red-900 mb-3">Use Harvard For:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>UK universities (most common)</li>
                    <li>Australian universities</li>
                    <li>Some European institutions</li>
                    <li>Business and management (UK)</li>
                    <li>Law (some UK institutions)</li>
                    <li>When your university specifies "Harvard"</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <h3 className="font-semibold text-blue-900 mb-3">Use APA For:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>US universities (most common)</li>
                    <li>Psychology and behavioral sciences</li>
                    <li>Education and nursing</li>
                    <li>Social sciences globally</li>
                    <li>Academic journals requiring APA</li>
                    <li>When strict standardization is needed</li>
                  </ul>
                </div>
              </div>
            ),
          },
          {
            id: "key-differences",
            heading: "Key Differences",
            body: (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-slate-300 rounded-lg overflow-hidden">
                  <thead className="bg-slate-800 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Element</th>
                      <th className="px-4 py-3 text-left font-semibold">Harvard</th>
                      <th className="px-4 py-3 text-left font-semibold">APA (7th Edition)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    <tr className="bg-white">
                      <td className="px-4 py-3 font-medium">Standardization</td>
                      <td className="px-4 py-3">Varies by institution</td>
                      <td className="px-4 py-3">Single official manual</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-4 py-3 font-medium">In-Text Format</td>
                      <td className="px-4 py-3">(Author Year) or (Author, Year)</td>
                      <td className="px-4 py-3">(Author, Year) — comma required</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3 font-medium">Author Names</td>
                      <td className="px-4 py-3">Full surname, initials (Smith, J.)</td>
                      <td className="px-4 py-3">Surname, initials (Smith, J. A.)</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-4 py-3 font-medium">Date Format</td>
                      <td className="px-4 py-3">Year only, or day month year</td>
                      <td className="px-4 py-3">(Year, Month Day) for online</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3 font-medium">Title Style</td>
                      <td className="px-4 py-3">Sentence case (varies)</td>
                      <td className="px-4 py-3">Sentence case (strict)</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-4 py-3 font-medium">URL Prefix</td>
                      <td className="px-4 py-3">Available at: URL</td>
                      <td className="px-4 py-3">URL only (no prefix)</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3 font-medium">DOI Format</td>
                      <td className="px-4 py-3">doi: or DOI:</td>
                      <td className="px-4 py-3">https://doi.org/...</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-4 py-3 font-medium">Reference List Title</td>
                      <td className="px-4 py-3">"Reference List" or "References"</td>
                      <td className="px-4 py-3">"References"</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ),
          },
          {
            id: "examples",
            heading: "Side-by-Side Examples",
            body: (
              <div className="space-y-6 text-slate-700">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Book Citation</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                      <p className="font-semibold text-red-900 mb-2">Harvard</p>
                      <p className="font-mono text-sm bg-white p-3 rounded">
                        Smith, J. (2023) <em>Research methods in psychology</em>. London: Academic
                        Press.
                      </p>
                    </div>
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                      <p className="font-semibold text-blue-900 mb-2">APA</p>
                      <p className="font-mono text-sm bg-white p-3 rounded">
                        Smith, J. (2023). <em>Research methods in psychology</em>. Academic Press.
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    Note: APA 7th edition no longer requires publisher location. Harvard often still
                    includes it.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Website Citation</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                      <p className="font-semibold text-red-900 mb-2">Harvard</p>
                      <p className="font-mono text-sm bg-white p-3 rounded">
                        World Health Organization (2023) <em>Mental health fact sheet</em>.
                        Available at: https://www.who.int/mental-health (Accessed: 15 March 2023).
                      </p>
                    </div>
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                      <p className="font-semibold text-blue-900 mb-2">APA</p>
                      <p className="font-mono text-sm bg-white p-3 rounded">
                        World Health Organization. (2023). <em>Mental health fact sheet</em>.
                        https://www.who.int/mental-health
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    Note: Harvard includes "Available at:" and access date. APA uses just the URL
                    and typically omits access dates.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">In-Text Citations</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                      <p className="font-semibold text-red-900 mb-2">Harvard</p>
                      <div className="bg-white p-3 rounded space-y-2 font-mono text-sm">
                        <p>(Smith 2023)</p>
                        <p>(Smith 2023, p. 45)</p>
                        <p>Smith (2023) argues...</p>
                      </div>
                    </div>
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                      <p className="font-semibold text-blue-900 mb-2">APA</p>
                      <div className="bg-white p-3 rounded space-y-2 font-mono text-sm">
                        <p>(Smith, 2023)</p>
                        <p>(Smith, 2023, p. 45)</p>
                        <p>Smith (2023) argues...</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    Note: APA always uses a comma between author and year. Harvard styles vary—some
                    use a comma, some don&apos;t.
                  </p>
                </div>
              </div>
            ),
          },
          {
            id: "tips",
            heading: "Practical Tips",
            body: (
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>
                  <strong>Check your university&apos;s Harvard guide:</strong> Since Harvard varies,
                  always use your institution&apos;s specific guidelines.
                </li>
                <li>
                  <strong>Don&apos;t mix styles:</strong> Pick one and use it consistently
                  throughout your paper.
                </li>
                <li>
                  <strong>When in doubt, ask:</strong> If your professor says "Harvard or APA," ask
                  which they prefer.
                </li>
                <li>
                  <strong>Use our generator:</strong> It handles the formatting differences
                  automatically.
                </li>
              </ul>
            ),
          },
        ]}
        showTool
      />
    </>
  );
}
