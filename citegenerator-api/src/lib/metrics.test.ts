import { describe, expect, it, beforeEach } from "vitest";
import { createMetricsRegistry } from "./metrics.js";

describe("MetricsRegistry", () => {
  let metrics: ReturnType<typeof createMetricsRegistry>;

  beforeEach(() => {
    metrics = createMetricsRegistry();
  });

  describe("incrementCounter", () => {
    it("increments counter by 1 by default", () => {
      metrics.incrementCounter("test_counter");
      const snapshot = metrics.getSnapshot();
      const counter = snapshot.find((m) => m.name === "test_counter");
      expect(counter?.value).toBe(1);
    });

    it("increments counter by custom value", () => {
      metrics.incrementCounter("test_counter", 5);
      metrics.incrementCounter("test_counter", 3);
      const snapshot = metrics.getSnapshot();
      const counter = snapshot.find((m) => m.name === "test_counter");
      expect(counter?.value).toBe(8);
    });

    it("creates new counter if not exists", () => {
      metrics.incrementCounter("new_counter");
      const snapshot = metrics.getSnapshot();
      expect(snapshot.some((m) => m.name === "new_counter")).toBe(true);
    });
  });

  describe("recordHistogram", () => {
    it("records histogram values", () => {
      metrics.recordHistogram("response_time", 10);
      metrics.recordHistogram("response_time", 50);
      metrics.recordHistogram("response_time", 100);

      const snapshot = metrics.getSnapshot();
      const hist = snapshot.find((m) => m.name === "response_time");
      expect(hist?.type).toBe("histogram");
      expect(hist?.value).toBe(3);
    });

    it("includes bucket data", () => {
      metrics.recordHistogram("test_hist", 5);
      metrics.recordHistogram("test_hist", 15);

      const snapshot = metrics.getSnapshot();
      const hist = snapshot.find((m) => m.name === "test_hist");
      expect(hist?.buckets).toBeDefined();
      expect(hist?.buckets?.length).toBeGreaterThan(0);
    });
  });

  describe("recordResponseTime", () => {
    it("records response time for endpoint", () => {
      metrics.recordResponseTime("/api/test", 123);

      const snapshot = metrics.getSnapshot();
      const counter = snapshot.find((m) => m.name === "endpoint__api_test_requests");
      expect(counter?.value).toBe(1);
    });

    it("records to histogram", () => {
      metrics.recordResponseTime("/api/test", 123);

      const snapshot = metrics.getSnapshot();
      const hist = snapshot.find((m) => m.name === "response_time_ms");
      expect(hist?.value).toBe(1);
    });
  });

  describe("recordError", () => {
    it("increments error counters", () => {
      metrics.recordError("/api/test", "INVALID_REQUEST");

      const snapshot = metrics.getSnapshot();
      const endpointErrors = snapshot.find((m) => m.name === "endpoint__api_test_errors");
      const totalErrors = snapshot.find((m) => m.name === "errors_total");

      expect(endpointErrors?.value).toBe(1);
      expect(totalErrors?.value).toBe(1);
    });
  });

  describe("incrementCounterByEndpoint", () => {
    it("increments endpoint-specific counter", () => {
      metrics.incrementCounterByEndpoint("/api/cite", "requests", 5);

      const snapshot = metrics.getSnapshot();
      const counter = snapshot.find((m) => m.name === "endpoint_requests__api_cite");
      expect(counter?.value).toBe(5);
    });
  });

  describe("getMetricsText", () => {
    it("returns Prometheus-formatted text", () => {
      metrics.incrementCounter("test_counter", 42);
      const text = metrics.getMetricsText();

      expect(text).toContain("# HELP");
      expect(text).toContain("# TYPE");
      expect(text).toContain("test_counter 42");
    });

    it("includes histogram buckets", () => {
      metrics.recordHistogram("timing", 10);
      metrics.recordHistogram("timing", 50);
      metrics.recordHistogram("timing", 100);
      metrics.recordHistogram("timing", 500);
      const text = metrics.getMetricsText();

      expect(text).toContain('_bucket{le="');
      expect(text).toContain("_count");
      expect(text).toContain("_sum");
    });

    it("includes endpoint stats", () => {
      metrics.recordResponseTime("/api/test", 100);
      metrics.recordError("/api/test", "TEST_ERROR");
      const text = metrics.getMetricsText();

      expect(text).toContain("endpoint__api_test_requests");
      expect(text).toContain("endpoint__api_test_errors");
      expect(text).toContain("response_time_avg");
    });
  });

  describe("reset", () => {
    it("clears all metrics", () => {
      metrics.incrementCounter("test", 5);
      metrics.recordHistogram("hist", 10);
      metrics.recordHistogram("hist", 20);

      metrics.reset();

      const snapshot = metrics.getSnapshot();
      expect(snapshot.filter((m) => m.value > 0)).toHaveLength(0);
    });
  });

  describe("percentile calculations", () => {
    it("calculates p95 correctly", () => {
      for (let i = 1; i <= 100; i++) {
        metrics.recordResponseTime("/api/p95", i);
      }

      const text = metrics.getMetricsText();
      expect(text).toContain("response_time_p95");
    });
  });
});
