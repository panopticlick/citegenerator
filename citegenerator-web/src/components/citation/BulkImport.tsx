"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import type { CitationStyle, MetadataResult, FormattedCitation } from "@/lib/api";
import { citeUrl } from "@/lib/api";
import { isValidHttpUrl } from "@/lib/validators";
import { useBibliography } from "@/lib/bibliography-state";

interface BulkImportProps {
  style: CitationStyle;
  onComplete?: () => void;
}

interface BulkResult {
  url: string;
  status: "pending" | "loading" | "success" | "error";
  metadata?: MetadataResult;
  citation?: FormattedCitation;
  error?: string;
}

const MAX_CONCURRENT = 5;

export function BulkImport({ style, onComplete }: BulkImportProps) {
  const [urls, setUrls] = useState("");
  const [results, setResults] = useState<BulkResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { addToast } = useToast();
  const bibliography = useBibliography();

  const handleProcess = async () => {
    const lines = urls
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      addToast({ type: "error", message: "Please enter at least one URL" });
      return;
    }

    const invalidUrls = lines.filter((url) => !isValidHttpUrl(url));
    if (invalidUrls.length > 0) {
      addToast({
        type: "error",
        message: `Invalid URLs found: ${invalidUrls.slice(0, 2).join(", ")}${invalidUrls.length > 2 ? "..." : ""}`,
      });
      return;
    }

    setIsProcessing(true);
    const initialResults: BulkResult[] = lines.map((url) => ({
      url,
      status: "pending",
    }));
    setResults(initialResults);

    await processBatch(initialResults);
    setIsProcessing(false);
  };

  const processBatch = async (batch: BulkResult[]) => {
    const queue = [...batch];
    const processing: Promise<void>[] = [];

    const processNext = async (index: number): Promise<void> => {
      while (queue.length > 0) {
        const item = queue.shift();
        if (!item) break;

        const resultIndex = batch.findIndex((r) => r.url === item.url);
        setResults((prev) => {
          const updated = [...prev];
          updated[resultIndex] = { ...updated[resultIndex], status: "loading" };
          return updated;
        });

        try {
          const { metadata, citation } = await citeUrl(item.url, style);
          setResults((prev) => {
            const updated = [...prev];
            updated[resultIndex] = {
              ...updated[resultIndex],
              status: "success",
              metadata,
              citation,
            };
            return updated;
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Failed to generate citation";
          setResults((prev) => {
            const updated = [...prev];
            updated[resultIndex] = {
              ...updated[resultIndex],
              status: "error",
              error: message,
            };
            return updated;
          });
        }
      }
    };

    for (let i = 0; i < MAX_CONCURRENT; i++) {
      processing.push(processNext(i));
    }

    await Promise.all(processing);
  };

  const handleAddAllToBibliography = () => {
    const successResults = results.filter(
      (r): r is BulkResult & { metadata: MetadataResult; citation: FormattedCitation } =>
        r.status === "success" && !!r.metadata && !!r.citation,
    );

    if (successResults.length === 0) {
      addToast({ type: "error", message: "No successful citations to add" });
      return;
    }

    successResults.forEach((result) => {
      bibliography.save(result.metadata, result.citation, style);
    });

    addToast({
      type: "success",
      message: `Added ${successResults.length} citation${successResults.length !== 1 ? "s" : ""} to bibliography!`,
    });

    if (onComplete) {
      onComplete();
    }
  };

  const handleReset = () => {
    setUrls("");
    setResults([]);
    setIsProcessing(false);
  };

  const stats = {
    total: results.length,
    pending: results.filter((r) => r.status === "pending").length,
    loading: results.filter((r) => r.status === "loading").length,
    success: results.filter((r) => r.status === "success").length,
    error: results.filter((r) => r.status === "error").length,
  };

  const progress = stats.total > 0 ? ((stats.success + stats.error) / stats.total) * 100 : 0;

  return (
    <Card variant="elevated" padding="lg">
      <CardHeader className="pb-4">
        <CardTitle>Bulk Import Citations</CardTitle>
        <p className="mt-1 text-sm text-slate-600">
          Paste multiple URLs (one per line) to generate citations in bulk
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {results.length === 0 ? (
          <>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                URLs to cite
              </label>
              <textarea
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:cursor-not-allowed"
                rows={10}
                placeholder="https://example.com/article-1&#10;https://example.com/article-2&#10;https://example.com/article-3"
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                disabled={isProcessing}
              />
              <p className="mt-1.5 text-sm text-slate-500">
                Maximum {MAX_CONCURRENT} concurrent requests
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">
                {style.toUpperCase()}
              </Badge>
              <span className="text-sm text-slate-600">Citation style for all URLs</span>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleProcess}
              disabled={isProcessing || !urls.trim()}
              className="w-full"
            >
              Process URLs
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-700">
                  Progress: {stats.success + stats.error} / {stats.total}
                </div>
                <div className="flex gap-2">
                  <Badge variant="default" size="sm">
                    {stats.success} success
                  </Badge>
                  {stats.error > 0 && (
                    <Badge variant="default" size="sm" className="bg-red-100 text-red-700">
                      {stats.error} failed
                    </Badge>
                  )}
                </div>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2 border border-slate-200 rounded-xl p-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white border border-slate-200"
                >
                  <div className="mt-1 flex-shrink-0">
                    {result.status === "pending" && (
                      <div className="w-5 h-5 rounded-full bg-slate-200" />
                    )}
                    {result.status === "loading" && <Spinner size="sm" />}
                    {result.status === "success" && (
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                    {result.status === "error" && (
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{result.url}</p>
                    {result.metadata && (
                      <p className="text-xs text-slate-600 mt-1 truncate">
                        {result.metadata.title}
                      </p>
                    )}
                    {result.error && <p className="text-xs text-red-600 mt-1">{result.error}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddAllToBibliography}
                disabled={isProcessing || stats.success === 0}
                className="flex-1"
              >
                Add {stats.success > 0 ? stats.success : ""} to Bibliography
              </Button>
              <Button variant="secondary" size="lg" onClick={handleReset} disabled={isProcessing}>
                Reset
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
