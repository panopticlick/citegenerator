import type { Metadata } from "next";
import { GuideTemplate } from "@/components/content/GuideTemplate";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { BreadcrumbJsonLd, type BreadcrumbItem } from "@/components/seo/BreadcrumbJsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citegenerator.org";

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", url: siteUrl },
  { name: "Guides", url: `${siteUrl}/guides` },
  { name: "Chicago vs APA", url: `${siteUrl}/guides/chicago-vs-apa` },
];

export const metadata: Metadata = {
  title: "Chicago vs APA Citation Style | Key Differences | 2026",
  description:
    "Compare Chicago and APA citation styles. Learn when to use each, formatting differences, and see side-by-side examples for books, articles, and websites.",
  keywords: [
    "Chicago vs APA",
    "difference between Chicago and APA",
    "Chicago citation style",
    "APA citation style",
    "citation style comparison",
    "Chicago APA differences",
  ].join(", "),
  alternates: { canonical: "/guides/chicago-vs-apa" },
  openGraph: {
    title: "Chicago vs APA Citation Style | Key Differences | 2026",
    description: "Compare Chicago and APA citation styles with examples.",
    url: "/guides/chicago-vs-apa",
  },
};

const updated = "January 1, 2026";
const datePublished = "2026-01-01";

export default function ChicagoVsApaGuide() {
  return (
    <>
      <ArticleJsonLd
        headline="Chicago vs APA Citation Style | Key Differences"
        description="Compare Chicago and APA citation styles. Learn when to use each, formatting differences, and see side-by-side examples."
        datePublished={datePublished}
        dateModified={updated}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <GuideTemplate
        title="Chicago vs APA: Key Differences"
        updated={updated}
        intro="Chicago and APA are both widely used citation styles, but they serve different academic disciplines and have distinct formatting rules. This guide explains when to use each style and highlights their key differences."
        sections={[
          {
            id: "overview",
            heading: "Overview",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  <strong>Chicago style</strong> (Chicago Manual of Style, 17th edition) is
                  primarily used in history, humanities, and some social sciences. It offers two
                  systems: notes-bibliography (common in humanities) and author-date (similar to
                  APA, used in sciences).
                </p>
                <p>
                  <strong>APA style</strong> (American Psychological Association, 7th edition) is
                  the standard for psychology, education, and social sciences. It uses an
                  author-date citation system that emphasizes when research was published.
                </p>
              </div>
            ),
          },
          {
            id: "when-to-use",
            heading: "When to Use Each Style",
            body: (
              <div className="grid md:grid-cols-2 gap-6 text-slate-700">
                <div className="rounded-lg bg-purple-50 border border-purple-200 p-4">
                  <h3 className="font-semibold text-purple-900 mb-3">Use Chicago For:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>History papers and historical research</li>
                    <li>Art history and fine arts</li>
                    <li>Literature and literary criticism</li>
                    <li>Philosophy and theology</li>
                    <li>Publishing and journalism</li>
                    <li>Some business and economics courses</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <h3 className="font-semibold text-blue-900 mb-3">Use APA For:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Psychology and behavioral sciences</li>
                    <li>Education and pedagogy</li>
                    <li>Sociology and social work</li>
                    <li>Nursing and health sciences</li>
                    <li>Business and management</li>
                    <li>Communication studies</li>
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
                      <th className="px-4 py-3 text-left font-semibold">Chicago (Notes-Bib)</th>
                      <th className="px-4 py-3 text-left font-semibold">APA (7th Edition)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    <tr className="bg-white">
                      <td className="px-4 py-3 font-medium">Citation System</td>
                      <td className="px-4 py-3">Footnotes/endnotes + bibliography</td>
                      <td className="px-4 py-3">Parenthetical author-date</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-4 py-3 font-medium">In-Text Format</td>
                      <td className="px-4 py-3">Superscript number¹</td>
                      <td className="px-4 py-3">(Author, Year)</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3 font-medium">Author Names</td>
                      <td className="px-4 py-3">Full names (First Last)</td>
                      <td className="px-4 py-3">Last name, initials (Smith, J. A.)</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-4 py-3 font-medium">Date Position</td>
                      <td className="px-4 py-3">Near the end of citation</td>
                      <td className="px-4 py-3">After author, in parentheses</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3 font-medium">Title Case</td>
                      <td className="px-4 py-3">Headline style (all major words)</td>
                      <td className="px-4 py-3">Sentence case (first word only)</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-4 py-3 font-medium">Bibliography Title</td>
                      <td className="px-4 py-3">"Bibliography"</td>
                      <td className="px-4 py-3">"References"</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3 font-medium">Publisher Location</td>
                      <td className="px-4 py-3">City: Publisher</td>
                      <td className="px-4 py-3">Publisher only (no city)</td>
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
                    <div className="rounded-lg bg-purple-50 border border-purple-200 p-4">
                      <p className="font-semibold text-purple-900 mb-2">Chicago</p>
                      <p className="font-mono text-sm bg-white p-3 rounded">
                        John Smith, <em>The History of Modern Art</em> (New York: Academic Press,
                        2023), 45.
                      </p>
                    </div>
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                      <p className="font-semibold text-blue-900 mb-2">APA</p>
                      <p className="font-mono text-sm bg-white p-3 rounded">
                        Smith, J. (2023). <em>The history of modern art</em>. Academic Press.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Website Citation</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-lg bg-purple-50 border border-purple-200 p-4">
                      <p className="font-semibold text-purple-900 mb-2">Chicago</p>
                      <p className="font-mono text-sm bg-white p-3 rounded">
                        Jane Doe, "Climate Change Effects," Environmental News, March 15, 2023,
                        https://example.com/climate.
                      </p>
                    </div>
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                      <p className="font-semibold text-blue-900 mb-2">APA</p>
                      <p className="font-mono text-sm bg-white p-3 rounded">
                        Doe, J. (2023, March 15). <em>Climate change effects</em>. Environmental
                        News. https://example.com/climate
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ),
          },
          {
            id: "choosing",
            heading: "How to Choose",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>Follow these guidelines when deciding between Chicago and APA:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Check your assignment:</strong> Your professor or journal will specify
                    the required style.
                  </li>
                  <li>
                    <strong>Consider your field:</strong> History and humanities typically use
                    Chicago; social sciences use APA.
                  </li>
                  <li>
                    <strong>Think about your sources:</strong> Chicago works well for archival and
                    historical documents.
                  </li>
                  <li>
                    <strong>Note the citation volume:</strong> If you cite many sources, APA&apos;s
                    parenthetical system is less disruptive.
                  </li>
                </ul>
              </div>
            ),
          },
        ]}
        showTool
      />
    </>
  );
}
