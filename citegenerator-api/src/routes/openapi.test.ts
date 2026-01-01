import { describe, expect, it } from "vitest";
import { createApp } from "../app.js";

describe("GET /api/openapi.json", () => {
  it("returns an OpenAPI spec", async () => {
    const app = createApp();
    const res = await app.request("http://localhost/api/openapi.json");
    expect(res.status).toBe(200);
    const json = (await res.json()) as unknown as { openapi?: string; info?: { title?: string } };
    expect(json.openapi).toBeTruthy();
    expect(json.info?.title).toBeTruthy();
  });
});
