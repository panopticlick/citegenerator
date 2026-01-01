import { describe, expect, it } from "vitest";
import { faqSchema, howToSchema, webApplicationSchema } from "./schema";

describe("schema helpers", () => {
  it("webApplicationSchema includes WebApplication", () => {
    const s = webApplicationSchema() as unknown as Record<string, unknown>;
    expect(s["@type"]).toBe("WebApplication");
    expect(typeof s.url).toBe("string");
  });

  it("faqSchema builds FAQPage", () => {
    const s = faqSchema([{ question: "Q", answer: "A" }]) as unknown as Record<string, unknown>;
    expect(s["@type"]).toBe("FAQPage");
    const mainEntity = s.mainEntity as Array<{ acceptedAnswer: { text: string } }>;
    expect(mainEntity[0]?.acceptedAnswer.text).toBe("A");
  });

  it("howToSchema builds HowTo", () => {
    const s = howToSchema("Test", [{ name: "Step 1", text: "Do it" }]) as unknown as Record<
      string,
      unknown
    >;
    expect(s["@type"]).toBe("HowTo");
    const steps = s.step as Array<{ position: number }>;
    expect(steps[0]?.position).toBe(1);
  });
});
