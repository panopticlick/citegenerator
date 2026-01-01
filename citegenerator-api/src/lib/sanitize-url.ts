const TRACKING_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "mc_cid",
  "mc_eid",
  "msclkid",
  "twclid",
  "dclid",
  "gbraid",
  "wbraid",
  "igshid",
  "_ga",
  "_gl",
  "referrer",
]);

const AUTH_PATTERN = /:\/\/([^:]+):([^@]+)@/;

export interface SanitizedUrlResult {
  original: string;
  sanitized: string;
  changes: {
    authRemoved: boolean;
    fragmentRemoved: boolean;
    trackingParamsRemoved: string[];
  };
}

export function sanitizeUrl(url: string): string {
  try {
    const result = sanitizeUrlDetailed(url);
    return result.sanitized;
  } catch {
    return url;
  }
}

export function sanitizeUrlDetailed(url: string): SanitizedUrlResult {
  let cleaned = url;
  const changes: SanitizedUrlResult["changes"] = {
    authRemoved: false,
    fragmentRemoved: false,
    trackingParamsRemoved: [],
  };

  // Remove authentication credentials
  if (AUTH_PATTERN.test(cleaned)) {
    cleaned = cleaned.replace(AUTH_PATTERN, "://");
    changes.authRemoved = true;
    console.log("[SanitizeURL] Removed auth credentials from URL");
  }

  try {
    const urlObj = new URL(cleaned);

    // Remove fragment
    if (urlObj.hash) {
      urlObj.hash = "";
      changes.fragmentRemoved = true;
    }

    // Remove tracking parameters
    const paramsToDelete: string[] = [];
    for (const key of urlObj.searchParams.keys()) {
      if (TRACKING_PARAMS.has(key)) {
        paramsToDelete.push(key);
        changes.trackingParamsRemoved.push(key);
      }
    }

    for (const key of paramsToDelete) {
      urlObj.searchParams.delete(key);
    }

    if (paramsToDelete.length > 0) {
      console.log("[SanitizeURL] Removed tracking params: " + paramsToDelete.join(", "));
    }

    cleaned = urlObj.toString();
  } catch {
    // URL parsing failed, return original with any auth removed
  }

  return {
    original: url,
    sanitized: cleaned,
    changes,
  };
}

export function stripTrackingParams(url: string): string {
  try {
    const urlObj = new URL(url);
    let modified = false;

    for (const key of [...urlObj.searchParams.keys()]) {
      if (TRACKING_PARAMS.has(key)) {
        urlObj.searchParams.delete(key);
        modified = true;
      }
    }

    return modified ? urlObj.toString() : url;
  } catch {
    return url;
  }
}

export function hasAuthCredentials(url: string): boolean {
  return AUTH_PATTERN.test(url);
}

export function removeAuthFromUrl(url: string): string {
  return url.replace(AUTH_PATTERN, "://");
}

export function removeFragmentFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    urlObj.hash = "";
    return urlObj.toString();
  } catch {
    return url;
  }
}
