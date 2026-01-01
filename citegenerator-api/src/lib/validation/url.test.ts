import { describe, expect, it } from "vitest";
import { validatePublicHttpUrl } from "./url.js";

describe("validatePublicHttpUrl", () => {
  it("accepts valid https url", async () => {
    const url = await validatePublicHttpUrl("https://example.com/path?utm_source=x", {
      lookupAll: async () => [{ address: "93.184.216.34", family: 4 }],
    });
    expect(url.toString()).toBe("https://example.com/path");
  });

  it("rejects invalid url", async () => {
    await expect(validatePublicHttpUrl("notaurl")).rejects.toThrow();
  });

  it("rejects private IP targets", async () => {
    await expect(validatePublicHttpUrl("http://127.0.0.1/")).rejects.toThrow();
  });

  it("rejects ssrf via dns to private ip", async () => {
    await expect(
      validatePublicHttpUrl("https://evil.test/", {
        lookupAll: async () => [{ address: "10.0.0.1", family: 4 }],
      }),
    ).rejects.toThrow();
  });
});
