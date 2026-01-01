import { env } from "@/lib/env";

export function webApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "CiteGenerator",
    description:
      "Free citation generator for APA, MLA, Chicago, and Harvard citation styles. Create accurate citations instantly.",
    url: env.siteUrl,
    applicationCategory: "EducationalApplication",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
}

export function faqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
}

export function howToSchema(name: string, steps: Array<{ name: string; text: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    step: steps.map((s, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CiteGenerator",
    url: env.siteUrl,
    logo: `${env.siteUrl}/logo.png`,
    description:
      "Free citation generator for APA, MLA, Chicago, and Harvard citation styles. Create accurate citations instantly.",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: `${env.siteUrl}/about`,
    },
  };
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function articleSchema(params: {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
}) {
  const { headline, description, datePublished, dateModified, author, image } = params;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Organization",
      name: author || "CiteGenerator",
    },
    publisher: {
      "@type": "Organization",
      name: "CiteGenerator",
      logo: {
        "@type": "ImageObject",
        url: `${env.siteUrl}/logo.png`,
      },
    },
    ...(image && { image }),
  };
}
