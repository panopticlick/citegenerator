import type { Metadata } from "next";
import { GuideTemplate } from "@/components/content/GuideTemplate";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { BreadcrumbJsonLd, type BreadcrumbItem } from "@/components/seo/BreadcrumbJsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citegenerator.org";

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", url: siteUrl },
  { name: "Guides", url: `${siteUrl}/guides` },
  { name: "In-Text Citations", url: `${siteUrl}/guides/in-text-citations` },
];

export const metadata: Metadata = {
  title: "In-Text Citations Guide | APA, MLA, Chicago | 2026",
  description:
    "Learn how to write in-text citations in APA, MLA, and Chicago styles. Examples for paraphrasing, direct quotes, and multiple authors.",
  keywords: [
    "in-text citations",
    "how to cite in text",
    "APA in-text citation",
    "MLA in-text citation",
    "Chicago in-text citation",
    "parenthetical citation",
  ].join(", "),
  alternates: { canonical: "/guides/in-text-citations" },
  openGraph: {
    title: "In-Text Citations Guide | APA, MLA, Chicago | 2026",
    description: "Learn how to write in-text citations in APA, MLA, and Chicago styles.",
    url: "/guides/in-text-citations",
  },
};

const updated = "January 1, 2026";
const datePublished = "2026-01-01";

export default function InTextCitationsGuide() {
  return (
    <>
      <ArticleJsonLd
        headline="In-Text Citations Guide | APA, MLA, Chicago"
        description="Learn how to write in-text citations in APA, MLA, and Chicago styles. Examples for paraphrasing, direct quotes, and multiple authors."
        datePublished={datePublished}
        dateModified={updated}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <GuideTemplate
        title="In-Text Citations Guide"
        updated={updated}
        intro="In-text citations appear in the body of your paper and point readers to the full source in your reference list or bibliography. Here's how to format them correctly."
        sections={[
          {
            id: "what-are-in-text-citations",
            heading: "What Are In-Text Citations?",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  An <strong>in-text citation</strong> is a brief reference within the body of your
                  academic paper that tells readers exactly where you found the information you are
                  using. Rather than interrupting your writing with full bibliographic details, an
                  in-text citation provides just enough information — typically the author&apos;s
                  name, publication year, and sometimes a page number — for readers to locate the
                  complete source in your reference list or bibliography.
                </p>
                <p>
                  In-text citations are essential because they serve two critical purposes in
                  academic writing. First, they give proper credit to the original authors whose
                  ideas, research, or words you are incorporating into your own work. This ethical
                  practice prevents plagiarism, which is the serious academic offense of presenting
                  someone else&apos;s work as your own. Second, in-text citations create a clear
                  pathway for interested readers to find and consult the original sources you used,
                  allowing them to verify your claims or explore the topic further.
                </p>
                <p>
                  Every in-text citation in your paper must have a corresponding entry in your
                  reference list (APA, Harvard), works cited page (MLA), or bibliography (Chicago).
                  This two-part citation system — brief references in the text paired with complete
                  listings at the end — ensures that academic communication remains transparent,
                  traceable, and credible.
                </p>
              </div>
            ),
          },
          {
            id: "parenthetical-vs-narrative",
            heading: "Parenthetical vs. Narrative Citations",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  In-text citations come in two primary formats:{" "}
                  <strong>parenthetical citations</strong> and <strong>narrative citations</strong>.
                  Understanding when and how to use each type will help you write more fluid,
                  readable prose while maintaining proper attribution.
                </p>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  What Is a Parenthetical Citation?
                </h3>
                <p>
                  A parenthetical citation places all the source information in parentheses at the
                  end of the sentence or clause that references the source. The period comes after
                  the closing parenthesis. This format is particularly useful when you want to
                  emphasize the information rather than the author, or when the author&apos;s name
                  doesn&apos;t fit naturally into your sentence structure.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 my-4">
                  <p className="font-semibold mb-2">APA parenthetical citation example:</p>
                  <p className="font-mono text-sm">
                    Research has shown that students benefit from structured study habits (Johnson,
                    2023, p. 42).
                  </p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  What Is a Narrative Citation?
                </h3>
                <p>
                  A narrative citation incorporates the author&apos;s name directly into your
                  sentence as part of the grammatical structure, usually followed immediately by the
                  year in parentheses. The publication year is still required, but the citation
                  becomes part of your sentence flow rather than appearing at the end. This format
                  is ideal when you want to highlight the author or when the author is the subject
                  of your sentence.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 my-4">
                  <p className="font-semibold mb-2">APA narrative citation example:</p>
                  <p className="font-mono text-sm">
                    Johnson (2023) argued that structured study habits significantly improve student
                    performance.
                  </p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  When to Use Each Format
                </h3>
                <p>
                  Use narrative citations when the author is the focus of your discussion or when
                  you want to create variety in your writing. They work well when introducing
                  researchers, their theories, or their specific contributions. Use parenthetical
                  citations when the information takes precedence over the source, when citing
                  multiple sources at once, or when you&apos;ve already mentioned the author
                  recently and don&apos;t need to emphasize them again. Both formats are equally
                  correct; the choice depends on sentence flow and emphasis.
                </p>
              </div>
            ),
          },
          {
            id: "apa-in-text-citations",
            heading: "APA In-Text Citations",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  The American Psychological Association (APA) style is commonly used in education,
                  psychology, and the social sciences. APA in-text citations typically include the
                  author&apos;s last name and the publication year, with page numbers added for
                  direct quotes.
                </p>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Basic APA Format</h3>
                <p>
                  The standard APA parenthetical citation format is (Author, Year). For narrative
                  citations, place the year in parentheses immediately after the author&apos;s name:
                  Author (Year).
                </p>
                <div className="rounded-lg bg-slate-50 p-4 my-4">
                  <p className="font-semibold mb-2">Parenthetical:</p>
                  <p className="font-mono text-sm">(Williams, 2023)</p>
                  <p className="font-semibold mb-2 mt-3">Narrative:</p>
                  <p className="font-mono text-sm">Williams (2023)</p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">One Author</h3>
                <p>
                  For a single author, simply include the surname and year in parentheses, or
                  integrate the name into your sentence.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 my-4">
                  <p className="font-mono text-sm">
                    Climate change affects agricultural yields worldwide (Garcia, 2023).
                  </p>
                  <p className="font-mono text-sm mt-2">
                    Garcia (2023) demonstrated that climate change affects agricultural yields.
                  </p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Two Authors</h3>
                <p>
                  For two authors, join their names with an ampersand (&) in parenthetical citations
                  or with &quot;and&quot; in narrative citations.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 my-4">
                  <p className="font-semibold mb-2">Parenthetical:</p>
                  <p className="font-mono text-sm">(Chen & Lee, 2023)</p>
                  <p className="font-semibold mb-2 mt-3">Narrative:</p>
                  <p className="font-mono text-sm">Chen and Lee (2023)</p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Three or More Authors
                </h3>
                <p>
                  For three or more authors, use the first author&apos;s name followed by &quot;et
                  al.&quot; (Latin for &quot;and others&quot;) in every citation, including the
                  first one. This changed in APA 7th edition; previous editions required listing all
                  authors on first mention.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 my-4">
                  <p className="font-mono text-sm">(Martinez et al., 2023)</p>
                  <p className="font-mono text-sm mt-2">Martinez et al. (2023) found that...</p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Direct Quotes with Page Numbers
                </h3>
                <p>
                  When quoting directly from a source, always include the page number(s) using
                  &quot;p.&quot; for a single page or &quot;pp.&quot; for multiple pages. For online
                  sources without page numbers, use paragraph numbers, section headings, or a
                  timestamp for videos.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 my-4">
                  <p className="font-semibold mb-2">Direct quote with page number:</p>
                  <p className="font-mono text-sm">
                    &quot;The results were inconclusive&quot; (Thompson, 2023, p. 127).
                  </p>
                  <p className="font-semibold mb-2 mt-3">Narrative with page number:</p>
                  <p className="font-mono text-sm">
                    Thompson (2023) stated that &quot;the results were inconclusive&quot; (p. 127).
                  </p>
                  <p className="font-semibold mb-2 mt-3">Multiple pages:</p>
                  <p className="font-mono text-sm">(Adams, 2023, pp. 45-47)</p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Paraphrasing in APA
                </h3>
                <p>
                  When paraphrasing (putting ideas in your own words), include the author and year
                  but page numbers are optional unless it helps readers locate the information.
                  However, many instructors prefer including page numbers even for paraphrases.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 my-4">
                  <p className="font-mono text-sm">
                    Recent studies have confirmed the effectiveness of cognitive behavioral therapy
                    for anxiety disorders (Brown, 2023).
                  </p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Multiple Sources in One Citation
                </h3>
                <p>
                  To cite multiple sources in the same parentheses, list them alphabetically and
                  separate them with semicolons. This is useful when several sources support the
                  same point.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 my-4">
                  <p className="font-mono text-sm">(Anderson, 2022; Baker, 2023; Clark, 2021)</p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Secondary Sources (As Cited In)
                </h3>
                <p>
                  When citing a source you found quoted in another source (a secondary source), use
                  &quot;as cited in&quot; to indicate you read the second author&apos;s work, not
                  the original. Only include the source you actually read in your reference list.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 my-4">
                  <p className="font-mono text-sm">
                    Piaget&apos;s theory of cognitive development (as cited in Robinson, 2023, p.
                    89) suggests...
                  </p>
                </div>
              </div>
            ),
          },
          {
            id: "mla-in-text-citations",
            heading: "MLA In-Text Citations",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  The Modern Language Association (MLA) style is widely used in the humanities,
                  especially in English and literature courses. MLA in-text citations use the
                  author-page format, focusing on location rather than publication year.
                </p>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Basic MLA Format</h3>
                <p>
                  MLA citations typically include only the author&apos;s last name and the page
                  number in parentheses, with no comma between them. The period comes after the
                  citation. Unlike APA, MLA does not include the year in standard in-text citations.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 my-4">
                  <p className="font-mono text-sm">(Smith 45)</p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">One Author</h3>
                <p>
                  For a single author, include the surname and page number. In narrative citations,
                  place only the page number in parentheses.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 my-4">
                  <p className="font-semibold mb-2">Parenthetical:</p>
                  <p className="font-mono text-sm">
                    Medieval poetry often employed elaborate allegory (Harrison 78).
                  </p>
                  <p className="font-semibold mb-2 mt-3">Narrative:</p>
                  <p className="font-mono text-sm">
                    Harrison notes that medieval poetry often employed elaborate allegory (78).
                  </p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Two Authors</h3>
                <p>
                  For two authors, join their names with &quot;and&quot; in both parenthetical and
                  narrative citations. Note that MLA uses &quot;and&quot; rather than the ampersand
                  used in APA.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 my-4">
                  <p className="font-mono text-sm">
                    The manuscript contains significant marginalia (Fisher and Morgan 212).
                  </p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Three or More Authors
                </h3>
                <p>
                  For three or more authors, use the first author&apos;s name followed by &quot;et
                  al.&quot; (Latin for &quot;and others&quot;). This applies to both parenthetical
                  and narrative citations.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 my-4">
                  <p className="font-mono text-sm">
                    Renaissance art reflected changing social structures (Patel et al. 156).
                  </p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Direct Quotes in MLA
                </h3>
                <p>
                  MLA requires page numbers for all direct quotes. For prose, cite the specific
                  page. For poetry, include line numbers if available. For plays, cite act, scene,
                  and line numbers as appropriate.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 my-4">
                  <p className="font-semibold mb-2">Prose quote:</p>
                  <p className="font-mono text-sm">
                    &quot;The text reveals layers of meaning&quot; (Bennett 92).
                  </p>
                  <p className="font-semibold mb-2 mt-3">Narrative quote:</p>
                  <p className="font-mono text-sm">
                    Bennett observes that &quot;the text reveals layers of meaning&quot; (92).
                  </p>
                  <p className="font-semibold mb-2 mt-3">Poetry (line numbers):</p>
                  <p className="font-mono text-sm">
                    Shakespeare&apos;s sonnet opens with a rhetorical question (lines 1-4).
                  </p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Multiple Works by the Same Author
                </h3>
                <p>
                  When citing multiple works by the same author, include a shortened version of the
                  title in your citation to distinguish which work you&apos;re referring to. The
                  title should be formatted as it appears in your works cited (italicized for books,
                  in quotation marks for articles).
                </p>
                <div className="rounded-lg bg-slate-50 p-4 my-4">
                  <p className="font-semibold mb-2">Book:</p>
                  <p className="font-mono text-sm">
                    (Foster, <em>Novel</em> 45)
                  </p>
                  <p className="font-semibold mb-2 mt-3">Article:</p>
                  <p className="font-mono text-sm">(Foster, &quot;Analysis&quot; 12)</p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Multiple Sources in One Citation
                </h3>
                <p>
                  When citing multiple sources to support a single point, separate them with
                  semicolons and list them in the order they appear in your works cited or
                  alphabetically.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 my-4">
                  <p className="font-mono text-sm">(Davis 23; Ellis 67; Foster 92)</p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Corporate Authors
                </h3>
                <p>
                  For sources authored by organizations or corporations, use the organization&apos;s
                  name in the citation or a shortened version if it&apos;s lengthy and has a
                  familiar abbreviation.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 my-4">
                  <p className="font-semibold mb-2">Full name:</p>
                  <p className="font-mono text-sm">(National Institute of Mental Health 14)</p>
                  <p className="font-semibold mb-2 mt-3">Abbreviated after first use:</p>
                  <p className="font-mono text-sm">(NIMH 14)</p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Online Sources without Page Numbers
                </h3>
                <p>
                  For digital sources without pagination, include only the author name. If the
                  source has numbered paragraphs, use the abbreviation &quot;par.&quot; or
                  &quot;pars.&quot; You may also include a section heading or chapter number to help
                  readers locate the information.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 my-4">
                  <p className="font-mono text-sm">(Johnson)</p>
                  <p className="font-mono text-sm mt-2">(Johnson, pars. 4-5)</p>
                  <p className="font-mono text-sm mt-2">
                    (Johnson, &quot;Methodology&quot; section)
                  </p>
                </div>
              </div>
            ),
          },
          {
            id: "chicago-in-text-citations",
            heading: "Chicago In-Text Citations",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  Chicago style offers two distinct citation systems: the Notes and Bibliography
                  system, preferred in humanities disciplines like history and literature, and the
                  Author-Date system, used in sciences and social sciences. Understanding which
                  system your field or instructor requires is the first step.
                </p>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Chicago Author-Date Style
                </h3>
                <p>
                  The Author-Date style is similar to APA format, placing citations in parentheses
                  within the text. Include the author&apos;s last name, publication year, and page
                  numbers if relevant. This system is commonly used in the physical, natural, and
                  social sciences.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 my-4">
                  <p className="font-semibold mb-2">Parenthetical citation:</p>
                  <p className="font-mono text-sm">(Richardson 2023, 45)</p>
                  <p className="font-semibold mb-2 mt-3">Narrative citation:</p>
                  <p className="font-mono text-sm">Richardson (2023, 45) argues that...</p>
                  <p className="font-semibold mb-2 mt-3">Multiple authors:</p>
                  <p className="font-mono text-sm">(Bell and Fox 2022)</p>
                  <p className="font-mono text-sm mt-2">(Bell et al. 2022)</p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Notes and Bibliography (Footnotes)
                </h3>
                <p>
                  The Notes and Bibliography system uses footnotes or endnotes instead of
                  parenthetical citations. Superscript numbers in the text correspond to notes at
                  the bottom of the page (footnotes) or end of the document (endnotes). This system
                  allows for more extensive commentary and is favored in history and the humanities.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 my-4">
                  <p className="font-semibold mb-2">Text with footnote reference:</p>
                  <p className="font-mono text-sm">
                    According to recent historical analysis, the Treaty of Versailles had
                    far-reaching economic consequences.^1
                  </p>
                  <p className="font-semibold mb-2 mt-3">Corresponding footnote:</p>
                  <p className="font-mono text-sm">
                    1. Margaret Evans, <em>Aftermath: The Economic Legacy of Versailles</em>{" "}
                    (London: Oxford University Press, 2023), 78.
                  </p>
                </div>
                <p>
                  The first time you cite a source in a footnote, provide the full citation.
                  Subsequent citations to the same source can use shortened forms: just the
                  author&apos;s last name, a shortened title, and the page number. The word
                  &quot;Ibid.&quot; (short for ibidem, meaning &quot;in the same place&quot;) was
                  traditionally used for consecutive citations to the same source, but modern
                  Chicago style prefers using the shortened citation format.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 my-4">
                  <p className="font-semibold mb-2">Subsequent footnote (shortened):</p>
                  <p className="font-mono text-sm">
                    2. Evans, <em>Aftermath</em>, 112.
                  </p>
                </div>
              </div>
            ),
          },
          {
            id: "harvard-in-text-citations",
            heading: "Harvard In-Text Citations",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  Harvard referencing is an author-date system widely used in UK universities and
                  internationally across many disciplines. While there are variations in Harvard
                  style between institutions, the basic in-text citation format remains consistent:
                  author name and year in parentheses.
                </p>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Basic Harvard Format
                </h3>
                <p>
                  Harvard citations follow the (Author, Year) format for parenthetical citations, or
                  Author (Year) for narrative citations. Page numbers are included for direct quotes
                  and sometimes for paraphrases.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 my-4">
                  <p className="font-semibold mb-2">Parenthetical:</p>
                  <p className="font-mono text-sm">(Roberts 2023)</p>
                  <p className="font-mono text-sm mt-2">(Roberts 2023, p. 35)</p>
                  <p className="font-semibold mb-2 mt-3">Narrative:</p>
                  <p className="font-mono text-sm">Roberts (2023) concludes that...</p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Multiple Authors in Harvard
                </h3>
                <p>
                  For two authors, use &quot;and&quot; between names in parenthetical citations. For
                  three or four authors, list all names the first time and use &quot;et al.&quot;
                  for subsequent citations. For five or more authors, use &quot;et al.&quot; from
                  the first citation.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 my-4">
                  <p className="font-semibold mb-2">Two authors:</p>
                  <p className="font-mono text-sm">(Turner and White 2023)</p>
                  <p className="font-semibold mb-2 mt-3">Three authors (first citation):</p>
                  <p className="font-mono text-sm">(Turner, White, and Harris 2023)</p>
                  <p className="font-semibold mb-2 mt-3">Three authors (subsequent):</p>
                  <p className="font-mono text-sm">(Turner et al. 2023)</p>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Multiple Sources and Corporate Authors
                </h3>
                <p>
                  When citing multiple sources in one parentheses, arrange them alphabetically and
                  separate with semicolons. For corporate authors, use the organization name or a
                  recognizable abbreviation.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 my-4">
                  <p className="font-semibold mb-2">Multiple sources:</p>
                  <p className="font-mono text-sm">(Andrews 2022; Bennett 2023; Carter 2021)</p>
                  <p className="font-semibold mb-2 mt-3">Corporate author:</p>
                  <p className="font-mono text-sm">(World Health Organization 2023)</p>
                </div>
              </div>
            ),
          },
          {
            id: "faq",
            heading: "Frequently Asked Questions",
            body: (
              <div className="space-y-4 text-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Do I need an in-text citation for common knowledge?
                </h3>
                <p>
                  No, you don&apos;t need to cite information that is considered common knowledge —
                  facts that are widely known and undisputed (e.g., water boils at 100°C, World War
                  II ended in 1945). However, when in doubt, it&apos;s always safer to include a
                  citation. Facts that are specific to a field or that your readers might not
                  generally know should always be cited.
                </p>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  How do I cite a source with no author?
                </h3>
                <p>
                  When a source has no named author, use a shortened version of the title in place
                  of the author name. In APA, place the title in quotation marks for articles or
                  italics for books. In MLA, use the full title or a shortened version, formatted as
                  it appears in your works cited. If the title is long, shorten it to the first few
                  words.
                </p>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Can I put the citation in the middle of a sentence?
                </h3>
                <p>
                  Yes, you can place citations mid-sentence to clarify which information comes from
                  which source. This is particularly useful when a sentence contains ideas from
                  multiple sources. Place the citation immediately after the information it
                  supports, before any punctuation, and continue your sentence.
                </p>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  What if I have two sources with the same author and year?
                </h3>
                <p>
                  When you have multiple sources by the same author published in the same year, add
                  lowercase letters (a, b, c) after the year to distinguish them. Assign the letters
                  alphabetically based on the titles (ignoring &quot;A&quot; or &quot;The&quot; at
                  the beginning). For example: (Smith, 2023a) and (Smith, 2023b). Make sure your
                  reference list entries match these labels.
                </p>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  How do I cite indirect sources (something quoted in another source)?
                </h3>
                <p>
                  For sources you found quoted in another work (indirect sources), use the phrase
                  &quot;as cited in&quot; or &quot;quoted in&quot; to indicate you read the
                  secondary source, not the original. Include only the source you actually read in
                  your reference list. For example, in APA: (Harris, 2019, as cited in Peterson,
                  2023, p. 15). Use indirect sources sparingly; try to locate the original work
                  whenever possible.
                </p>
              </div>
            ),
          },
        ]}
        showTool
      />
    </>
  );
}
