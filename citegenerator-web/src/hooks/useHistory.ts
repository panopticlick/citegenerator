"use client";

import { useEffect, useMemo, useState } from "react";
import { safeLocalStorageGet, safeLocalStorageSet } from "@/lib/storage";
import type { CitationStyle, FormattedCitation, MetadataResult } from "@/lib/api";

export interface HistoryItem {
  id: string;
  createdAt: string;
  url: string;
  title: string;
  style: CitationStyle;
  citationText: string;
  citationBibtex?: string;
}

const KEY = "citegen:history:v1";
const LIMIT = 50;

function safeParse(json: string | null): HistoryItem[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(Boolean) as HistoryItem[];
  } catch {
    return [];
  }
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear() - 1
  )
    return "A year ago";

  const diffTime = Math.abs(today.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 7) return `Last 7 days`;
  if (date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear())
    return "This month";

  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function groupByDate(items: HistoryItem[]): Record<string, HistoryItem[]> {
  return items.reduce(
    (acc, item) => {
      const dateGroup = formatDate(item.createdAt);
      if (!acc[dateGroup]) acc[dateGroup] = [];
      acc[dateGroup].push(item);
      return acc;
    },
    {} as Record<string, HistoryItem[]>,
  );
}

export function useHistory() {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setItems(safeParse(safeLocalStorageGet(KEY)));
  }, []);

  const save = (metadata: MetadataResult, formatted: FormattedCitation, style: CitationStyle) => {
    const next: HistoryItem = {
      id: Math.random().toString(36).slice(2),
      createdAt: new Date().toISOString(),
      url: metadata.url,
      title: metadata.title,
      style,
      citationText: formatted.text,
      citationBibtex: formatted.bibtex,
    };
    setItems((prev) => {
      const merged = [next, ...prev].slice(0, LIMIT);
      safeLocalStorageSet(KEY, JSON.stringify(merged));
      return merged;
    });
  };

  const remove = (id: string) => {
    setItems((prev) => {
      const next = prev.filter((x) => x.id !== id);
      safeLocalStorageSet(KEY, JSON.stringify(next));
      return next;
    });
  };

  const clear = () => {
    setItems([]);
    safeLocalStorageSet(KEY, JSON.stringify([]));
  };

  const importHistory = (json: string) => {
    try {
      const parsed = JSON.parse(json);
      if (!Array.isArray(parsed)) throw new Error("Invalid format");
      const imported = parsed.filter(
        (item) =>
          item &&
          typeof item === "object" &&
          typeof item.title === "string" &&
          typeof item.citationText === "string",
      ) as HistoryItem[];
      setItems((prev) => {
        const merged = [...imported.slice(0, LIMIT), ...prev].slice(0, LIMIT);
        safeLocalStorageSet(KEY, JSON.stringify(merged));
        return merged;
      });
      return { success: true, count: imported.length };
    } catch {
      return { success: false, count: 0 };
    }
  };

  const exportHistory = () => {
    return JSON.stringify(items, null, 2);
  };

  const groupedItems = useMemo(() => groupByDate(items), [items]);
  const stats = useMemo(() => ({ count: items.length }), [items.length]);

  return { items, groupedItems, save, remove, clear, importHistory, exportHistory, stats };
}
