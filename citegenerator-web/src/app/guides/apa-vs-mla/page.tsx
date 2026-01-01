import type { Metadata } from "next";
import { GuideTemplate } from "@/components/content/GuideTemplate";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { BreadcrumbJsonLd, type BreadcrumbItem } from "@/components/seo/BreadcrumbJsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citegenerator.org";

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", url: siteUrl },
  { name: "Guides", url: `${siteUrl}/guides` },
  { name: "APA vs MLA", url: `${siteUrl}/guides/apa-vs-mla` },
];

export const metadata: Metadata = {
  title: "APA vs MLA Citation Style | What's the Difference? | 2026",
  description:
    "Learn the key differences between APA and MLA citation styles. When to use each, formatting examples, and quick comparison guide.",
  keywords: [
    "APA vs MLA",
    "difference between APA and MLA",
    "when to use APA",
    "when to use MLA",
    "citation style comparison",
    "APA MLA differences",
  ].join(", "),
  alternates: { canonical: "/guides/apa-vs-mla" },
  openGraph: {
    title: "APA vs MLA Citation Style | What's the Difference? | 2026",
    description: "Learn the key differences between APA and MLA citation styles.",
    url: "/guides/apa-vs-mla",
  },
};

const updated = "January 1, 2026";
const datePublished = "2026-01-01";

export default function ApaVsMlaGuide() {
  return (
    <>
      <ArticleJsonLd
        headline="APA vs MLA Citation Style | What's the Difference?"
        description="Learn the key differences between APA and MLA citation styles. When to use each, formatting examples, and quick comparison guide."
        datePublished={datePublished}
        dateModified={updated}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <GuideTemplate
        title="APA vs MLA: What's the Difference?"
        updated={updated}
        intro="APA and MLA are the two most widely used citation styles in academic writing. Understanding the difference between APA and MLA is essential for any student writing research papers. This comprehensive guide breaks down when to use each style, the key formatting differences, side-by-side examples, and tips for converting between formats."
        sections={[
          {
            id: "introduction",
            heading: "Understanding APA vs MLA Citation Styles",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  When writing academic papers, properly citing sources is non-negotiable. The two
                  most common citation styles you will encounter are <strong>APA</strong> (American
                  Psychological Association) and <strong>MLA</strong> (Modern Language Association).
                  While both serve the same fundamental purpose—giving credit to original authors
                  and avoiding plagiarism—they differ significantly in formatting, structure, and
                  application.
                </p>
                <p>
                  The <strong>APA citation style</strong> was developed by the American
                  Psychological Association and is currently in its 7th edition. It emphasizes the
                  publication date, making it ideal for fields where currency of information is
                  critical. APA style is used extensively in sciences and social sciences, where
                  recent research findings often supersede older studies.
                </p>
                <p>
                  The <strong>MLA citation style</strong> comes from the Modern Language Association
                  and is now in its 9th edition. MLA focuses more on the author and the title of the
                  work, which suits humanities disciplines where the interpretation of classic texts
                  and literary analysis takes precedence over publication timing.
                </p>
                <p>
                  Knowing the difference between APA and MLA matters because using the wrong format
                  can result in lower grades or even rejected papers. Professors and instructors
                  typically specify which style to use in their assignment guidelines. When in
                  doubt, always ask rather than assume.
                </p>
              </div>
            ),
          },
          {
            id: "when-to-use",
            heading: "When to Use APA vs MLA",
            body: (
              <div className="space-y-6 text-slate-700">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    When to Use APA Citation Style
                  </h3>
                  <p className="mb-3">
                    APA style is the preferred format for sciences and social sciences. It places a
                    strong emphasis on the publication date because in these fields, recent research
                    is often more relevant than older sources. The APA format helps readers quickly
                    identify how current the information is.
                  </p>
                  <p className="mb-3 font-medium">Common disciplines using APA:</p>
                  <ul className="list-disc pl-5 space-y-2 mb-4">
                    <li>
                      <strong>Psychology</strong> — The birthplace of APA style, used for all
                      psychological research and studies
                    </li>
                    <li>
                      <strong>Education</strong> — Educational research, teaching methodologies, and
                      pedagogy papers
                    </li>
                    <li>
                      <strong>Social Sciences</strong> — Sociology, anthropology, political science,
                      and social work
                    </li>
                    <li>
                      <strong>Business</strong> — Management studies, organizational behavior, and
                      business administration
                    </li>
                    <li>
                      <strong>Nursing & Health Sciences</strong> — Medical research, healthcare
                      studies, and nursing papers
                    </li>
                    <li>
                      <strong>Sciences</strong> — Biology, chemistry, physics, and engineering
                      disciplines
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    When to Use MLA Citation Style
                  </h3>
                  <p className="mb-3">
                    MLA style is designed for humanities and liberal arts. In these fields, the
                    focus is on analyzing existing texts, literature, and cultural works rather than
                    presenting current research findings. Therefore, MLA prioritizes the author and
                    title over the publication date.
                  </p>
                  <p className="mb-3 font-medium">Common disciplines using MLA:</p>
                  <ul className="list-disc pl-5 space-y-2 mb-4">
                    <li>
                      <strong>Literature</strong> — Literary analysis, literary criticism, and
                      comparative literature
                    </li>
                    <li>
                      <strong>Languages & Linguistics</strong> — English, foreign languages,
                      translation studies
                    </li>
                    <li>
                      <strong>Philosophy</strong> — Philosophical inquiry, ethics, and critical
                      theory
                    </li>
                    <li>
                      <strong>Religious Studies</strong> — Theology, comparative religion, and
                      scriptural analysis
                    </li>
                    <li>
                      <strong>Cultural Studies</strong> — Media studies, popular culture, film
                      analysis
                    </li>
                    <li>
                      <strong>Art History</strong> — Art criticism, visual culture, and art theory
                    </li>
                    <li>
                      <strong>Theater & Drama</strong> — Performance studies and dramatic literature
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                  <h4 className="font-semibold text-amber-900 mb-2">
                    How to Know Which Style Your Professor Wants
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-amber-900">
                    <li>Check your assignment sheet or syllabus — it should be specified there</li>
                    <li>
                      Look at the course discipline (science courses typically use APA, humanities
                      use MLA)
                    </li>
                    <li>Ask your professor directly if unsure — never guess</li>
                    <li>Check if your department has a preferred style guide</li>
                  </ul>
                </div>
              </div>
            ),
          },
          {
            id: "key-differences",
            heading: "Key Differences Between APA and MLA",
            body: (
              <div className="space-y-6 text-slate-700">
                <p>
                  The table below provides a comprehensive comparison of APA and MLA citation styles
                  across the most important formatting elements. Understanding these differences is
                  essential for correctly formatting your bibliography or works cited page.
                </p>

                <div className="overflow-x-auto">
                  <table className="min-w-full border border-slate-300 rounded-lg overflow-hidden">
                    <thead className="bg-slate-800 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Element</th>
                        <th className="px-4 py-3 text-left font-semibold">
                          APA Style (7th Edition)
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          MLA Style (9th Edition)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="bg-white">
                        <td className="px-4 py-3 font-medium">Author Name Format</td>
                        <td className="px-4 py-3">Last name, initials (e.g., Smith, J. A.)</td>
                        <td className="px-4 py-3">
                          Last name, full first name (e.g., Smith, John)
                        </td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="px-4 py-3 font-medium">Date Location</td>
                        <td className="px-4 py-3">
                          In parentheses immediately after author (e.g., (2023))
                        </td>
                        <td className="px-4 py-3">Near the end of the citation, no parentheses</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="px-4 py-3 font-medium">Date Format</td>
                        <td className="px-4 py-3">
                          Year only for most sources; full date for websites/magazines (e.g., 2023,
                          January 15)
                        </td>
                        <td className="px-4 py-3">
                          Full date in Day Month Year format (e.g., 15 Jan. 2023)
                        </td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="px-4 py-3 font-medium">Title Capitalization</td>
                        <td className="px-4 py-3">
                          Sentence case — only first word, first word after colon, and proper nouns
                          capitalized
                        </td>
                        <td className="px-4 py-3">
                          Title case — first and last words plus all major words capitalized
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="px-4 py-3 font-medium">Title Formatting</td>
                        <td className="px-4 py-3">
                          Article/website titles in plain text; container works (books, journals,
                          websites) italicized
                        </td>
                        <td className="px-4 py-3">
                          Article titles in quotation marks; container works italicized
                        </td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="px-4 py-3 font-medium">Source Location</td>
                        <td className="px-4 py-3">
                          Publisher name (for books) or DOI/URL (for online sources)
                        </td>
                        <td className="px-4 py-3">
                          Publisher name; for online sources, include URL without "http://"
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="px-4 py-3 font-medium">In-Text Citation</td>
                        <td className="px-4 py-3">
                          (Author, Year) or (Author, Year, p. XX) for direct quotes
                        </td>
                        <td className="px-4 py-3">
                          (Author Page) — author name and page number only, no comma
                        </td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="px-4 py-3 font-medium">Page Numbers</td>
                        <td className="px-4 py-3">
                          Use "p." before single page, "pp." before page ranges
                        </td>
                        <td className="px-4 py-3">
                          No abbreviation — just the number (e.g., 45 or 45-52)
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="px-4 py-3 font-medium">Title of Page</td>
                        <td className="px-4 py-3">"References"</td>
                        <td className="px-4 py-3">"Works Cited"</td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="px-4 py-3 font-medium">Hanging Indent</td>
                        <td className="px-4 py-3">
                          Yes — first line flush left, subsequent lines indented 0.5 inches
                        </td>
                        <td className="px-4 py-3">Yes — same hanging indent format</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Quick Reference</h4>
                  <p className="text-blue-900">
                    The easiest way to remember the main difference:{" "}
                    <strong>APA emphasizes when</strong> the research was published (date), while{" "}
                    <strong>MLA emphasizes who</strong> created it (author) and{" "}
                    <strong>what</strong> it&apos;s called (title). This reflects each field&apos;s
                    priorities—sciences value currency, humanities value the work itself.
                  </p>
                </div>
              </div>
            ),
          },
          {
            id: "side-by-side-examples",
            heading: "Side-by-Side Citation Examples",
            body: (
              <div className="space-y-8 text-slate-700">
                <p>
                  Seeing APA and MLA citations side-by-side is the best way to understand their
                  differences. Below are examples for the most common source types, with annotations
                  explaining the key distinctions.
                </p>

                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">
                    Book Citation Example
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                      <p className="font-semibold text-blue-900 mb-2">APA Format</p>
                      <p className="font-mono text-sm bg-white p-3 rounded">
                        Smith, J. A. (2020).{" "}
                        <em>The psychology of learning: A comprehensive guide</em>. Academic Press.
                      </p>
                      <div className="mt-3 text-sm text-blue-900 space-y-1">
                        <p>
                          <strong>A:</strong> Author uses initials
                        </p>
                        <p>
                          <strong>D:</strong> Date in parentheses after author
                        </p>
                        <p>
                          <strong>T:</strong> Sentence case title (only first word capitalized)
                        </p>
                        <p>
                          <strong>I:</strong> Italicized book title
                        </p>
                        <p>
                          <strong>P:</strong> Publisher name at end
                        </p>
                      </div>
                    </div>
                    <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                      <p className="font-semibold text-green-900 mb-2">MLA Format</p>
                      <p className="font-mono text-sm bg-white p-3 rounded">
                        Smith, John A. <em>The Psychology of Learning: A Comprehensive Guide</em>.
                        Academic Press, 2020.
                      </p>
                      <div className="mt-3 text-sm text-green-900 space-y-1">
                        <p>
                          <strong>A:</strong> Full first name
                        </p>
                        <p>
                          <strong>T:</strong> Title case (major words capitalized)
                        </p>
                        <p>
                          <strong>I:</strong> Italicized book title
                        </p>
                        <p>
                          <strong>D:</strong> Year at end, no parentheses
                        </p>
                        <p>
                          <strong>P:</strong> Publisher before year
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">
                    Journal Article Example
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                      <p className="font-semibold text-blue-900 mb-2">APA Format</p>
                      <p className="font-mono text-sm bg-white p-3 rounded">
                        Johnson, M. R., & Lee, S. K. (2021). Student motivation and academic
                        performance.
                        <em>Journal of Educational Psychology</em>,<em>113</em>(4), 678-692.
                        https://doi.org/10.1037/edu0000156
                      </p>
                      <div className="mt-3 text-sm text-blue-900 space-y-1">
                        <p>
                          <strong>A:</strong> Multiple authors separated by "&"
                        </p>
                        <p>
                          <strong>D:</strong> Full year in parentheses
                        </p>
                        <p>
                          <strong>AT:</strong> Article title in sentence case, plain text
                        </p>
                        <p>
                          <strong>J:</strong> Journal name italicized, title case
                        </p>
                        <p>
                          <strong>V:</strong> Volume italicized, issue in parentheses
                        </p>
                        <p>
                          <strong>DOI:</strong> Full DOI link included
                        </p>
                      </div>
                    </div>
                    <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                      <p className="font-semibold text-green-900 mb-2">MLA Format</p>
                      <p className="font-mono text-sm bg-white p-3 rounded">
                        Johnson, Mary R., and Susan K. Lee. "Student Motivation and Academic
                        Performance."
                        <em>Journal of Educational Psychology</em>, vol. 113, no. 4, 2021, pp.
                        678-92.
                      </p>
                      <div className="mt-3 text-sm text-green-900 space-y-1">
                        <p>
                          <strong>A:</strong> "and" between authors, full names
                        </p>
                        <p>
                          <strong>AT:</strong> Article title in quotes, title case
                        </p>
                        <p>
                          <strong>J:</strong> Journal name italicized
                        </p>
                        <p>
                          <strong>V:</strong> "vol." and "no." specified
                        </p>
                        <p>
                          <strong>P:</strong> "pp." before page range
                        </p>
                        <p>
                          <strong>D:</strong> Year near end, no DOI
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Website Example</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                      <p className="font-semibold text-blue-900 mb-2">APA Format</p>
                      <p className="font-mono text-sm bg-white p-3 rounded">
                        Brown, L. (2023, August 12).{" "}
                        <em>Climate change impacts on coastal cities</em>. Environmental Protection
                        Agency. https://www.epa.gov/climate-change
                      </p>
                      <div className="mt-3 text-sm text-blue-900 space-y-1">
                        <p>
                          <strong>D:</strong> Full date in parentheses
                        </p>
                        <p>
                          <strong>T:</strong> Page title italicized, sentence case
                        </p>
                        <p>
                          <strong>S:</strong> Site name in plain text
                        </p>
                        <p>
                          <strong>U:</strong> Full URL (no "Retrieved from")
                        </p>
                      </div>
                    </div>
                    <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                      <p className="font-semibold text-green-900 mb-2">MLA Format</p>
                      <p className="font-mono text-sm bg-white p-3 rounded">
                        Brown, Linda. "Climate Change Impacts on Coastal Cities."{" "}
                        <em>Environmental Protection Agency</em>, 12 Aug. 2023,
                        www.epa.gov/climate-change.
                      </p>
                      <div className="mt-3 text-sm text-green-900 space-y-1">
                        <p>
                          <strong>T:</strong> Page title in quotes, title case
                        </p>
                        <p>
                          <strong>S:</strong> Site name italicized
                        </p>
                        <p>
                          <strong>D:</strong> Date in day-month-year format
                        </p>
                        <p>
                          <strong>U:</strong> URL without http://
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">
                    In-Text Citation Comparison
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                      <p className="font-semibold text-blue-900 mb-2">APA In-Text Citations</p>
                      <div className="bg-white p-3 rounded space-y-3">
                        <div>
                          <p className="text-sm font-medium mb-1">Parenthetical:</p>
                          <p className="font-mono text-sm">(Smith, 2020, p. 45)</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Narrative:</p>
                          <p className="font-mono text-sm">
                            Smith (2020) argued that "..." (p. 45)
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">No page (online):</p>
                          <p className="font-mono text-sm">(Smith, 2020)</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Two authors:</p>
                          <p className="font-mono text-sm">(Smith & Jones, 2020)</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Three+ authors:</p>
                          <p className="font-mono text-sm">(Smith et al., 2020)</p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-blue-900">
                        Always includes the year. Uses "p." for page numbers.
                      </p>
                    </div>
                    <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                      <p className="font-semibold text-green-900 mb-2">MLA In-Text Citations</p>
                      <div className="bg-white p-3 rounded space-y-3">
                        <div>
                          <p className="text-sm font-medium mb-1">Parenthetical:</p>
                          <p className="font-mono text-sm">(Smith 45)</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Narrative:</p>
                          <p className="font-mono text-sm">Smith argues that "..." (45).</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">No page (online):</p>
                          <p className="font-mono text-sm">(Smith)</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Two authors:</p>
                          <p className="font-mono text-sm">(Smith and Jones 45)</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Three+ authors:</p>
                          <p className="font-mono text-sm">(Smith et al. 45)</p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-green-900">
                        No year, no comma. Author-page format only.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ),
          },
          {
            id: "converting",
            heading: "Converting Between APA and MLA",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  Converting citations from APA to MLA (or vice versa) is a common task, especially
                  when submitting the same research paper to different journals or professors with
                  different preferences. Here are some quick tips to make conversion easier.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                    <h4 className="font-semibold text-blue-900 mb-3">Converting APA to MLA</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <span className="font-bold text-blue-700">1.</span>
                        <span>Expand author initials to full first names</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-blue-700">2.</span>
                        <span>Move date from after author to near the end</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-blue-700">3.</span>
                        <span>Remove parentheses around the date</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-blue-700">4.</span>
                        <span>Change title from sentence case to title case</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-blue-700">5.</span>
                        <span>Add quotation marks around article/chapter titles</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-blue-700">6.</span>
                        <span>Remove "p." and "pp." from page numbers</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-blue-700">7.</span>
                        <span>Remove DOI URLs (MLA 9th edition doesn&apos;t require them)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                    <h4 className="font-semibold text-green-900 mb-3">Converting MLA to APA</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <span className="font-bold text-green-700">1.</span>
                        <span>Shorten first names to initials</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-green-700">2.</span>
                        <span>Move date to immediately after author, in parentheses</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-green-700">3.</span>
                        <span>Change title from title case to sentence case</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-green-700">4.</span>
                        <span>Remove quotation marks from article titles</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-green-700">5.</span>
                        <span>Add "p." or "pp." before page numbers</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-green-700">6.</span>
                        <span>Include DOI if available</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-green-700">7.</span>
                        <span>Change "&" to "&" between authors</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                  <h4 className="font-semibold text-red-900 mb-3">Common Conversion Pitfalls</h4>
                  <ul className="list-disc pl-5 space-y-2 text-red-900">
                    <li>
                      <strong>Forgetting the title capitalization change</strong> — This is one of
                      the most common mistakes. Remember: APA uses sentence case, MLA uses title
                      case.
                    </li>
                    <li>
                      <strong>Misplacing the date</strong> — APA places it right after the author;
                      MLA places it near the end.
                    </li>
                    <li>
                      <strong>Incorrect author names</strong> — MLA uses full names, APA uses
                      initials. Don&apos;t forget to convert properly.
                    </li>
                    <li>
                      <strong>Missing italics</strong> — Both styles use italics, but for different
                      elements. Make sure you&apos;re italicizing the correct part.
                    </li>
                    <li>
                      <strong>In-text citation errors</strong> — APA always includes the year; MLA
                      never does.
                    </li>
                  </ul>
                </div>
              </div>
            ),
          },
          {
            id: "faq",
            heading: "Frequently Asked Questions",
            body: (
              <div className="space-y-6 text-slate-700">
                <div className="border-b border-slate-200 pb-4">
                  <h4 className="font-semibold text-slate-900 mb-2">
                    1. Which is easier: APA or MLA?
                  </h4>
                  <p>
                    Neither is inherently easier — they just have different rules. Many students
                    find MLA slightly simpler because it has fewer rules about formatting dates and
                    DOIs. However, APA&apos;s author-date system can be more intuitive for in-text
                    citations. The "easiest" style is usually the one you use most frequently.
                  </p>
                </div>

                <div className="border-b border-slate-200 pb-4">
                  <h4 className="font-semibold text-slate-900 mb-2">
                    2. Can I use APA and MLA in the same paper?
                  </h4>
                  <p>
                    No, you should never mix citation styles within the same paper. Choose one style
                    and use it consistently throughout. If you have sources from different
                    disciplines, you still need to format all of them according to the style
                    required by your assignment.
                  </p>
                </div>

                <div className="border-b border-slate-200 pb-4">
                  <h4 className="font-semibold text-slate-900 mb-2">
                    3. What if my professor doesn&apos;t specify which style to use?
                  </h4>
                  <p>
                    Ask your professor directly. If they leave it up to you, consider the subject
                    area: use APA for sciences/social sciences and MLA for humanities. You can also
                    look at the types of sources you&apos;re using — if you&apos;re citing many
                    recent journal articles, APA might be better; if analyzing literature, MLA is
                    more appropriate.
                  </p>
                </div>

                <div className="border-b border-slate-200 pb-4">
                  <h4 className="font-semibold text-slate-900 mb-2">
                    4. Do high schools use APA or MLA?
                  </h4>
                  <p>
                    MLA is more commonly taught in high schools, especially in English and language
                    arts classes. This is because high school writing often focuses on literature
                    analysis. However, some high school courses in psychology, sociology, or
                    sciences may introduce APA formatting.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">
                    5. What&apos;s the current edition of APA and MLA?
                  </h4>
                  <p>
                    The current edition of APA is the <strong>7th edition</strong> (released in
                    2019), and the current edition of MLA is the <strong>9th edition</strong>{" "}
                    (released in 2021). Always check which edition your instructor expects. Our
                    citation generator uses the latest editions for both styles.
                  </p>
                </div>
              </div>
            ),
          },
        ]}
        showTool
      />
    </>
  );
}
