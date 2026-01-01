import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/app/globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citegenerator.org";
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.citegenerator.org";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Free Citation Generator | APA, MLA, Chicago | 2026",
    template: "%s | CiteGenerator",
  },
  description:
    "Free citation generator for APA, MLA, Chicago, and Harvard formats. Create accurate citations instantly — no account required. Fast, simple, and student-friendly.",
  keywords: [
    "citation generator",
    "APA citation generator",
    "MLA citation generator",
    "Chicago citation generator",
    "Harvard citation generator",
    "cite sources",
    "bibliography maker",
    "reference generator",
    "academic citations",
    "student tools",
  ].join(", "),
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "CiteGenerator",
    title: "Free Citation Generator | APA, MLA, Chicago | 2026",
    description:
      "Generate accurate citations in seconds. Paste a URL and get APA, MLA, Chicago, or Harvard citations instantly.",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "CiteGenerator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Citation Generator | APA, MLA, Chicago | 2026",
    description:
      "Generate accurate citations in seconds. Paste a URL and get APA, MLA, Chicago, or Harvard citations instantly.",
    images: ["/og-image.svg"],
  },
  robots: { index: true, follow: true },
  other: {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href={apiUrl} />
        <link rel="dns-prefetch" href={apiUrl} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased">
        <ToastProvider>
          <Header />
          <main className="min-h-[calc(100vh-160px)]">{children}</main>
          <Footer />
        </ToastProvider>
        <OrganizationJsonLd />
      </body>
    </html>
  );
}
