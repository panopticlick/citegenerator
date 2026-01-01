import { articleSchema } from "@/lib/seo/schema";

export function ArticleJsonLd(params: {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema(params)) }}
    />
  );
}
