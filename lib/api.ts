import { getAccessToken } from "@/lib/auth"
export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://seoscribe.frank-couchman.workers.dev"
function withAuthHeaders(init: RequestInit = {}): RequestInit {
  const token = typeof window !== 'undefined' ? getAccessToken() : null
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (token) headers["Authorization"] = `Bearer ${token}`
  return { ...init, headers: { ...headers, ...(init.headers as any || {}) } }
}
async function handle(res: Response) {
  if (!res.ok) { const text = await res.text().catch(()=> ''); throw new Error(text || `Request failed: ${res.status}`) }
  const ct = res.headers.get("content-type") || ""; if (ct.includes("application/json")) return res.json(); return res.text()
}
export async function generateDraft(payload:any){ const res = await fetch(`${API_BASE}/v1/generate-draft`, withAuthHeaders({ method:"POST", body: JSON.stringify(payload), cache:"no-store" })); return handle(res) }
export async function sendMagicLink(email:string, redirect?:string){ const res = await fetch(`${API_BASE}/auth/magic-link`, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ email, redirect }) }); return handle(res) }
export function googleAuthURL(redirect?:string){ const url = new URL(`${API_BASE}/auth/google`); if(redirect) url.searchParams.set("redirect", redirect); return url.toString() }
export async function getProfile(){ const res = await fetch(`${API_BASE}/api/profile`, withAuthHeaders({ method:"GET", cache:"no-store" })); return handle(res) }
export async function listArticles(){ const res = await fetch(`${API_BASE}/api/articles`, withAuthHeaders({ method:"GET", cache:"no-store" })); return handle(res) }
export async function createCheckout(successUrl?:string, cancelUrl?:string){ const res = await fetch(`${API_BASE}/api/stripe/create-checkout`, withAuthHeaders({ method:"POST", body: JSON.stringify({ successUrl, cancelUrl }) })); return handle(res) }
export async function openPortal(returnUrl?:string){ const res = await fetch(`${API_BASE}/api/stripe/portal`, withAuthHeaders({ method:"POST", body: JSON.stringify({ returnUrl }) })); return handle(res) }

// Tool API endpoints
export async function generateHeadlines(payload: { topic: string }){ const res = await fetch(`${API_BASE}/api/tools/headlines`, withAuthHeaders({ method:"POST", body: JSON.stringify(payload), cache:"no-store" })); return handle(res) }
export async function optimizeMetaTags(payload: { title: string }){ const res = await fetch(`${API_BASE}/api/tools/meta-tags`, withAuthHeaders({ method:"POST", body: JSON.stringify(payload), cache:"no-store" })); return handle(res) }
export async function suggestInternalLinks(payload: { content: string }){ const res = await fetch(`${API_BASE}/api/tools/internal-links`, withAuthHeaders({ method:"POST", body: JSON.stringify(payload), cache:"no-store" })); return handle(res) }
export async function analyzeReadability(payload: { content: string }){ const res = await fetch(`${API_BASE}/api/tools/readability`, withAuthHeaders({ method:"POST", body: JSON.stringify(payload), cache:"no-store" })); return handle(res) }
export async function generateContentBrief(payload: { topic: string }){ const res = await fetch(`${API_BASE}/api/tools/content-brief`, withAuthHeaders({ method:"POST", body: JSON.stringify(payload), cache:"no-store" })); return handle(res) }
export async function checkKeywordDensity(payload: { content: string }){ const res = await fetch(`${API_BASE}/api/tools/keyword-density`, withAuthHeaders({ method:"POST", body: JSON.stringify(payload), cache:"no-store" })); return handle(res) }
