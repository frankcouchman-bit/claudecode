import { getAccessToken } from "@/lib/auth"
export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://seoscribe.frank-couchman.workers.dev"
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
// Generate a draft article.  Calls the /api/draft endpoint instead of the legacy generate-draft route.
export async function generateDraft(payload:any){
  const url = `${API_BASE}/api/draft`
  const res = await fetch(url, withAuthHeaders({ method:"POST", body: JSON.stringify(payload), cache:"no-store" }))
  return handle(res)
}
export async function sendMagicLink(email:string, redirect?:string){ const res = await fetch(`${API_BASE}/auth/magic-link`, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ email, redirect }) }); return handle(res) }
export function googleAuthURL(redirect?:string){ const url = new URL(`${API_BASE}/auth/google`); if(redirect) url.searchParams.set("redirect", redirect); return url.toString() }
export async function getProfile(){ const res = await fetch(`${API_BASE}/api/profile`, withAuthHeaders({ method:"GET", cache:"no-store" })); return handle(res) }
export async function listArticles(){ const res = await fetch(`${API_BASE}/api/articles`, withAuthHeaders({ method:"GET", cache:"no-store" })); return handle(res) }
export async function getArticle(id: string){ const res = await fetch(`${API_BASE}/api/articles/${id}`, withAuthHeaders({ method:"GET", cache:"no-store" })); return handle(res) }
export async function saveArticle(payload: any){ const res = await fetch(`${API_BASE}/api/articles`, withAuthHeaders({ method:"POST", body: JSON.stringify(payload), cache:"no-store" })); return handle(res) }
export async function updateArticle(id: string, payload: any){ const res = await fetch(`${API_BASE}/api/articles/${id}`, withAuthHeaders({ method:"PUT", body: JSON.stringify(payload), cache:"no-store" })); return handle(res) }
export async function deleteArticle(id: string){ const res = await fetch(`${API_BASE}/api/articles/${id}`, withAuthHeaders({ method:"DELETE", cache:"no-store" })); return handle(res) }
export async function createCheckout(successUrl?:string, cancelUrl?:string){ const res = await fetch(`${API_BASE}/api/stripe/create-checkout`, withAuthHeaders({ method:"POST", body: JSON.stringify({ successUrl, cancelUrl }) })); return handle(res) }
export async function openPortal(returnUrl?:string){ const res = await fetch(`${API_BASE}/api/stripe/portal`, withAuthHeaders({ method:"POST", body: JSON.stringify({ returnUrl }) })); return handle(res) }

// Tool API endpoints
// Tool API endpoints updated to match backend worker routes.
export async function generateHeadlines(payload: { headline: string }){
  const res = await fetch(`${API_BASE}/api/tools/headline-analyzer`, withAuthHeaders({ method:"POST", body: JSON.stringify(payload), cache:"no-store" }))
  return handle(res)
}
export async function optimizeMetaTags(payload: { content: string }){
  const res = await fetch(`${API_BASE}/api/tools/meta-description`, withAuthHeaders({ method:"POST", body: JSON.stringify(payload), cache:"no-store" }))
  return handle(res)
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
