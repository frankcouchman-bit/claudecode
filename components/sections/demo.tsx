"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { generateDraft } from "@/lib/api"
export default function Demo() {
  const [topic, setTopic] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  async function run() {
    if (!topic.trim()) { setError("Please enter a topic"); return }
    setError(null); setLoading(true)
    try {
      const r = await generateDraft({ topic: topic.trim(), tone: "professional", target_word_count: 3000, research: true, generate_social: true })
      setResult(r)
    } catch (e: any) { setError(e?.message || "Failed to generate") } finally { setLoading(false) }
  }
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="font-semibold">Try a demo article</h3>
      <p className="text-sm text-muted-foreground mb-4">No signup required. Limited to 1 demo per month.</p>
      <div className="flex gap-2">
        <Input placeholder="e.g., Best AI writer for agencies" value={topic} onChange={e => setTopic(e.target.value)} />
        <Button onClick={run} disabled={loading}>{loading ? "Generating..." : "Generate"}</Button>
      </div>
      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      {result && (
        <div className="mt-6 space-y-4">
          <h4 className="text-xl font-semibold">{result?.title || "Draft"}</h4>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: result?.html || "" }} />
        </div>
      )}
    </div>
  )
}
