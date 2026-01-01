const ITEMS: Array<{ q: string; a: string }> = [
  {
    q: "Is CiteGenerator really free?",
    a: "Yes. CiteGenerator is free to use with no sign-up required. We may show minimal sponsored recommendations.",
  },
  {
    q: "How accurate are the citations?",
    a: "We format citations based on common rules for APA 7, MLA 9, Chicago 17, and Harvard. Always review citations against your instructor's specific requirements.",
  },
  {
    q: "What if my source has no author or date?",
    a: "We follow common guidance: if no author, start with the title; if no date, use n.d. (APA) or omit where appropriate (MLA).",
  },
  {
    q: "Do you store my sources?",
    a: "We do not require accounts. Your recent citations may be saved locally in your browser for convenience.",
  },
  {
    q: "What citation styles do you support?",
    a: "We support APA 7th edition, MLA 9th edition, Chicago 17th edition (notes-bibliography), and Harvard referencing style.",
  },
  {
    q: "Can I cite YouTube videos and podcasts?",
    a: "Yes! We support citing websites, books, journal articles, YouTube videos, podcasts, PDFs, and many other source types.",
  },
  {
    q: "How do I export my bibliography?",
    a: "Use the 'My Bibliography' button to view all saved citations. You can copy them as formatted text or export to BibTeX format.",
  },
  {
    q: "What's the difference between APA and MLA?",
    a: "APA (American Psychological Association) is common in sciences and social sciences, emphasizing author-date format. MLA (Modern Language Association) is used in humanities, focusing on author-page format.",
  },
];

export function FAQ() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">Frequently asked questions</h2>
      <div className="mt-6 space-y-4">
        {ITEMS.map((x) => (
          <details key={x.q} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <summary className="cursor-pointer select-none font-semibold text-slate-900">
              {x.q}
            </summary>
            <p className="mt-2 text-slate-700 leading-relaxed">{x.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export function getFaqItemsForSchema() {
  return ITEMS.map((i) => ({ question: i.q, answer: i.a }));
}
