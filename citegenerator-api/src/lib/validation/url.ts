import dns from "node:dns/promises";
import net from "node:net";
import { ValidationError } from "./types.js";

const DEFAULT_ALLOWED_PROTOCOLS = ["http:", "https:"];
const DEFAULT_BLOCKED_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "[::1]",
  "metadata.google.internal",
  "169.254.169.254",
  "metadata.azure.internal",
]);

function isPrivateIpv4(ip: string): boolean {
  const parts = ip.split(".").map((x) => Number(x));
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return false;
  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
}

function isPrivateIp(ip: string): boolean {
  const family = net.isIP(ip);
  if (family === 4) return isPrivateIpv4(ip);
  if (family === 6) {
    const normalized = ip.toLowerCase();
    if (normalized === "::1") return true;
    if (normalized.startsWith("fe80:")) return true; // link-local
    if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true; // ULA
  }
  return false;
}

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
]);

export function normalizeUrlForCitation(url: URL): URL {
  const clean = new URL(url.toString());
  for (const key of [...clean.searchParams.keys()]) {
    if (TRACKING_PARAMS.has(key)) clean.searchParams.delete(key);
  }
  // Remove trailing hash
  clean.hash = "";
  return clean;
}

export async function validatePublicHttpUrl(
  urlString: string,
  deps: {
    lookupAll?: (hostname: string) => Promise<Array<{ address: string; family: number }>>;
  } = {},
): Promise<URL> {
  if (urlString.length > 2048) {
    throw new ValidationError("URL too long", "INPUT_TOO_LONG", "url");
  }

  let url: URL;
  try {
    url = new URL(urlString);
  } catch {
    throw new ValidationError("Invalid URL", "INVALID_URL", "url");
  }

  if (!DEFAULT_ALLOWED_PROTOCOLS.includes(url.protocol)) {
    throw new ValidationError("Blocked protocol", "BLOCKED_PROTOCOL", "url");
  }

  const hostname = url.hostname.toLowerCase();
  if (DEFAULT_BLOCKED_HOSTS.has(hostname)) {
    throw new ValidationError("Blocked host", "BLOCKED_HOST", "url");
  }

  // If hostname is an IP literal, check private ranges directly.
  if (net.isIP(hostname)) {
    if (isPrivateIp(hostname)) {
      throw new ValidationError("Private IP not allowed", "PRIVATE_IP", "url");
    }
    return normalizeUrlForCitation(url);
  }

  // Resolve to prevent DNS rebinding / internal targets.
  const lookupAll =
    deps.lookupAll ??
    (async (h: string) =>
      dns.lookup(h, { all: true, verbatim: true }) as unknown as Array<{
        address: string;
        family: number;
      }>);
  const answers = await lookupAll(hostname);
  for (const ans of answers) {
    if (isPrivateIp(ans.address)) {
      throw new ValidationError("SSRF detected", "SSRF_DETECTED", "url");
    }
  }

  return normalizeUrlForCitation(url);
}
