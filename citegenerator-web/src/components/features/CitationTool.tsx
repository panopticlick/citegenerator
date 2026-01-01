"use client";

import { useMemo, useState } from "react";
import { CitationForm } from "./CitationForm";
import { CitationResult } from "./CitationResult";
import { ManualEntryForm } from "@/components/citation/ManualEntryForm";
import { MetadataEditor } from "@/components/citation/MetadataEditor";
import { BibliographyBuilder } from "@/components/citation/BibliographyBuilder";
import { BulkImport } from "@/components/citation/BulkImport";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { CitationStyle, FormattedCitation, MetadataResult } from "@/lib/api";
import { citeUrl, formatCitation } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { AffiliateAd } from "./AffiliateAd";
import { useHistory } from "@/hooks/useHistory";
import { CitationHistory } from "./CitationHistory";
import { useBibliography } from "@/lib/bibliography-state";
import { trackEvent } from "@/lib/api";

type ToolMode = "url" | "manual" | "bulk";
type ToolState =
  | { status: "idle" }
  | { status: "loading" }
  | {
      status: "success";
      metadata: MetadataResult;
      citations: Partial<Record<CitationStyle, FormattedCitation>>;
      selectedStyle: CitationStyle;
    }
  | { status: "error"; message: string };

export function CitationTool({ defaultStyle = "apa" }: { defaultStyle?: CitationStyle }) {
  const [state, setState] = useState<ToolState>({ status: "idle" });
  const [mode, setMode] = useState<ToolMode>("url");
  const [selectedStyle, setSelectedStyle] = useState<CitationStyle>(defaultStyle);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const { addToast } = useToast();
  const history = useHistory();
  const bibliography = useBibliography();

  const canShowAd = state.status === "success";

  const handleSubmitUrl = async (url: string, style: CitationStyle) => {
    setSelectedStyle(style);
    setState({ status: "loading" });
    try {
      trackEvent("generate_citation_start", { style, mode });
      const { metadata, citation } = await citeUrl(url, style);
      setState({
        status: "success",
        metadata,
        citations: { [style]: citation },
        selectedStyle: style,
      });
      addToast({ type: "success", message: "Citation generated!" });
      history.save(metadata, citation, style);
      trackEvent("generate_citation_success", { style, mode });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate citation";
      setState({ status: "error", message });
      addToast({ type: "error", message });
      trackEvent("generate_citation_error", { message, mode });
    }
  };

  const handleSubmitManual = async (data: {
    title: string;
    url: string;
    authors: Array<{ fullName: string; firstName?: string; lastName?: string }>;
    publishedDate?: string;
    publisher?: string;
    siteName?: string;
    sourceType: string;
    style: CitationStyle;
  }) => {
    setSelectedStyle(data.style);
    setState({ status: "loading" });
    try {
      trackEvent("generate_citation_start", { style: data.style, mode });
      const metadata: MetadataResult = {
        title: data.title,
        url: data.url,
        accessDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        authors: data.authors,
        publishedDate: data.publishedDate,
        publisher: data.publisher,
        siteName: data.siteName,
      };
      const citation = await formatCitation(metadata, data.style);
      setState({
        status: "success",
        metadata,
        citations: { [data.style]: citation },
        selectedStyle: data.style,
      });
      addToast({ type: "success", message: "Citation generated!" });
      history.save(metadata, citation, data.style);
      trackEvent("generate_citation_success", { style: data.style, mode });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate citation";
      setState({ status: "error", message });
      addToast({ type: "error", message });
      trackEvent("generate_citation_error", { message, mode });
    }
  };

  const handleManualStyleChange = (style: CitationStyle) => {
    setSelectedStyle(style);
  };

  const onCiteAnother = () => setState({ status: "idle" });

  const requestStyle = async (style: CitationStyle) => {
    if (state.status !== "success") return;
    if (state.citations[style]) return;
    const next = await formatCitation(state.metadata, style);
    setState((prev) => {
      if (prev.status !== "success") return prev;
      return { ...prev, citations: { ...prev.citations, [style]: next }, selectedStyle: style };
    });
  };

  const handleAddToBibliography = () => {
    if (state.status !== "success") return;
    const citation = state.citations[state.selectedStyle];
    if (!citation) return;
    bibliography.save(state.metadata, citation, state.selectedStyle);
    addToast({ type: "success", message: "Added to bibliography!" });
    trackEvent("add_to_bibliography", { style: state.selectedStyle });
  };

  const handleSaveMetadata = (updatedMetadata: MetadataResult, formattedCitation: string) => {
    if (state.status !== "success") return;
    setState((prev) => {
      if (prev.status !== "success") return prev;
      const updatedCitation: FormattedCitation = {
        ...prev.citations[prev.selectedStyle]!,
        text: formattedCitation,
      };
      return {
        ...prev,
        metadata: updatedMetadata,
        citations: { ...prev.citations, [prev.selectedStyle]: updatedCitation },
      };
    });
    addToast({ type: "success", message: "Metadata updated!" });
    trackEvent("edit_metadata", { style: state.selectedStyle });
  };

  const result = useMemo(() => {
    if (state.status !== "success") return null;
    return {
      metadata: state.metadata,
      citations: state.citations,
      selectedStyle: state.selectedStyle,
    };
  }, [state]);

  return (
    <div className="space-y-6">
      <Card variant="elevated" padding="none">
        <div className="border-b border-slate-200">
          <div className="flex" role="tablist" aria-label="Entry mode">
            <button
              type="button"
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                mode === "url"
                  ? "bg-white text-slate-900 border-b-2 border-blue-500"
                  : "bg-slate-50 text-slate-600 hover:text-slate-900"
              }`}
              onClick={() => setMode("url")}
              role="tab"
              aria-selected={mode === "url"}
            >
              <svg
                className="w-4 h-4 inline-block mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              URL Input
            </button>
            <button
              type="button"
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                mode === "manual"
                  ? "bg-white text-slate-900 border-b-2 border-blue-500"
                  : "bg-slate-50 text-slate-600 hover:text-slate-900"
              }`}
              onClick={() => setMode("manual")}
              role="tab"
              aria-selected={mode === "manual"}
            >
              <svg
                className="w-4 h-4 inline-block mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Manual Entry
            </button>
            <button
              type="button"
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                mode === "bulk"
                  ? "bg-white text-slate-900 border-b-2 border-blue-500"
                  : "bg-slate-50 text-slate-600 hover:text-slate-900"
              }`}
              onClick={() => setMode("bulk")}
              role="tab"
              aria-selected={mode === "bulk"}
            >
              <svg
                className="w-4 h-4 inline-block mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Bulk Import
            </button>
          </div>
        </div>
        <div className="p-6">
          {mode === "url" ? (
            <CitationForm
              defaultStyle={defaultStyle}
              onSubmit={handleSubmitUrl}
              isLoading={state.status === "loading"}
            />
          ) : mode === "manual" ? (
            <ManualEntryForm
              onSubmit={handleSubmitManual}
              isLoading={state.status === "loading"}
              defaultStyle={selectedStyle}
              onStyleChange={handleManualStyleChange}
            />
          ) : (
            <BulkImport style={selectedStyle} />
          )}
        </div>
      </Card>

      {state.status === "error" ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-900">
          <div className="font-semibold">Error</div>
          <div className="text-sm mt-1">{state.message}</div>
        </div>
      ) : null}

      {result ? (
        <>
          <CitationResult
            citation={result}
            initialStyle={result.selectedStyle}
            onCiteAnother={onCiteAnother}
            onRequestStyle={requestStyle}
            onAddToBibliography={handleAddToBibliography}
            onEditMetadata={() => setIsEditorOpen(true)}
          />
          <AffiliateAd show={canShowAd} />
        </>
      ) : null}

      <MetadataEditor
        metadata={
          state.status === "success"
            ? state.metadata
            : { title: "", url: "", accessDate: "", authors: [] }
        }
        style={selectedStyle}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveMetadata}
      />

      <CitationHistory items={history.items} onRemove={history.remove} onClear={history.clear} />
    </div>
  );
}
