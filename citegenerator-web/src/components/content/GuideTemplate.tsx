import { Container } from "@/components/layout/Container";
import { CitationTool } from "@/components/features/CitationTool";
import type { CitationStyle } from "@/lib/api";

export function GuideTemplate({
  title,
  updated,
  intro,
  sections,
  showTool = false,
  toolDefaultStyle,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: Array<{ id: string; heading: string; body: React.ReactNode }>;
  showTool?: boolean;
  toolDefaultStyle?: CitationStyle;
}) {
  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: {updated}</p>
      <p className="mt-4 text-lg text-slate-600 leading-relaxed">{intro}</p>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sticky top-6">
            <div className="text-sm font-bold text-slate-900">On this page</div>
            <ul className="mt-3 space-y-2 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a className="text-blue-700 hover:text-blue-800 font-semibold" href={`#${s.id}`}>
                    {s.heading}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <article className="lg:col-span-8 space-y-10">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900">{s.heading}</h2>
              <div className="mt-4">{s.body}</div>
            </section>
          ))}

          {showTool ? (
            <section id="generate" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900">Generate your citation</h2>
              <p className="mt-3 text-slate-600">
                Paste your URL below and we’ll generate citations in multiple styles.
              </p>
              <div className="mt-6">
                <CitationTool defaultStyle={toolDefaultStyle} />
              </div>
            </section>
          ) : null}
        </article>
      </div>
    </Container>
  );
}
