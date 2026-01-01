import { howToSchema } from "@/lib/seo/schema";

export function HowToJsonLd({
  name,
  steps,
}: {
  name: string;
  steps: Array<{ name: string; text: string }>;
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema(name, steps)) }}
    />
  );
}
