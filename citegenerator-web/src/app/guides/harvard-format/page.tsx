import type { Metadata } from "next";
import { GuideTemplate } from "@/components/content/GuideTemplate";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { BreadcrumbJsonLd, type BreadcrumbItem } from "@/components/seo/BreadcrumbJsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citegenerator.org";

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", url: siteUrl },
  { name: "Guides", url: `${siteUrl}/guides` },
  { name: "Harvard Format", url: `${siteUrl}/guides/harvard-format` },
];

export const metadata: Metadata = {
  title: "Harvard Referencing Guide | Harvard Citation Format | 2026",
  description:
    "Complete guide to Harvard referencing style. In-text citations, reference list format, and examples for books, websites, and journal articles.",
  keywords: [
    "Harvard referencing",
    "Harvard citation style",
    "Harvard format",
    "how to cite in Harvard",
    "Harvard reference list",
    "Harvard bibliography",
  ].join(", "),
  alternates: { canonical: "/guides/harvard-format" },
  openGraph: {
    title: "Harvard Referencing Guide | Harvard Citation Format | 2026",
    description: "Complete guide to Harvard referencing style.",
    url: "/guides/harvard-format",
  },
};

const updated = "January 1, 2026";
const datePublished = "2026-01-01";

export default function HarvardFormatGuide() {
  return (
    <>
      <ArticleJsonLd
        headline="Harvard Referencing Guide | Harvard Citation Format"
        description="Complete guide to Harvard referencing style. In-text citations, reference list format, and examples for books, websites, and journal articles."
        datePublished={datePublished}
        dateModified={updated}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <GuideTemplate
        title="Harvard Referencing Guide"
        updated={updated}
        intro="Harvard referencing is a parenthetical author-date style commonly used in UK universities and worldwide. This guide covers the basics of Harvard citation format."
        sections={[
          {
            id: "what-is-harvard",
            heading: "What is Harvard Referencing?",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  Harvard referencing is a widely used citation style that employs an author-date
                  system for acknowledging sources in academic writing. Unlike other referencing
                  styles that are managed by official organizations, Harvard referencing has no
                  single authoritative manual or governing body. Instead, various universities and
                  institutions have developed their own Harvard style guides, leading to slight
                  variations in formatting rules across different institutions.
                </p>
                <p>
                  The Harvard citation style is characterized by its parenthetical in-text
                  citations, which typically include the author&apos;s surname and the year of
                  publication. This system allows readers to quickly locate the full source details
                  in the reference list or bibliography at the end of the document. The simplicity
                  and efficiency of this author-date approach have contributed to Harvard&apos;s
                  popularity among students and researchers worldwide.
                </p>
                <p>
                  Harvard referencing is particularly prevalent in the United Kingdom, Australia,
                  and many Commonwealth countries. It is extensively used across various
                  disciplines, including the sciences, social sciences, humanities, and business.
                  Many UK universities, including Harvard University (despite the name), recommend
                  or require Harvard referencing for academic submissions. The style&apos;s
                  flexibility and adaptability to different types of sources make it a preferred
                  choice for many academic institutions.
                </p>
                <p>
                  Because there is no official Harvard referencing guide, students should always
                  consult their institution&apos;s specific Harvard style guidelines. While the core
                  principles remain consistent, details such as punctuation, capitalization, and the
                  formatting of electronic sources may vary between different universities.
                </p>
              </div>
            ),
          },
          {
            id: "in-text-citations",
            heading: "In-Text Citation Format",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  In-text citations in Harvard referencing are brief references included within the
                  body of your text that direct readers to the full source information in your
                  reference list. The basic format for Harvard in-text citations consists of the
                  author&apos;s surname followed by the year of publication, enclosed in
                  parentheses.
                </p>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Basic Format Structure
                </h3>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-mono text-sm">(Author, Year)</p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">One Author</h3>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold mb-2">Parenthetical citation:</p>
                  <p className="font-mono text-sm">(Smith, 2023)</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold mb-2">Narrative citation (author in text):</p>
                  <p className="font-mono text-sm">Smith (2023) argues that...</p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Two Authors</h3>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-mono text-sm">(Smith and Jones, 2023)</p>
                  <p className="text-sm mt-2">
                    Both authors are listed, joined by &quot;and&quot;.
                  </p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Three Authors</h3>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-mono text-sm">(Smith, Jones and Brown, 2023)</p>
                  <p className="text-sm mt-2">All three authors are listed, separated by commas.</p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Four or More Authors
                </h3>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-mono text-sm">(Smith et al., 2023)</p>
                  <p className="text-sm mt-2">
                    Use &quot;et al.&quot; (meaning &quot;and others&quot;) for four or more
                    authors.
                  </p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Corporate Authors
                </h3>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-mono text-sm">(World Health Organization, 2023)</p>
                  <p className="text-sm mt-2">
                    Use the full corporate name for organizations as authors.
                  </p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Multiple Sources in One Citation
                </h3>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-mono text-sm">(Smith, 2021; Jones, 2022; Brown, 2023)</p>
                  <p className="text-sm mt-2">
                    List sources in chronological order, separated by semicolons.
                  </p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Direct Quotes vs. Paraphrasing
                </h3>
                <p>
                  When quoting directly from a source, you must include the page number(s) where the
                  quote appears. For paraphrased information (putting ideas into your own words),
                  page numbers are not required but may be included for clarity.
                </p>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold mb-2">Direct quote with page number:</p>
                  <p className="font-mono text-sm">(Smith, 2023, p. 45)</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold mb-2">Quote spanning multiple pages:</p>
                  <p className="font-mono text-sm">(Smith, 2023, pp. 45-47)</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold mb-2">Paraphrasing (no page number):</p>
                  <p className="font-mono text-sm">(Smith, 2023)</p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Secondary Sources
                </h3>
                <p>
                  When citing a source that you have not read directly but was quoted in another
                  source (a secondary source), use the following format:
                </p>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-mono text-sm">(Smith, 2020, cited in Jones, 2023)</p>
                  <p className="text-sm mt-2">
                    Only include Jones in your reference list, as that is the source you actually
                    read.
                  </p>
                </div>
              </div>
            ),
          },
          {
            id: "reference-list",
            heading: "Reference List Format",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  The reference list in Harvard referencing contains full details of all sources
                  cited in your text, arranged alphabetically by author surname. Unlike a
                  bibliography, which may include sources consulted but not cited, a Harvard
                  reference list includes only works directly referenced in your assignment.
                </p>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  General Formatting Rules
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Begin on a new page at the end of your document</li>
                  <li>Label the page &quot;Reference List&quot; or &quot;References&quot;</li>
                  <li>Arrange entries alphabetically by author&apos;s surname</li>
                  <li>Use hanging indent (first line flush left, subsequent lines indented)</li>
                  <li>Include all elements in the specified order with consistent punctuation</li>
                  <li>Italicize book and journal titles</li>
                  <li>Use &apos;p.&apos; for single page and &apos;pp.&apos; for multiple pages</li>
                </ul>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Books - Single Author
                </h3>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold mb-2">Format:</p>
                  <p className="font-mono text-sm">
                    Author, Initial. (Year) <em>Title of Book</em>. Edition (if not 1st). City:
                    Publisher.
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold mb-2">Example:</p>
                  <p className="font-mono text-sm">
                    Smith, J. A. (2023) <em>Academic Writing Skills</em>. 2nd edn. London: Palgrave
                    Macmillan.
                  </p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Books - Multiple Authors
                </h3>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold mb-2">Two authors:</p>
                  <p className="font-mono text-sm">
                    Smith, J. and Jones, B. (2023) <em>Research Methods</em>. Oxford: Oxford
                    University Press.
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold mb-2">Three authors:</p>
                  <p className="font-mono text-sm">
                    Smith, J., Jones, B. and Brown, C. (2023) <em>Data Analysis</em>. Cambridge:
                    Cambridge University Press.
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold mb-2">Four or more authors:</p>
                  <p className="font-mono text-sm">
                    Smith, J. et al. (2023) <em>Advanced Statistics</em>. Edinburgh: Pearson.
                  </p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Edited Books</h3>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold mb-2">Format:</p>
                  <p className="font-mono text-sm">
                    Editor, Initial. (ed.) (Year) <em>Title of Book</em>. City: Publisher.
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold mb-2">Example:</p>
                  <p className="font-mono text-sm">
                    Johnson, P. (ed.) (2023) <em>Contemporary Issues in Psychology</em>. London:
                    Routledge.
                  </p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Chapter in an Edited Book
                </h3>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold mb-2">Format:</p>
                  <p className="font-mono text-sm">
                    ChapterAuthor, Initial. (Year) &apos;Title of Chapter&apos;, in Editor, Initial.
                    (ed.) <em>Title of Book</em>. City: Publisher, pp. page range.
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold mb-2">Example:</p>
                  <p className="font-mono text-sm">
                    Williams, R. (2023) &apos;Cognitive development in early childhood&apos;, in
                    Davies, M. (ed.) <em>Child Psychology: A Comprehensive Guide</em>. London: Sage,
                    pp. 145-167.
                  </p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Journal Articles - Print
                </h3>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold mb-2">Format:</p>
                  <p className="font-mono text-sm">
                    Author, Initial. (Year) &apos;Title of Article&apos;, <em>Journal Name</em>,
                    volume(issue), pp. page range.
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold mb-2">Example:</p>
                  <p className="font-mono text-sm">
                    Thompson, L. (2023) &apos;The impact of remote work on employee
                    productivity&apos;,
                    <em>Journal of Business Research</em>, 78(3), pp. 234-251.
                  </p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Journal Articles - Online with DOI
                </h3>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold mb-2">Format:</p>
                  <p className="font-mono text-sm">
                    Author, Initial. (Year) &apos;Title of Article&apos;, <em>Journal Name</em>,
                    volume(issue), pp. page range. doi:DOI number.
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold mb-2">Example:</p>
                  <p className="font-mono text-sm">
                    Anderson, M. and Clarke, S. (2023) &apos;Climate change effects on coastal
                    ecosystems&apos;, <em>Environmental Science</em>, 45(2), pp. 78-95.
                    doi:10.1234/envsci.2023.002.
                  </p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Journal Articles - Online without DOI
                </h3>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold mb-2">Format:</p>
                  <p className="font-mono text-sm">
                    Author, Initial. (Year) &apos;Title of Article&apos;, <em>Journal Name</em>,
                    volume(issue), pp. page range. Available at: URL (Accessed: Day Month Year).
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold mb-2">Example:</p>
                  <p className="font-mono text-sm">
                    Harris, P. (2023) &apos;Digital transformation in higher education&apos;,
                    <em>International Journal of Education</em>, 12(1), pp. 112-128. Available at:
                    https://www.ije.org/articles/2023/digital-transformation (Accessed: 15 January
                    2026).
                  </p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Websites and Web Pages
                </h3>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold mb-2">Format:</p>
                  <p className="font-mono text-sm">
                    Author, Initial. or Organization (Year) &apos;Title of page&apos;,
                    <em>Website Name</em>. Available at: URL (Accessed: Day Month Year).
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold mb-2">Example with author:</p>
                  <p className="font-mono text-sm">
                    Roberts, T. (2023) &apos;Understanding mental health in the workplace&apos;,
                    <em>Mind Matters</em>. Available at: https://www.mindmatters.org/mental-health
                    (Accessed: 10 January 2026).
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold mb-2">Example with organization as author:</p>
                  <p className="font-mono text-sm">
                    National Health Service (2023) &apos;Guide to healthy eating&apos;,
                    <em>NHS Website</em>. Available at: https://www.nhs.uk/live-well/eat-well
                    (Accessed: 8 January 2026).
                  </p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Electronic Sources - General
                </h3>
                <p>
                  When referencing electronic sources, always include the URL and the date you
                  accessed the material, as online content can change or be removed. The access date
                  is particularly important for sources that are frequently updated or lack a
                  publication date.
                </p>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold mb-2">PDF document online:</p>
                  <p className="font-mono text-sm">
                    United Nations (2023) <em>Global Climate Report 2023</em>. New York: UN.
                    Available at: https://www.un.org/climate-report-2023.pdf (Accessed: 12 January
                    2026).
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold mb-2">Blog post:</p>
                  <p className="font-mono text-sm">
                    Chen, L. (2023) &apos;5 tips for better study habits&apos;,{" "}
                    <em>Study Success Blog</em>. 18 September. Available at:
                    https://www.studysuccess.blog/tips (Accessed: 5 January 2026).
                  </p>
                </div>
              </div>
            ),
          },
          {
            id: "year-formatting",
            heading: "Year Formatting Rules",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  The year of publication is a critical component of Harvard referencing and must be
                  included in both in-text citations and reference list entries. However, situations
                  arise where a source lacks a clear publication date or when you need to cite
                  multiple works by the same author from the same year.
                </p>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Sources with No Date (n.d.)
                </h3>
                <p>
                  When a source does not have a publication date, use &quot;n.d.&quot; (no date) in
                  place of the year in both the in-text citation and the reference list entry.
                </p>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold mb-2">In-text citation:</p>
                  <p className="font-mono text-sm">(Smith, n.d.)</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold mb-2">Reference list:</p>
                  <p className="font-mono text-sm">
                    Smith, J. (n.d.) <em>Guide to Research Methods</em>. Available at:
                    https://www.example.com/research (Accessed: 15 January 2026).
                  </p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Multiple Works by Same Author in Same Year
                </h3>
                <p>
                  When citing multiple works by the same author published in the same year, add
                  lowercase letters (a, b, c, etc.) after the year to distinguish between them. The
                  order is determined alphabetically by the title of the work (excluding
                  &quot;A&quot; or &quot;The&quot; at the beginning).
                </p>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold mb-2">In-text citations:</p>
                  <p className="font-mono text-sm">(Smith, 2023a) or (Smith, 2023b)</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold mb-2">Reference list:</p>
                  <p className="font-mono text-sm">
                    Smith, J. (2023a) &apos;Academic writing in the digital age&apos;,
                    <em>Journal of Higher Education</em>, 15(2), pp. 45-62.
                  </p>
                  <p className="font-mono text-sm mt-2">
                    Smith, J. (2023b) <em>Modern Research Techniques</em>. London: Academic Press.
                  </p>
                </div>
                <p className="text-sm mt-2">
                  Note: &quot;Academic&quot; comes before &quot;Modern&quot; alphabetically, so it
                  receives the &quot;a&quot; designation.
                </p>
              </div>
            ),
          },
          {
            id: "comparison",
            heading: "Harvard vs Other Citation Styles",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  While Harvard referencing shares similarities with other citation styles,
                  understanding the key differences can help ensure you use the correct format for
                  your academic work. Here&apos;s how Harvard compares to two other popular styles.
                </p>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Harvard vs APA</h3>
                <p>
                  Harvard and APA (American Psychological Association) styles both use an
                  author-date system for in-text citations, making them similar in approach.
                  However, there are important distinctions:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Author names:</strong> Harvard uses initials before surnames in
                    reference lists, while APA lists surname followed by initials
                  </li>
                  <li>
                    <strong>Book titles:</strong> Harvard italicizes book titles; APA also
                    italicizes book titles but has different capitalization rules
                  </li>
                  <li>
                    <strong>Article titles:</strong> Harvard uses single quotation marks for article
                    titles; APA uses no quotation marks
                  </li>
                  <li>
                    <strong>Multiple authors:</strong> Harvard typically lists all authors up to
                    three or four, while APA lists up to 20 authors
                  </li>
                  <li>
                    <strong>Page numbers:</strong> Harvard uses &quot;p.&quot; and &quot;pp.&quot;
                    abbreviations; APA uses &quot;p.&quot; and &quot;pp.&quot; as well but placement
                    may differ
                  </li>
                  <li>
                    <strong>Official status:</strong> APA has an official manual (7th edition);
                    Harvard has no official governing body
                  </li>
                </ul>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Harvard vs MLA</h3>
                <p>
                  MLA (Modern Language Association) style differs more significantly from Harvard,
                  as it uses an author-page number system rather than author-date:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>In-text citations:</strong> Harvard uses (Author, Year), MLA uses
                    (Author Page)
                  </li>
                  <li>
                    <strong>Year placement:</strong> Harvard places the year after the author; MLA
                    places it near the end of the reference entry
                  </li>
                  <li>
                    <strong>Titles:</strong> Harvard italicizes book titles; MLA uses quotation
                    marks for article titles and italicizes book titles
                  </li>
                  <li>
                    <strong>Discipline focus:</strong> Harvard is used across many disciplines,
                    especially in sciences and social sciences; MLA is primarily used in humanities
                    and liberal arts
                  </li>
                  <li>
                    <strong>Reference label:</strong> Harvard uses &quot;Reference List&quot;; MLA
                    uses &quot;Works Cited&quot;
                  </li>
                </ul>
                <div className="rounded-lg bg-slate-50 p-4 mt-4">
                  <p className="font-semibold mb-2">Quick comparison example - Book:</p>
                  <p className="text-sm font-semibold mt-3">Harvard:</p>
                  <p className="font-mono text-sm">
                    Smith, J. (2023) <em>The Book Title</em>. London: Publisher.
                  </p>
                  <p className="text-sm font-semibold mt-3">APA:</p>
                  <p className="font-mono text-sm">
                    Smith, J. (2023). <em>The book title</em>. Publisher.
                  </p>
                  <p className="text-sm font-semibold mt-3">MLA:</p>
                  <p className="font-mono text-sm">
                    Smith, John. <em>The Book Title</em>. Publisher, 2023.
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
                    Is there an official Harvard referencing guide?
                  </h3>
                  <p>
                    No, there is no official Harvard referencing guide or manual. Unlike APA or MLA,
                    Harvard referencing is not managed by a single organization. Instead, various
                    universities and institutions have developed their own Harvard style guides. You
                    should always follow your specific institution&apos;s Harvard referencing
                    guidelines, as minor variations exist between different versions.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    How do I cite a website with no author in Harvard style?
                  </h3>
                  <p>
                    When a website has no identifiable author, use the name of the organization
                    responsible for the site as the author. If no organization is apparent, use the
                    title of the page as the first element of the reference. For example:
                    (Anonymous, 2023) or begin with the page title in alphabetical order.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    What is the difference between a reference list and a bibliography?
                  </h3>
                  <p>
                    A reference list includes only the sources you have cited in your text, whereas
                    a bibliography may include additional sources you consulted but did not directly
                    cite. Harvard referencing typically requires a reference list, though some
                    institutions may ask for both. Always check your assignment requirements.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    When should I use &apos;et al.&apos; in Harvard referencing?
                  </h3>
                  <p>
                    In Harvard referencing, &quot;et al.&quot; (meaning &quot;and others&quot;) is
                    typically used for sources with four or more authors. Use &quot;et al.&quot;
                    after the first author&apos;s name in both in-text citations and the reference
                    list entry. However, some institutions may have different thresholds, so check
                    your local guidelines.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Do I need to include URLs in Harvard references?
                  </h3>
                  <p>
                    Yes, for electronic sources including websites, online articles, and PDFs, you
                    should include the full URL and the date you accessed the material. This is
                    important because online content can be changed, updated, or removed. The access
                    date helps readers understand when the source was available and viewed.
                  </p>
                </div>
              </div>
            ),
          },
        ]}
        showTool
        toolDefaultStyle="harvard"
      />
    </>
  );
}
