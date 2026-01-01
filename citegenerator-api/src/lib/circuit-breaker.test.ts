import { describe, expect, it, beforeEach, vi } from "vitest";
import { createCircuitBreaker, CircuitBreakerOpenError } from "./circuit-breaker.js";

describe("CircuitBreaker", () => {
  let cb: ReturnType<typeof createCircuitBreaker>;
  const stateChanges: Array<{ from: string; to: string }> = [];

  beforeEach(() => {
    stateChanges.length = 0;
    cb = createCircuitBreaker(
      "test-breaker",
      {
        failureThreshold: 3,
        successThreshold: 2,
        timeoutMs: 50,
      },
      {
        onStateChange: (newState, previousState) => {
          stateChanges.push({ from: previousState, to: newState });
        },
      },
    );
  });

  describe("initial state", () => {
    it("starts in closed state", () => {
      expect(cb.getState()).toBe("closed");
    });

    it("allows requests when closed", async () => {
      const result = await cb.execute(async () => "success");
      expect(result).toBe("success");
    });
  });

  describe("successful execution", () => {
    it("executes function and returns result", async () => {
      const fn = vi.fn().mockResolvedValue("result");
      const result = await cb.execute(fn);
      expect(result).toBe("result");
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("tracks stats", async () => {
      await cb.execute(async () => "ok");
      await cb.execute(async () => "ok");

      const stats = cb.getStats();
      expect(stats.totalCalls).toBe(2);
      expect(stats.totalSuccesses).toBe(2);
      expect(stats.totalFailures).toBe(0);
    });
  });

  describe("failure handling", () => {
    it("opens circuit after threshold failures", async () => {
      const fn = async () => {
        throw new Error("Failed");
      };

      for (let i = 0; i < 3; i++) {
        await expect(cb.execute(fn)).rejects.toThrow("Failed");
      }

      expect(cb.getState()).toBe("open");
      expect(stateChanges).toEqual([{ from: "closed", to: "open" }]);
    });

    it("blocks requests when open", async () => {
      const fn = async () => {
        throw new Error("Failed");
      };

      for (let i = 0; i < 3; i++) {
        await expect(cb.execute(fn)).rejects.toThrow("Failed");
      }

      await expect(cb.execute(async () => "should not execute")).rejects.toThrow(
        CircuitBreakerOpenError,
      );
    });

    it("tracks failure stats", async () => {
      const fn = async () => {
        throw new Error("Failed");
      };

      for (let i = 0; i < 2; i++) {
        await expect(cb.execute(fn)).rejects.toThrow();
      }

      const stats = cb.getStats();
      expect(stats.totalCalls).toBe(2);
      expect(stats.totalFailures).toBe(2);
      expect(stats.totalSuccesses).toBe(0);
    });
  });

  describe("half-open state", () => {
    it("transitions to half-open after timeout", async () => {
      const failFn = async () => {
        throw new Error("Failed");
      };

      for (let i = 0; i < 3; i++) {
        await expect(cb.execute(failFn)).rejects.toThrow("Failed");
      }
      expect(cb.getState()).toBe("open");

      const stats = cb.getStats();
      const nextAttempt = stats.nextAttemptTime ?? 0;
      const waitTime = Math.max(0, nextAttempt - Date.now() + 100);
      await new Promise((resolve) => setTimeout(resolve, waitTime));

      const result = await cb.execute(async () => "recovered");
      expect(result).toBe("recovered");
      expect(cb.getState()).toBe("half-open");
    }, 15000);

    it("closes circuit after successful calls", async () => {
      const failFn = async () => {
        throw new Error("Failed");
      };

      for (let i = 0; i < 3; i++) {
        await expect(cb.execute(failFn)).rejects.toThrow("Failed");
      }

      const stats = cb.getStats();
      const nextAttempt = stats.nextAttemptTime ?? 0;
      const waitTime = Math.max(0, nextAttempt - Date.now() + 100);
      await new Promise((resolve) => setTimeout(resolve, waitTime));

      await cb.execute(async () => "success");
      await cb.execute(async () => "success");

      expect(cb.getState()).toBe("closed");
    }, 15000);

    it("re-opens on failure in half-open state", async () => {
      const failFn = async () => {
        throw new Error("Failed");
      };

      for (let i = 0; i < 3; i++) {
        await expect(cb.execute(failFn)).rejects.toThrow("Failed");
      }

      const stats = cb.getStats();
      const nextAttempt = stats.nextAttemptTime ?? 0;
      const waitTime = Math.max(0, nextAttempt - Date.now() + 100);
      await new Promise((resolve) => setTimeout(resolve, waitTime));

      await cb.execute(async () => "success");
      await expect(cb.execute(failFn)).rejects.toThrow("Failed");

      expect(cb.getState()).toBe("open");
    }, 15000);
  });

  describe("reset", () => {
    it("resets to closed state", async () => {
      const failFn = async () => {
        throw new Error("Failed");
      };

      for (let i = 0; i < 3; i++) {
        await expect(cb.execute(failFn)).rejects.toThrow();
      }

      expect(cb.getState()).toBe("open");

      cb.reset();

      expect(cb.getState()).toBe("closed");
      const stats = cb.getStats();
      expect(stats.totalCalls).toBe(0);
      expect(stats.totalFailures).toBe(0);
    });
  });

  describe("executeSync", () => {
    it("executes synchronous functions", () => {
      const result = cb.executeSync(() => "sync result");
      expect(result).toBe("sync result");
    });

    it("handles sync errors", () => {
      const fn = () => {
        throw new Error("Sync error");
      };

      expect(() => cb.executeSync(fn)).toThrow("Sync error");
    });

    it("respects circuit state for sync calls", async () => {
      const failFn = async () => {
        throw new Error("Failed");
      };

      for (let i = 0; i < 3; i++) {
        await expect(cb.execute(failFn)).rejects.toThrow("Failed");
      }

      expect(() => cb.executeSync(() => "should not execute")).toThrow(CircuitBreakerOpenError);
    });
  });
});
