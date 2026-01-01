"use client";

import Link from "next/link";
import { Container } from "./Container";
import { useState, useEffect } from "react";
import { BibliographyBuilder } from "@/components/citation/BibliographyBuilder";
import { useBibliography } from "@/lib/bibliography-state";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

function BibliographyButton() {
  const [isOpen, setIsOpen] = useState(false);
  const bibliography = useBibliography();

  useEffect(() => {
    const handleOpenBibliography = () => setIsOpen(true);
    window.addEventListener("open-bibliography", handleOpenBibliography);
    return () => window.removeEventListener("open-bibliography", handleOpenBibliography);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        My Bibliography
        {bibliography.stats.count > 0 && (
          <Badge variant="primary" size="sm" className="ml-1">
            {bibliography.stats.count}
          </Badge>
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-4xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">My Bibliography</h2>
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </div>
            <BibliographyBuilder
              items={bibliography.items}
              onRemove={bibliography.remove}
              onReorder={bibliography.reorder}
              onSort={bibliography.sortAlphabetically}
              style="apa"
            />
          </div>
        </div>
      )}
    </>
  );
}

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <Container className="py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-extrabold">
            C
          </span>
          <span className="font-extrabold text-slate-900">CiteGenerator</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-semibold text-slate-700">
          <Link className="hover:text-slate-900 transition-colors" href="/apa-citation-generator">
            APA
          </Link>
          <Link className="hover:text-slate-900 transition-colors" href="/mla-citation-generator">
            MLA
          </Link>
          <Link
            className="hover:text-slate-900 transition-colors"
            href="/chicago-citation-generator"
          >
            Chicago
          </Link>
          <Link
            className="hover:text-slate-900 transition-colors"
            href="/harvard-citation-generator"
          >
            Harvard
          </Link>
          <span className="hidden sm:inline text-slate-300">|</span>
          <BibliographyButton />
          <Link className="hover:text-slate-900 transition-colors" href="/guides/apa-format">
            Guides
          </Link>
          <Link className="hover:text-slate-900 transition-colors" href="/faq">
            FAQ
          </Link>
        </nav>
      </Container>
    </header>
  );
}
