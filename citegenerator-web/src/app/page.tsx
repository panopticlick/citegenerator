"use client";

import { CitationTool } from "@/components/features/CitationTool";
import { FAQ } from "@/components/content/FAQ";
import { BibliographySidebar } from "@/components/content/BibliographySidebar";
import { WebApplicationJsonLd } from "@/components/seo/WebApplicationJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { Container } from "@/components/layout/Container";
import Link from "next/link";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citegenerator.org";

const breadcrumbItems = [{ name: "Home", url: siteUrl }];

export default function HomePage() {
  return (
    <>
      <WebApplicationJsonLd />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <Container className="py-10 sm:py-14">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              Free Citation Generator (2026)
            </h1>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              Create accurate citations in APA, MLA, Chicago, and Harvard instantly. Paste a URL and
              we automatically extract the author, date, and title — no sign-up required. Try our
              free citation generator now!
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-green-600" aria-hidden="true" />
                No account required
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-blue-600" aria-hidden="true" />
                Fast + privacy-friendly
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-yellow-600" aria-hidden="true" />
                Copy in one click
              </span>
            </div>

            <div className="mt-8">
              <h2 className="sr-only">Generate your citation</h2>
              <CitationTool />
            </div>
          </div>

          <aside className="lg:col-span-5 space-y-6">
            <BibliographySidebar />

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Popular Citation Tools</h2>
              <p className="mt-2 text-sm text-slate-600">
                Looking for a specific style? These pages include examples and tips.
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3">
                <Link
                  className="rounded-xl border border-slate-200 px-4 py-3 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                  href="/apa-citation-generator"
                >
                  <div className="font-semibold text-slate-900">APA Citation Generator</div>
                  <div className="text-sm text-slate-600">
                    APA 7th edition for websites, books, articles.
                  </div>
                </Link>
                <Link
                  className="rounded-xl border border-slate-200 px-4 py-3 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                  href="/mla-citation-generator"
                >
                  <div className="font-semibold text-slate-900">MLA Citation Generator</div>
                  <div className="text-sm text-slate-600">
                    MLA 9th edition works cited citations.
                  </div>
                </Link>
                <Link
                  className="rounded-xl border border-slate-200 px-4 py-3 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                  href="/chicago-citation-generator"
                >
                  <div className="font-semibold text-slate-900">Chicago Citation Generator</div>
                  <div className="text-sm text-slate-600">
                    Chicago 17th notes & bibliography format.
                  </div>
                </Link>
                <Link
                  className="rounded-xl border border-slate-200 px-4 py-3 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                  href="/harvard-citation-generator"
                >
                  <div className="font-semibold text-slate-900">Harvard Citation Generator</div>
                  <div className="text-sm text-slate-600">
                    Common UK university referencing style.
                  </div>
                </Link>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-14 sm:mt-16">
          <h2 className="text-2xl font-bold text-slate-900">How it works</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "1. Enter your source",
                body: "Paste a URL or enter citation details manually.",
              },
              {
                title: "2. Choose your style",
                body: "Select APA, MLA, Chicago, or Harvard. We remember your preference.",
              },
              {
                title: "3. Build your bibliography",
                body: "Add citations to your bibliography and export when ready.",
              },
            ].map((x) => (
              <div
                key={x.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-slate-900">{x.title}</h3>
                <p className="mt-2 text-slate-600">{x.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 sm:mt-16">
          <h2 className="text-2xl font-bold text-slate-900">Cite common sources</h2>
          <p className="mt-3 text-slate-600">
            Need a citation for a specific source type? Start here (with your style pre-selected).
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { href: "/cite/apa/website", label: "APA website citation" },
              { href: "/cite/mla/journal-article", label: "MLA journal article citation" },
              { href: "/cite/chicago/book", label: "Chicago book citation" },
              { href: "/cite/apa/youtube-video", label: "APA YouTube citation" },
              { href: "/cite/mla/podcast", label: "MLA podcast citation" },
              { href: "/cite/harvard/pdf", label: "Harvard PDF citation" },
            ].map((x) => (
              <Link
                key={x.href}
                href={x.href}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                {x.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14 sm:mt-16">
          <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <FAQ />
        </section>
      </Container>
    </>
  );
}
