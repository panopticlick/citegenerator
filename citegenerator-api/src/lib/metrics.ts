interface CounterMetric {
  type: "counter";
  value: number;
  help: string;
}

interface HistogramMetric {
  type: "histogram";
  values: number[];
  help: string;
  buckets: number[];
}

type Metric = CounterMetric | HistogramMetric;

interface MetricSnapshot {
  name: string;
  type: string;
  value: number;
  help: string;
  buckets?: { value: number; count: number }[];
}

const DEFAULT_HISTOGRAM_BUCKETS = [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];

export interface MetricsRegistry {
  incrementCounter(name: string, value?: number): void;
  recordHistogram(name: string, value: number): void;
  incrementCounterByEndpoint(endpoint: string, name: string, value?: number): void;
  recordResponseTime(endpoint: string, ms: number): void;
  recordError(endpoint: string, code: string): void;
  getSnapshot(): MetricSnapshot[];
  getMetricsText(): string;
  reset(): void;
}

interface EndpointStats {
  requests: number;
  errors: number;
  byErrorCode: Record<string, number>;
  responseTimes: number[];
}

export function createMetricsRegistry(): MetricsRegistry {
  const counters = new Map<string, CounterMetric>();
  const histograms = new Map<string, HistogramMetric>();
  const endpointStats = new Map<string, EndpointStats>();

  function getOrCreateCounter(name: string, help: string): CounterMetric {
    let metric = counters.get(name);
    if (!metric) {
      metric = { type: "counter", value: 0, help };
      counters.set(name, metric);
    }
    return metric;
  }

  function getOrCreateHistogram(name: string, help: string): HistogramMetric {
    let metric = histograms.get(name);
    if (!metric) {
      metric = {
        type: "histogram",
        values: [],
        help,
        buckets: DEFAULT_HISTOGRAM_BUCKETS,
      };
      histograms.set(name, metric);
    }
    return metric;
  }

  function getOrCreateEndpointStats(endpoint: string): EndpointStats {
    let stats = endpointStats.get(endpoint);
    if (!stats) {
      stats = {
        requests: 0,
        errors: 0,
        byErrorCode: {},
        responseTimes: [],
      };
      endpointStats.set(endpoint, stats);
    }
    return stats;
  }

  function calculateBuckets(
    values: number[],
    buckets: number[],
  ): { value: number; count: number }[] {
    const sorted = [...values].sort((a, b) => a - b);
    return buckets.map((bucket) => {
      const count = sorted.filter((v) => v <= bucket).length;
      return { value: bucket, count };
    });
  }

  return {
    incrementCounter(name: string, value: number = 1): void {
      const metric = getOrCreateCounter(name, name);
      metric.value += value;
      console.log("[Metrics] Counter " + name + " += " + value + " (total: " + metric.value + ")");
    },

    recordHistogram(name: string, value: number): void {
      const metric = getOrCreateHistogram(name, name);
      metric.values.push(value);

      // Keep only last 1000 values to prevent unbounded growth
      if (metric.values.length > 1000) {
        metric.values = metric.values.slice(-1000);
      }
    },

    incrementCounterByEndpoint(endpoint: string, name: string, value: number = 1): void {
      const counterName = "endpoint_" + name + "_" + endpoint.replace(/[^a-zA-Z0-9]/g, "_");
      this.incrementCounter(counterName, value);
    },

    recordResponseTime(endpoint: string, ms: number): void {
      const stats = getOrCreateEndpointStats(endpoint);
      stats.requests++;
      stats.responseTimes.push(ms);

      // Keep only last 1000 response times
      if (stats.responseTimes.length > 1000) {
        stats.responseTimes = stats.responseTimes.slice(-1000);
      }

      this.recordHistogram("response_time_ms", ms);
      this.incrementCounterByEndpoint(endpoint, "requests");

      console.log("[Metrics] " + endpoint + " response time: " + ms + "ms");
    },

    recordError(endpoint: string, code: string): void {
      const stats = getOrCreateEndpointStats(endpoint);
      stats.errors++;
      stats.byErrorCode[code] = (stats.byErrorCode[code] || 0) + 1;
      this.incrementCounterByEndpoint(endpoint, "errors");
      this.incrementCounter("errors_total");

      console.log("[Metrics] " + endpoint + " error: " + code);
    },

    getSnapshot(): MetricSnapshot[] {
      const snapshots: MetricSnapshot[] = [];

      for (const [name, metric] of counters) {
        snapshots.push({
          name,
          type: metric.type,
          value: metric.value,
          help: metric.help,
        });
      }

      for (const [name, metric] of histograms) {
        snapshots.push({
          name,
          type: metric.type,
          value: metric.values.length,
          help: metric.help,
          buckets: calculateBuckets(metric.values, metric.buckets),
        });
      }

      for (const [endpoint, stats] of endpointStats) {
        snapshots.push(
          {
            name: "endpoint_" + endpoint.replace(/[^a-zA-Z0-9]/g, "_") + "_requests",
            type: "counter",
            value: stats.requests,
            help: "Total requests to " + endpoint,
          },
          {
            name: "endpoint_" + endpoint.replace(/[^a-zA-Z0-9]/g, "_") + "_errors",
            type: "counter",
            value: stats.errors,
            help: "Total errors from " + endpoint,
          },
        );
      }

      return snapshots;
    },

    getMetricsText(): string {
      const lines: string[] = [];
      lines.push("# Citation Generator API Metrics");
      lines.push("# Generated at " + new Date().toISOString());
      lines.push("");

      for (const [name, metric] of counters) {
        lines.push("# HELP " + name + " " + metric.help);
        lines.push("# TYPE " + name + " " + metric.type);
        lines.push(name + " " + metric.value);
        lines.push("");
      }

      for (const [name, metric] of histograms) {
        lines.push("# HELP " + name + " " + metric.help);
        lines.push("# TYPE " + name + " " + metric.type);

        const sorted = [...metric.values].sort((a, b) => a - b);
        lines.push(name + "_count " + sorted.length);

        if (sorted.length > 0) {
          const sum = sorted.reduce((a, b) => a + b, 0);
          lines.push(name + "_sum " + sum);

          const buckets = calculateBuckets(metric.values, metric.buckets);
          let cumulativeCount = 0;
          for (const bucket of buckets) {
            cumulativeCount = bucket.count;
            lines.push(name + '_bucket{le="' + bucket.value + '"} ' + cumulativeCount);
          }
          lines.push(name + '_bucket{le="+Inf"} ' + sorted.length);
        }
        lines.push("");
      }

      for (const [endpoint, stats] of endpointStats) {
        const safeEndpoint = endpoint.replace(/[^a-zA-Z0-9]/g, "_");
        lines.push("# HELP endpoint_" + safeEndpoint + "_requests Total requests to " + endpoint);
        lines.push("# TYPE endpoint_" + safeEndpoint + "_requests counter");
        lines.push("endpoint_" + safeEndpoint + "_requests " + stats.requests);
        lines.push("");

        lines.push("# HELP endpoint_" + safeEndpoint + "_errors Total errors from " + endpoint);
        lines.push("# TYPE endpoint_" + safeEndpoint + "_errors counter");
        lines.push("endpoint_" + safeEndpoint + "_errors " + stats.errors);
        lines.push("");

        for (const [code, count] of Object.entries(stats.byErrorCode)) {
          lines.push("endpoint_" + safeEndpoint + '_errors{code="' + code + '"} ' + count);
        }
        if (Object.keys(stats.byErrorCode).length > 0) {
          lines.push("");
        }

        if (stats.responseTimes.length > 0) {
          const times = [...stats.responseTimes].sort((a, b) => a - b);
          const avg = times.reduce((a, b) => a + b, 0) / times.length;
          const p50 = times[Math.floor(times.length * 0.5)];
          const p95 = times[Math.floor(times.length * 0.95)];
          const p99 = times[Math.floor(times.length * 0.99)];

          lines.push(
            "# HELP endpoint_" +
              safeEndpoint +
              "_response_time_avg Average response time for " +
              endpoint,
          );
          lines.push("# TYPE endpoint_" + safeEndpoint + "_response_time_avg gauge");
          lines.push("endpoint_" + safeEndpoint + "_response_time_avg " + avg.toFixed(2));
          lines.push("");

          lines.push(
            "# HELP endpoint_" +
              safeEndpoint +
              "_response_time_p95 95th percentile response time for " +
              endpoint,
          );
          lines.push("# TYPE endpoint_" + safeEndpoint + "_response_time_p95 gauge");
          lines.push("endpoint_" + safeEndpoint + "_response_time_p95 " + p95);
          lines.push("");
        }
      }

      return lines.join("\n");
    },

    reset(): void {
      counters.clear();
      histograms.clear();
      endpointStats.clear();
      console.log("[Metrics] Reset all metrics");
    },
  };
}

export function createMetricsMiddleware(registry: MetricsRegistry) {
  return async (c: any, next: any) => {
    const startTime = Date.now();
    const url = new URL(c.req.url);
    const endpoint = url.pathname;

    await next();

    const responseTime = Date.now() - startTime;
    registry.recordResponseTime(endpoint, responseTime);

    if (c.res.status >= 400) {
      registry.recordError(endpoint, "status_" + c.res.status);
    }
  };
}
