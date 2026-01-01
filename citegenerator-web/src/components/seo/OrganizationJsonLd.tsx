import { env } from "@/lib/env";

const siteUrl = env.siteUrl;

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CiteGenerator",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description:
      "Free citation generator for APA, MLA, Chicago, and Harvard citation styles. Create accurate citations instantly.",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: `${siteUrl}/about`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
