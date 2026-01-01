"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { CitationStyle } from "@/lib/api";

type SourceType = "website" | "book" | "journal" | "youtube" | "podcast";

interface Author {
  fullName: string;
  firstName?: string;
  lastName?: string;
}

interface ManualEntryFormProps {
  onSubmit: (metadata: {
    title: string;
    url: string;
    authors: Author[];
    publishedDate?: string;
    publisher?: string;
    siteName?: string;
    sourceType: SourceType;
    style: CitationStyle;
  }) => Promise<void>;
  isLoading: boolean;
  defaultStyle?: CitationStyle;
  onStyleChange?: (style: CitationStyle) => void;
}

const sourceTypes: { value: SourceType; label: string; description: string }[] = [
  { value: "website", label: "Website", description: "Online article, blog post, or web page" },
  { value: "book", label: "Book", description: "Print or electronic book" },
  { value: "journal", label: "Journal Article", description: "Academic or scholarly article" },
  { value: "youtube", label: "YouTube Video", description: "Video from YouTube" },
  { value: "podcast", label: "Podcast", description: "Audio podcast episode" },
];

const fieldLabels: Record<SourceType, { publisher?: string; siteName?: string; extra?: string }> = {
  website: { publisher: "Publisher/Organization", siteName: "Website Name" },
  book: { publisher: "Publisher", extra: "Edition (optional)" },
  journal: { publisher: "Journal Name", siteName: "Volume/Issue" },
  youtube: { publisher: "Channel Name" },
  podcast: { publisher: "Podcast Name", siteName: "Episode Number" },
};

const formats: { value: CitationStyle; label: string; description: string }[] = [
  { value: "apa", label: "APA 7th", description: "American Psychological Association" },
  { value: "mla", label: "MLA 9th", description: "Modern Language Association" },
  { value: "chicago", label: "Chicago 17th", description: "Chicago Manual of Style" },
  { value: "harvard", label: "Harvard", description: "Common UK referencing style" },
];

export function ManualEntryForm({
  onSubmit,
  isLoading,
  defaultStyle = "apa",
  onStyleChange,
}: ManualEntryFormProps) {
  const [sourceType, setSourceType] = useState<SourceType>("website");
  const [style, setStyle] = useState<CitationStyle>(defaultStyle);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [publisher, setPublisher] = useState("");
  const [siteName, setSiteName] = useState("");
  const [authors, setAuthors] = useState<Author[]>([]);
  const [newAuthor, setNewAuthor] = useState("");
  const [extra, setExtra] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const labels = fieldLabels[sourceType];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if ((sourceType === "website" || sourceType === "youtube") && !url.trim()) {
      newErrors.url = "URL is required for this source type";
    }
    if (url.trim()) {
      try {
        new URL(url);
      } catch {
        newErrors.url = "Please enter a valid URL";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAuthor = () => {
    if (!newAuthor.trim()) return;
    const nameParts = newAuthor.trim().split(" ");
    const newAuthorObj: Author = {
      fullName: newAuthor.trim(),
      firstName: nameParts.slice(0, -1).join(" ") || undefined,
      lastName: nameParts[nameParts.length - 1] || undefined,
    };
    setAuthors([...authors, newAuthorObj]);
    setNewAuthor("");
  };

  const handleRemoveAuthor = (index: number) => {
    setAuthors(authors.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      title: title.trim(),
      url: url.trim(),
      authors,
      publishedDate: publishedDate.trim() || undefined,
      publisher: publisher.trim() || undefined,
      siteName: siteName.trim() || undefined,
      sourceType,
      style,
    });
  };

  const handleStyleChange = (newStyle: CitationStyle) => {
    setStyle(newStyle);
    onStyleChange?.(newStyle);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">Source Type</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sourceTypes.map((type) => (
            <label
              key={type.value}
              className={`relative flex flex-col p-4 cursor-pointer border-2 rounded-xl transition-colors ${
                sourceType === type.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input
                type="radio"
                name="sourceType"
                value={type.value}
                checked={sourceType === type.value}
                onChange={(e) => setSourceType(e.target.value as SourceType)}
                className="sr-only"
                disabled={isLoading}
              />
              <span className="flex items-center gap-2">
                <Badge variant={sourceType === type.value ? "primary" : "default"} size="sm">
                  {type.label}
                </Badge>
              </span>
              <span className="mt-1 text-xs text-slate-600">{type.description}</span>
            </label>
          ))}
        </div>
      </div>

      <Input
        label="Title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (errors.title) setErrors({ ...errors, title: "" });
        }}
        error={errors.title}
        placeholder="Enter the title"
        disabled={isLoading}
        required
      />

      {(sourceType === "website" || sourceType === "youtube") && (
        <Input
          label="URL"
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (errors.url) setErrors({ ...errors, url: "" });
          }}
          error={errors.url}
          placeholder="https://example.com/article"
          disabled={isLoading}
        />
      )}

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Author(s)</label>
        <div className="space-y-2">
          {authors.map((author, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200"
            >
              <span className="flex-1 text-sm text-slate-800">{author.fullName}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveAuthor(index)}
                disabled={isLoading}
                aria-label={`Remove ${author.fullName}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              placeholder="Add author (e.g., John Smith)"
              className="flex-1"
              disabled={isLoading}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddAuthor())}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddAuthor}
              disabled={!newAuthor.trim() || isLoading}
            >
              Add
            </Button>
          </div>
          <p className="text-xs text-slate-500">
            Enter authors one at a time (Last Name, First Name or Full Name)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Publication Date"
          value={publishedDate}
          onChange={(e) => setPublishedDate(e.target.value)}
          placeholder="2024 or January 15, 2024"
          hint="Optional: Year or full date"
          disabled={isLoading}
        />

        {labels.publisher && (
          <Input
            label={labels.publisher}
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            placeholder={labels.publisher}
            hint="Optional"
            disabled={isLoading}
          />
        )}
      </div>

      {labels.siteName && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={labels.siteName}
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder={labels.siteName}
            hint="Optional"
            disabled={isLoading}
          />
          {labels.extra && (
            <Input
              label={labels.extra}
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              placeholder={labels.extra}
              hint="Optional"
              disabled={isLoading}
            />
          )}
        </div>
      )}

      <fieldset>
        <legend className="block text-sm font-semibold text-slate-700 mb-3">Citation style</legend>
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
                onChange={() => handleStyleChange(f.value)}
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
  );
}
