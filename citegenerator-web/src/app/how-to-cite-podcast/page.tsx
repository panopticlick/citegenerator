import type { Metadata } from "next";
import { GuideTemplate } from "@/components/content/GuideTemplate";
import { HowToJsonLd } from "@/components/seo/HowToJsonLd";
import { BreadcrumbJsonLd, type BreadcrumbItem } from "@/components/seo/BreadcrumbJsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citegenerator.org";

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", url: siteUrl },
  { name: "How to Cite a Podcast", url: `${siteUrl}/how-to-cite-podcast` },
];

export const metadata: Metadata = {
  title: "How to Cite a Podcast (APA, MLA, Chicago) | 2026 Guide",
  description:
    "Learn how to cite a podcast episode in APA, MLA, and Chicago styles. Includes examples for hosts, episode titles, and streaming platforms.",
  keywords: [
    "how to cite a podcast",
    "podcast citation",
    "cite a podcast episode",
    "podcast reference",
    "audio source citation",
    "podcast format",
  ].join(", "),
  alternates: { canonical: "/how-to-cite-podcast" },
  openGraph: {
    title: "How to Cite a Podcast (APA, MLA, Chicago) | 2026 Guide",
    description: "Learn how to cite a podcast episode in APA, MLA, and Chicago styles.",
    url: "/how-to-cite-podcast",
  },
};

const steps = [
  { name: "Find the host", text: "Use the host name as the author." },
  { name: "Get the episode title", text: "Use the exact title from the episode." },
  { name: "Find the podcast name", text: "This is the show name, not the episode." },
  { name: "Get the episode number", text: "Include this if available." },
  { name: "Find the release date", text: "Use the original publication date." },
  { name: "Copy the URL", text: "Use the link to the episode page." },
];

export default function HowToCitePodcast() {
  return (
    <>
      <HowToJsonLd name="How to cite a podcast" steps={steps} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <GuideTemplate
        title="How to Cite a Podcast"
        updated="January 1, 2026"
        intro="Podcasts are typically cited at the episode level. Use the host or producer as the author when available."
        sections={[
          {
            id: "apa",
            heading: "APA (7th) podcast episode format",
            body: (
              <p className="text-slate-700">
                Host, A. A. (Host). (Year, Month Day). Title of episode (No. X) [Audio podcast
                episode]. In <em>Podcast Name</em>. Publisher. URL
              </p>
            ),
          },
          {
            id: "mla",
            heading: "MLA (9th) podcast episode format",
            body: (
              <p className="text-slate-700">
                "Title of Episode." <em>Podcast Name</em>, hosted by Host Name, Publisher, Day Mon.
                Year, URL.
              </p>
            ),
          },
        ]}
        showTool
      />
    </>
  );
}
