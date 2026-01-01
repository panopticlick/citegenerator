"use client";

import { useMemo, useState } from "react";
import type { CitationStyle, FormattedCitation, MetadataResult } from "@/lib/api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useClipboard } from "@/hooks/useClipboard";
import { useToast } from "@/components/ui/Toast";
import { trackEvent } from "@/lib/api";

const formatLabels: Record<CitationStyle, string> = {
  apa: "APA 7th",
  mla: "MLA 9th",
  chicago: "Chicago 17th",
  harvard: "Harvard",
};

function generateInTextCitation(metadata: MetadataResult, style: CitationStyle): string {
  const authors = metadata.authors;
  const year = metadata.publishedDate?.match(/\d{4}/)?.[0] || "n.d.";

  if (authors.length === 0) {
    return style === "mla"
      ? `("${metadata.title.split(" ").slice(0, 3).join(" ")}...")`
      : `("${metadata.title}", ${year})`;
  }

  if (authors.length === 1) {
    const lastName =
      authors[0].lastName || authors[0].fullName.split(" ").pop() || authors[0].fullName;
    return style === "mla" ? `(${lastName})` : `(${lastName}, ${year})`;
  }

  if (authors.length === 2) {
    const lastName1 =
      authors[0].lastName || authors[0].fullName.split(" ").pop() || authors[0].fullName;
    const lastName2 =
      authors[1].lastName || authors[1].fullName.split(" ").pop() || authors[1].fullName;
    return style === "mla"
      ? `(${lastName1} and ${lastName2})`
      : `(${lastName1} & ${lastName2}, ${year})`;
  }

  const lastName =
    authors[0].lastName || authors[0].fullName.split(" ").pop() || authors[0].fullName;
  return style === "mla" ? `(${lastName} et al.)` : `(${lastName} et al., ${year})`;
}

function generateRIS(metadata: MetadataResult, style: CitationStyle): string {
  const typeMap: Record<CitationStyle, string> = {
    apa: "ELEC",
    mla: "ELEC",
    chicago: "ELEC",
    harvard: "ELEC",
  };
  const authors = metadata.authors.map((a) => `AU  - ${a.fullName}`).join("\n");
  const year = metadata.publishedDate?.match(/\d{4}/)?.[0] || "";

  return [
    `TY  - ${typeMap[style]}`,
    `TI  - ${metadata.title}`,
    authors,
    metadata.siteName ? `T2  - ${metadata.siteName}` : "",
    metadata.publisher ? `PB  - ${metadata.publisher}` : "",
    year ? `PY  - ${year}` : "",
    `UR  - ${metadata.url}`,
    `Y2  - ${metadata.accessDate}`,
    `ER  -`,
  ]
    .filter(Boolean)
    .join("\n");
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function CitationResult({
  citation,
  initialStyle,
  onCiteAnother,
  onRequestStyle,
  onAddToBibliography,
  onEditMetadata,
}: {
  citation: {
    metadata: MetadataResult;
    citations: Partial<Record<CitationStyle, FormattedCitation>>;
  };
  initialStyle: CitationStyle;
  onCiteAnother: () => void;
  onRequestStyle?: (style: CitationStyle) => Promise<void>;
  onAddToBibliography?: () => void;
  onEditMetadata?: () => void;
}) {
  const [active, setActive] = useState<CitationStyle>(initialStyle);
  const [loadingStyle, setLoadingStyle] = useState<CitationStyle | null>(null);
  const [showInText, setShowInText] = useState(false);
  const { copied, copy } = useClipboard(2000);
  const { addToast } = useToast();

  const current = citation.citations[active];
  const author = citation.metadata.authors?.[0]?.fullName;
  const inTextCitation = useMemo(
    () => generateInTextCitation(citation.metadata, active),
    [citation.metadata, active],
  );
  const bibtex = useMemo(() => citation.citations[active]?.bibtex, [active, citation.citations]);
  const ris = useMemo(() => generateRIS(citation.metadata, active), [citation.metadata, active]);

  const doCopy = async (text: string, label?: string) => {
    try {
      await copy(text);
      addToast({ type: "success", message: label ? `${label} copied!` : "Copied to clipboard!" });
      trackEvent("copy_citation", { style: active });
    } catch {
      addToast({ type: "error", message: "Copy failed. Please select and copy manually." });
    }
  };

  const selectStyle = async (style: CitationStyle) => {
    setActive(style);
    trackEvent("switch_style", { style });

    if (citation.citations[style] || !onRequestStyle) return;

    try {
      setLoadingStyle(style);
      await onRequestStyle(style);
    } catch (err) {
      addToast({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to load citation style",
      });
    } finally {
      setLoadingStyle((prev) => (prev === style ? null : prev));
    }
  };

  const handleExportRTF = () => {
    if (!current) return;
    const rtfContent = `{|\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}\\f0\\fs24 ${current.text.replace(/[\u007F-\uFFFF]/g, "")}}`;
    downloadFile(rtfContent, `citation-${active}.rtf`, "application/rtf");
    addToast({ type: "success", message: "RTF file downloaded!" });
    trackEvent("export_rtf", { style: active });
  };

  const handleExportBibTeX = () => {
    if (!bibtex) return;
    downloadFile(bibtex, `citation-${active}.bib`, "application/x-bibtex");
    addToast({ type: "success", message: "BibTeX file downloaded!" });
    trackEvent("export_bibtex", { style: active });
  };

  const handleExportRIS = () => {
    downloadFile(ris, `citation-${active}.ris`, "application/x-research-info-systems");
    addToast({ type: "success", message: "RIS file downloaded!" });
    trackEvent("export_ris", { style: active });
  };

  return (
    <Card variant="elevated" padding="none" className="overflow-hidden">
      <div className="flex border-b border-slate-200" role="tablist" aria-label="Citation styles">
        {(Object.keys(formatLabels) as CitationStyle[]).map((style) => (
          <button
            key={style}
            type="button"
            className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
              active === style
                ? "bg-white text-slate-900"
                : "bg-slate-50 text-slate-600 hover:text-slate-900"
            }`}
            role="tab"
            aria-selected={active === style}
            onClick={() => void selectStyle(style)}
          >
            {formatLabels[style]}
          </button>
        ))}
      </div>

      <CardHeader className="p-5">
        <CardTitle>Your citation</CardTitle>
        <div className="mt-2 text-xs text-slate-500 flex flex-wrap items-center gap-2">
          <span className="truncate">{citation.metadata.title}</span>
          {author ? (
            <>
              <span aria-hidden="true">•</span>
              <span>{author}</span>
            </>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5 space-y-4">
        <div
          className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-serif text-slate-800 leading-relaxed select-all cursor-text"
          aria-label={`${formatLabels[active]} formatted citation`}
        >
          {current ? current.text : loadingStyle === active ? "Loading…" : "Not available"}
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="primary">{formatLabels[active]}</Badge>
          <span className="text-xs text-slate-500">Click inside the box to select all text</span>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={() => setShowInText(!showInText)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            aria-expanded={showInText}
            aria-controls="in-text-citation"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showInText ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            In-text citation
          </button>

          {showInText && (
            <div
              id="in-text-citation"
              className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-200"
            >
              <p className="font-serif text-slate-800 mb-2">{inTextCitation}</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => void doCopy(inTextCitation, "In-text citation")}
              >
                Copy in-text citation
              </Button>
            </div>
          )}
        </div>

        {bibtex ? (
          <details className="rounded-xl border border-slate-200 bg-white">
            <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold text-slate-800">
              Show BibTeX
            </summary>
            <div className="px-4 pb-4">
              <pre className="whitespace-pre-wrap text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-3">
                {bibtex}
              </pre>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={() => void doCopy(bibtex, "BibTeX")}>
                  Copy BibTeX
                </Button>
                <Button variant="secondary" size="sm" onClick={handleExportBibTeX}>
                  Download .bib
                </Button>
              </div>
            </div>
          </details>
        ) : null}

        <details className="rounded-xl border border-slate-200 bg-white">
          <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold text-slate-800">
            Show RIS
          </summary>
          <div className="px-4 pb-4">
            <pre className="whitespace-pre-wrap text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-3">
              {ris}
            </pre>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={() => void doCopy(ris, "RIS")}>
                Copy RIS
              </Button>
              <Button variant="secondary" size="sm" onClick={handleExportRIS}>
                Download .ris
              </Button>
            </div>
          </div>
        </details>
      </CardContent>

      <CardFooter className="p-5 bg-slate-50 border-t border-slate-200">
        <div className="flex flex-col gap-3 w-full">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              onClick={() => (current ? void doCopy(current.text) : undefined)}
              className="flex-1"
              disabled={!current || loadingStyle === active}
              leftIcon={
                copied ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                )
              }
            >
              {copied ? "Copied!" : "Copy Citation"}
            </Button>
            <Button variant="secondary" onClick={onCiteAnother} className="flex-1">
              Cite Another Source
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="secondary"
              onClick={handleExportRTF}
              className="flex-1"
              disabled={!current}
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              }
            >
              Export RTF
            </Button>
            {onAddToBibliography && (
              <Button
                variant="secondary"
                onClick={onAddToBibliography}
                className="flex-1"
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                }
              >
                Add to Bibliography
              </Button>
            )}
            {onEditMetadata && (
              <Button
                variant="ghost"
                onClick={onEditMetadata}
                className="flex-1"
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                }
              >
                Edit Metadata
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
