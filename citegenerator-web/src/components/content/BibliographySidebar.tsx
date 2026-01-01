"use client";

import { useBibliography } from "@/lib/bibliography-state";

export function BibliographySidebar() {
  const bibliography = useBibliography();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">My Bibliography</h2>
      <p className="mt-2 text-sm text-slate-600">
        {bibliography.stats.count === 0
          ? "Save citations to build your bibliography."
          : `${bibliography.stats.count} citation${bibliography.stats.count !== 1 ? "s" : ""} saved.`}
      </p>

      {bibliography.stats.count > 0 ? (
        <div className="mt-4">
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {bibliography.items.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm"
              >
                <p className="font-medium text-slate-900 truncate">{item.metadata.title}</p>
                <p className="text-xs text-slate-500 mt-1">{item.style.toUpperCase()}</p>
              </div>
            ))}
            {bibliography.items.length > 5 && (
              <p className="text-xs text-slate-500 text-center">
                +{bibliography.items.length - 5} more citations
              </p>
            )}
          </div>
          <button
            onClick={() => {
              const event = new CustomEvent("open-bibliography");
              window.dispatchEvent(event);
            }}
            className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
          >
            View All Citations
          </button>
        </div>
      ) : (
        <div className="mt-4 text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <svg
            className="w-10 h-10 mx-auto text-slate-300 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <p className="text-sm text-slate-600">Generate citations to get started</p>
        </div>
      )}
    </div>
  );
}
