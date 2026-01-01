"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { CitationStyle } from "@/lib/api";
import { isValidHttpUrl } from "@/lib/validators";
import { useFormatPreference } from "@/hooks/useFormatPreference";

interface CitationFormProps {
  defaultStyle?: CitationStyle;
  onSubmit: (url: string, style: CitationStyle) => Promise<void>;
  isLoading: boolean;
}

const formats: { value: CitationStyle; label: string; description: string }[] = [
  { value: "apa", label: "APA 7th", description: "American Psychological Association" },
  { value: "mla", label: "MLA 9th", description: "Modern Language Association" },
  { value: "chicago", label: "Chicago 17th", description: "Chicago Manual of Style" },
  { value: "harvard", label: "Harvard", description: "Common UK referencing style" },
];

export function CitationForm({ defaultStyle = "apa", onSubmit, isLoading }: CitationFormProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { style, setStyle } = useFormatPreference(defaultStyle);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please enter a URL");
      return;
    }
    if (!isValidHttpUrl(trimmed)) {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }
    await onSubmit(trimmed, style);
  };

  return (
    <Card variant="elevated" padding="lg">
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <Input
          label="Website URL"
          type="url"
          placeholder="https://example.com/article"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError(null);
          }}
          error={error || undefined}
          hint="Paste the URL of the webpage you want to cite"
          leftAddon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          }
          disabled={isLoading}
          aria-label="Enter website URL to cite"
        />

        <fieldset>
          <legend className="block text-sm font-semibold text-slate-700 mb-3">
            Citation style
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {formats.map((f) => (
              <label
                key={f.value}
                className={`relative flex flex-col p-4 cursor-pointer border-2 rounded-xl transition-colors ${
                  style === f.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <input
                  type="radio"
                  name="style"
                  value={f.value}
                  checked={style === f.value}
                  onChange={() => setStyle(f.value)}
                  className="sr-only"
                  disabled={isLoading}
                />
                <span className="flex items-center gap-2">
                  <Badge variant={style === f.value ? "primary" : "default"} size="sm">
                    {f.label}
                  </Badge>
                </span>
                <span className="mt-1 text-xs text-slate-600">{f.description}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
          {isLoading ? "Generating Citation..." : "Generate Citation"}
        </Button>
      </form>
    </Card>
  );
}
