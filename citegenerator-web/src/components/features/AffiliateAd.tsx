"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { env } from "@/lib/env";
import { trackEvent } from "@/lib/api";

export function AffiliateAd({ show }: { show: boolean }) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (show && !dismissed) {
      const t = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(t);
    }
  }, [show, dismissed]);

  const url = useMemo(() => env.grammarlyAffiliateUrl, []);

  if (!visible || dismissed || !url) return null;

  const onClick = () => {
    trackEvent("affiliate_click", { partner: "grammarly" });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Card
      variant="bordered"
      padding="none"
      className="relative overflow-hidden bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 animate-fade-in"
      role="complementary"
      aria-label="Sponsored content"
    >
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 p-2 text-slate-500 hover:text-slate-700"
        aria-label="Dismiss advertisement"
      >
        ×
      </button>

      <div className="flex flex-col sm:flex-row items-center gap-4 p-4">
        <div className="shrink-0 w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm">
          <span className="text-xl font-extrabold text-green-700">G</span>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <Badge variant="warning" size="sm">
              Sponsored
            </Badge>
          </div>
          <h3 className="text-lg font-bold text-slate-900">Finish strong with Grammarly</h3>
          <p className="text-sm text-slate-700 mt-1">
            Your citation is ready — now check your paper for grammar and plagiarism.
          </p>
        </div>
        <Button
          onClick={onClick}
          className="shrink-0 bg-green-600 hover:bg-green-700 focus:ring-green-500"
        >
          Try Free
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </Button>
      </div>
    </Card>
  );
}
