export type CircuitState = "closed" | "open" | "half-open";

export interface CircuitBreakerConfig {
  failureThreshold: number;
  successThreshold: number;
  timeoutMs: number;
  halfOpenMaxCalls: number;
  monitorWindowMs: number;
}

export interface CircuitBreakerStats {
  state: CircuitState;
  failureCount: number;
  successCount: number;
  lastFailureTime?: number;
  lastSuccessTime?: number;
  openedAt?: number;
  nextAttemptTime?: number;
  totalCalls: number;
  totalFailures: number;
  totalSuccesses: number;
}

interface CircuitBreakerOptions {
  onStateChange?: (state: CircuitState, previousState: CircuitState) => void;
  onError?: (error: Error) => void;
}

const DEFAULT_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5,
  successThreshold: 2,
  timeoutMs: 60_000,
  halfOpenMaxCalls: 3,
  monitorWindowMs: 10_000,
};

export class CircuitBreakerOpenError extends Error {
  public readonly nextAttemptTime: number;

  constructor(message: string, nextAttemptTime: number) {
    super(message);
    this.name = "CircuitBreakerOpenError";
    this.nextAttemptTime = nextAttemptTime;
  }
}

function calculateBackoff(attempt: number, baseMs: number = 1000, maxMs: number = 60_000): number {
  const exponential = Math.min(baseMs * Math.pow(2, attempt), maxMs);
  const jitter = Math.random() * 0.3 * exponential;
  return Math.floor(exponential + jitter);
}

export function createCircuitBreaker(
  name: string,
  config: Partial<CircuitBreakerConfig> = {},
  options: CircuitBreakerOptions = {},
) {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  let state: CircuitState = "closed";
  let failureCount = 0;
  let successCount = 0;
  let consecutiveFailures = 0;
  let openedAt: number | undefined;
  let nextAttemptTime: number | undefined;
  let lastFailureTime: number | undefined;
  let lastSuccessTime: number | undefined;
  let totalCalls = 0;
  let totalFailures = 0;
  let totalSuccesses = 0;
  let halfOpenCalls = 0;

  function transition(newState: CircuitState): void {
    const previous = state;
    state = newState;

    const msg = "[CircuitBreaker:" + name + "] State transition: " + previous + " -> " + newState;
    console.log(msg);

    if (newState === "open") {
      openedAt = Date.now();
      const backoff = calculateBackoff(Math.min(consecutiveFailures, 10));
      nextAttemptTime = Date.now() + backoff;
      const nextDate = new Date(nextAttemptTime).toISOString();
      console.log(
        "[CircuitBreaker:" +
          name +
          "] Circuit opened until " +
          nextDate +
          " (backoff: " +
          backoff +
          "ms)",
      );
    } else if (newState === "closed") {
      openedAt = undefined;
      nextAttemptTime = undefined;
      failureCount = 0;
      successCount = 0;
      halfOpenCalls = 0;
    } else if (newState === "half-open") {
      halfOpenCalls = 0;
      successCount = 0;
    }

    if (options.onStateChange) {
      try {
        options.onStateChange(newState, previous);
      } catch (err) {
        console.error("[CircuitBreaker:" + name + "] Error in state change callback:", err);
      }
    }
  }

  function shouldAllowRequest(): boolean {
    if (state === "closed") {
      return true;
    }

    if (state === "open") {
      if (nextAttemptTime && Date.now() >= nextAttemptTime) {
        transition("half-open");
        return true;
      }
      return false;
    }

    if (state === "half-open") {
      return halfOpenCalls < cfg.halfOpenMaxCalls;
    }

    return false;
  }

  function recordSuccess(): void {
    totalSuccesses++;
    lastSuccessTime = Date.now();

    if (state === "half-open") {
      successCount++;
      if (successCount >= cfg.successThreshold) {
        consecutiveFailures = 0;
        transition("closed");
      }
    } else if (state === "closed") {
      consecutiveFailures = 0;
    }
  }

  function recordFailure(error: Error): void {
    totalFailures++;
    consecutiveFailures++;
    lastFailureTime = Date.now();

    if (options.onError) {
      try {
        options.onError(error);
      } catch (err) {
        console.error("[CircuitBreaker:" + name + "] Error in error callback:", err);
      }
    }

    if (state === "half-open") {
      transition("open");
    } else if (state === "closed") {
      failureCount++;
      if (failureCount >= cfg.failureThreshold) {
        transition("open");
      }
    }
  }

  return {
    get name(): string {
      return name;
    },

    get state(): CircuitState {
      return state;
    },

    async execute<T>(fn: () => Promise<T>): Promise<T> {
      totalCalls++;

      if (!shouldAllowRequest()) {
        const waitTime = nextAttemptTime ? nextAttemptTime - Date.now() : cfg.timeoutMs;
        throw new CircuitBreakerOpenError(
          'Circuit breaker "' +
            name +
            '" is open. Try again in ' +
            Math.ceil(waitTime / 1000) +
            "s.",
          nextAttemptTime ?? Date.now() + cfg.timeoutMs,
        );
      }

      if (state === "half-open") {
        halfOpenCalls++;
      }

      try {
        const result = await fn();
        recordSuccess();
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        recordFailure(error);
        throw error;
      }
    },

    executeSync<T>(fn: () => T): T {
      totalCalls++;

      if (!shouldAllowRequest()) {
        const waitTime = nextAttemptTime ? nextAttemptTime - Date.now() : cfg.timeoutMs;
        throw new CircuitBreakerOpenError(
          'Circuit breaker "' +
            name +
            '" is open. Try again in ' +
            Math.ceil(waitTime / 1000) +
            "s.",
          nextAttemptTime ?? Date.now() + cfg.timeoutMs,
        );
      }

      if (state === "half-open") {
        halfOpenCalls++;
      }

      try {
        const result = fn();
        recordSuccess();
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        recordFailure(error);
        throw error;
      }
    },

    reset(): void {
      console.log("[CircuitBreaker:" + name + "] Resetting circuit breaker");
      transition("closed");
      consecutiveFailures = 0;
      totalCalls = 0;
      totalFailures = 0;
      totalSuccesses = 0;
    },

    getStats(): CircuitBreakerStats {
      return {
        state,
        failureCount,
        successCount,
        lastFailureTime,
        lastSuccessTime,
        openedAt,
        nextAttemptTime,
        totalCalls,
        totalFailures,
        totalSuccesses,
      };
    },

    getState(): CircuitState {
      return state;
    },
  };
}

export type CircuitBreaker = ReturnType<typeof createCircuitBreaker>;
