import { getAccessToken } from "@/lib/auth"

export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://seoscribe.frank-couchman.workers.dev"

export type NormalizedArticle = {
  id: string
  title: string
  topic: string
  content: string
  markdown: string
  html: string
  seo_score: number
  created_at: string
  updated_at: string
} & Record<string, any>

function mergeHeaders(input?: HeadersInit): Record<string, string> {
  if (!input) return {}
  if (input instanceof Headers) {
    return Array.from(input.entries()).reduce<Record<string, string>>((acc, [key, value]) => {
      acc[key] = value
      return acc
    }, {})
  }
  if (Array.isArray(input)) {
    return input.reduce<Record<string, string>>((acc, [key, value]) => {
      acc[key] = value
      return acc
    }, {})
  }
  return { ...input }
}

function withAuthHeaders(init: RequestInit = {}): RequestInit {
  const token = typeof window !== "undefined" ? getAccessToken() : null
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (token) headers["Authorization"] = `Bearer ${token}`
  return { ...init, headers: { ...headers, ...mergeHeaders(init.headers) } }
}

async function handle<T = any>(res: Response): Promise<T> {
  const rawText = await res.text().catch(() => "")
  const contentType = res.headers.get("content-type") || ""

  if (!res.ok) {
    let errorMsg = rawText || `Request failed: ${res.status}`
    try {
      const json = JSON.parse(rawText)
      errorMsg = json.error || json.message || errorMsg
    } catch {
      // Ignore JSON parse issues for error responses and fall back to the raw text
    }
    throw new Error(errorMsg)
  }

  // Gracefully handle malformed JSON from the backend to avoid crashing the client.
  if (contentType.includes("application/json") || rawText.trim().match(/^[\[{]/)) {
    try {
      return (rawText ? JSON.parse(rawText) : {}) as T
    } catch (error) {
      throw new Error("Invalid JSON response from server")
    }
  }

  return rawText as T
}
// Generate a draft article.  Calls the /api/draft endpoint instead of the legacy generate-draft route.
export async function generateDraft(payload:any){
  const url = `${API_BASE}/api/draft`
  const res = await fetch(url, withAuthHeaders({ method:"POST", body: JSON.stringify(payload), cache:"no-store" }))
  return handle(res)
}
function normalizeArticlePayload(payload: any): NormalizedArticle | null {
  if (!payload || typeof payload !== "object") return null
  const articleCandidate =
    (typeof payload.article === "object" && payload.article !== null && payload.article) ||
    (typeof payload.data === "object" && payload.data !== null && payload.data) ||
    payload

  const article = articleCandidate as Record<string, any>
  const createdAt =
    article.created_at ||
    article.createdAt ||
    article.updated_at ||
    article.updatedAt ||
    new Date().toISOString()

  const updatedAt = article.updated_at || article.updatedAt || createdAt

  return {
    ...article,
    id: article.id || article._id || article.uuid || "",
    title: article.title || article.headline || article.topic || "",
    topic: article.topic || article.title || "",
    content: article.content || article.markdown || article.html || "",
    markdown: article.markdown || "",
    html: article.html || "",
    seo_score: Number(article.seo_score ?? article.seoScore ?? article.score ?? 0) || 0,
    created_at: createdAt,
    updated_at: updatedAt,
  } as NormalizedArticle
}
export async function sendMagicLink(email:string, redirect?:string){ const res = await fetch(`${API_BASE}/auth/magic-link`, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ email, redirect }) }); return handle(res) }
export function googleAuthURL(redirect?:string){ const url = new URL(`${API_BASE}/auth/google`); if(redirect) url.searchParams.set("redirect", redirect); return url.toString() }
export async function getProfile(){ const res = await fetch(`${API_BASE}/api/profile`, withAuthHeaders({ method:"GET", cache:"no-store" })); return handle(res) }
export async function listArticles(): Promise<NormalizedArticle[]>{
  const res = await fetch(`${API_BASE}/api/articles`, withAuthHeaders({ method:"GET", cache:"no-store" }))
  const data = await handle(res)
  const rawList =
    (Array.isArray(data) && data) ||
    (Array.isArray((data as any)?.articles) && (data as any).articles) ||
    (Array.isArray((data as any)?.data) && (data as any).data) ||
    []

  return rawList
    .map(normalizeArticlePayload)
    .filter((article): article is NormalizedArticle => Boolean(article))
}
export async function getArticle(id: string): Promise<NormalizedArticle>{
  const res = await fetch(`${API_BASE}/api/articles/${id}`, withAuthHeaders({ method:"GET", cache:"no-store" }))
  const data = await handle(res)
  const article = normalizeArticlePayload(data)

  if (!article) {
    throw new Error("Invalid article payload from server")
  }

  return article
}
export async function saveArticle(payload: any){ const res = await fetch(`${API_BASE}/api/articles`, withAuthHeaders({ method:"POST", body: JSON.stringify(payload), cache:"no-store" })); return handle(res) }
export async function updateArticle(id: string, payload: any){ const res = await fetch(`${API_BASE}/api/articles/${id}`, withAuthHeaders({ method:"PUT", body: JSON.stringify(payload), cache:"no-store" })); return handle(res) }
export async function deleteArticle(id: string){ const res = await fetch(`${API_BASE}/api/articles/${id}`, withAuthHeaders({ method:"DELETE", cache:"no-store" })); return handle(res) }
export async function createCheckout(successUrl?:string, cancelUrl?:string){ const res = await fetch(`${API_BASE}/api/stripe/create-checkout`, withAuthHeaders({ method:"POST", body: JSON.stringify({ successUrl, cancelUrl }) })); return handle(res) }
export async function openPortal(returnUrl?:string){ const res = await fetch(`${API_BASE}/api/stripe/portal`, withAuthHeaders({ method:"POST", body: JSON.stringify({ returnUrl }) })); return handle(res) }

// Tool API endpoints
// Tool API endpoints updated to match backend worker routes.
/**
 * Generate a handful of headline ideas for a given topic.  The backend does not
 * expose a dedicated "generate headlines" endpoint, so we leverage the
 * AI assistant endpoint.  We construct a prompt asking for five
 * compelling article titles on the supplied topic.  The AI assistant
 * returns suggestions in the `suggestions` array.
 *
 * @param payload An object containing a `topic` string.  This value is
 * included in the prompt as the subject of the headlines.
 * @returns An object with a `headlines` array of strings.  If the
 * suggestion list is missing, an empty array is returned.
 */
/**
 * Generate a handful of headline ideas for a given topic or headline.
 * Accepts either a `topic` or a `headline` property on the payload.
 * If `topic` is provided it is used as the subject for the prompt;
 * otherwise the `headline` value is used.  This flexibility avoids
 * TypeScript errors when callers supply a `headline` key instead of
 * `topic`.
 *
 * The backend does not expose a dedicated headline generator endpoint,
 * so we leverage the AI assistant.  We request five suggestions
 * based on the topic/headline.  The assistant returns an array of
 * suggestions under the `suggestions` key.
 */
export async function generateHeadlines(payload: { topic?: string; headline?: string }) {
  const subject = payload.topic ?? payload.headline ?? ""
  const prompt = `Generate 5 compelling article headlines for: ${subject}`
  const body = {
    prompt,
    context: "",
    keyword: subject,
    region: "",
  }
  const res = await fetch(
    `${API_BASE}/api/ai-assistant`,
    withAuthHeaders({
      method: "POST",
      body: JSON.stringify(body),
      cache: "no-store",
    })
  )
  const data = await handle(res)
  return { headlines: (data as any)?.suggestions || [] }
}
export async function optimizeMetaTags(payload: { title: string }) {
  // Request a meta description for the provided title.  The backend
  // returns an object with a `description` field.  We derive a meta
  // title by truncating the input to 60 characters, ensuring it fits
  // recommended length guidelines.  If the API call fails, the
  // returned object may not include a description.
  const res = await fetch(
    `${API_BASE}/api/tools/meta-description`,
    withAuthHeaders({
      method: "POST",
      body: JSON.stringify({ content: payload.title }),
      cache: "no-store",
    })
  )
  const data = await handle(res)
  const rawTitle = String(payload.title || "").trim()
  const metaTitle = rawTitle.length > 60 ? rawTitle.slice(0, 57).trim() + "…" : rawTitle
  return {
    title: metaTitle,
    description: (data as any)?.description || "",
  }
}
// Suggest internal links by leveraging the keywords API to get keyword clusters.  The caller can derive internal links from this data.
export async function suggestInternalLinks(payload: { topic: string, text?: string }){
  // call the keyword clustering tool to get suggestions
  const res = await fetch(`${API_BASE}/api/tools/keywords`, withAuthHeaders({ method:"POST", body: JSON.stringify(payload), cache:"no-store" }))
  return handle(res)
}
export async function analyzeReadability(payload: { text: string }){
  const res = await fetch(`${API_BASE}/api/tools/readability`, withAuthHeaders({ method:"POST", body: JSON.stringify(payload), cache:"no-store" }))
  return handle(res)
}
export async function generateContentBrief(payload: { keyword: string, region?: string }){
  const res = await fetch(`${API_BASE}/api/tools/content-brief`, withAuthHeaders({ method:"POST", body: JSON.stringify(payload), cache:"no-store" }))
  return handle(res)
}
export async function checkKeywordDensity(payload: { topic: string, text?: string, region?: string }){
  const res = await fetch(`${API_BASE}/api/tools/keywords`, withAuthHeaders({ method:"POST", body: JSON.stringify(payload), cache:"no-store" }))
  return handle(res)
}
