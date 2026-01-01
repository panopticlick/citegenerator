import { faqSchema } from "@/lib/seo/schema";
import { getFaqItemsForSchema } from "@/components/content/FAQ";

export function FAQJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqSchema(getFaqItemsForSchema())),
      }}
    />
  );
}
