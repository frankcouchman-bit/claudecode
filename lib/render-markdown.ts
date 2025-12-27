import DOMPurify from "isomorphic-dompurify"

/**
 * Lightweight Markdown renderer for client-side previews.
 * Converts common markdown syntax (headings, lists, emphasis, code)
 * into sanitized HTML without pulling in extra dependencies.
 */
export function renderMarkdownToHtml(markdown: string): string {
  if (!markdown || typeof markdown !== "string") return ""

  // Normalize line endings to simplify regex handling
  let html = markdown.replace(/\r\n/g, "\n").trim()

  // Headings
  html = html.replace(/^######\s?(.*)$/gm, "<h6>$1</h6>")
  html = html.replace(/^#####\s?(.*)$/gm, "<h5>$1</h5>")
  html = html.replace(/^####\s?(.*)$/gm, "<h4>$1</h4>")
  html = html.replace(/^###\s?(.*)$/gm, "<h3>$1</h3>")
  html = html.replace(/^##\s?(.*)$/gm, "<h2>$1</h2>")
  html = html.replace(/^#\s?(.*)$/gm, "<h1>$1</h1>")

  // Blockquotes
  html = html.replace(/^>\s?(.*)$/gm, "<blockquote>$1</blockquote>")

  // Inline code, bold, italics
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>")
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>")

  // Bullet lists
  html = html.replace(/^\s*[-*]\s+(.*)$/gm, "<li>$1</li>")
  html = html.replace(/(<li>.*<\/li>)(\s*(<li>.*<\/li>))+/gs, (match) => {
    const items = match.replace(/\n/g, "")
    return `<ul>${items}</ul>`
  })

  // Paragraphs for remaining lines that are not wrapped already
  html = html.replace(/^(?!<(?:h[1-6]|ul|li|p|blockquote|code|pre))(.*\S.*)$/gm, "<p>$1</p>")

  // Preserve single line breaks within paragraphs
  html = html.replace(/([^>])\n([^<])/g, "$1<br />$2")

  return DOMPurify.sanitize(html)
}
