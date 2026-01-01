export interface AnalyticsService {
  track: (opts: {
    event: string;
    properties?: Record<string, string | number | boolean>;
    anonymousId?: string;
    requestId?: string;
  }) => Promise<void>;
}

type AnalyticsProvider = "none" | "posthog";

function getProvider(): AnalyticsProvider {
  const raw = (process.env.ANALYTICS_PROVIDER || "none").toLowerCase();
  if (raw === "posthog") return "posthog";
  return "none";
}

function safeString(value: unknown, maxLen: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const v = value.trim();
  if (!v) return undefined;
  return v.length > maxLen ? v.slice(0, maxLen) : v;
}

function sanitizeProperties(input: Record<string, string | number | boolean> | undefined) {
  if (!input) return undefined;
  const out: Record<string, string | number | boolean> = {};
  let count = 0;
  for (const [key, value] of Object.entries(input)) {
    if (count >= 25) break;
    const safeKey = safeString(key, 64);
    if (!safeKey) continue;
    if (typeof value === "string") out[safeKey] = safeString(value, 256) ?? "";
    else out[safeKey] = value;
    count += 1;
  }
  return out;
}

export function createAnalyticsService(): AnalyticsService {
  const provider = getProvider();

  if (provider === "posthog") {
    const apiKey = process.env.POSTHOG_API_KEY;
    const host = process.env.POSTHOG_HOST || "https://app.posthog.com";

    if (!apiKey) {
      return {
        async track() {
          // misconfigured; no-op
        },
      };
    }

    const captureUrl = new URL("/capture/", host).toString();

    return {
      async track({ event, properties, anonymousId, requestId }) {
        const distinctId =
          safeString(anonymousId, 128) || safeString(requestId, 128) || "anonymous";
        const props = sanitizeProperties(properties);

        // PostHog uses $ip for geo/IP capture. Explicitly disable for privacy.
        const payload = {
          api_key: apiKey,
          event,
          distinct_id: distinctId,
          properties: {
            ...(props || {}),
            $ip: null,
            $geoip_disable: true,
          },
          timestamp: new Date().toISOString(),
        };

        await fetch(captureUrl, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        }).then(() => undefined);
      },
    };
  }

  return {
    async track() {
      // no-op
    },
  };
}
