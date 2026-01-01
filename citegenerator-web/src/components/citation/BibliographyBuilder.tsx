"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useClipboard } from "@/hooks/useClipboard";
import { useToast } from "@/components/ui/Toast";
import type { BibliographyItem } from "@/lib/bibliography-state";
import type { CitationStyle } from "@/lib/api";

interface BibliographyBuilderProps {
  items: BibliographyItem[];
  onRemove: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onSort: () => void;
  style: CitationStyle;
}

export function BibliographyBuilder({
  items,
  onRemove,
  onReorder,
  onSort,
  style,
}: BibliographyBuilderProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const { copy } = useClipboard(2000);
  const { addToast } = useToast();

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (dragIndex !== null && dragIndex !== index) {
      onReorder(dragIndex, index);
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const copyAll = async () => {
    const allText = items.map((item) => `${item.citation.text}`).join("\n\n");
    try {
      await copy(allText);
      addToast({ type: "success", message: "All citations copied!" });
    } catch {
      addToast({ type: "error", message: "Copy failed. Please try again." });
    }
  };

  const exportRTF = () => {
    const rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}
\\f0\\fs24
${items.map((item) => item.citation.text.replace(/[\u007F-\uFFFF]/g, "")).join("\\par\\par")}
}`;
    const blob = new Blob([rtfContent], { type: "application/rtf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bibliography-${style}-${new Date().toISOString().slice(0, 10)}.rtf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast({ type: "success", message: "RTF file downloaded!" });
  };

  const exportText = () => {
    const text = items.map((item) => item.citation.text).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bibliography-${style}-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast({ type: "success", message: "Text file downloaded!" });
  };

  if (items.length === 0) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="text-center py-8">
          <svg
            className="w-16 h-16 mx-auto text-slate-300 mb-4"
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
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No citations saved</h3>
          <p className="text-sm text-slate-500">
            Generate citations and add them to your bibliography to see them here.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="none">
      <CardHeader className="p-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>My Bibliography</CardTitle>
            <p className="mt-1 text-sm text-slate-600">
              {items.length} citation{items.length !== 1 ? "s" : ""} saved
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={onSort}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
              Sort A-Z
            </Button>
            <Button variant="secondary" size="sm" onClick={copyAll}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy All
            </Button>
            <Button variant="secondary" size="sm" onClick={exportText}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export .txt
            </Button>
            <Button variant="secondary" size="sm" onClick={exportRTF}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export RTF
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={() => handleDrop(index)}
              onDragEnd={handleDragEnd}
              className={`group rounded-xl border-2 transition-all ${
                dragOverIndex === index
                  ? "border-blue-400 bg-blue-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              } ${dragIndex === index ? "opacity-50" : ""}`}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className="mt-1 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600"
                    aria-label="Drag to reorder"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8h16M4 16h16"
                      />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="primary" size="sm">
                        {item.style.toUpperCase()}
                      </Badge>
                      {item.metadata.publishedDate && (
                        <span className="text-xs text-slate-500">
                          {item.metadata.publishedDate}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-slate-800 font-serif leading-relaxed">
                      {item.citation.text}
                    </p>

                    <p className="mt-2 text-xs text-slate-500 truncate">{item.metadata.title}</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        await copy(item.citation.text);
                        addToast({ type: "success", message: "Copied!" });
                      }}
                      aria-label="Copy citation"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(item.id)}
                      aria-label="Remove from bibliography"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
