import type { Metadata } from "next";
import { GuideTemplate } from "@/components/content/GuideTemplate";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { BreadcrumbJsonLd, type BreadcrumbItem } from "@/components/seo/BreadcrumbJsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citegenerator.org";

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", url: siteUrl },
  { name: "Guides", url: `${siteUrl}/guides` },
  { name: "MLA vs Chicago", url: `${siteUrl}/guides/mla-vs-chicago` },
];

export const metadata: Metadata = {
  title: "MLA vs Chicago Citation Style | Key Differences | 2026",
  description:
    "Compare MLA and Chicago citation styles. Learn when to use each for humanities papers, formatting differences, and see side-by-side examples.",
  keywords: [
    "MLA vs Chicago",
    "difference between MLA and Chicago",
    "MLA citation style",
    "Chicago citation style",
    "humanities citation styles",
    "MLA Chicago comparison",
  ].join(", "),
  alternates: { canonical: "/guides/mla-vs-chicago" },
  openGraph: {
    title: "MLA vs Chicago Citation Style | Key Differences | 2026",
    description: "Compare MLA and Chicago citation styles with examples.",
    url: "/guides/mla-vs-chicago",
  },
};

const updated = "January 1, 2026";
const datePublished = "2026-01-01";

export default function MlaVsChicagoGuide() {
  return (
    <>
      <ArticleJsonLd
        headline="MLA vs Chicago Citation Style | Key Differences"
        description="Compare MLA and Chicago citation styles. Learn when to use each for humanities papers, formatting differences, and see side-by-side examples."
        datePublished={datePublished}
        dateModified={updated}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <GuideTemplate
        title="MLA vs Chicago: Key Differences"
        updated={updated}
        intro="Both MLA and Chicago are commonly used in humanities disciplines, but they have distinct purposes and formatting rules. This guide explains the key differences and helps you choose the right style for your paper."
        sections={[
          {
            id: "overview",
            heading: "Overview",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  <strong>MLA style</strong> (Modern Language Association, 9th edition) is designed
                  for literature, languages, and cultural studies. It uses parenthetical author-page
                  citations and a "Works Cited" page.
                </p>
                <p>
                  <strong>Chicago style</strong> (Chicago Manual of Style, 17th edition) is used in
                  history, art history, and publishing. Its notes-bibliography system uses footnotes
                  or endnotes with a full bibliography.
                </p>
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 mt-4">
                  <p className="text-amber-900">
                    <strong>Key insight:</strong> MLA is simpler and more streamlined, while Chicago
                    allows for more detailed commentary in footnotes. Choose based on your
                    discipline and assignment requirements.
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
                <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                  <h3 className="font-semibold text-green-900 mb-3">Use MLA For:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>English literature and composition</li>
                    <li>Foreign language studies</li>
                    <li>Comparative literature</li>
                    <li>Cultural and media studies</li>
                    <li>High school English classes</li>
                    <li>Undergraduate humanities courses</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-purple-50 border border-purple-200 p-4">
                  <h3 className="font-semibold text-purple-900 mb-3">Use Chicago For:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>History and historical research</li>
                    <li>Art history and museum studies</li>
                    <li>Philosophy and theology</li>
                    <li>Publishing and journalism</li>
                    <li>Graduate-level humanities</li>
                    <li>When extensive footnotes are needed</li>
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
                      <th className="px-4 py-3 text-left font-semibold">MLA (9th Edition)</th>
                      <th className="px-4 py-3 text-left font-semibold">Chicago (Notes-Bib)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    <tr className="bg-white">
                      <td className="px-4 py-3 font-medium">Citation System</td>
                      <td className="px-4 py-3">Parenthetical (Author Page)</td>
                      <td className="px-4 py-3">Footnotes/endnotes + bibliography</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-4 py-3 font-medium">In-Text Example</td>
                      <td className="px-4 py-3">(Smith 45)</td>
                      <td className="px-4 py-3">Superscript number¹</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3 font-medium">Author Names</td>
                      <td className="px-4 py-3">Last, First (Smith, John)</td>
                      <td className="px-4 py-3">First Last (John Smith) in notes</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-4 py-3 font-medium">Date Position</td>
                      <td className="px-4 py-3">Near end, after publisher</td>
                      <td className="px-4 py-3">In parentheses with publisher</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3 font-medium">Page Title</td>
                      <td className="px-4 py-3">"Works Cited"</td>
                      <td className="px-4 py-3">"Bibliography"</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-4 py-3 font-medium">Article Titles</td>
                      <td className="px-4 py-3">In quotation marks</td>
                      <td className="px-4 py-3">In quotation marks</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3 font-medium">Container Titles</td>
                      <td className="px-4 py-3">Italicized</td>
                      <td className="px-4 py-3">Italicized</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-4 py-3 font-medium">URLs</td>
                      <td className="px-4 py-3">Without http://</td>
                      <td className="px-4 py-3">Full URL</td>
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
                    <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                      <p className="font-semibold text-green-900 mb-2">MLA Works Cited</p>
                      <p className="font-mono text-sm bg-white p-3 rounded">
                        Smith, John. <em>The Art of Fiction</em>. Academic Press, 2023.
                      </p>
                    </div>
                    <div className="rounded-lg bg-purple-50 border border-purple-200 p-4">
                      <p className="font-semibold text-purple-900 mb-2">Chicago Bibliography</p>
                      <p className="font-mono text-sm bg-white p-3 rounded">
                        Smith, John. <em>The Art of Fiction</em>. New York: Academic Press, 2023.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Chicago Footnote vs MLA In-Text
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                      <p className="font-semibold text-green-900 mb-2">MLA In-Text</p>
                      <p className="font-mono text-sm bg-white p-3 rounded">
                        The author argues that "fiction reveals truth" (Smith 45).
                      </p>
                    </div>
                    <div className="rounded-lg bg-purple-50 border border-purple-200 p-4">
                      <p className="font-semibold text-purple-900 mb-2">Chicago Footnote</p>
                      <p className="font-mono text-sm bg-white p-3 rounded">
                        The author argues that "fiction reveals truth."¹
                        <br />
                        <br />
                        <span className="text-xs">
                          1. John Smith, <em>The Art of Fiction</em> (New York: Academic Press,
                          2023), 45.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Journal Article</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                      <p className="font-semibold text-green-900 mb-2">MLA</p>
                      <p className="font-mono text-sm bg-white p-3 rounded">
                        Doe, Jane. "Narrative Techniques in Modern Fiction."{" "}
                        <em>Literary Review</em>, vol. 45, no. 2, 2023, pp. 123-45.
                      </p>
                    </div>
                    <div className="rounded-lg bg-purple-50 border border-purple-200 p-4">
                      <p className="font-semibold text-purple-900 mb-2">Chicago</p>
                      <p className="font-mono text-sm bg-white p-3 rounded">
                        Doe, Jane. "Narrative Techniques in Modern Fiction."{" "}
                        <em>Literary Review</em> 45, no. 2 (2023): 123-145.
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
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>For literature analysis:</strong> MLA is the standard choice.
                  </li>
                  <li>
                    <strong>For historical research:</strong> Chicago is preferred.
                  </li>
                  <li>
                    <strong>For detailed commentary:</strong> Chicago footnotes allow extended
                    discussion.
                  </li>
                  <li>
                    <strong>For simplicity:</strong> MLA&apos;s parenthetical system is less
                    intrusive.
                  </li>
                  <li>
                    <strong>When citing primary sources:</strong> Chicago handles archival materials
                    better.
                  </li>
                  <li>
                    <strong>Always check:</strong> Your professor or publication will specify the
                    required style.
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
