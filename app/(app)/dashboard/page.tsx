'use client'
import { useEffect, useState } from "react"
import Link from "next/link"
import { captureTokensFromURL, isAuthed, clearTokens } from "@/lib/auth"
import { getProfile, listArticles, createCheckout, openPortal } from "@/lib/api"
export default function Page(){
  const [authed,setAuthed]=useState(false); const [loading,setLoading]=useState(true)
  const [profile,setProfile]=useState<any>(null); const [articles,setArticles]=useState<any[]>([]); const [err,setErr]=useState<string|null>(null)
  useEffect(()=>{
    captureTokensFromURL(); const a=isAuthed(); setAuthed(a); if(!a){ setLoading(false) }
  },[])
  useEffect(()=>{
    (async ()=>{
      if(!authed){ return }
      setErr(null)
      try{
        const p=await getProfile(); setProfile(p)
        const rows=await listArticles(); setArticles(rows||[])
      }catch(e:any){ setErr(e?.message||'Failed') } finally{ setLoading(false) }
    })()
  },[authed])
  if(loading) return <div className="container py-16">Loading...</div>
  if(!authed) return (<div className="container py-16"><h1 className="text-3xl font-bold">Dashboard</h1><p className="mt-2 text-muted-foreground">Sign in to view your articles.</p><div className="mt-6"><Link href="/auth" className="underline">Go to Sign In</Link></div></div>)
  async function upgrade(){ try{ const {url}=await createCheckout(window.location.origin+'/dashboard?upgrade=success', window.location.origin+'/dashboard?upgrade=cancel'); window.location.href=url }catch(e:any){ alert(e?.message||'Checkout failed')} }
  async function portal(){ try{ const {url}=await openPortal(window.location.origin+'/dashboard'); window.location.href=url }catch(e:any){ alert(e?.message||'Portal failed')} }
  return (<div className="container py-10">
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="flex gap-2">
        <button className="border px-3 py-2 rounded" onClick={portal}>Manage billing</button>
        <button className="border px-3 py-2 rounded" onClick={upgrade}>Upgrade to Pro</button>
        <button className="text-sm underline" onClick={clearTokens}>Sign out</button>
      </div>
    </div>
    {err && <p className="mt-4 text-red-600">{err}</p>}
    <div className="mt-6 border rounded p-4">
      <h2 className="font-semibold text-lg">Plan & usage</h2>
      <p className="text-sm mt-1">Plan: {profile?.plan||'free'}</p>
      <p className="text-sm">Today generations: {profile?.usage?.today?.generations ?? 0}</p>
      <p className="text-sm">Month generations: {profile?.usage?.month?.generations ?? 0}</p>
      <p className="text-sm">Tools today: {profile?.tools_today ?? 0} / {profile?.tool_limit_daily ?? 0}</p>
    </div>
    <div className="mt-8">
      <h2 className="font-semibold text-lg mb-3">Your articles</h2>
      <div className="overflow-x-auto rounded border">
        <table className="min-w-full text-sm">
          <thead><tr><th className="text-left p-2">Title</th><th className="text-left p-2">Updated</th><th className="text-left p-2">Words</th><th className="text-left p-2">SEO</th><th className="text-left p-2">Status</th></tr></thead>
          <tbody>
          {articles.map((a:any)=>(<tr key={a.id} className="border-t">
            <td className="p-2">{a.title}</td>
            <td className="p-2">{new Date(a.updated_at||a.created_at).toLocaleString()}</td>
            <td className="p-2">{a.word_count??'-'}</td>
            <td className="p-2">{a.seo_score??'-'}</td>
            <td className="p-2">{a.status}</td>
          </tr>))}
          {articles.length===0 && (<tr><td className="p-2 text-muted-foreground" colSpan={5}>No articles yet. Try the <a className="underline" href="/article-writer">demo</a>.</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  </div>)
}
