import { getAccessToken } from "@/lib/auth"
// Determine the base URL for the API.  At runtime the front‑end may define
// either `NEXT_PUBLIC_API_URL` or `PUBLIC_API_URL`.  Fallback to the
// default Cloudflare Worker URL when no environment variable is provided.
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.PUBLIC_API_URL ||
  "https://seoscribe.frank-couchman.workers.dev"
function withAuthHeaders(init: RequestInit = {}): RequestInit {
  const token = typeof window !== 'undefined' ? getAccessToken() : null
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (token) headers["Authorization"] = `Bearer ${token}`
  return { ...init, headers: { ...headers, ...(init.headers as any || {}) } }
}
async function handle(res: Response) {
  if (!res.ok) {
    const text = await res.text().catch(()=> '')
    let errorMsg = text || `Request failed: ${res.status}`
    try {
      const json = JSON.parse(text)
      errorMsg = json.error || json.message || errorMsg
    } catch {}
    throw new Error(errorMsg)
  }
  const ct = res.headers.get("content-type") || ""; if (ct.includes("application/json")) return res.json(); return res.text()
}
export async function generateDraft(payload:any){
  // Use the /api/draft endpoint defined in the Cloudflare worker.  The
  // previous implementation pointed to `/api/generate-draft` which does
  // not exist on the backend and resulted in 404 errors.  See worker
  // routes for details.
  const url = `${API_BASE}/api/draft`
  const res = await fetch(url, withAuthHeaders({
    method: "POST",
    body: JSON.stringify(payload),
    cache: "no-store",
  }))
  return handle(res)
}
export async function sendMagicLink(email:string, redirect?:string){ const res = await fetch(`${API_BASE}/auth/magic-link`, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ email, redirect }) }); return handle(res) }
export function googleAuthURL(redirect?:string){ const url = new URL(`${API_BASE}/auth/google`); if(redirect) url.searchParams.set("redirect", redirect); return url.toString() }
export async function getProfile(){ const res = await fetch(`${API_BASE}/api/profile`, withAuthHeaders({ method:"GET", cache:"no-store" })); return handle(res) }
// Fetch a list of articles from the backend.  The backend may return either
// an array of articles directly or wrap the array under an `articles` key.
// Historically the frontend assumed the response was always an array and
// immediately called `.map` on the result.  When the backend response
// changed shape, this caused a `map is not a function` runtime error on
// the dashboard.  To make the code resilient to changes, normalize the
// output so it is always an array.
export async function listArticles() {
  const res = await fetch(
    `${API_BASE}/api/articles`,
    withAuthHeaders({ method: "GET", cache: "no-store" })
  )
  const data = await handle(res)
  // If the response is already an array, use it directly.
  if (Array.isArray(data)) {
    return data
  }
  // Some backends wrap the articles array in an `articles` property.
  if (data && Array.isArray((data as any).articles)) {
    return (data as any).articles
  }
  // Fallback to an empty array if the response structure is unexpected.
  return []
}
export async function getArticle(id: string){ const res = await fetch(`${API_BASE}/api/articles/${id}`, withAuthHeaders({ method:"GET", cache:"no-store" })); return handle(res) }
export async function saveArticle(payload: any){ const res = await fetch(`${API_BASE}/api/articles`, withAuthHeaders({ method:"POST", body: JSON.stringify(payload), cache:"no-store" })); return handle(res) }
export async function updateArticle(id: string, payload: any){ const res = await fetch(`${API_BASE}/api/articles/${id}`, withAuthHeaders({ method:"PUT", body: JSON.stringify(payload), cache:"no-store" })); return handle(res) }
export async function deleteArticle(id: string){ const res = await fetch(`${API_BASE}/api/articles/${id}`, withAuthHeaders({ method:"DELETE", cache:"no-store" })); return handle(res) }
export async function createCheckout(successUrl?:string, cancelUrl?:string){ const res = await fetch(`${API_BASE}/api/stripe/create-checkout`, withAuthHeaders({ method:"POST", body: JSON.stringify({ successUrl, cancelUrl }) })); return handle(res) }
export async function openPortal(returnUrl?:string){ const res = await fetch(`${API_BASE}/api/stripe/portal`, withAuthHeaders({ method:"POST", body: JSON.stringify({ returnUrl }) })); return handle(res) }

// Tool API endpoints
// Generate headline ideas using the AI assistant.  The backend's
// `/api/ai-assistant` endpoint accepts a prompt and returns a list of
// suggestions.  We ask for five headlines based on the provided topic.
export async function generateHeadlines(payload: { topic: string }) {
  const prompt = `Generate 5 compelling article headlines for: ${payload.topic}`
  const body = {
    prompt,
    context: "",
    keyword: payload.topic,
    region: "",
  }
  const res = await fetch(`${API_BASE}/api/ai-assistant`, withAuthHeaders({
    method: "POST",
    body: JSON.stringify(body),
    cache: "no-store",
  }))
  const data = await handle(res)
  return { headlines: data?.suggestions || [] }
}

// Generate and optimise meta tags (title & description) for a given piece
// of content.  The backend offers `/api/tools/meta-description` which
// accepts a `content` field and returns a meta description.  We wrap
// the response to provide both the description and a suggested title.
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
    description: data?.description || "",
  }
}

// Suggest internal links for a block of content.  The backend does not
// expose a dedicated internal linking endpoint, so we leverage the
// `/api/tools/keywords` endpoint to extract primary and secondary
// keywords from the provided content.  We then convert those keywords
// into simple anchor suggestions.  Each suggestion includes an
// `anchor` (the keyword) and a placeholder `url` which can be
// customised by the caller.
export async function suggestInternalLinks(payload: { content: string }) {
  const text = String(payload.content || "")
  const res = await fetch(
    `${API_BASE}/api/tools/keywords`,
    withAuthHeaders({
      method: "POST",
      body: JSON.stringify({
        topic: text.slice(0, 80),
        text,
      }),
      cache: "no-store",
    })
  )
  const data = await handle(res)
  const keywords: string[] = []
  if (Array.isArray((data as any).primary)) keywords.push(...(data as any).primary)
  if (Array.isArray((data as any).secondary)) keywords.push(...(data as any).secondary)
  if (Array.isArray((data as any).questions)) keywords.push(...(data as any).questions)
  if (Array.isArray((data as any).long_tail)) keywords.push(...(data as any).long_tail)
  const unique = Array.from(new Set(keywords)).filter(Boolean)
  const links = unique.slice(0, 10).map((k) => ({ anchor: k, url: "#" }))
  return { links }
}

// Analyze readability of a piece of content.  The backend accepts a
// `text` field for readability analysis.  We map our `content`
// parameter to `text` to maintain backward compatibility with the
// caller.
export async function analyzeReadability(payload: { content: string }) {
  const res = await fetch(
    `${API_BASE}/api/tools/readability`,
    withAuthHeaders({
      method: "POST",
      body: JSON.stringify({ text: payload.content }),
      cache: "no-store",
    })
  )
  return handle(res)
}

// Analyze a headline using the AI headline analyzer.  Returns an object
// with score, length, word count, and feedback.  See Cloudflare worker
// endpoint `/api/tools/headline-analyzer` for details.
export async function analyzeHeadlineApi(payload: { headline: string }) {
  const res = await fetch(
    `${API_BASE}/api/tools/headline-analyzer`,
    withAuthHeaders({
      method: "POST",
      body: JSON.stringify({ headline: payload.headline }),
      cache: "no-store",
    })
  )
  return handle(res)
}

// Generate a SERP preview snippet given a title, description and URL.
// Returns an object with Google, Twitter, Facebook and LinkedIn previews.
export async function serpPreview(payload: { title: string; description: string; url: string }) {
  const res = await fetch(
    `${API_BASE}/api/tools/serp-preview`,
    withAuthHeaders({
      method: "POST",
      body: JSON.stringify({ title: payload.title, description: payload.description, url: payload.url }),
      cache: "no-store",
    })
  )
  return handle(res)
}

// Check plagiarism for a block of text.  Returns originality score and metrics.
export async function checkPlagiarism(payload: { content: string }) {
  const res = await fetch(
    `${API_BASE}/api/tools/plagiarism`,
    withAuthHeaders({
      method: "POST",
      body: JSON.stringify({ text: payload.content }),
      cache: "no-store",
    })
  )
  return handle(res)
}

// Run competitor analysis for a keyword.  Returns difficulty, top content insights and recommendations.
export async function competitorAnalysis(payload: { keyword: string }) {
  const res = await fetch(
    `${API_BASE}/api/tools/competitor-analysis`,
    withAuthHeaders({
      method: "POST",
      body: JSON.stringify({ keyword: payload.keyword }),
      cache: "no-store",
    })
  )
  return handle(res)
}

// Generate a content brief for a given topic.  The backend expects a
// `keyword` parameter rather than `topic`.  Provide the keyword and
// return the backend response as-is.
export async function generateContentBrief(payload: { topic: string }) {
  const res = await fetch(
    `${API_BASE}/api/tools/content-brief`,
    withAuthHeaders({
      method: "POST",
      body: JSON.stringify({ keyword: payload.topic }),
      cache: "no-store",
    })
  )
  return handle(res)
}

// Compute keyword density on the client side.  This helper splits
// the provided content into words, counts occurrences and returns
// the top keywords with their counts and densities.  No network
// requests are made.
export async function checkKeywordDensity(payload: { content: string }) {
  const text = String(payload.content || "")
  // Normalise text: remove punctuation and convert to lowercase
  const cleaned = text
    .replace(/[^a-zA-Z0-9\s]+/g, " ")
    .toLowerCase()
  const words = cleaned.split(/\s+/).filter((w) => w.length > 2)
  const total = words.length || 1
  const counts: Record<string, number> = {}
  for (const w of words) {
    counts[w] = (counts[w] || 0) + 1
  }
  const top = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({
      word,
      count,
      density: Math.round((count / total) * 1000) / 10, // one decimal place
    }))
  return { keywords: top }
}
