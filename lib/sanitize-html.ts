const STRIP_ELEMENTS = ["script", "style", "iframe", "object", "embed"].join("|")
const STRIP_REGEX = new RegExp(`<(${STRIP_ELEMENTS})(.|\n|\r)*?<\\/(?:${STRIP_ELEMENTS})>`, "gi")

function normalizeWhitespace(html: string) {
  return html.replace(/\s{2,}/g, " ").replace(/\n{3,}/g, "\n\n")
}

export function sanitizeHtml(input: unknown): string {
  if (typeof input !== "string") return ""
  const trimmed = input.trim()
  if (!trimmed) return ""

  // Remove obviously unsafe tags to prevent client-side crashes or hydration issues.
  const withoutScripts = trimmed.replace(STRIP_REGEX, "")

  // Some providers return plain text; wrap double newlines as paragraphs for readability.
  if (!/<[^>]+>/.test(withoutScripts)) {
    return withoutScripts
      .split(/\n{2,}/)
      .map((block) => block.trim())
      .filter(Boolean)
      .map((block) => `<p>${block.replace(/\n/g, "<br />")}</p>`)
      .join("\n")
  }

  return normalizeWhitespace(withoutScripts)
}

export function ensureHtml(input: unknown, fallbackMarkdown?: unknown) {
  const primary = sanitizeHtml(input)
  if (primary) return primary
  return sanitizeHtml(fallbackMarkdown)
}
