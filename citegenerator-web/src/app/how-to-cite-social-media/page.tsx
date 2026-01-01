import type { Metadata } from "next";
import { GuideTemplate } from "@/components/content/GuideTemplate";
import { HowToJsonLd } from "@/components/seo/HowToJsonLd";
import { BreadcrumbJsonLd, type BreadcrumbItem } from "@/components/seo/BreadcrumbJsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citegenerator.org";

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", url: siteUrl },
  { name: "How to Cite Social Media", url: `${siteUrl}/how-to-cite-social-media` },
];

export const metadata: Metadata = {
  title: "How to Cite Social Media (APA, MLA, Chicago) | 2026 Guide",
  description:
    "Learn how to cite Twitter/X, Instagram, Facebook, TikTok, and other social media posts in APA, MLA, and Chicago formats with examples.",
  keywords: [
    "how to cite social media",
    "cite twitter post",
    "cite instagram post",
    "cite facebook post",
    "cite tiktok",
    "social media citation APA",
    "social media citation MLA",
  ].join(", "),
  alternates: { canonical: "/how-to-cite-social-media" },
  openGraph: {
    title: "How to Cite Social Media (APA, MLA, Chicago) | 2026 Guide",
    description: "Learn how to cite social media posts in APA, MLA, and Chicago formats.",
    url: "/how-to-cite-social-media",
  },
};

const steps = [
  {
    name: "Identify the author",
    text: "Use the account holder's real name if known, otherwise use the username.",
  },
  { name: "Find the date", text: "Locate the exact date and time the post was published." },
  {
    name: "Quote or describe the content",
    text: "Include the first 20 words of the post or a description.",
  },
  {
    name: "Identify the platform",
    text: "Name the social media platform (Twitter/X, Instagram, etc.).",
  },
  { name: "Get the direct URL", text: "Copy the permanent link to the specific post." },
];

export default function HowToCiteSocialMedia() {
  return (
    <>
      <HowToJsonLd name="How to cite social media" steps={steps} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <GuideTemplate
        title="How to Cite Social Media Posts"
        updated="January 1, 2026"
        intro="Social media is increasingly used as a primary source in academic research. This guide covers how to cite posts from Twitter/X, Instagram, Facebook, TikTok, and other platforms in APA, MLA, and Chicago formats."
        sections={[
          {
            id: "quick-reference",
            heading: "Quick reference",
            body: (
              <ul className="list-disc pl-5 space-y-3 text-slate-700">
                <li>
                  <strong>APA:</strong> Author [@username]. (Year, Month Day).{" "}
                  <em>First 20 words of post</em> [Type of post]. Platform. URL
                </li>
                <li>
                  <strong>MLA:</strong> Author (Username). "First 20 words of post..."{" "}
                  <em>Platform</em>, Day Mon. Year, URL.
                </li>
                <li>
                  <strong>Chicago:</strong> Author, "First 20 words of post...," Platform, Month
                  Day, Year, URL.
                </li>
              </ul>
            ),
          },
          {
            id: "twitter",
            heading: "Citing Twitter/X Posts",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  Twitter (now X) is one of the most commonly cited social media platforms. Include
                  the tweet text, author handle, and direct link to the post.
                </p>
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <p className="font-semibold text-blue-900 mb-2">APA Example</p>
                  <p className="font-mono text-sm bg-white p-3 rounded">
                    Obama, B. [@BarackObama]. (2023, January 15).{" "}
                    <em>
                      Today we celebrate the legacy of Dr. Martin Luther King Jr. His dream
                      continues to inspire
                    </em>{" "}
                    [Tweet]. Twitter. https://twitter.com/BarackObama/status/123456789
                  </p>
                </div>
                <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                  <p className="font-semibold text-green-900 mb-2">MLA Example</p>
                  <p className="font-mono text-sm bg-white p-3 rounded">
                    Obama, Barack (BarackObama). "Today we celebrate the legacy of Dr. Martin Luther
                    King Jr. His dream continues to inspire..." <em>Twitter</em>, 15 Jan. 2023,
                    twitter.com/BarackObama/status/123456789.
                  </p>
                </div>
              </div>
            ),
          },
          {
            id: "instagram",
            heading: "Citing Instagram Posts",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  For Instagram posts, include the caption text or describe the image/video content
                  if no caption exists. Stories cannot be cited as they disappear after 24 hours.
                </p>
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <p className="font-semibold text-blue-900 mb-2">APA Example</p>
                  <p className="font-mono text-sm bg-white p-3 rounded">
                    National Geographic [@natgeo]. (2023, March 5).{" "}
                    <em>
                      The northern lights dance across the Arctic sky in this stunning photograph
                    </em>{" "}
                    [Photograph]. Instagram. https://www.instagram.com/p/ABC123/
                  </p>
                </div>
              </div>
            ),
          },
          {
            id: "tiktok",
            heading: "Citing TikTok Videos",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  TikTok videos should be described if no caption is available. Include the video
                  type (Video, Duet, etc.) and the permanent link.
                </p>
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <p className="font-semibold text-blue-900 mb-2">APA Example</p>
                  <p className="font-mono text-sm bg-white p-3 rounded">
                    Creator [@username]. (2023, July 20).{" "}
                    <em>Demonstration of chemistry experiment showing color-changing reaction</em>{" "}
                    [Video]. TikTok. https://www.tiktok.com/@username/video/123456
                  </p>
                </div>
              </div>
            ),
          },
          {
            id: "tips",
            heading: "Important Tips",
            body: (
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>
                  Always save a screenshot or archive of social media posts, as they can be deleted.
                </li>
                <li>
                  Use the author&apos;s real name when known; include username in brackets or
                  parentheses.
                </li>
                <li>If the real name is unknown, use the username as the author.</li>
                <li>
                  For posts without text, describe the content in brackets (e.g., [Photograph],
                  [Video]).
                </li>
                <li>
                  Include the exact date and time if available, especially for time-sensitive
                  topics.
                </li>
              </ul>
            ),
          },
        ]}
        showTool
      />
    </>
  );
}
