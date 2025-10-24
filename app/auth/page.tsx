'use client'
import { useEffect, useState } from "react"
import { captureTokensFromURL, clearTokens } from "@/lib/auth"
import { sendMagicLink, googleAuthURL } from "@/lib/api"
import Link from "next/link"
export default function Page(){
  const [email,setEmail]=useState(''); const [sent,setSent]=useState(false); const [err,setErr]=useState<string|null>(null)
  useEffect(()=>{ captureTokensFromURL() },[])
  async function magic(){ setErr(null); try{ await sendMagicLink(email, typeof window!=='undefined'?window.location.origin + '/auth': undefined); setSent(true) } catch(e:any){ setErr(e?.message||'Failed') } }
  return (<div className="container py-16 max-w-lg">
    <h1 className="text-3xl font-bold">Sign in</h1>
    <p className="text-muted-foreground mt-2">Use a magic link or Google.</p>
    <div className="mt-6 space-y-3">
      <input className="border rounded px-3 py-2 w-full" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
      <button className="border px-4 py-2 rounded" onClick={magic}>Send Magic Link</button>
      <a className="underline block" href={googleAuthURL(typeof window!=='undefined'?window.location.origin + '/auth': undefined)}>Continue with Google</a>
      {sent && <p className="text-green-600 text-sm">Magic link sent.</p>}
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <Link className="text-sm underline" href="/dashboard">Go to Dashboard</Link>
      <button className="text-sm underline" onClick={clearTokens}>Sign out (clear tokens)</button>
    </div>
  </div>)
}
