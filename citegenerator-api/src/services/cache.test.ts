import { describe, expect, it, beforeEach } from "vitest";
import { createTieredCache, createCacheKey } from "./cache.js";

describe("TieredCache", () => {
  let cache: ReturnType<typeof createTieredCache>;

  beforeEach(() => {
    cache = createTieredCache({
      l1MaxItems: 10,
      l1TtlMs: 1000,
      l2Enabled: false,
    });
  });

  describe("get and set", () => {
    it("returns undefined for non-existent keys", async () => {
      const result = await cache.get("nonexistent");
      expect(result).toBeUndefined();
    });

    it("stores and retrieves values", async () => {
      await cache.set("test-key", { foo: "bar" });
      const result = await cache.get<{ foo: string }>("test-key");
      expect(result).toEqual({ foo: "bar" });
    });

    it("updates existing keys", async () => {
      await cache.set("test-key", { value: 1 });
      await cache.set("test-key", { value: 2 });
      const result = await cache.get<{ value: number }>("test-key");
      expect(result?.value).toBe(2);
    });

    it("stores different types", async () => {
      await cache.set("string", "hello");
      await cache.set("number", 42);
      await cache.set("object", { nested: { value: true } });
      await cache.set("array", [1, 2, 3]);

      expect(await cache.get<string>("string")).toBe("hello");
      expect(await cache.get<number>("number")).toBe(42);
      expect(await cache.get<{ nested: { value: boolean } }>("object")).toEqual({
        nested: { value: true },
      });
      expect(await cache.get<number[]>("array")).toEqual([1, 2, 3]);
    });
  });

  describe("delete", () => {
    it("removes existing keys", async () => {
      await cache.set("delete-me", "value");
      await cache.delete("delete-me");
      const result = await cache.get("delete-me");
      expect(result).toBeUndefined();
    });

    it("handles deleting non-existent keys", async () => {
      await expect(cache.delete("nonexistent")).resolves.not.toThrow();
    });
  });

  describe("clear", () => {
    it("removes all entries", async () => {
      await cache.set("key1", "value1");
      await cache.set("key2", "value2");
      await cache.set("key3", "value3");

      await cache.clear();

      expect(await cache.get("key1")).toBeUndefined();
      expect(await cache.get("key2")).toBeUndefined();
      expect(await cache.get("key3")).toBeUndefined();
    });
  });

  describe("getStats", () => {
    it("tracks hits and misses", async () => {
      await cache.set("existing", "value");

      await cache.get("existing");
      await cache.get("existing");
      await cache.get("nonexistent");

      const stats = cache.getStats();
      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(1);
      expect(stats.hitRate).toBeCloseTo(2 / 3);
    });

    it("tracks cache size", async () => {
      await cache.set("key1", "value1");
      await cache.set("key2", "value2");

      const stats = cache.getStats();
      expect(stats.size).toBe(2);
    });
  });

  describe("getL1Stats", () => {
    it("returns L1-specific statistics", async () => {
      await cache.set("test", "value");
      await cache.get("test");

      const stats = cache.getL1Stats();
      expect(stats.size).toBeGreaterThan(0);
      expect(stats.hits).toBeGreaterThan(0);
    });
  });
});

describe("createCacheKey", () => {
  it("creates simple keys", () => {
    expect(createCacheKey(["test"])).toBe("cache:test");
  });

  it("creates keys with multiple parts", () => {
    expect(createCacheKey(["user", "123", "profile"])).toBe("cache:user:123:profile");
  });

  it("filters out undefined values", () => {
    expect(createCacheKey(["api", undefined, "data"])).toBe("cache:api:data");
  });

  it("supports custom prefix", () => {
    expect(createCacheKey(["test"], "custom")).toBe("custom:test");
  });

  it("handles numbers", () => {
    expect(createCacheKey(["item", 42])).toBe("cache:item:42");
  });
});
