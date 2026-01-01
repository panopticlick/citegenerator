import type { CitationStyle } from "@/lib/api";
import { Container } from "@/components/layout/Container";
import { CitationTool } from "@/components/features/CitationTool";
import Link from "next/link";
import { CITE_SOURCES, citePath } from "@/lib/pseo/cite-pages";

export function StyleLandingPage({
  style,
  title,
  subtitle,
  quickFormat,
}: {
  style: CitationStyle;
  title: string;
  subtitle: string;
  quickFormat: { heading: string; bullets: string[] };
}) {
  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">{title}</h1>
      <p className="mt-3 text-lg text-slate-600">{subtitle}</p>

      <div className="mt-8">
        <h2 className="sr-only">Generate your citation</h2>
        <CitationTool defaultStyle={style} />
      </div>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-slate-900">{quickFormat.heading}</h2>
        <ul className="mt-4 list-disc pl-5 space-y-2 text-slate-700">
          {quickFormat.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-slate-900">Explore source types</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {CITE_SOURCES.map((source) => (
            <Link
              key={source}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-slate-50"
              href={citePath(style, source)}
            >
              {source.replace(/-/g, " ")}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-slate-900">More guides</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-slate-50"
            href="/how-to-cite-website"
          >
            How to cite a website
          </Link>
          <Link
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-slate-50"
            href="/how-to-cite-book"
          >
            How to cite a book
          </Link>
          <Link
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-slate-50"
            href="/how-to-cite-journal-article"
          >
            How to cite a journal article
          </Link>
        </div>
      </section>
    </Container>
  );
}
