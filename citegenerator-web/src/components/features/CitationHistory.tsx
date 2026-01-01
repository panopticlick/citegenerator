"use client";

import { useState, useMemo, useRef } from "react";
import type { HistoryItem } from "@/hooks/useHistory";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { useClipboard } from "@/hooks/useClipboard";
import type { CitationStyle } from "@/lib/api";

const styleLabels: Record<CitationStyle, string> = {
  apa: "APA",
  mla: "MLA",
  chicago: "Chicago",
  harvard: "Harvard",
};

interface CitationHistoryProps {
  items: HistoryItem[];
  groupedItems?: Record<string, HistoryItem[]>;
  onRemove: (id: string) => void;
  onClear: () => void;
  onImport?: (json: string) => { success: boolean; count: number };
  onExport?: () => string;
}

export function CitationHistory({
  items,
  groupedItems,
  onRemove,
  onClear,
  onImport,
  onExport,
}: CitationHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [styleFilter, setStyleFilter] = useState<CitationStyle | "all">("all");
  const [showImport, setShowImport] = useState(false);
  const { addToast } = useToast();
  const { copy } = useClipboard(1500);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredItems = useMemo(() => {
    let result = items;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.url.toLowerCase().includes(query) ||
          item.citationText.toLowerCase().includes(query),
      );
    }

    if (styleFilter !== "all") {
      result = result.filter((item) => item.style === styleFilter);
    }

    return result;
  }, [items, searchQuery, styleFilter]);

  const filteredGrouped = useMemo(() => {
    if (!groupedItems) return {};
    const groups: Record<string, HistoryItem[]> = {};
    const filteredIds = new Set(filteredItems.map((i) => i.id));

    Object.entries(groupedItems).forEach(([group, groupItems]) => {
      const matching = groupItems.filter((item) => filteredIds.has(item.id));
      if (matching.length > 0) {
        groups[group] = matching;
      }
    });

    return groups;
  }, [groupedItems, filteredItems]);

  const handleExport = () => {
    if (!onExport) return;
    try {
      const json = onExport();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `citation-history-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast({ type: "success", message: "History exported!" });
    } catch {
      addToast({ type: "error", message: "Export failed" });
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImport) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content !== "string") return;

      const result = onImport(content);
      if (result.success) {
        addToast({ type: "success", message: `Imported ${result.count} citations` });
      } else {
        addToast({ type: "error", message: "Import failed. Check file format." });
      }
      setShowImport(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsText(file);
  };

  if (items.length === 0) {
    return null;
  }

  const hasFilters = searchQuery.trim() || styleFilter !== "all";

  return (
    <Card className="bg-white" padding="lg">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="text-lg font-bold text-slate-900">Recent citations</div>
            <div className="text-sm text-slate-600">
              Saved locally in your browser ({items.length} items)
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full sm:w-48"
              leftAddon={
                <svg
                  className="w-4 h-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
            />
            <select
              value={styleFilter}
              onChange={(e) => setStyleFilter(e.target.value as CitationStyle | "all")}
              className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All styles</option>
              <option value="apa">APA</option>
              <option value="mla">MLA</option>
              <option value="chicago">Chicago</option>
              <option value="harvard">Harvard</option>
            </select>
            {onExport && (
              <Button variant="secondary" size="sm" onClick={handleExport}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Export
              </Button>
            )}
            {onImport && (
              <>
                <Button variant="secondary" size="sm" onClick={() => setShowImport(!showImport)}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Import
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImport}
                />
              </>
            )}
            <Button variant="ghost" size="sm" onClick={onClear}>
              Clear
            </Button>
          </div>
        </div>

        {showImport && onImport && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-sm text-slate-600 mb-2">Import citation history from JSON file</p>
            <Button variant="primary" size="sm" onClick={() => fileInputRef.current?.click()}>
              Choose File
            </Button>
          </div>
        )}

        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-slate-500">No citations match your search.</div>
        ) : groupedItems && Object.keys(filteredGrouped).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(filteredGrouped).map(([dateGroup, groupItems]) => (
              <div key={dateGroup}>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">{dateGroup}</h4>
                <div className="space-y-3">
                  {groupItems.map((i) => (
                    <div key={i.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-slate-900 truncate">
                              {i.title}
                            </span>
                            <Badge variant="default" size="sm">
                              {styleLabels[i.style] || i.style.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="text-xs text-slate-600 break-all mb-2">{i.url}</div>
                          <div className="text-xs text-slate-700 italic font-serif truncate">
                            {i.citationText}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={async () => {
                            await copy(i.citationText);
                            addToast({ type: "success", message: "Copied!" });
                          }}
                        >
                          Copy
                        </Button>
                        {i.citationBibtex && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={async () => {
                              await copy(i.citationBibtex || "");
                              addToast({ type: "success", message: "Copied BibTeX!" });
                            }}
                          >
                            Copy BibTeX
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => onRemove(i.id)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((i) => (
              <div key={i.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">{i.title}</div>
                <div className="mt-1 text-xs text-slate-600 break-all">{i.url}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={async () => {
                      await copy(i.citationText);
                      addToast({ type: "success", message: "Copied!" });
                    }}
                  >
                    Copy
                  </Button>
                  {i.citationBibtex ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={async () => {
                        await copy(i.citationBibtex || "");
                        addToast({ type: "success", message: "Copied BibTeX!" });
                      }}
                    >
                      Copy BibTeX
                    </Button>
                  ) : null}
                  <Button size="sm" variant="ghost" onClick={() => onRemove(i.id)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {hasFilters && (
          <div className="text-xs text-slate-500">
            Showing {filteredItems.length} of {items.length} citations
          </div>
        )}
      </div>
    </Card>
  );
}
