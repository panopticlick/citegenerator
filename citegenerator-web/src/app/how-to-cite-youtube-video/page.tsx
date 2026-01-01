import type { Metadata } from "next";
import { GuideTemplate } from "@/components/content/GuideTemplate";
import { HowToJsonLd } from "@/components/seo/HowToJsonLd";
import { BreadcrumbJsonLd, type BreadcrumbItem } from "@/components/seo/BreadcrumbJsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citegenerator.org";

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", url: siteUrl },
  { name: "How to Cite a YouTube Video", url: `${siteUrl}/how-to-cite-youtube-video` },
];

export const metadata: Metadata = {
  title: "How to Cite a YouTube Video (APA, MLA, Chicago) | 2026 Guide",
  description:
    "Learn how to cite a YouTube video in APA, MLA, and Chicago styles. Includes examples for creators, channels, and missing dates.",
  keywords: [
    "how to cite a YouTube video",
    "YouTube citation",
    "cite a video APA",
    "cite a video MLA",
    "YouTube video reference",
    "video source citation",
  ].join(", "),
  alternates: { canonical: "/how-to-cite-youtube-video" },
  openGraph: {
    title: "How to Cite a YouTube Video (APA, MLA, Chicago) | 2026 Guide",
    description: "Learn how to cite a YouTube video in APA, MLA, and Chicago styles.",
    url: "/how-to-cite-youtube-video",
  },
};

const steps = [
  { name: "Find the creator", text: "Use the channel name or individual creator listed." },
  { name: "Copy the video title", text: "Use the exact title from the video page." },
  { name: "Get the upload date", text: "This is shown under the video." },
  { name: "Copy the URL", text: "Use the share URL for a clean link." },
];

export default function HowToCiteYouTubeVideo() {
  return (
    <>
      <HowToJsonLd name="How to cite a YouTube video" steps={steps} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <GuideTemplate
        title="How to Cite a YouTube Video"
        updated="January 1, 2026"
        intro="When citing YouTube, use the creator (or channel) as the author and include the full URL. Always check whether your class prefers timestamps or access dates."
        sections={[
          {
            id: "apa",
            heading: "APA (7th) YouTube format",
            body: (
              <p className="text-slate-700">
                Author, A. A. [Channel Name]. (Year, Month Day). <em>Title of video</em> [Video].
                YouTube. URL
              </p>
            ),
          },
          {
            id: "mla",
            heading: "MLA (9th) YouTube format",
            body: (
              <p className="text-slate-700">
                "Title of Video." <em>YouTube</em>, uploaded by Channel Name, Day Mon. Year, URL.
              </p>
            ),
          },
          {
            id: "tips",
            heading: "Tips",
            body: (
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Use the channel name if no individual creator is listed.</li>
                <li>If no date: use n.d. or omit depending on style guidance.</li>
                <li>Use the full video URL (no tracking parameters).</li>
              </ul>
            ),
          },
        ]}
        showTool
      />
    </>
  );
}
