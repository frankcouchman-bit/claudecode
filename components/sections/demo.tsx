"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { generateDraft, saveArticle } from "@/lib/api"
import { ensureHtml, sanitizeHtml } from "@/lib/sanitize-html"
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
import { ErrorBoundary } from "@/components/error-boundary"

type DraftResult = Record<string, any> | null

type DraftContext = {
  siteUrl?: string
  baseWordCount?: number
}

function coerceString(value: unknown): string {
  if (typeof value === "string") return value
  if (value === null || value === undefined) return ""
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

function stripTags(html: string) {
  if (!html) return ""
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
}

function deriveKeywords(subject: string, fallback: string[] = []) {
  const cleaned = subject.replace(/[^a-zA-Z0-9\s-]/g, " ").toLowerCase()
  const parts = cleaned.split(/\s+/).filter(Boolean)
  const deduped = Array.from(new Set(parts)).filter((word) => word.length > 3)
  if (deduped.length === 0) return fallback
  return deduped.slice(0, 8)
}

function normalizeUrl(input?: string) {
  if (!input) return ""
  try {
    const url = new URL(input.startsWith("http") ? input : `https://${input}`)
    return url.origin
  } catch {
    return ""
  }
}

function buildInternalLinks(topic: string, siteUrl?: string) {
  const anchors = [
    { url: "/blog/ai-content-generators-on-page-seo", anchor_text: "AI generators for on-page SEO" },
    { url: "/blog/best-ai-seo-article-writer-2025", anchor_text: "Best AI SEO writers" },
    { url: "/blog/keyword-research-ai-writers", anchor_text: "Keyword research for AI writers" },
    { url: "/blog/serp-analysis-ai-tools", anchor_text: "SERP analysis with AI" },
    { url: "/tools", anchor_text: "SEO tools dashboard" },
  ]

  const normalized = normalizeUrl(siteUrl)
  if (normalized) {
    anchors.unshift({ url: normalized, anchor_text: `${new URL(normalized).hostname} homepage` })
    anchors.unshift({ url: `${normalized}/blog`, anchor_text: `${new URL(normalized).hostname} blog` })
  }

  if (!topic) return anchors
  return anchors.map((link) => ({ ...link, anchor_text: `${link.anchor_text} · ${topic}` }))
}

function buildSocialPosts(title: string, summary: string) {
  const base = summary || "See why SEOScribe drafts are clean, long-form, and publish-ready."
  const hero = title || "AI SEO article"
  return [
    { platform: "LinkedIn", content: `${hero}: key takeaways + checklist → ${base}` },
    { platform: "X / Twitter", content: `${hero} — fast outline, meta tags, internal links ready. 🚀 #SEO #content` },
    { platform: "Facebook", content: `We just generated "${hero}" with full meta + FAQs. Read the preview and save to your library.` },
    { platform: "Email", content: `Subject: ${hero}\n\nInside: structured H2s, FAQs, and interlinking tips so you can publish today.` },
  ]
}

function buildFaqs(topic: string) {
  const subject = topic || "AI SEO writing"
  return [
    {
      question: `How long should a ${subject} article be?`,
      answer: "Aim for 2,000–5,000 words with clear H2/H3 structure and internal links to related guides.",
    },
    {
      question: `What makes a ${subject} post rank?`,
      answer: "Tight search intent matching, descriptive meta tags, fast-loading media, and strong on-page UX.",
    },
    {
      question: `How does SEOScribe keep ${subject} drafts safe?`,
      answer: "We sanitize HTML, auto-generate meta data, and surface readability + SEO scores before you publish.",
    },
  ]
}

function buildFallbackHtml(title: string, description: string, keywords: string[], links: any[], faqs: any[]) {
  const keywordsLine = keywords.length ? `<p><strong>Primary keywords:</strong> ${keywords.join(", ")}</p>` : ""
  const linksList = links
    .map((link: any) => `<li><a href="${link.url}" rel="internal">${link.anchor_text}</a></li>`)
    .join("")
  const faqsHtml = faqs
    .map((faq: any) => `<div><h3>${faq.question}</h3><p>${faq.answer}</p></div>`)
    .join("")

  return `
    <article>
      <header>
        <p class="text-sm text-slate-500">SEO-ready draft</p>
        <h1>${title}</h1>
        <p>${description}</p>
        ${keywordsLine}
      </header>
      <section>
        <h2>Evergreen SEO expansion</h2>
        <p>Use this scaffold to stretch the article into a 3,000–5,000 word pillar.</p>
        <ul>
          <li>Intent & topical map with comparisons</li>
          <li>Research narrative and methodology</li>
          <li>Distribution, repurposing, and CTAs</li>
          <li>Refresh cadence and QA checklist</li>
          <li>Conversion accelerators and templates</li>
        </ul>
      </section>
      <section>
        <h2>Internal links to add</h2>
        <ul>${linksList}</ul>
      </section>
      <section>
        <h2>Frequently asked questions</h2>
        ${faqsHtml}
      </section>
    </article>
  `
}

function normalizeDraftResult(raw: any, context: DraftContext = {}): DraftResult {
  if (!raw) return null

  // Accept plain string responses (HTML or markdown) instead of throwing.
  if (typeof raw === "string") {
    return {
      title: "Your Article",
      topic: "",
      html: raw,
      markdown: raw,
      meta_title: "Your Article",
      meta_description: "",
      meta_keywords: [],
      keywords: [],
      citations: [],
      faqs: [],
      internal_links: [],
      social_posts: {},
      image_url: "",
      seo_score: 0,
      readability_score: "",
      word_count: 0,
    }
  }

  if (typeof raw !== "object") return null

  const baseCandidate =
    (typeof (raw as any).data === "object" && (raw as any).data) ||
    (typeof (raw as any).draft === "object" && (raw as any).draft) ||
    (typeof (raw as any).result === "object" && (raw as any).result) ||
    raw

  const base = baseCandidate as Record<string, any>

  const title = base.title || base.topic || base.headline || "Your Article"
  const summary = base.meta_description || base.description || base.summary || "SEO-ready AI article with headings and CTAs."

  const metaKeywords = Array.isArray(base.meta_keywords)
    ? base.meta_keywords
    : Array.isArray(base.keywords)
      ? base.keywords
      : deriveKeywords(`${title} ${summary}`)

  const internalLinks = Array.isArray(base.internal_links)
    ? base.internal_links.filter((link: any) => link && (link.url || link.anchor_text))
    : buildInternalLinks(title, context.siteUrl)

  const faqs = Array.isArray(base.faqs) && base.faqs.length > 0 ? base.faqs.filter(Boolean) : buildFaqs(title)

  const htmlRaw =
    base.html ||
    base.rendered_html ||
    base.content_html ||
    base.article_html ||
    base.content ||
    base.body ||
    base.markdown ||
    ""

  const markdownRaw = coerceString(base.markdown || base.content || base.html || base.body)
  const html = ensureHtml(htmlRaw, markdownRaw)

  const safeHtml = html || sanitizeHtml(buildFallbackHtml(title, summary, metaKeywords, internalLinks, faqs))
  const textForCount = stripTags(safeHtml || markdownRaw)
  const generatedCount = base.word_count || base.target_word_count || (textForCount ? textForCount.split(/\s+/).length : 0)
  const wordCount = context.baseWordCount ? context.baseWordCount + generatedCount : generatedCount

  const socialPosts = (() => {
    const rawSocial = base.social_posts
    if (Array.isArray(rawSocial) && rawSocial.length > 0) return rawSocial
    if (rawSocial && typeof rawSocial === "object" && Object.keys(rawSocial).length > 0) return rawSocial
    return buildSocialPosts(title, summary)
  })()

  const seoScore = (() => {
    const rawScore = Number(base.seo_score ?? base.score ?? 0)
    if (rawScore > 0) return rawScore
    let score = 60
    if (wordCount > 1200) score += 10
    if (metaKeywords.length >= 3) score += 10
    if (internalLinks.length >= 3) score += 10
    if (safeHtml) score += 5
    return Math.min(score, 95)
  })()

  return {
    ...base,
    title,
    topic: base.topic || base.title || "",
    html: safeHtml,
    markdown: markdownRaw,
    meta_title: base.meta_title || title,
    meta_description: summary,
    meta_keywords: metaKeywords,
    keywords: Array.isArray(base.keywords) && base.keywords.length > 0 ? base.keywords : metaKeywords,
    citations: Array.isArray(base.citations) ? base.citations.filter(Boolean) : [],
    faqs,
    internal_links: internalLinks,
    social_posts: socialPosts,
    image_url: base.image_url || base.image?.image_url || base.image?.image_b64 || "",
    seo_score: seoScore,
    readability_score: base.readability_score ?? "",
    word_count: Number(wordCount) || 0,
  }
}

function DemoContent() {
  const { quota, isAuthenticated, updateQuota, syncWithBackend } = useQuota()

  const [topic, setTopic] = useState("")
  const [language, setLanguage] = useState("en")
  const [tone, setTone] = useState("professional")
  // Word count selection; will be constrained by plan
  const [wordCount, setWordCount] = useState("1500")
  // Optional brief/instructions to guide generation
  const [brief, setBrief] = useState("")
  const [siteUrl, setSiteUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [extending, setExtending] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Determine allowed word counts based on plan and surface locked options for clarity
  const wordOptions = [
    { value: "1200", label: "1,200 words (demo safe)", allowed: true },
    { value: "1500", label: "1,500 words (guest/demo)", allowed: true },
    { value: "2000", label: "2,000 words (Free cap)", allowed: isAuthenticated },
    { value: "3000", label: "3,000 words (Pro starter)", allowed: isAuthenticated && quota.plan === 'pro' },
    { value: "4500", label: "4,500 words (Pro long-form)", allowed: isAuthenticated && quota.plan === 'pro' },
    { value: "6000", label: "6,000 words (Pro max)", allowed: isAuthenticated && quota.plan === 'pro' },
  ]

  // Ensure selected word count remains valid when plan or options change
  useEffect(() => {
    const highestAllowed = [...wordOptions].reverse().find((opt) => opt.allowed)
    if (highestAllowed && wordCount !== highestAllowed.value) {
      setWordCount(highestAllowed.value)
    }
  }, [quota.plan, isAuthenticated])

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
    try {
      console.log('Generating article with payload:', {
        topic: topic.trim(),
        tone,
        language,
        target_word_count: parseInt(wordCount) || 3000
      })

      const rawResult = await generateDraft({
        topic: topic.trim(),
        tone: tone,
        language: language,
        target_word_count: parseInt(wordCount) || 3000,
        research: true,
        generate_social: true,
        generate_image: true,
        generate_faqs: true,
        site_url: siteUrl || undefined,
        // Include optional brief/instructions if provided
        brief: brief.trim() || undefined
      })

      console.log('Generation successful:', rawResult)

      const normalized = normalizeDraftResult(rawResult, {
        siteUrl: siteUrl || undefined,
      })

      if (!normalized) {
        throw new Error("Unexpected response from the server. Please try again.")
      }

      // Record successful generation and update global state
      const updatedQuota = recordArticleGeneration(quota, isAuthenticated)
      updateQuota(updatedQuota)

      // Sync with backend if authenticated
      if (isAuthenticated) {
        setTimeout(() => syncWithBackend(), 1000)
      }

      setResult(normalized)
    } catch (e: any) {
      console.error('Generation failed:', e)
      const errorMessage = e?.message || "Failed to generate"
      setError(`Error: ${errorMessage}. Check browser console for details.`)
    } finally {
      setLoading(false)
    }
  }

  const quotaInfo = getRemainingQuota(quota)

  const maxAllowedOption = [...wordOptions].reverse().find((opt) => opt.allowed)

  async function extendDraft() {
    if (!result) return
    const target = parseInt(maxAllowedOption?.value || wordCount) || 3000
    setExtending(true)
    try {
      const rawResult = await generateDraft({
        topic: topic.trim() || result.title || "Article",
        tone,
        language,
        target_word_count: target,
        research: true,
        generate_social: true,
        generate_image: true,
        generate_faqs: true,
        site_url: siteUrl || undefined,
        brief: (brief || "") + "\nExtend and enrich the existing draft while keeping headings intact.",
        existing_content: result.markdown || result.html || "",
      })

      const normalized = normalizeDraftResult(rawResult, {
        siteUrl: siteUrl || undefined,
        baseWordCount: result.word_count || 0,
      })

      if (!normalized) {
        throw new Error("Could not extend this draft. Please try again.")
      }

      setResult({
        ...normalized,
        markdown: [result.markdown, normalized.markdown].filter(Boolean).join("\n\n"),
        html: ensureHtml(normalized.html, normalized.markdown),
      })
    } catch (e: any) {
      setError(e?.message || "Failed to extend draft")
    } finally {
      setExtending(false)
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
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      disabled={!opt.allowed}
                    >
                      {opt.label}
                      {!opt.allowed && " · Pro"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Website to research for internal links (optional)"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                disabled={loading}
                className="h-12 text-base"
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

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <Badge variant="outline">Demo & guests: up to 1,500 words</Badge>
              <Badge variant="outline">Free: unlock 2,000-word drafts</Badge>
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">Pro: 6,000-word max</Badge>
              {siteUrl && (
                <Badge variant="secondary">Interlinking with {normalizeUrl(siteUrl) || siteUrl}</Badge>
              )}
            </div>

            {/* Optional brief/instructions */}
            <div className="flex flex-col">
              <Textarea
                placeholder="Optional brief or instructions (e.g. tone, brand guidelines, specific points)"
                value={brief}
                onChange={e => setBrief(e.target.value)}
                disabled={loading}
                className="mt-2"
              />
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
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              disabled={extending}
              onClick={extendDraft}
              className="flex items-center gap-2"
            >
              {extending ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Extending to {maxAllowedOption?.label || `${wordCount} words`}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Extend to {maxAllowedOption?.label || `${wordCount} words`}
                </>
              )}
            </Button>
            <Badge variant="outline" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Keeps existing content and adds more depth
            </Badge>
          </div>
          <ArticlePreview result={result} />
        </div>
      )}
    </div>
  )
}

export default function Demo() {
  const [instanceKey, setInstanceKey] = useState(0)

  return (
    <ErrorBoundary
      resetKeys={[instanceKey]}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <Card className="border-2 border-red-200 bg-red-50/70">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <CardTitle className="text-xl">Something went wrong</CardTitle>
            </div>
            <CardDescription className="text-sm text-muted-foreground">
              The generator hit a client-side issue. Please try again; your session limits remain safe.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Details: {error.message}</p>
            <div className="flex flex-wrap gap-2">
              <Button
                className="gradient-btn text-white"
                onClick={() => {
                  setInstanceKey((key) => key + 1)
                  resetErrorBoundary()
                }}
              >
                Restart generator
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Refresh page
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    >
      <DemoContent key={instanceKey} />
    </ErrorBoundary>
  )
}
