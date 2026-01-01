import { describe, expect, it } from "vitest";
import { createApp } from "../app.js";
import { createCitationService } from "../services/citation.js";

describe("POST /api/format", () => {
  it("formats citation (deployment shape)", async () => {
    const app = createApp({ citation: createCitationService() });
    const res = await app.request("http://localhost/api/format", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        style: "apa",
        citation: {
          title: "Test",
          url: "https://example.com",
          accessDate: "2024-03-15T10:00:00Z",
          authors: [{ fullName: "John Smith", firstName: "John", lastName: "Smith" }],
          publishedDate: "2024-01-10T00:00:00Z",
          siteName: "Example",
        },
      }),
    });
    expect(res.status).toBe(200);
    const json = (await res.json()) as unknown as {
      success: boolean;
      data: { style: string; text: string };
    };
    expect(json.success).toBe(true);
    expect(json.data.style).toBe("apa");
    expect(json.data.text).toContain("Smith");
  });

  it("formats citation (blueprint shape)", async () => {
    const app = createApp({ citation: createCitationService() });
    const res = await app.request("http://localhost/api/format", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        format: "mla",
        metadata: {
          title: "Test",
          url: "https://example.com",
          accessDate: "2024-03-15T10:00:00Z",
        },
      }),
    });
    expect(res.status).toBe(200);
    const json = (await res.json()) as unknown as { success: boolean; data: { style: string } };
    expect(json.success).toBe(true);
    expect(json.data.style).toBe("mla");
  });
});
