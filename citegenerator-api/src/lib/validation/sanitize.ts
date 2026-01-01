import { ValidationError } from "./types.js";

export function sanitizeText(input: string, maxLength = 4096): string {
  const trimmed = input.trim();
  if (trimmed.length === 0) return "";
  if (trimmed.length > maxLength) {
    throw new ValidationError("Input too long", "INPUT_TOO_LONG");
  }
  // Remove ASCII control chars (except tab/newline/CR) without regex to satisfy eslint no-control-regex.
  let out = "";
  for (const ch of trimmed) {
    const code = ch.codePointAt(0) ?? 0;
    if (code === 9 || code === 10 || code === 13) {
      out += ch;
      continue;
    }
    if (code < 32 || code === 127) continue;
    out += ch;
  }
  return out;
}
