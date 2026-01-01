import type { MetadataRoute } from "next";
import { CITE_PAGES, citePath } from "@/lib/pseo/cite-pages";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citegenerator.org";

interface SitemapPage {
  path: string;
  lastModified: string;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
}

const basePages: SitemapPage[] = [
  { path: "/", lastModified: "2026-01-01", changeFrequency: "weekly", priority: 1 },
  { path: "/about", lastModified: "2026-01-01", changeFrequency: "monthly", priority: 0.6 },
  { path: "/faq", lastModified: "2026-01-01", changeFrequency: "monthly", priority: 0.7 },
  {
    path: "/annotated-bibliography-guide",
    lastModified: "2026-01-01",
    changeFrequency: "monthly",
    priority: 0.8,
  },
];

const styleLandingPages: SitemapPage[] = [
  {
    path: "/apa-citation-generator",
    lastModified: "2026-01-01",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/mla-citation-generator",
    lastModified: "2026-01-01",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/chicago-citation-generator",
    lastModified: "2026-01-01",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/harvard-citation-generator",
    lastModified: "2026-01-01",
    changeFrequency: "weekly",
    priority: 0.9,
  },
];

const howToPages: SitemapPage[] = [
  {
    path: "/how-to-cite-website",
    lastModified: "2026-01-01",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/how-to-cite-book",
    lastModified: "2026-01-01",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/how-to-cite-journal-article",
    lastModified: "2026-01-01",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/how-to-cite-youtube-video",
    lastModified: "2026-01-01",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/how-to-cite-pdf",
    lastModified: "2026-01-01",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/how-to-cite-podcast",
    lastModified: "2026-01-01",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/how-to-cite-social-media",
    lastModified: "2026-01-01",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/how-to-cite-interview",
    lastModified: "2026-01-01",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/how-to-cite-image",
    lastModified: "2026-01-01",
    changeFrequency: "monthly",
    priority: 0.8,
  },
];

const guidePages: SitemapPage[] = [
  {
    path: "/guides/apa-format",
    lastModified: "2026-01-01",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/guides/mla-format",
    lastModified: "2026-01-01",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/guides/chicago-format",
    lastModified: "2026-01-01",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/guides/harvard-format",
    lastModified: "2026-01-01",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/guides/apa-vs-mla",
    lastModified: "2026-01-01",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/guides/chicago-vs-apa",
    lastModified: "2026-01-01",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/guides/harvard-vs-apa",
    lastModified: "2026-01-01",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/guides/mla-vs-chicago",
    lastModified: "2026-01-01",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/guides/in-text-citations",
    lastModified: "2026-01-01",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/guides/works-cited-vs-bibliography",
    lastModified: "2026-01-01",
    changeFrequency: "monthly",
    priority: 0.8,
  },
];

const programmaticPages = CITE_PAGES.map(
  (p): SitemapPage => ({
    path: citePath(p.style, p.source),
    lastModified: p.updated || "2026-01-01",
    changeFrequency: "monthly",
    priority: 0.7,
  }),
);

export default function sitemap(): MetadataRoute.Sitemap {
  const allPages = [
    ...basePages,
    ...styleLandingPages,
    ...howToPages,
    ...guidePages,
    ...programmaticPages,
  ];

  return allPages.map((page) => ({
    url: `${siteUrl}${page.path === "/" ? "" : page.path}`,
    lastModified: page.lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
