"use client";

import { useCallback, useState } from "react";

export function useClipboard(timeoutMs = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), timeoutMs);
    },
    [timeoutMs],
  );

  return { copied, copy };
}
