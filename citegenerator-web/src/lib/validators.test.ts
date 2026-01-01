import { describe, expect, it } from "vitest";
import { isValidHttpUrl } from "./validators";

describe("isValidHttpUrl", () => {
  it("accepts https", () => {
    expect(isValidHttpUrl("https://example.com")).toBe(true);
  });

  it("rejects non-url", () => {
    expect(isValidHttpUrl("notaurl")).toBe(false);
  });

  it("rejects javascript:", () => {
    expect(isValidHttpUrl("javascript:alert(1)")).toBe(false);
  });
});
