"use client";

import { useEffect, useMemo, useState } from "react";
import { safeLocalStorageGet, safeLocalStorageSet } from "@/lib/storage";
import type { CitationStyle, MetadataResult, FormattedCitation } from "@/lib/api";

export interface BibliographyItem {
  id: string;
  createdAt: string;
  metadata: MetadataResult;
  citation: FormattedCitation;
  style: CitationStyle;
}

const KEY = "citegen:bibliography:v1";

function safeParse(json: string | null): BibliographyItem[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(Boolean) as BibliographyItem[];
  } catch {
    return [];
  }
}

export function useBibliography() {
  const [items, setItems] = useState<BibliographyItem[]>([]);

  useEffect(() => {
    setItems(safeParse(safeLocalStorageGet(KEY)));
  }, []);

  const save = (metadata: MetadataResult, citation: FormattedCitation, style: CitationStyle) => {
    const next: BibliographyItem = {
      id: `bib_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      createdAt: new Date().toISOString(),
      metadata,
      citation,
      style,
    };
    setItems((prev) => {
      const merged = [...prev, next];
      safeLocalStorageSet(KEY, JSON.stringify(merged));
      return merged;
    });
    return next.id;
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

  const reorder = (fromIndex: number, toIndex: number) => {
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      safeLocalStorageSet(KEY, JSON.stringify(next));
      return next;
    });
  };

  const sortAlphabetically = () => {
    setItems((prev) => {
      const next = [...prev].sort((a, b) => a.metadata.title.localeCompare(b.metadata.title));
      safeLocalStorageSet(KEY, JSON.stringify(next));
      return next;
    });
  };

  const getAllText = () => {
    return items.map((item) => item.citation.text).join("\n\n");
  };

  const stats = useMemo(
    () => ({ count: items.length, styles: Array.from(new Set(items.map((i) => i.style))) }),
    [items],
  );

  return { items, save, remove, clear, reorder, sortAlphabetically, getAllText, stats };
}
