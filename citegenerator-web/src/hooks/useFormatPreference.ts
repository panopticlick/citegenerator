"use client";

import { useEffect, useState } from "react";
import type { CitationStyle } from "@/lib/api";
import { safeLocalStorageGet, safeLocalStorageSet } from "@/lib/storage";

const KEY = "citegen:style";

export function useFormatPreference(defaultStyle: CitationStyle = "apa") {
  const [style, setStyle] = useState<CitationStyle>(defaultStyle);

  useEffect(() => {
    const stored = safeLocalStorageGet(KEY);
    if (stored === "apa" || stored === "mla" || stored === "chicago" || stored === "harvard") {
      setStyle(stored);
    }
  }, []);

  const update = (next: CitationStyle) => {
    setStyle(next);
    safeLocalStorageSet(KEY, next);
  };

  return { style, setStyle: update };
}
