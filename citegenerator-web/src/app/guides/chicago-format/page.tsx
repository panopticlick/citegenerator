import type { Metadata } from "next";
import { GuideTemplate } from "@/components/content/GuideTemplate";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { BreadcrumbJsonLd, type BreadcrumbItem } from "@/components/seo/BreadcrumbJsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citegenerator.org";

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", url: siteUrl },
  { name: "Guides", url: `${siteUrl}/guides` },
  { name: "Chicago Format", url: `${siteUrl}/guides/chicago-format` },
];

export const metadata: Metadata = {
  title: "Chicago Style Guide | Chicago 17th Edition Citation Format | 2026",
  description:
    "Complete guide to Chicago 17th edition citation format. Notes and bibliography style, footnotes, and bibliography examples for common sources.",
  keywords: [
    "Chicago style",
    "Chicago 17th edition",
    "Chicago citation format",
    "Chicago footnotes",
    "Chicago bibliography",
    "how to cite in Chicago",
  ].join(", "),
  alternates: { canonical: "/guides/chicago-format" },
  openGraph: {
    title: "Chicago Style Guide | Chicago 17th Edition Citation Format | 2026",
    description: "Complete guide to Chicago 17th edition citation format.",
    url: "/guides/chicago-format",
  },
};

const updated = "January 1, 2026";
const datePublished = "2026-01-01";

export default function ChicagoFormatGuide() {
  return (
    <>
      <ArticleJsonLd
        headline="Chicago Style Guide | Chicago 17th Edition Citation Format"
        description="Complete guide to Chicago 17th edition citation format. Notes and bibliography style, footnotes, and bibliography examples for common sources."
        datePublished={datePublished}
        dateModified={updated}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <GuideTemplate
        title="Chicago Style Guide (17th Edition)"
        updated={updated}
        intro="Master Chicago style citation format with our comprehensive guide. Learn Chicago Manual of Style rules for footnotes, bibliography, author-date citations, and proper formatting for academic papers."
        sections={[
          {
            id: "what-is-chicago-style",
            heading: "What is Chicago Style?",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  The <strong>Chicago Manual of Style (CMOS)</strong> is one of the most widely used
                  and respected citation styles in academic publishing. First published in 1906 by
                  the University of Chicago Press, it has become the standard guide for authors,
                  editors, and publishers in the United States and beyond. The current 17th edition,
                  released in 2017, continues to be the authoritative resource for Chicago style
                  citation format.
                </p>
                <p>
                  Chicago style is favored by many disciplines because of its flexibility and
                  comprehensiveness. Unlike more rigid citation formats, Chicago style offers two
                  distinct documentation systems that cater to different academic needs. This makes
                  it particularly valuable for researchers working with diverse source materials,
                  from historical primary documents to contemporary scientific studies.
                </p>
                <p>
                  The primary users of Chicago style include scholars in <strong>history</strong>,{" "}
                  <strong>literature</strong>, <strong>philosophy</strong>, and the{" "}
                  <strong>humanities</strong>, though it also appears in some social sciences and
                  physical sciences. Many university presses, academic journals, and trade
                  publishers require Chicago format for manuscript submissions. Book publishers
                  frequently use Chicago style as their house style, making it essential knowledge
                  for aspiring authors and editors.
                </p>
                <p>
                  What sets Chicago style apart is its emphasis on source documentation through
                  <strong> footnotes</strong> or <strong>endnotes</strong>, allowing for extensive
                  commentary without interrupting the flow of the main text. This approach is
                  particularly valuable in historical writing, where authors often need to provide
                  context, acknowledge sources, and engage with secondary literature—all while
                  maintaining readability for their audience.
                </p>
              </div>
            ),
          },
          {
            id: "two-systems",
            heading: "The Two Chicago Citation Systems",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  The Chicago Manual of Style offers two distinct citation systems, each designed
                  for different academic purposes and disciplines. Understanding which system to use
                  is the first step in mastering Chicago style citation format.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">
                  Notes and Bibliography (NB) System
                </h3>
                <p>
                  The <strong>Notes and Bibliography system</strong> is the more traditional of the
                  two and is preferred in the humanities—especially history, literature, and the
                  arts. This system uses superscript numbers in the text that correspond to{" "}
                  <strong>footnotes</strong> (at the bottom of the page) or{" "}
                  <strong>endnotes</strong> (at the end of the paper or chapter). These notes
                  provide complete citation information the first time a source is referenced.
                </p>
                <p>
                  A <strong>bibliography</strong> at the end of the document lists all sources
                  alphabetically, providing full publication details. The bibliography entry format
                  differs slightly from the footnote format, so it&apos;s important to follow the
                  specific rules for each. The Notes and Bibliography system allows authors to
                  include substantive commentary in their notes, making it ideal for disciplines
                  where engagement with sources and interpretation are central.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">
                  Author-Date (AD) System
                </h3>
                <p>
                  The <strong>Author-Date system</strong> is commonly used in the physical, natural,
                  and social sciences, including disciplines like economics, political science, and
                  sociology. Instead of footnotes or endnotes, this system uses brief parenthetical
                  citations within the text itself, typically including the author&apos;s last name,
                  publication year, and page number.
                </p>
                <p>
                  A <strong>reference list</strong> at the end of the paper provides complete
                  publication information for all sources cited. This system is more concise and
                  better suited to sciences where the focus is on recent research and where
                  extensive commentary in notes is less common. The Author-Date format shares
                  similarities with APA style but maintains Chicago&apos;s distinctive approach to
                  source documentation.
                </p>
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 mt-4">
                  <p className="font-semibold text-amber-900 mb-2">Which system should you use?</p>
                  <p className="text-amber-800">
                    Always check with your instructor or publisher to determine which Chicago
                    citation system is required. When in doubt, the Notes and Bibliography system is
                    the default choice for most humanities disciplines, while the Author-Date system
                    is standard in the sciences.
                  </p>
                </div>
              </div>
            ),
          },
          {
            id: "notes-bibliography-format",
            heading: "Notes and Bibliography Format",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  The Notes and Bibliography system is the most distinctive feature of Chicago style
                  citation format. Mastering the differences between footnote and bibliography
                  entries is essential for proper documentation.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Book Citations</h3>
                <p>
                  Books are among the most commonly cited sources in academic writing. Chicago style
                  has specific formatting rules for book citations in both footnotes and the
                  bibliography.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 mt-4">
                  <p className="font-semibold mb-2">First Footnote Citation - Single Author:</p>
                  <p className="font-mono text-sm">
                    1. John Smith, <em>The Art of Historical Writing</em> (Chicago: University of
                    Chicago Press, 2020), 45.
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 mt-4">
                  <p className="font-semibold mb-2">Bibliography Entry - Single Author:</p>
                  <p className="font-mono text-sm">
                    Smith, John. <em>The Art of Historical Writing</em>. Chicago: University of
                    Chicago Press, 2020.
                  </p>
                </div>
                <p className="mt-4">
                  Note the key differences: in the bibliography, the author&apos;s last name comes
                  first, and periods replace most parentheses. The publication city appears before
                  the publisher, separated by a colon.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 mt-4">
                  <p className="font-semibold mb-2">Footnote - Multiple Authors:</p>
                  <p className="font-mono text-sm">
                    2. Mary Johnson and Robert Williams, <em>Modern Philosophy</em> (New York:
                    Academic Press, 2019), 123-24.
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 mt-4">
                  <p className="font-semibold mb-2">Bibliography - Multiple Authors:</p>
                  <p className="font-mono text-sm">
                    Johnson, Mary, and Robert Williams. <em>Modern Philosophy</em>. New York:
                    Academic Press, 2019.
                  </p>
                </div>
                <p className="mt-4">
                  For books with three or more authors, use &quot;et al.&quot; in footnotes but list
                  all authors in the bibliography.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">
                  Journal Article Citations
                </h3>
                <p>
                  Scholarly journal articles require specific information including volume, issue,
                  and page numbers. Chicago format follows a consistent pattern for journal
                  citations.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 mt-4">
                  <p className="font-semibold mb-2">Footnote - Journal Article:</p>
                  <p className="font-mono text-sm">
                    3. Sarah Martinez, &quot;The Evolution of Urban Planning,&quot;{" "}
                    <em>Journal of American Studies</em> 52, no. 3 (2018): 289.
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 mt-4">
                  <p className="font-semibold mb-2">Bibliography - Journal Article:</p>
                  <p className="font-mono text-sm">
                    Martinez, Sarah. &quot;The Evolution of Urban Planning.&quot;{" "}
                    <em>Journal of American Studies</em> 52, no. 3 (2018): 275-92.
                  </p>
                </div>
                <p className="mt-4">
                  Note that the bibliography includes the full page range of the article, while the
                  footnote typically cites only the specific page referenced. The volume number is
                  not followed by &quot;vol.&quot; and the issue number appears after
                  &quot;no.&quot;
                </p>
                <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">
                  Website and Online Source Citations
                </h3>
                <p>
                  Citing online sources requires including the URL and, when available, access
                  dates. Chicago style citation format for web sources emphasizes clarity and
                  permanence.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 mt-4">
                  <p className="font-semibold mb-2">Footnote - Website:</p>
                  <p className="font-mono text-sm">
                    4. Emily Chen, &quot;Understanding Climate Change Data,&quot;{" "}
                    <em>Environmental Research Today</em>, last modified June 15, 2022,
                    https://www.environmentalresearch.org/climate-data.
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 mt-4">
                  <p className="font-semibold mb-2">Bibliography - Website:</p>
                  <p className="font-mono text-sm">
                    Chen, Emily. &quot;Understanding Climate Change Data.&quot;{" "}
                    <em>Environmental Research Today</em>. Modified June 15, 2022.
                    https://www.environmentalresearch.org/climate-data.
                  </p>
                </div>
                <p className="mt-4">
                  For online sources that may change, include an access date: &quot;accessed August
                  1, 2023.&quot; Use &quot;last modified&quot; when a date is provided, or
                  &quot;published&quot; for formal publications.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">
                  Footnote Formatting Rules
                </h3>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>
                    Use superscript numbers in the text, placed after punctuation (except dashes)
                  </li>
                  <li>Footnote numbers should begin at 1 and continue consecutively</li>
                  <li>
                    Indent the first line of each footnote (use a hanging indent in word processors)
                  </li>
                  <li>Use the author&apos;s full name in the order First Last</li>
                  <li>
                    Titles of books and journals are italicized; titles of articles and chapters are
                    in quotation marks
                  </li>
                  <li>Publication information appears in parentheses: (City: Publisher, Year)</li>
                  <li>Specific page numbers follow the publication information</li>
                </ul>
                <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">
                  Bibliography Formatting Rules
                </h3>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Start each entry with the author&apos;s last name: Last, First</li>
                  <li>
                    Alphabetize entries by the authors&apos; last names (or by title if no author)
                  </li>
                  <li>Use a hanging indent (second and subsequent lines indented)</li>
                  <li>Separate elements with periods instead of parentheses where appropriate</li>
                  <li>Include the full page range for articles and chapters</li>
                  <li>Single-space within entries, double-space between entries</li>
                  <li>
                    For multiple works by the same author, use a 3-em dash (&#8213;) instead of the
                    author&apos;s name after the first entry
                  </li>
                </ul>
                <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">
                  Subsequent Footnote Citations
                </h3>
                <p>
                  After citing a source fully in the first footnote, use shortened citations for
                  subsequent references.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 mt-4">
                  <p className="font-semibold mb-2">Shortened Footnote:</p>
                  <p className="font-mono text-sm">
                    5. Smith, <em>Historical Writing</em>, 67.
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 mt-4">
                  <p className="font-semibold mb-2">Consecutive Citation (Ibid.):</p>
                  <p className="font-mono text-sm">6. Ibid., 89.</p>
                </div>
                <p className="mt-4">
                  <strong>Ibid.</strong> (short for the Latin ibidem, meaning &quot;in the same
                  place&quot;) is used for immediately consecutive citations. If you cite the same
                  source again later (but not immediately after), use the shortened form.
                </p>
              </div>
            ),
          },
          {
            id: "author-date-format",
            heading: "Author-Date Format",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  The Author-Date system is favored in sciences and social sciences for its concise
                  in-text citations. Instead of footnotes, sources are cited parenthetically within
                  the text itself.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">
                  In-Text Citation Format
                </h3>
                <p>
                  Basic in-text citations include the author&apos;s last name, publication year, and
                  page number when specific information is referenced.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 mt-4">
                  <p className="font-semibold mb-2">Parenthetical Citation:</p>
                  <p className="font-mono text-sm">(Smith 2020, 45)</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 mt-4">
                  <p className="font-semibold mb-2">Narrative Citation:</p>
                  <p className="font-mono text-sm">Smith (2020, 45) argues that...</p>
                </div>
                <p className="mt-4">
                  For two authors: (Smith and Jones 2019, 23). For three or more authors: (Smith et
                  al. 2018, 67).
                </p>
                <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">
                  Reference List Entry - Books
                </h3>
                <div className="rounded-lg bg-slate-50 p-4 mt-4">
                  <p className="font-semibold mb-2">Book - Single Author:</p>
                  <p className="font-mono text-sm">
                    Smith, John. 2020. <em>The Art of Historical Writing</em>. Chicago: University
                    of Chicago Press.
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 mt-4">
                  <p className="font-semibold mb-2">Book - Multiple Authors:</p>
                  <p className="font-mono text-sm">
                    Johnson, Mary, and Robert Williams. 2019. <em>Modern Philosophy</em>. New York:
                    Academic Press.
                  </p>
                </div>
                <p className="mt-4">
                  Note that the year follows the author&apos;s name immediately, unlike the Notes
                  and Bibliography format where it appears later in the entry.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">
                  Reference List Entry - Journal Articles
                </h3>
                <div className="rounded-lg bg-slate-50 p-4 mt-4">
                  <p className="font-semibold mb-2">Journal Article:</p>
                  <p className="font-mono text-sm">
                    Martinez, Sarah. 2018. &quot;The Evolution of Urban Planning.&quot;{" "}
                    <em>Journal of American Studies</em> 52 (3): 275-92.
                  </p>
                </div>
                <p className="mt-4">
                  The year appears after the author&apos;s name, and the volume number is not
                  preceded by &quot;vol.&quot; The issue number immediately follows the volume in
                  parentheses, followed by a colon and the page range.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">
                  Reference List Formatting Rules
                </h3>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Alphabetize by authors&apos; last names</li>
                  <li>Include the publication year after the author&apos;s name</li>
                  <li>Use a hanging indent for each entry</li>
                  <li>Italicize book and journal titles</li>
                  <li>Use quotation marks for article and chapter titles</li>
                  <li>Capitalize titles using headline style (major words capitalized)</li>
                  <li>List multiple works by the same author chronologically, earliest first</li>
                </ul>
              </div>
            ),
          },
          {
            id: "chicago-style-headings",
            heading: "Chicago Style Headings",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  Chicago Manual of Style provides guidelines for five levels of headings to create
                  clear hierarchies in academic and professional documents. Proper heading structure
                  helps readers navigate complex texts and understand relationships between ideas.
                </p>
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full border border-slate-300 rounded-lg overflow-hidden">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900 border-b">
                          Level
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900 border-b">
                          Format
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900 border-b">
                          Example
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="px-4 py-3 text-sm">Level 1</td>
                        <td className="px-4 py-3 text-sm">
                          Centered, bold, headline-style capitalization
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-center">Chapter Title</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm">Level 2</td>
                        <td className="px-4 py-3 text-sm">
                          Centered, bold, headline-style capitalization
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-center">
                          Main Section Head
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm">Level 3</td>
                        <td className="px-4 py-3 text-sm">
                          Left-aligned, bold, headline-style capitalization
                        </td>
                        <td className="px-4 py-3 text-sm font-bold">Subsection Head</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm">Level 4</td>
                        <td className="px-4 py-3 text-sm">
                          Left-aligned, bold, italic, sentence-style capitalization
                        </td>
                        <td className="px-4 py-3 text-sm font-bold italic">Sub-subsection head</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm">Level 5</td>
                        <td className="px-4 py-3 text-sm">
                          Run-in at beginning of paragraph, bold, italic, sentence-style, ends with
                          period
                        </td>
                        <td className="px-4 py-3 text-sm font-bold italic">
                          Run-in paragraph head. The text continues...
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">
                  Headline-Style Capitalization
                </h3>
                <p>
                  Chicago style uses <strong>headline-style capitalization</strong> for most
                  headings. Capitalize the first and last words and all major words (nouns,
                  pronouns, verbs, adjectives, adverbs). Lowercase articles, coordinating
                  conjunctions, and prepositions unless they are the first or last word of the
                  heading or the first word after a colon.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 mt-4">
                  <p className="font-semibold mb-2">Headline-Style (correct):</p>
                  <p className="font-mono text-sm">
                    The History of the Roman Empire in the First Century
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 mt-4">
                  <p className="font-semibold mb-2">Sentence-Style (for Level 4 & 5):</p>
                  <p className="font-mono text-sm">
                    The history of the Roman empire in the first century
                  </p>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">
                  General Heading Guidelines
                </h3>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Use no more than three levels of headings in most documents</li>
                  <li>Leave a blank line before and after each heading (except run-in)</li>
                  <li>Number headings only if required by your specific field or publisher</li>
                  <li>Keep headings brief and descriptive</li>
                  <li>Aave headings stand alone (no &quot;Introduction&quot; as a heading)</li>
                  <li>Use parallel structure for headings at the same level</li>
                </ul>
              </div>
            ),
          },
          {
            id: "common-mistakes",
            heading: "Common Chicago Style Mistakes",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  Even experienced writers can make mistakes with Chicago style citation format.
                  Being aware of these common errors will help you avoid them in your own work.
                </p>
                <ul className="list-disc pl-6 space-y-3 mt-4">
                  <li>
                    <strong>Confusing the two systems:</strong> Mixing Author-Date in-text citations
                    with footnotes, or vice versa. Choose one system and apply it consistently
                    throughout your document.
                  </li>
                  <li>
                    <strong>Incorrect footnote placement:</strong> Superscript numbers should appear
                    after punctuation (except dashes) and quotation marks. Example: &quot;end of the
                    quote.&quot;&#185; Not: &quot;end of the quote&#185;.&quot;
                  </li>
                  <li>
                    <strong>Wrong author name format:</strong> Footnotes use First Last, while
                    bibliography entries use Last, First. Don&apos;t mix these up.
                  </li>
                  <li>
                    <strong>Missing page numbers:</strong> Footnotes require specific page numbers
                    for the referenced information. Bibliography entries need full page ranges for
                    articles and chapters.
                  </li>
                  <li>
                    <strong>Improper use of Ibid.:</strong> Ibid. is only used when citing the same
                    source immediately after the previous citation. If you&apos;ve cited any other
                    source in between, use a shortened footnote instead.
                  </li>
                  <li>
                    <strong>Inconsistent punctuation:</strong> Chicago style has specific rules for
                    periods, commas, and parentheses in citations. Pay attention to these details.
                  </li>
                  <li>
                    <strong>Forgetting the bibliography:</strong> Even with complete footnotes, you
                    still need a bibliography listing all sources at the end of your paper.
                  </li>
                  <li>
                    <strong>Wrong capitalization in titles:</strong> Use headline-style for most
                    titles, but sentence-style for Level 4 and 5 headings.
                  </li>
                </ul>
                <div className="rounded-lg bg-red-50 border border-red-200 p-4 mt-4">
                  <p className="font-semibold text-red-900 mb-2">
                    Pro Tip: Use a Citation Generator
                  </p>
                  <p className="text-red-800">
                    While understanding Chicago style rules is important, using our free Chicago
                    citation generator can help you avoid formatting errors and save time. Always
                    double-check generated citations against the official manual.
                  </p>
                </div>
              </div>
            ),
          },
          {
            id: "faq",
            heading: "Frequently Asked Questions",
            body: (
              <div className="space-y-6 text-slate-700">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    What is the difference between Chicago footnotes and endnotes?
                  </h3>
                  <p>
                    Footnotes appear at the bottom of the page where the reference occurs, while
                    endnotes are collected at the end of a chapter or document. Both use the same
                    citation format. Footnotes are more common as they allow readers to easily see
                    source information without flipping to the end of the document.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    How do I cite a source with no author in Chicago style?
                  </h3>
                  <p>
                    For sources with no identifiable author, begin the citation with the title. In
                    footnotes and bibliography entries, alphabetize by the first main word of the
                    title (excluding A, An, The). In the Author-Date system, use the title and year
                    for in-text citations: (<em>Title</em> 2020, 15).
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    When should I use Ibid. in Chicago citations?
                  </h3>
                  <p>
                    Use <strong>Ibid.</strong> (short for the Latin word ibidem, meaning &quot;in
                    the same place&quot;) only when you are citing the exact same source
                    consecutively—meaning no other sources appear between the citations. If
                    you&apos;ve cited any other source, even a different page of the same book, use
                    a shortened footnote instead.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Do I need to include URL access dates in Chicago style?
                  </h3>
                  <p>
                    Access dates are required for online sources that are likely to change or do not
                    have a publication or modification date. For stable online sources like
                    journals, books, or official reports with clear publication dates, an access
                    date is typically unnecessary. When included, access dates follow the format:
                    &quot;accessed January 1, 2026.&quot;
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    How do I cite multiple sources in one Chicago footnote?
                  </h3>
                  <p>
                    When citing multiple sources in a single footnote, separate each citation with a
                    semicolon. List them in the order they are referenced in your text. For example:
                    &quot;1. Smith, <em>Historical Writing</em>, 45; Jones,
                    <em>Modern Philosophy</em>, 67-68; Martinez, &quot;Urban Planning,&quot;
                    289.&quot;
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Is Chicago style the same as Turabian style?
                  </h3>
                  <p>
                    <strong>Turabian style</strong> is a simplified version of Chicago style
                    designed for students and researchers. It follows the same citation principles
                    and formatting rules as Chicago but with modifications for student papers rather
                    than published works. Most Chicago guidelines apply equally to Turabian, making
                    our Chicago style guide applicable for both formats.
                  </p>
                </div>
              </div>
            ),
          },
        ]}
        showTool
        toolDefaultStyle="chicago"
      />
    </>
  );
}
