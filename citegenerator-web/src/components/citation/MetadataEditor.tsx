"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { MetadataResult, CitationStyle } from "@/lib/api";
import { formatCitation } from "@/lib/api";

interface Author {
  fullName: string;
  firstName?: string;
  lastName?: string;
}

interface MetadataEditorProps {
  metadata: MetadataResult;
  style: CitationStyle;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedMetadata: MetadataResult, formattedCitation: string) => void;
}

export function MetadataEditor({ metadata, style, isOpen, onClose, onSave }: MetadataEditorProps) {
  const [title, setTitle] = useState(metadata.title);
  const [url, setUrl] = useState(metadata.url);
  const [publishedDate, setPublishedDate] = useState(metadata.publishedDate || "");
  const [publisher, setPublisher] = useState(metadata.publisher || "");
  const [siteName, setSiteName] = useState(metadata.siteName || "");
  const [authors, setAuthors] = useState<Author[]>(metadata.authors);
  const [newAuthor, setNewAuthor] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setTitle(metadata.title);
    setUrl(metadata.url);
    setPublishedDate(metadata.publishedDate || "");
    setPublisher(metadata.publisher || "");
    setSiteName(metadata.siteName || "");
    setAuthors(metadata.authors);
  }, [metadata]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!url.trim()) newErrors.url = "URL is required";
    try {
      new URL(url);
    } catch {
      newErrors.url = "Please enter a valid URL";
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

  const handleSave = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      const updatedMetadata: MetadataResult = {
        title: title.trim(),
        url: url.trim(),
        accessDate: metadata.accessDate,
        authors,
        publishedDate: publishedDate.trim() || undefined,
        publisher: publisher.trim() || undefined,
        siteName: siteName.trim() || undefined,
      };

      const formatted = await formatCitation(updatedMetadata, style);
      onSave(updatedMetadata, formatted.text);
      onClose();
    } catch {
      setErrors({ form: "Failed to re-format citation. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="metadata-editor-title"
    >
      <Card
        variant="elevated"
        padding="none"
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <CardHeader className="p-6">
          <CardTitle id="metadata-editor-title">Edit Citation Metadata</CardTitle>
        </CardHeader>

        <CardContent className="px-6 pb-6 space-y-5">
          {errors.form && (
            <div
              className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700"
              role="alert"
            >
              {errors.form}
            </div>
          )}

          <Input
            label="Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors({ ...errors, title: "" });
            }}
            error={errors.title}
            placeholder="Article or page title"
            disabled={isLoading}
          />

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

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Authors</label>
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

            <Input
              label="Publisher"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              placeholder="Publisher name"
              hint="Optional"
              disabled={isLoading}
            />
          </div>

          <Input
            label="Site Name"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="Website name"
            hint="Optional: e.g., The New York Times"
            disabled={isLoading}
          />

          <div className="flex items-center gap-2">
            <Badge variant="primary">{style.toUpperCase()}</Badge>
            <span className="text-sm text-slate-600">Citation will be re-formatted on save</span>
          </div>
        </CardContent>

        <CardFooter className="p-6 bg-slate-50 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button variant="primary" onClick={handleSave} isLoading={isLoading} className="flex-1">
              Save Changes
            </Button>
            <Button variant="secondary" onClick={onClose} disabled={isLoading} className="flex-1">
              Cancel
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
