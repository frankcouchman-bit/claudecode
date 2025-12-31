"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { generateDraft, saveArticle, suggestInternalLinks } from "@/lib/api"
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
import { GenerationErrorBoundary } from "@/components/generation-error-boundary"

export default function Demo() {
  const { quota, isAuthenticated, updateQuota, syncWithBackend } = useQuota()

  const normalizeSiteUrl = (value: string) => {
    const trimmed = (value || "").trim()
    if (!trimmed) return ""
    try {
      const url = trimmed.startsWith("http") ? new URL(trimmed) : new URL(`https://${trimmed}`)
      return url.origin
    } catch {
      return ""
    }
  }

  const coerceText = (value: any) => {
    if (typeof value === "string") return value
    if (value === null || value === undefined) return ""
    if (typeof value === "object") {
      try {
        return JSON.stringify(value)
      } catch {
        return String(value)
      }
    }
    return String(value)
  }

  const normalizeResult = (raw: any) => {
    if (!raw) return null
    // Attempt to parse string payloads from the API
    if (typeof raw === "string") {
      try {
        raw = JSON.parse(raw)
      } catch {
        return { title: topic.trim(), markdown: raw, html: raw }
      }
    }

    const article = (raw as any)?.article || raw
    const seoMeta = (article && typeof (article as any).seo === "object") ? (article as any).seo : undefined
    const title = article?.title || article?.topic || topic.trim()

    const resolveContent = () => {
      const sectionBlocks = Array.isArray((article as any)?.sections) ? (article as any).sections : null

      const normalizeSectionBody = (body: any) => {
        if (Array.isArray(body)) {
          return body.map(item => coerceText(item)).filter(Boolean).join("\n\n")
        }
        if (body && typeof body === "object") {
          const candidate =
            (body as any).content ||
            (body as any).text ||
            (body as any).body ||
            Object.values(body as any).join("\n\n")
          return coerceText(candidate)
        }
        return coerceText(body)
      }

      if (sectionBlocks && sectionBlocks.length > 0) {
        return sectionBlocks
          .map((section: any) => {
            const heading = coerceText(section?.heading || section?.title || "")
            const body = normalizeSectionBody(section?.content ?? section?.body ?? section?.text ?? "")
            return `${heading ? `## ${heading}\n\n` : ""}${body}`
          })
          .join("\n\n")
      }

      const candidates = [
        article?.html,
        article?.markdown,
        article?.content,
        article?.body,
        (article as any)?.content?.html,
        (article as any)?.content?.markdown,
        (article as any)?.content?.text,
      ]

      for (const candidate of candidates) {
        if (typeof candidate === "string" && candidate.trim().length > 0) return candidate
        if (candidate && typeof candidate === "object") {
          const nested = (candidate as any)?.html || (candidate as any)?.markdown || (candidate as any)?.content
          if (typeof nested === "string" && nested.trim().length > 0) return nested
        }
      }

      return ""
    }

    const rawContent = resolveContent()
    const markdown = coerceText(rawContent)
    const html = markdown

    const seoScoreCandidate =
      article?.seo_score ??
      article?.seoScore ??
      article?.score ??
      article?.grade ??
      article?.overall ??
      seoMeta?.overall ??
      seoMeta?.score ??
      seoMeta?.grade

    const safeKeywords = Array.isArray(article?.keywords)
      ? article.keywords.map((kw: any) => coerceText(kw)).filter(Boolean)
      : Array.isArray(seoMeta?.keywords)
        ? seoMeta.keywords.map((kw: any) => coerceText(kw)).filter(Boolean)
        : []

    const safeMetaKeywords = Array.isArray(article?.meta_keywords)
      ? article.meta_keywords.map((kw: any) => coerceText(kw)).filter(Boolean)
      : Array.isArray(article?.metaKeywords)
        ? article.metaKeywords.map((kw: any) => coerceText(kw)).filter(Boolean)
        : []

    const safeCitations = Array.isArray(article?.citations)
      ? article.citations.map((c: any) => ({
          url: coerceText(c?.url || ""),
          title: coerceText(c?.title || c?.url || ""),
          description: coerceText(c?.description || ""),
        }))
      : []

    const safeFaqs = Array.isArray(article?.faqs)
      ? article.faqs
          .map((faq: any) => ({
            question: coerceText(faq?.question || ""),
            answer: coerceText(faq?.answer || ""),
          }))
          .filter(f => f.question || f.answer)
      : []

    const safeSocial = (() => {
      const sp = (article as any)?.social_posts ?? (article as any)?.socialPosts
      if (Array.isArray(sp)) return sp.map((post: any) => ({ platform: coerceText(post?.platform || ""), content: coerceText(post?.content || "") }))
      if (sp && typeof sp === "object") return Object.entries(sp).map(([platform, content]: any) => ({ platform: coerceText(platform), content: coerceText(content) }))
      return []
    })()

    const safeLinks = Array.isArray(article?.internal_links)
      ? article.internal_links
          .map((link: any) => ({
            url: coerceText(link?.url || ""),
            anchor_text: coerceText(link?.anchor_text || link?.anchorText || link?.title || link?.url || ""),
          }))
          .filter(l => l.url.length > 0)
      : []

    const safeHeadings = Array.isArray(article?.headings)
      ? article.headings.map((h: any) => coerceText(h)).filter(Boolean)
      : []

    const safeSeoScore =
      typeof seoScoreCandidate === "object"
        ? Number(
            seoScoreCandidate?.overall ??
              seoScoreCandidate?.score ??
              seoScoreCandidate?.grade ??
              seoScoreCandidate?.word_count ??
              0
          ) || 0
        : Number(seoScoreCandidate) || 0

    const safeReadability = (() => {
      const candidate = article?.readability_score ?? article?.readabilityScore
      const num = Number(candidate)
      if (Number.isFinite(num) && num > 0) return num
      if (typeof candidate === "string" && candidate.trim().length > 0) return candidate
      return null
    })()

    const safeImage = coerceText(
      (article as any)?.image_url ||
      (article as any)?.image?.image_url ||
      (article as any)?.image?.url ||
      (article as any)?.image?.src ||
      (article as any)?.image ||
      (article as any)?.hero_image ||
      (article as any)?.heroImage ||
      ""
    )

    return {
      title,
      topic: coerceText(article?.topic || title),
      markdown,
      html,
      meta_title: coerceText(article?.meta_title || article?.metaTitle),
      meta_description: coerceText(article?.meta_description || article?.metaDescription),
      keywords: safeKeywords,
      meta_keywords: safeMetaKeywords,
      citations: safeCitations,
      faqs: safeFaqs,
      social_posts: safeSocial,
      internal_links: safeLinks,
      headings: safeHeadings,
      seo_score: safeSeoScore,
      word_count:
        Number(article?.word_count || article?.wordCount || seoMeta?.word_count) ||
        (markdown ? markdown.split(/\s+/).filter(Boolean).length : 0),
      readability_score: safeReadability,
      image_url: safeImage,
    }
  }

  // Determine allowed word counts based on plan. Memoize to keep Select stable
  const wordOptions = useMemo(() => {
    if (!isAuthenticated || quota.plan === 'free') return ["2000"]
    // Pro plan (quick + extended options)
    return ["2000", "2500", "3000", "3500"]
  }, [isAuthenticated, quota.plan])
  const [topic, setTopic] = useState("")
  const [language, setLanguage] = useState("en")
  const [tone, setTone] = useState("professional")
  // Word count selection; will be constrained by plan
  const [wordCount, setWordCount] = useState(() => wordOptions[wordOptions.length - 1])
  // Optional brief/instructions to guide generation
  const [brief, setBrief] = useState("")
  const [siteUrl, setSiteUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const generationGate = useMemo(
    () => canGenerateArticle(quota, isAuthenticated),
    [quota, isAuthenticated]
  )

  // Ensure selected word count remains valid when plan or options change
  useEffect(() => {
    if (!wordOptions.includes(wordCount)) {
      setWordCount(wordOptions[wordOptions.length - 1])
    }
  }, [wordOptions, wordCount])

  async function run() {
    if (!topic.trim()) {
      setError("Please enter a topic")
      return
    }

    // Check quota enforcement
    if (!generationGate.allowed) {
      setError(generationGate.reason || "Generation limit reached")
      return
    }

    setError(null)
    setResult(null)
    setLoading(true)
    try {
      const desiredWords = Math.max(parseInt(wordCount) || 0, 2000)
      const seoBrief = `Write a deeply researched, long-form article of at least ${desiredWords} words with rich H2/H3 structure, skimmable bullet lists, examples, and step-by-step guidance. Include an introduction, concluding CTA, concise meta title/description, keyword list, and 4–6 FAQs. Aim for high readability with short paragraphs and bold subheadings. Add a clear hero image description tied to the topic and suggest 3–5 internal links when possible.`
      const combinedBrief = brief.trim()
        ? `${brief.trim()}\n\n${seoBrief}`
        : seoBrief

      const normalizedSite = normalizeSiteUrl(siteUrl)

      console.log('Generating article with payload:', {
        topic: topic.trim(),
        tone,
        language,
        target_word_count: desiredWords
      })

      const r = await generateDraft({
        topic: topic.trim(),
        tone: tone,
        language: language,
        target_word_count: desiredWords,
        research: true,
        generate_social: true,
        generate_image: true,
        generate_faqs: true,
        provider: "openrouter",
        model: "anthropic/claude-3.7-sonnet-20250219",
        search_provider: "serper",
        site_url: normalizedSite || undefined,
        // Include optional brief/instructions if provided
        brief: combinedBrief
      })

      console.log('Generation successful:', r)
      const safeResult = normalizeResult(r)

      if (!safeResult) {
        throw new Error("Empty response from generator")
      }

      // Backfill internal link suggestions when the generator response is missing them.
      let enrichedResult = safeResult
      const needsLinks =
        (!Array.isArray(safeResult.internal_links) || safeResult.internal_links.length < 3) &&
        Boolean(safeResult.markdown || safeResult.html)

      if (needsLinks) {
        try {
          const linkResponse = await suggestInternalLinks({
            topic: safeResult.title || topic.trim(),
            text: (safeResult.markdown || safeResult.html || "").slice(0, 20000),
            domain: normalizedSite || undefined,
            site_url: normalizedSite || undefined,
          })

          const incomingLinks =
            (Array.isArray((linkResponse as any)?.links) && (linkResponse as any).links) ||
            (Array.isArray((linkResponse as any)?.suggestions) && (linkResponse as any).suggestions) ||
            []

          const normalizedLinks = incomingLinks
            .map((link: any, idx: number) => ({
              url: coerceText(link?.url || link?.href || ""),
              anchor_text: coerceText(link?.anchor_text || link?.anchorText || link?.title || link?.url || link?.href || `Suggested link ${idx + 1}`),
            }))
            .filter(link => link.url.length > 0)

          // If we still have fewer than 3 links, synthesize fallback anchors using the site
          // domain and article headings to keep the UX consistent.
          if (normalizedLinks.length < 3) {
            const headingSlugs = (safeResult.headings || []).slice(0, 3)
            const base = normalizedSite || "https://example.com"
            const filler = headingSlugs.map((heading: string, i: number) => ({
              url: `${base}/${heading.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "") || `section-${i + 1}`}`,
              anchor_text: heading || `Related resource ${i + 1}`,
            }))
            normalizedLinks.push(...filler)
          }

          if (normalizedLinks.length > 0) {
            enrichedResult = { ...safeResult, internal_links: normalizedLinks.slice(0, 5) }
          }
        } catch (linkError) {
          console.error("Failed to fetch internal links", linkError)
        }
      }

      // Record successful generation and update global state
      const updatedQuota = recordArticleGeneration(quota, isAuthenticated)
      updateQuota(updatedQuota)

      // Sync with backend if authenticated
      if (isAuthenticated) {
        setTimeout(() => syncWithBackend(), 1000)
      }

      setResult(enrichedResult)
    } catch (e: any) {
      console.error('Generation failed:', e)
      const errorMessage = e?.message || "Failed to generate"
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
                  {wordOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>{parseInt(opt).toLocaleString()} words</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={run}
                disabled={loading || !generationGate.allowed}
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

            {!generationGate.allowed && (
              <p className="text-sm text-red-500 mt-2">
                {generationGate.reason || "Generation limit reached. Upgrade to continue."}
              </p>
            )}

            {/* Optional brief/instructions */}
            <div className="flex flex-col gap-3">
              <Textarea
                placeholder="Optional brief or instructions (e.g. tone, brand guidelines, specific points)"
                value={brief}
                onChange={e => setBrief(e.target.value)}
                disabled={loading}
                className="mt-2"
              />
              <Input
                placeholder="Your site URL for internal link suggestions (e.g. https://example.com)"
                value={siteUrl}
                onChange={e => setSiteUrl(e.target.value)}
                disabled={loading}
                className="h-12"
              />
              <p className="text-xs text-muted-foreground">
                We’ll suggest at least 3 relevant internal links from your domain when provided.
              </p>
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
      {result && !loading && (
        <GenerationErrorBoundary onReset={() => setResult(null)}>
          <ArticlePreview result={result} />
        </GenerationErrorBoundary>
      )}
    </div>
  )
}
