"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { generateDraft } from "@/lib/api"
import {
  Sparkles,
  Copy,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  TrendingUp
} from "lucide-react"

export default function Demo() {
  const [topic, setTopic] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function run() {
    if (!topic.trim()) {
      setError("Please enter a topic")
      return
    }
    setError(null)
    setLoading(true)
    try {
      const r = await generateDraft({
        topic: topic.trim(),
        tone: "professional",
        target_word_count: 3000,
        research: true,
        generate_social: true
      })
      setResult(r)
    } catch (e: any) {
      setError(e?.message || "Failed to generate")
    } finally {
      setLoading(false)
    }
  }

  function copyToClipboard() {
    if (result?.html) {
      navigator.clipboard.writeText(result.html)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function downloadMarkdown() {
    if (result?.markdown || result?.html) {
      const content = result.markdown || result.html
      const blob = new Blob([content], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${result?.title || 'article'}.md`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Generate Your Article</CardTitle>
              <CardDescription>
                Enter a topic and watch AI create SEO-optimized content in seconds
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="e.g., Best AI Writing Tools for Content Marketers in 2024"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && run()}
              className="flex-1 h-12 text-base"
              disabled={loading}
            />
            <Button
              onClick={run}
              disabled={loading}
              className="gradient-btn text-white h-12 px-8"
            >
              {loading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Article
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>No signup required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>2000+ words</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>SEO optimized</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      )}

      {/* Result Section */}
      {result && !loading && (
        <Card className="border-2 border-green-200 dark:border-green-800">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Generated Successfully
                  </Badge>
                  {result?.word_count && (
                    <Badge variant="outline">
                      <FileText className="w-3 h-3 mr-1" />
                      {result.word_count} words
                    </Badge>
                  )}
                  {result?.seo_score && (
                    <Badge
                      variant={result.seo_score >= 80 ? "success" : "warning"}
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      SEO: {result.seo_score}/100
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-3xl">{result?.title || "Your Article"}</CardTitle>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  {copied ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={downloadMarkdown}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-lg dark:prose-invert max-w-none
                         prose-headings:font-bold prose-headings:gradient-text
                         prose-p:text-muted-foreground prose-p:leading-relaxed
                         prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                         prose-img:rounded-lg prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: result?.html || "" }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
