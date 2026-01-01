import type { Metadata } from "next";
import { GuideTemplate } from "@/components/content/GuideTemplate";
import { HowToJsonLd } from "@/components/seo/HowToJsonLd";
import { BreadcrumbJsonLd, type BreadcrumbItem } from "@/components/seo/BreadcrumbJsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citegenerator.org";

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", url: siteUrl },
  { name: "How to Cite an Image", url: `${siteUrl}/how-to-cite-image` },
];

export const metadata: Metadata = {
  title: "How to Cite an Image (APA, MLA, Chicago) | 2026 Guide",
  description:
    "Learn how to cite photographs, artwork, infographics, stock images, and online images in APA, MLA, and Chicago formats with examples.",
  keywords: [
    "how to cite an image",
    "cite photograph",
    "cite artwork",
    "cite infographic",
    "image citation APA",
    "image citation MLA",
    "cite stock photo",
  ].join(", "),
  alternates: { canonical: "/how-to-cite-image" },
  openGraph: {
    title: "How to Cite an Image (APA, MLA, Chicago) | 2026 Guide",
    description: "Learn how to cite images, photos, and artwork in APA, MLA, and Chicago formats.",
    url: "/how-to-cite-image",
  },
};

const steps = [
  {
    name: "Identify the creator",
    text: "Find the artist, photographer, or organization who created the image.",
  },
  {
    name: "Find the title",
    text: "Use the official title, or create a descriptive title in brackets.",
  },
  { name: "Determine the date", text: "Find when the image was created or published." },
  {
    name: "Note the source",
    text: "Record the museum, website, database, or book where you found the image.",
  },
  { name: "Get the URL", text: "For online images, copy the direct URL to the image or page." },
];

export default function HowToCiteImage() {
  return (
    <>
      <HowToJsonLd name="How to cite an image" steps={steps} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <GuideTemplate
        title="How to Cite an Image"
        updated="January 1, 2026"
        intro="Properly citing images is essential when using photographs, artwork, infographics, or other visual media in academic work. This guide covers how to cite images from museums, websites, databases, and books."
        sections={[
          {
            id: "quick-reference",
            heading: "Quick reference",
            body: (
              <ul className="list-disc pl-5 space-y-3 text-slate-700">
                <li>
                  <strong>APA:</strong> Creator. (Year). <em>Title of image</em> [Type]. Source. URL
                </li>
                <li>
                  <strong>MLA:</strong> Creator. <em>Title of Image</em>. Year. Source, URL.
                </li>
                <li>
                  <strong>Chicago:</strong> Creator, <em>Title of Image</em>, Year, Medium, Source.
                </li>
              </ul>
            ),
          },
          {
            id: "online-images",
            heading: "Citing Online Images",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  For images found online, include the website or database where you accessed the
                  image.
                </p>
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <p className="font-semibold text-blue-900 mb-2">APA Example</p>
                  <p className="font-mono text-sm bg-white p-3 rounded">
                    NASA. (2022). <em>Earth from the International Space Station</em> [Photograph].
                    NASA Image Gallery. https://images.nasa.gov/earth-iss
                  </p>
                </div>
                <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                  <p className="font-semibold text-green-900 mb-2">MLA Example</p>
                  <p className="font-mono text-sm bg-white p-3 rounded">
                    NASA. <em>Earth from the International Space Station</em>. 2022.{" "}
                    <em>NASA Image Gallery</em>, images.nasa.gov/earth-iss.
                  </p>
                </div>
              </div>
            ),
          },
          {
            id: "artwork",
            heading: "Citing Artwork and Paintings",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  When citing famous artwork, include the museum or collection where the original is
                  housed.
                </p>
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <p className="font-semibold text-blue-900 mb-2">APA Example</p>
                  <p className="font-mono text-sm bg-white p-3 rounded">
                    van Gogh, V. (1889). <em>The Starry Night</em> [Painting]. Museum of Modern Art,
                    New York.
                  </p>
                </div>
                <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                  <p className="font-semibold text-green-900 mb-2">MLA Example</p>
                  <p className="font-mono text-sm bg-white p-3 rounded">
                    van Gogh, Vincent. <em>The Starry Night</em>. 1889. Museum of Modern Art, New
                    York.
                  </p>
                </div>
                <div className="rounded-lg bg-purple-50 border border-purple-200 p-4">
                  <p className="font-semibold text-purple-900 mb-2">Chicago Example</p>
                  <p className="font-mono text-sm bg-white p-3 rounded">
                    Vincent van Gogh, <em>The Starry Night</em>, 1889, oil on canvas, Museum of
                    Modern Art, New York.
                  </p>
                </div>
              </div>
            ),
          },
          {
            id: "stock-photos",
            heading: "Citing Stock Photos",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  Stock photos from services like Getty Images, Shutterstock, or Unsplash should
                  credit the photographer.
                </p>
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <p className="font-semibold text-blue-900 mb-2">APA Example</p>
                  <p className="font-mono text-sm bg-white p-3 rounded">
                    Johnson, M. (2023). <em>Business team in modern office</em> [Photograph].
                    Unsplash. https://unsplash.com/photos/abc123
                  </p>
                </div>
              </div>
            ),
          },
          {
            id: "infographics",
            heading: "Citing Infographics",
            body: (
              <div className="space-y-4 text-slate-700">
                <p>
                  Infographics combine data and visual design. Cite the creator or organization and
                  describe the type.
                </p>
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <p className="font-semibold text-blue-900 mb-2">APA Example</p>
                  <p className="font-mono text-sm bg-white p-3 rounded">
                    World Health Organization. (2023). <em>Global vaccine coverage rates 2022</em>{" "}
                    [Infographic]. https://www.who.int/data/infographic-vaccines
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
                <li>
                  If no title exists, create a brief descriptive title in brackets (APA) or italics
                  (MLA).
                </li>
                <li>
                  Specify the image type: [Photograph], [Painting], [Infographic], [Map], etc.
                </li>
                <li>For images in books, cite the book and include the figure/page number.</li>
                <li>Check copyright and licensing before using images in published work.</li>
                <li>When the creator is unknown, start with the title.</li>
                <li>
                  Include dimensions or medium for artwork when relevant (especially Chicago).
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
