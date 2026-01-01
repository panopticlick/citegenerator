import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { GuideTemplate } from "@/components/content/GuideTemplate";
import { HowToJsonLd } from "@/components/seo/HowToJsonLd";
import { BreadcrumbJsonLd, type BreadcrumbItem } from "@/components/seo/BreadcrumbJsonLd";
import type { CitationStyle } from "@/lib/api";
import {
  CITE_PAGES,
  CITE_SOURCES,
  CITE_STYLES,
  citePath,
  getCitePage,
  type CiteSource,
} from "@/lib/pseo/cite-pages";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citegenerator.org";

const STYLES: CitationStyle[] = CITE_STYLES;
const SOURCES: CiteSource[] = [...CITE_SOURCES];

const STYLE_LABELS: Record<CitationStyle, string> = {
  apa: "APA 7th",
  mla: "MLA 9th",
  chicago: "Chicago 17th",
  harvard: "Harvard",
};

const STYLE_LANDING: Record<CitationStyle, string> = {
  apa: "/apa-citation-generator",
  mla: "/mla-citation-generator",
  chicago: "/chicago-citation-generator",
  harvard: "/harvard-citation-generator",
};

const STYLE_GUIDES: Partial<Record<CitationStyle, string>> = {
  apa: "/guides/apa-format",
  mla: "/guides/mla-format",
  chicago: "/guides/chicago-format",
  harvard: "/guides/harvard-format",
};

const HOW_TO_PAGES: Partial<Record<CiteSource, string>> = {
  website: "/how-to-cite-website",
  book: "/how-to-cite-book",
  "journal-article": "/how-to-cite-journal-article",
  "youtube-video": "/how-to-cite-youtube-video",
  podcast: "/how-to-cite-podcast",
  pdf: "/how-to-cite-pdf",
};

const SOURCE_GROUPS: Array<{ label: string; sources: CiteSource[] }> = [
  { label: "Web sources", sources: ["website", "blog-post", "newspaper-article"] },
  {
    label: "Academic sources",
    sources: ["journal-article", "conference-paper", "thesis", "dataset"],
  },
  { label: "Documents", sources: ["pdf", "report", "government-document"] },
  { label: "Media", sources: ["youtube-video", "podcast"] },
];

function prettySource(source: string) {
  return source.replace(/-/g, " ");
}

function isCitationStyle(value: string): value is CitationStyle {
  return (STYLES as string[]).includes(value);
}

function isCiteSource(value: string): value is CiteSource {
  return (SOURCES as string[]).includes(value);
}

export function generateStaticParams() {
  return CITE_PAGES.map((p) => ({ style: p.style, source: p.source }));
}

export function generateMetadata({
  params,
}: {
  params: { style: string; source: string };
}): Metadata {
  if (!isCitationStyle(params.style) || !isCiteSource(params.source)) return {};
  const page = getCitePage(params.style, params.source);
  if (!page) return {};
  return {
    title: page.title + " | 2026",
    description: page.description,
    alternates: { canonical: citePath(page.style, page.source) },
    openGraph: {
      title: page.title + " | 2026",
      description: page.description,
      url: citePath(page.style, page.source),
    },
  };
}

export default function CitePage({ params }: { params: { style: string; source: string } }) {
  if (!isCitationStyle(params.style) || !isCiteSource(params.source)) return notFound();

  const page = getCitePage(params.style, params.source);
  if (!page) return notFound();

  const relatedSameStyle = SOURCES.filter((s) => s !== page.source);
  const relatedSameSource = STYLES.filter((s) => s !== page.style);

  const group = SOURCE_GROUPS.find((g) => g.sources.includes(page.source));
  const similarSources = group ? group.sources.filter((s) => s !== page.source) : [];

  const styleLanding = STYLE_LANDING[page.style];
  const styleGuide = STYLE_GUIDES[page.style];
  const howTo = HOW_TO_PAGES[page.source];

  const breadcrumbItems: BreadcrumbItem[] = [
    { name: "Home", url: siteUrl },
    { name: `${page.style.toUpperCase()} Citation Generator`, url: `${siteUrl}${styleLanding}` },
    {
      name: `${STYLE_LABELS[page.style]} ${prettySource(page.source)}`,
      url: `${siteUrl}${citePath(page.style, page.source)}`,
    },
  ];

  return (
    <>
      <HowToJsonLd
        name={`How to cite a ${prettySource(page.source)} in ${STYLE_LABELS[page.style]}`}
        steps={page.steps}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <GuideTemplate
        title={page.title}
        updated={page.updated}
        intro={page.intro}
        showTool
        toolDefaultStyle={page.style}
        sections={[
          {
            id: "quick-format",
            heading: "Quick format",
            body: (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-800">
                <div className="text-sm font-semibold text-slate-900">Template</div>
                <div className="mt-2 font-serif">{page.quickFormat}</div>
              </div>
            ),
          },
          {
            id: "what-you-need",
            heading: "What you need",
            body: (
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Author or organization</li>
                <li>Title</li>
                <li>Date (if available)</li>
                <li>Publisher / site name (if applicable)</li>
                <li>URL (clean, without tracking parameters)</li>
                <li>Access date (often required for online sources)</li>
              </ul>
            ),
          },
          {
            id: "steps",
            heading: "Step-by-step",
            body: (
              <ol className="list-decimal pl-5 space-y-2 text-slate-700">
                {page.steps.map((s) => (
                  <li key={s.name}>
                    <strong>{s.name}:</strong> {s.text}
                  </li>
                ))}
              </ol>
            ),
          },
          {
            id: "related",
            heading: "Related pages",
            body: (
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-bold text-slate-900">Start here</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Link
                      href={styleLanding}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      {page.style.toUpperCase()} citation generator
                    </Link>
                    {styleGuide ? (
                      <Link
                        href={styleGuide}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-slate-50"
                      >
                        {page.style.toUpperCase()} guide
                      </Link>
                    ) : null}
                    {howTo ? (
                      <Link
                        href={howTo}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-slate-50"
                      >
                        How to cite a {prettySource(page.source)}
                      </Link>
                    ) : null}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    More in {page.style.toUpperCase()}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {relatedSameStyle.map((src) => (
                      <Link
                        key={src}
                        href={citePath(page.style, src)}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-slate-50"
                      >
                        {prettySource(src)}
                      </Link>
                    ))}
                  </div>
                </div>
                {similarSources.length > 0 ? (
                  <div>
                    <div className="text-sm font-bold text-slate-900">{group?.label}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {similarSources.map((src) => (
                        <Link
                          key={src}
                          href={citePath(page.style, src)}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-slate-50"
                        >
                          {prettySource(src)}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div>
                  <div className="text-sm font-bold text-slate-900">Same source, other styles</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {relatedSameSource.map((st) => (
                      <Link
                        key={st}
                        href={citePath(st, page.source)}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-slate-50"
                      >
                        {st.toUpperCase()}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ),
          },
        ]}
      />
    </>
  );
}
