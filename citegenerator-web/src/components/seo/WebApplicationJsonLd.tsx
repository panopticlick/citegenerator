import { webApplicationSchema } from "@/lib/seo/schema";

export function WebApplicationJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema()) }}
    />
  );
}
