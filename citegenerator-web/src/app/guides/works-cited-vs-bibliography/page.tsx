import type { Metadata } from "next";
import { GuideTemplate } from "@/components/content/GuideTemplate";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { BreadcrumbJsonLd, type BreadcrumbItem } from "@/components/seo/BreadcrumbJsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citegenerator.org";

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", url: siteUrl },
  { name: "Guides", url: `${siteUrl}/guides` },
  { name: "Works Cited vs Bibliography", url: `${siteUrl}/guides/works-cited-vs-bibliography` },
];

export const metadata: Metadata = {
  title: "Works Cited vs Bibliography vs References | What's the Difference? | 2026",
  description:
    "Learn the difference between works cited, bibliography, and reference lists. When to use each term and how to format them correctly.",
  keywords: [
    "works cited vs bibliography",
    "difference between works cited and bibliography",
    "reference list vs bibliography",
    "works cited page",
    "bibliography format",
    "APA reference list",
  ].join(", "),
  alternates: { canonical: "/guides/works-cited-vs-bibliography" },
  openGraph: {
    title: "Works Cited vs Bibliography vs References | What's the Difference?",
    description: "Learn the difference between works cited, bibliography, and reference lists.",
    url: "/guides/works-cited-vs-bibliography",
  },
};

const updated = "January 1, 2026";
const datePublished = "2026-01-01";

export default function WorksCitedVsBibliographyGuide() {
  return (
    <>
      <ArticleJsonLd
        headline="Works Cited vs Bibliography vs References | What's the Difference?"
        description="Learn the difference between works cited, bibliography, and reference lists. When to use each term and how to format them correctly."
        datePublished={datePublished}
        dateModified={updated}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <GuideTemplate
        title="Works Cited vs Bibliography vs References"
        updated={updated}
        intro="Different citation styles use different terms for the list of sources at the end of your paper. Here's what each term means and when to use it."
        sections={[
          {
            id: "definitions",
            heading: "What Are Works Cited, Bibliography, and References?",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  When writing academic papers, you will encounter different terms for the list of
                  sources at the end of your document. Understanding{" "}
                  <strong>works cited vs bibliography</strong> vs references is essential for proper
                  academic formatting. While these terms are sometimes used interchangeably in
                  casual conversation, they have distinct meanings in different citation styles.
                </p>

                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  What is a Works Cited Page?
                </h3>
                <p>
                  A <strong>Works Cited page</strong> is a list of all the sources you directly
                  quoted, paraphrased, or summarized in your research paper. This term is
                  exclusively used in <strong>MLA (Modern Language Association)</strong> style,
                  which is commonly used in humanities disciplines like English, literature, and
                  cultural studies. The key characteristic of a Works Cited page is that it only
                  includes sources that were explicitly cited within the text of your paper using
                  parenthetical citations.
                </p>

                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  What is a Bibliography?
                </h3>
                <p>
                  A <strong>bibliography</strong> is a comprehensive list of all sources you
                  consulted during your research process, regardless of whether you actually cited
                  them in your paper. This includes sources that influenced your thinking, provided
                  background information, or helped you understand your topic even if you did not
                  include specific quotes or paraphrases from them. Bibliographies are most commonly
                  associated with <strong>Chicago style</strong> and{" "}
                  <strong>Harvard referencing</strong>, but the term is also used more generally to
                  describe any list of sources.
                </p>

                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  What is a References Page?
                </h3>
                <p>
                  A <strong>References page</strong> (or Reference List) is the term used in
                  <strong>APA (American Psychological Association)</strong> style, which is the
                  standard format for social sciences including psychology, sociology, education,
                  and business. Like a Works Cited page, an APA References page includes only the
                  sources that were specifically cited in your paper. However, the formatting rules
                  differ significantly from MLA style.
                </p>

                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Historical Context
                </h3>
                <p>
                  The practice of documenting sources dates back centuries, but formal citation
                  styles emerged in the late 19th and early 20th centuries as academic publishing
                  became more standardized. Each major citation style was developed by professional
                  organizations to serve the needs of specific disciplines: MLA for language and
                  literature scholars (founded in 1883), APA for social scientists (founded in
                  1892), and Chicago for historians and researchers across multiple fields (first
                  published in 1906).
                </p>
              </div>
            ),
          },
          {
            id: "key-differences",
            heading: "Key Differences Between Works Cited, Bibliography, and References",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  Understanding the <strong>difference between works cited and bibliography</strong>
                  is crucial for academic success. The table below provides a comprehensive
                  comparison of these three source documentation types.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-slate-700 my-4">
                    <thead>
                      <tr className="border-b-2 border-slate-300">
                        <th className="py-3 px-2 text-left">Feature</th>
                        <th className="py-3 px-2 text-left">Works Cited</th>
                        <th className="py-3 px-2 text-left">References</th>
                        <th className="py-3 px-2 text-left">Bibliography</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="py-3 px-2 font-semibold">Citation Style</td>
                        <td className="py-3 px-2">MLA (9th Edition)</td>
                        <td className="py-3 px-2">APA (7th Edition)</td>
                        <td className="py-3 px-2">Chicago, Harvard, Turabian</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="py-3 px-2 font-semibold">Primary Disciplines</td>
                        <td className="py-3 px-2">Humanities, English, Literature</td>
                        <td className="py-3 px-2">Social Sciences, Sciences</td>
                        <td className="py-3 px-2">History, Arts, General</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="py-3 px-2 font-semibold">Sources Included</td>
                        <td className="py-3 px-2">Only cited sources</td>
                        <td className="py-3 px-2">Only cited sources</td>
                        <td className="py-3 px-2">All consulted sources</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="py-3 px-2 font-semibold">Author Name Format</td>
                        <td className="py-3 px-2">Last Name, First Name</td>
                        <td className="py-3 px-2">Last Name, First Initial.</td>
                        <td className="py-3 px-2">Last Name, First Name</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="py-3 px-2 font-semibold">Title Capitalization</td>
                        <td className="py-3 px-2">Title Case</td>
                        <td className="py-3 px-2">Sentence Case</td>
                        <td className="py-3 px-2">Title Case</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="py-3 px-2 font-semibold">Date Position</td>
                        <td className="py-3 px-2">Near end of citation</td>
                        <td className="py-3 px-2">After author name</td>
                        <td className="py-3 px-2">Varies by style</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="py-3 px-2 font-semibold">Page Header</td>
                        <td className="py-3 px-2">&quot;Works Cited&quot; (centered)</td>
                        <td className="py-3 px-2">&quot;References&quot; (centered, bold)</td>
                        <td className="py-3 px-2">&quot;Bibliography&quot; (centered)</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-3 px-2 font-semibold">Annotation Option</td>
                        <td className="py-3 px-2">Yes (Annotated Bibliography)</td>
                        <td className="py-3 px-2">Yes (Annotated Bibliography)</td>
                        <td className="py-3 px-2">Yes (Annotated Bibliography)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p>
                  The most significant difference between works cited and bibliography is the scope
                  of sources included. A Works Cited or References page is strictly limited to
                  sources actually cited in your text, while a bibliography can include any source
                  that informed your research. This distinction is important because using the wrong
                  term or including incorrect sources can affect your grade on an assignment.
                </p>
              </div>
            ),
          },
          {
            id: "when-to-use",
            heading: "When to Use Each Type: Citation Style Guide",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  Choosing between a works cited page, bibliography, or references list depends on
                  which citation style you are required to use. Your instructor will typically
                  specify the citation style for your assignment. Below is a detailed breakdown of
                  when to use each type.
                </p>

                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  MLA Style: Works Cited
                </h3>
                <p>
                  Use a <strong>Works Cited page</strong> when writing in MLA style, which is the
                  standard for English classes, literature courses, foreign language studies, and
                  other humanities disciplines. MLA is developed and maintained by the Modern
                  Language Association. The current version is MLA 9th Edition, released in 2021.
                  MLA style prioritizes author names and page numbers, making it easy for readers to
                  locate specific quoted material in the original source.
                </p>
                <p>
                  When using MLA style, you will include parenthetical citations in your text like
                  this: (Smith 23). The corresponding entry in your Works Cited page allows readers
                  to find the complete source information.
                </p>

                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  APA Style: References
                </h3>
                <p>
                  Use a <strong>References page</strong> when writing in APA style, which is the
                  standard for psychology, sociology, nursing, business, education, and other social
                  sciences. APA is developed by the American Psychological Association and is
                  currently in its 7th edition (published in 2019). APA style emphasizes dates,
                  reflecting the importance of current research in scientific fields.
                </p>
                <p>
                  APA uses author-date parenthetical citations like this: (Smith, 2023, p. 23). The
                  date appears immediately after the author's name in both in-text citations and the
                  References page entries, highlighting the currency of the research.
                </p>

                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Chicago Style: Bibliography
                </h3>
                <p>
                  Use a <strong>Bibliography</strong> when writing in Chicago style, which offers
                  two documentation systems: Notes and Bibliography, and Author-Date. The Notes and
                  Bibliography system is preferred in history, arts, and humanities, while the
                  Author-Date system is used in sciences and social sciences. Chicago style is
                  published by the University of Chicago Press and is currently in its 17th edition.
                </p>
                <p>
                  In the Notes and Bibliography system, sources are cited in footnotes or endnotes,
                  and all consulted sources are listed in the Bibliography at the end. The
                  Author-Date system uses parenthetical citations and includes only cited sources in
                  a Reference List.
                </p>

                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Harvard Style: Reference List
                </h3>
                <p>
                  Use a <strong>Reference List</strong> when writing in Harvard style, which is
                  widely used in universities in the United Kingdom, Australia, and other countries.
                  Harvard style uses author-date parenthetical citations similar to APA but has
                  different formatting rules for reference list entries. Note that Harvard style
                  sometimes refers to its source list as a bibliography, but technically it is a
                  reference list because it includes only cited sources.
                </p>

                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Other Citation Styles
                </h3>
                <p>
                  Other citation styles use different terminology: <strong>Turabian style</strong>
                  (a simplified version of Chicago) uses a Bibliography; <strong>IEEE style</strong>
                  (engineering and computer science) uses numbered references;{" "}
                  <strong>CSE style</strong> (sciences) uses Cited References; and{" "}
                  <strong>Bluebook</strong>
                  (legal citations) uses a Table of Authorities.
                </p>
              </div>
            ),
          },
          {
            id: "how-to-create",
            heading: "How to Create Each Type: Step-by-Step Formatting Guide",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  Follow these step-by-step instructions to properly format your works cited page,
                  references list, or bibliography according to the major citation styles.
                </p>

                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Works Cited Page Format (MLA)
                </h3>
                <p>To format a Works Cited page in MLA 9th Edition:</p>
                <ul className="list-decimal pl-5 space-y-2">
                  <li>Start a new page at the end of your paper</li>
                  <li>
                    Center the title &quot;Works Cited&quot; (not bold, not italicized, not in
                    quotation marks)
                  </li>
                  <li>Double-space the entire list (both between and within entries)</li>
                  <li>
                    Use a hanging indent for each entry (first line flush left, subsequent lines
                    indented 0.5 inches)
                  </li>
                  <li>Alphabetize entries by the first word (usually the author's last name)</li>
                  <li>Include the author's full name: Last Name, First Name</li>
                  <li>Use title case for source titles (capitalize all major words)</li>
                  <li>Include page numbers for print sources (pp. XX-XX)</li>
                  <li>
                    For online sources, include the URL (without http://) and a DOI if available
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  References Page Format (APA)
                </h3>
                <p>To format a References page in APA 7th Edition:</p>
                <ul className="list-decimal pl-5 space-y-2">
                  <li>Start a new page at the end of your paper</li>
                  <li>
                    Center the title &quot;References&quot; in bold (not italicized, not in
                    quotation marks)
                  </li>
                  <li>Double-space the entire list</li>
                  <li>Use a hanging indent for each entry</li>
                  <li>Alphabetize entries by the first author's surname</li>
                  <li>Include author's name as: Last Name, First Initial. Middle Initial.</li>
                  <li>
                    Use sentence case for article titles (capitalize only the first word, proper
                    nouns, and first word after a colon)
                  </li>
                  <li>Use italics for journal and book titles</li>
                  <li>Include DOIs as URLs in the format https://doi.org/xxxxx</li>
                  <li>
                    List up to 20 authors (use &quot;...&quot; before the last author for more than
                    20)
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Bibliography Format (Chicago)
                </h3>
                <p>To format a Bibliography in Chicago style (Notes and Bibliography system):</p>
                <ul className="list-decimal pl-5 space-y-2">
                  <li>Start a new page at the end of your paper</li>
                  <li>Center the title &quot;Bibliography&quot; at the top</li>
                  <li>Single-space within entries, double-space between entries</li>
                  <li>Use a hanging indent for each entry</li>
                  <li>Alphabetize entries by the author's last name</li>
                  <li>Include the author's full name: Last Name, First Name</li>
                  <li>Use italics for book and periodical titles</li>
                  <li>Use quotation marks for article and chapter titles</li>
                  <li>Include publication information: City: Publisher, Year</li>
                  <li>For articles, include volume and issue numbers</li>
                </ul>

                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Universal Formatting Rules
                </h3>
                <p>Regardless of citation style, these rules apply to all source lists:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Use the same font and margins as the rest of your paper</li>
                  <li>Begin on a separate page at the end of your document</li>
                  <li>Apply a hanging indent (first line extended, subsequent lines indented)</li>
                  <li>Alphabetize by the first element of each citation</li>
                  <li>
                    Include all sources cited in the text (and optionally, consulted sources for
                    bibliographies)
                  </li>
                  <li>Verify that every in-text citation has a corresponding entry</li>
                  <li>
                    Check that every entry is actually cited in your text (for Works Cited and
                    References)
                  </li>
                </ul>
              </div>
            ),
          },
          {
            id: "examples",
            heading: "Side-by-Side Examples: Same Source, Different Formats",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  Below are examples of how the same source would appear in MLA Works Cited, APA
                  References, and Chicago Bibliography formats. This comparison helps illustrate the
                  key differences in formatting.
                </p>

                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Example 1: Book</h3>
                <div className="bg-slate-50 p-4 rounded space-y-3">
                  <div>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded mb-2">
                      MLA Works Cited
                    </span>
                    <p className="pl-3 border-l-2 border-blue-300 text-sm">
                      Smith, John. <em>The Art of Academic Writing</em>. Oxford University Press,
                      2022.
                    </p>
                  </div>
                  <div>
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded mb-2">
                      APA References
                    </span>
                    <p className="pl-3 border-l-2 border-green-300 text-sm">
                      Smith, J. (2022). <em>The art of academic writing</em>. Oxford University
                      Press.
                    </p>
                  </div>
                  <div>
                    <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded mb-2">
                      Chicago Bibliography
                    </span>
                    <p className="pl-3 border-l-2 border-amber-300 text-sm">
                      Smith, John. <em>The Art of Academic Writing</em>. New York: Oxford University
                      Press, 2022.
                    </p>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Example 2: Journal Article
                </h3>
                <div className="bg-slate-50 p-4 rounded space-y-3">
                  <div>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded mb-2">
                      MLA Works Cited
                    </span>
                    <p className="pl-3 border-l-2 border-blue-300 text-sm">
                      Johnson, Mary, and Robert Lee. &quot;The Future of Citation Practices.&quot;{" "}
                      <em>Journal of Academic Research</em>, vol. 45, no. 3, 2023, pp. 123-145.
                    </p>
                  </div>
                  <div>
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded mb-2">
                      APA References
                    </span>
                    <p className="pl-3 border-l-2 border-green-300 text-sm">
                      Johnson, M., & Lee, R. (2023). The future of citation practices.{" "}
                      <em>Journal of Academic Research</em>, <em>45</em>(3), 123-145.
                      https://doi.org/10.xxxx/jar.2023.003
                    </p>
                  </div>
                  <div>
                    <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded mb-2">
                      Chicago Bibliography
                    </span>
                    <p className="pl-3 border-l-2 border-amber-300 text-sm">
                      Johnson, Mary, and Robert Lee. &quot;The Future of Citation Practices.&quot;{" "}
                      <em>Journal of Academic Research</em> 45, no. 3 (2023): 123-45.
                    </p>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
                  Example 3: Website
                </h3>
                <div className="bg-slate-50 p-4 rounded space-y-3">
                  <div>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded mb-2">
                      MLA Works Cited
                    </span>
                    <p className="pl-3 border-l-2 border-blue-300 text-sm">
                      Brown, Sarah. &quot;Understanding Academic Integrity.&quot;{" "}
                      <em>Educational Resources</em>, 12 May 2024,
                      www.educationalresources.org/academic-integrity. Accessed 15 June 2024.
                    </p>
                  </div>
                  <div>
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded mb-2">
                      APA References
                    </span>
                    <p className="pl-3 border-l-2 border-green-300 text-sm">
                      Brown, S. (2024, May 12). <em>Understanding academic integrity</em>.
                      Educational Resources. https://www.educationalresources.org/academic-integrity
                    </p>
                  </div>
                  <div>
                    <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded mb-2">
                      Chicago Bibliography
                    </span>
                    <p className="pl-3 border-l-2 border-amber-300 text-sm">
                      Brown, Sarah. &quot;Understanding Academic Integrity.&quot;{" "}
                      <em>Educational Resources</em>. Accessed June 15, 2024.
                      https://www.educationalresources.org/academic-integrity.
                    </p>
                  </div>
                </div>
              </div>
            ),
          },
          {
            id: "faq",
            heading: "Frequently Asked Questions: Works Cited vs Bibliography",
            body: (
              <div className="space-y-4 text-slate-700">
                <div className="border-b border-slate-200 pb-4">
                  <h4 className="font-semibold text-slate-900 mb-2">
                    Can I use &quot;Works Cited&quot; and &quot;Bibliography&quot; interchangeably?
                  </h4>
                  <p className="text-slate-700">
                    No, these terms have distinct meanings in academic writing. &quot;Works
                    Cited&quot; specifically refers to the MLA-style list of cited sources only. A
                    bibliography includes all sources consulted during research. Using these terms
                    incorrectly may result in point deductions on your assignment. Always follow
                    your instructor's guidelines and the citation style required for your paper.
                  </p>
                </div>

                <div className="border-b border-slate-200 pb-4">
                  <h4 className="font-semibold text-slate-900 mb-2">
                    Do I need to include sources I read but didn't cite?
                  </h4>
                  <p className="text-slate-700">
                    It depends on the citation style. For MLA Works Cited and APA References, you
                    only include sources that you actually cited in your paper. For Chicago style
                    Bibliography and other similar formats, you may include sources you consulted
                    even if you did not cite them. However, always check your assignment
                    requirements first; some instructors may want a comprehensive bibliography even
                    when using MLA or APA.
                  </p>
                </div>

                <div className="border-b border-slate-200 pb-4">
                  <h4 className="font-semibold text-slate-900 mb-2">
                    What is the difference between a Reference List and a Bibliography?
                  </h4>
                  <p className="text-slate-700">
                    The main difference is scope. A Reference List (used in APA and Harvard styles)
                    includes only the sources you cited in your paper. A Bibliography (used in
                    Chicago style) includes all sources you consulted during your research,
                    regardless of whether they were cited. Another key difference is formatting:
                    Reference Lists and Bibliographies have different rules for how to format author
                    names, dates, titles, and publication information.
                  </p>
                </div>

                <div className="border-b border-slate-200 pb-4">
                  <h4 className="font-semibold text-slate-900 mb-2">
                    How do I know which citation style to use?
                  </h4>
                  <p className="text-slate-700">
                    Your instructor or assignment prompt should specify the required citation style.
                    If not specified, use the style standard for your discipline: MLA for English
                    and humanities, APA for social sciences and sciences, Chicago for history, IEEE
                    for engineering, etc. When in doubt, ask your instructor for clarification.
                    Using the wrong citation style can significantly impact your grade.
                  </p>
                </div>

                <div className="pb-2">
                  <h4 className="font-semibold text-slate-900 mb-2">
                    What is an annotated bibliography?
                  </h4>
                  <p className="text-slate-700">
                    An annotated bibliography includes a brief summary and evaluation (the
                    annotation) after each citation. Annotations are typically 150-250 words
                    describing the source's content, relevance, credibility, and relationship to
                    other sources on the topic. Annotated bibliographies help researchers
                    demonstrate their understanding of available literature and are often assigned
                    as preliminary research projects. See our comprehensive{" "}
                    <a
                      href="/guides/annotated-bibliography"
                      className="text-blue-700 hover:underline"
                    >
                      Annotated Bibliography Guide
                    </a>{" "}
                    for detailed instructions.
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
