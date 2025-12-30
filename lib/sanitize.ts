/**
 * Minimal HTML sanitizer for server/client safe rendering.
 * Strips script/style tags and removes inline event handlers.
 */
export function sanitizeHtml(input: unknown): string {
  if (!input || typeof input !== "string") return ""

  // Remove script/style tags and their content
  let cleaned = input.replace(/<\/(?:script|style)>/gi, (match) => match.toLowerCase())
  cleaned = cleaned.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "")

  // Drop inline event handlers (on*) and javascript: URLs
  cleaned = cleaned.replace(/ on[a-z]+\s*=\s*"[^"]*"/gi, "")
  cleaned = cleaned.replace(/ on[a-z]+\s*=\s*'[^']*'/gi, "")
  cleaned = cleaned.replace(/javascript:/gi, "")

  return cleaned
}
