"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { generateDraft, saveArticle } from "@/lib/api"
import { ArticlePreview } from "@/components/article-preview"
import { useQuota } from "@/contexts/quota-context"
import {
  canGenerateArticle,
  recordArticleGeneration,
  getRemainingQuota
} from "@/lib/quota-enforcement"
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Globe
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function Demo() {
  const { quota, isAuthenticated, updateQuota, syncWithBackend } = useQuota()
  const [topic, setTopic] = useState("")
  const [language, setLanguage] = useState("en")
  const [tone, setTone] = useState("professional")
  // Optional brief/instructions to guide the AI.  Users can add additional
  // context or promotional copy here.  This will be sent to the backend
  // when generating the draft.
  const [brief, setBrief] = useState("")
  // Word count selection.  Options are determined by plan: demo/guest users can
  // choose only 1500 words; free plan users up to 2000; pro users up to 3000.
  const [wordCount, setWordCount] = useState("3000")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Determine allowed word count options based on quota and plan
  const isProPlan = isAuthenticated && quota.plan === 'pro'
  const wordOptions = isAuthenticated
    ? isProPlan
      ? ["1500", "2000", "2500", "3000"]
      : ["1500", "2000"]
    : ["1500"]

  // Ensure selected word count remains within allowed options when quota changes
  useEffect(() => {
    if (!wordOptions.includes(wordCount)) {
      setWordCount(wordOptions[wordOptions.length - 1])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quota, isAuthenticated])

  async function run() {
    if (!topic.trim()) {
      setError("Please enter a topic")
      return
    }

    // Check quota enforcement
    const { allowed, reason } = canGenerateArticle(quota, isAuthenticated)

    if (!allowed) {
      setError(reason || "Generation limit reached")
      return
    }

    setError(null)
    setLoading(true)

    // Build the base payload for generation
    const requestedWordCount = parseInt(wordCount) || 2500
    // Include optional brief when provided.  Unknown fields will be
    // ignored by the backend but allow users to customise content.
    const basePayload = {
      topic: topic.trim(),
      tone: tone,
      language: language,
      target_word_count: requestedWordCount,
      research: true,
      generate_social: true,
      generate_image: true,
      generate_faqs: true,
      ...(brief.trim() ? { brief: brief.trim() } : {})
    }

    // Helper to handle successful generation: updates quota, saves article
    async function handleSuccess(r: any) {
      console.log('Generation successful:', r)

      // Record successful generation and update global state
      const updatedQuota = recordArticleGeneration(quota, isAuthenticated)
      updateQuota(updatedQuota)

      // Sync with backend if authenticated
      if (isAuthenticated) {
        setTimeout(() => syncWithBackend(), 1000)
      }

      setResult(r)

      // Automatically save articles to the library for signed in users
      if (isAuthenticated) {
        try {
      await saveArticle({
        // Persist all relevant fields to the backend.  Use a fallback for the
        // hero image because the Cloudflare worker may return the image
        // nested under an `image` object instead of directly on the root.
        title: r.title,
        content: r.html || r.markdown,
        markdown: r.markdown,
        html: r.html,
        meta_title: r.meta_title,
        meta_description: r.meta_description,
        meta_keywords: r.meta_keywords || r.keywords,
        seo_score: r.seo_score,
        readability_score: r.readability_score,
        word_count: r.word_count,
        image_url: r.image_url || (r.image && (r.image.image_url || r.image.image_b64)) || undefined,
        citations: r.citations,
        faqs: r.faqs,
        social_posts: r.social_posts,
        keywords: r.keywords,
        internal_links: r.internal_links,
      })
        } catch (saveErr) {
          console.error('Auto-save failed:', saveErr)
        }
      }
    }

    try {
      console.log('Generating article with payload:', basePayload)
      const r = await generateDraft(basePayload)
      await handleSuccess(r)
    } catch (e: any) {
      console.error('Generation failed:', e)
      let errorMessage = e?.message || "Failed to generate"
      // If the backend returns a 404 ("Not found"), retry with a default word
      // count of 3000.  Some deployments only allow certain word count
      // parameters and will return 404 for others.  Fallback to 3000 to
      // maintain functionality without user intervention.
      const messageStr = errorMessage.toLowerCase()
      if (messageStr.includes('not found')) {
        try {
          const fallbackPayload = { ...basePayload, target_word_count: 3000 }
          console.warn('Retrying generation with fallback payload:', fallbackPayload)
          const fallbackResult = await generateDraft(fallbackPayload)
          await handleSuccess(fallbackResult)
          return
        } catch (fallbackErr: any) {
          console.error('Fallback generation failed:', fallbackErr)
          errorMessage = fallbackErr?.message || errorMessage
        }
      }
      setError(`Error: ${errorMessage}. Check browser console for details.`)
    } finally {
      setLoading(false)
    }
  }

  const quotaInfo = getRemainingQuota(quota)

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
          <div className="flex flex-col gap-3">
            <Input
              placeholder="e.g., Best AI Writing Tools for Content Marketers in 2024"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && run()}
              className="h-12 text-base"
              disabled={loading}
            />

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <Select value={language} onValueChange={setLanguage} disabled={loading}>
                <SelectTrigger className="h-12">
                  <Globe className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="pt">Portuguese</SelectItem>
                  <SelectItem value="it">Italian</SelectItem>
                  <SelectItem value="nl">Dutch</SelectItem>
                  <SelectItem value="pl">Polish</SelectItem>
                  <SelectItem value="ru">Russian</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                  <SelectItem value="ko">Korean</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="tr">Turkish</SelectItem>
                </SelectContent>
              </Select>

              <Select value={tone} onValueChange={setTone} disabled={loading}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="authoritative">Authoritative</SelectItem>
                  <SelectItem value="conversational">Conversational</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                </SelectContent>
              </Select>

              <Select value={wordCount} onValueChange={setWordCount} disabled={loading}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Word Count" />
                </SelectTrigger>
                <SelectContent>
                  {wordOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {Number(option).toLocaleString()} words{option === '2500' && isProPlan ? ' (recommended)' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Optional brief/instructions */}
              <Textarea
                placeholder="Brief / extra instructions (optional)"
                value={brief}
                onChange={e => setBrief(e.target.value)}
                disabled={loading}
                className="sm:col-span-2 min-h-[80px] resize-none"
              />

              <Button
                onClick={run}
                disabled={loading}
                className="gradient-btn text-white h-12"
              >
                {loading ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
              >
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm flex-1">{error}</p>
                {!isAuthenticated && error.includes("locked") && (
                  <Link href="/auth">
                    <Button size="sm" className="gradient-btn text-white">
                      Sign Up
                    </Button>
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>25+ languages</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>AI-generated image</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Auto citations & FAQs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Social posts included</span>
              </div>
            </div>
            {quotaInfo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Badge variant="outline" className="text-xs">
                  {quotaInfo}
                </Badge>
              </motion.div>
            )}
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
      {result && !loading && <ArticlePreview result={result} />}
    </div>
  )
}
