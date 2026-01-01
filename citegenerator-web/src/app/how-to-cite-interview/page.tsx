import type { Metadata } from "next";
import { GuideTemplate } from "@/components/content/GuideTemplate";
import { HowToJsonLd } from "@/components/seo/HowToJsonLd";
import { BreadcrumbJsonLd, type BreadcrumbItem } from "@/components/seo/BreadcrumbJsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citegenerator.org";

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", url: siteUrl },
  { name: "How to Cite an Interview", url: `${siteUrl}/how-to-cite-interview` },
];

export const metadata: Metadata = {
  title: "How to Cite an Interview (APA, MLA, Chicago) | 2026 Guide",
  description:
    "Learn how to cite personal interviews, published interviews, and broadcast interviews in APA, MLA, and Chicago formats with examples.",
  keywords: [
    "how to cite an interview",
    "cite personal interview",
    "cite published interview",
    "interview citation APA",
    "interview citation MLA",
    "interview citation Chicago",
  ].join(", "),
  alternates: { canonical: "/how-to-cite-interview" },
  openGraph: {
    title: "How to Cite an Interview (APA, MLA, Chicago) | 2026 Guide",
    description:
      "Learn how to cite different types of interviews in APA, MLA, and Chicago formats.",
    url: "/how-to-cite-interview",
  },
};

const steps = [
  {
    name: "Identify the interview type",
    text: "Determine if it's personal, published, or broadcast.",
  },
  { name: "Note the interviewee", text: "Record the full name of the person being interviewed." },
  { name: "Record the date", text: "Note when the interview took place or was published." },
  { name: "Note the interviewer", text: "Some formats require the interviewer's name." },
  {
    name: "Get publication details",
    text: "For published interviews, include the source information.",
  },
];

export default function HowToCiteInterview() {
  return (
    <>
      <HowToJsonLd name="How to cite an interview" steps={steps} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <GuideTemplate
        title="How to Cite an Interview"
        updated="January 1, 2026"
        intro="Interviews can be primary sources or published content. The citation format varies based on whether the interview was conducted personally, published in print/online, or broadcast on TV/radio. This guide covers all three types."
        sections={[
          {
            id: "types",
            heading: "Types of Interviews",
            body: (
              <div className="space-y-4 text-slate-700">
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Personal interviews:</strong> Conducted by you for your research
                    (in-person, phone, email, video call)
                  </li>
                  <li>
                    <strong>Published interviews:</strong> Appear in newspapers, magazines, books,
                    or websites
                  </li>
                  <li>
                    <strong>Broadcast interviews:</strong> Aired on TV, radio, or podcasts
                  </li>
                </ul>
              </div>
            ),
          },
          {
            id: "personal",
            heading: "Citing Personal Interviews",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  Personal interviews you conducted yourself are cited differently in each style.
                  Note that APA does not include personal interviews in the reference list — cite
                  them only in-text.
                </p>
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <p className="font-semibold text-blue-900 mb-2">APA (In-text only)</p>
                  <p className="font-mono text-sm bg-white p-3 rounded">
                    According to J. Smith (personal communication, March 15, 2023), the project was
                    successful.
                  </p>
                  <p className="mt-2 text-sm text-blue-900">
                    Note: Personal interviews are NOT included in the APA reference list.
                  </p>
                </div>
                <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                  <p className="font-semibold text-green-900 mb-2">MLA (Works Cited)</p>
                  <p className="font-mono text-sm bg-white p-3 rounded">
                    Smith, John. Personal interview. 15 Mar. 2023.
                  </p>
                </div>
                <div className="rounded-lg bg-purple-50 border border-purple-200 p-4">
                  <p className="font-semibold text-purple-900 mb-2">Chicago (Note)</p>
                  <p className="font-mono text-sm bg-white p-3 rounded">
                    John Smith, interview by author, March 15, 2023.
                  </p>
                </div>
              </div>
            ),
          },
          {
            id: "published",
            heading: "Citing Published Interviews",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  For interviews published in magazines, newspapers, or websites, cite them like any
                  other article, with the interviewee as the author.
                </p>
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <p className="font-semibold text-blue-900 mb-2">APA Example (Magazine)</p>
                  <p className="font-mono text-sm bg-white p-3 rounded">
                    Gates, B. (2023, February). The future of AI [Interview by J. Smith].{" "}
                    <em>Tech Monthly</em>, 45(2), 24-30.
                  </p>
                </div>
                <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                  <p className="font-semibold text-green-900 mb-2">MLA Example (Online)</p>
                  <p className="font-mono text-sm bg-white p-3 rounded">
                    Gates, Bill. "The Future of AI." Interview by John Smith. <em>Tech Monthly</em>,
                    15 Feb. 2023, www.techmonthly.com/gates-interview.
                  </p>
                </div>
              </div>
            ),
          },
          {
            id: "broadcast",
            heading: "Citing Broadcast Interviews",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>For TV or radio interviews, include the program name, network, and air date.</p>
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <p className="font-semibold text-blue-900 mb-2">APA Example</p>
                  <p className="font-mono text-sm bg-white p-3 rounded">
                    Obama, B. (2023, April 10). [Interview by D. Muir]. In D. Muir (Host),{" "}
                    <em>World News Tonight</em>. ABC.
                  </p>
                </div>
                <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                  <p className="font-semibold text-green-900 mb-2">MLA Example</p>
                  <p className="font-mono text-sm bg-white p-3 rounded">
                    Obama, Barack. Interview by David Muir. <em>World News Tonight</em>, ABC, 10
                    Apr. 2023.
                  </p>
                </div>
              </div>
            ),
          },
          {
            id: "tips",
            heading: "Key Tips",
            body: (
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>The interviewee is typically treated as the author.</li>
                <li>
                  For personal interviews in APA, only use in-text citations — no reference list
                  entry.
                </li>
                <li>Include the interviewer&apos;s name when it adds context or credibility.</li>
                <li>
                  For email interviews, include "Email interview" or "Telephone interview" as
                  appropriate.
                </li>
                <li>Always get permission before citing personal interviews in published work.</li>
              </ul>
            ),
          },
        ]}
        showTool
      />
    </>
  );
}
