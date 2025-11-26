"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { saveArticle, updateArticle } from "@/lib/api"
import { ensureHtml, sanitizeHtml } from "@/lib/sanitize-html"
import { useQuota } from "@/contexts/quota-context"
import { motion } from "framer-motion"
import {
  Copy,
  Download,
  CheckCircle2,
  FileText,
  TrendingUp,
  Image as ImageIcon,
  Link2,
  MessageSquare,
  Tags,
  Eye,
  Share2,
  Code,
  Globe,
  Save,
  BookmarkPlus
} from "lucide-react"

interface ArticlePreviewProps {
  result: any
  onSave?: () => void
}

export function ArticlePreview({ result, onSave }: ArticlePreviewProps) {
  const router = useRouter()
  const { isAuthenticated } = useQuota()
  const [copied, setCopied] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("preview")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [socialEdits, setSocialEdits] = useState<Record<string, string>>({})
  const [heroImage, setHeroImage] = useState<string | null>(result?.image_url || null)

  useEffect(() => {
    // Keep the last valid hero image across extensions so the preview never blanks
    if (result?.image_url) {
      setHeroImage(result.image_url)
    }
  }, [result?.image_url])

  function deriveKeywords() {
    if (Array.isArray(result?.meta_keywords) && result.meta_keywords.length) return result.meta_keywords
    if (Array.isArray(result?.keywords) && result.keywords.length) return result.keywords
    if (Array.isArray(result?.seo_keywords) && result.seo_keywords.length) return result.seo_keywords
    return [] as string[]
  }

  const derivedKeywords = deriveKeywords()

  const nextKeywords = (() => {
    const suggestions = result?.keyword_suggestions
    const buckets = suggestions && typeof suggestions === "object"
      ? [suggestions.primary, suggestions.secondary, suggestions.long_tail, suggestions.questions]
      : []
    const flattened = buckets
      .filter(Array.isArray)
      .flat()
      .map((kw: any) => (typeof kw === "string" ? kw : kw?.keyword || ""))
    const merged = [...derivedKeywords, ...flattened].map((kw) => String(kw).trim()).filter(Boolean)
    return Array.from(new Set(merged)).slice(0, 15)
  })()

  function deriveMetaDescription() {
    const explicit = typeof result?.meta_description === "string" ? result.meta_description.trim() : ""
    const looksGeneric = /seo-ready ai article/i.test(explicit)
    if (explicit && !looksGeneric) return explicit

    const sectionParagraph = Array.isArray(result?.sections)
      ? (result.sections as any[])
          .flatMap((s) => (Array.isArray(s?.paragraphs) ? s.paragraphs : []))
          .find((p) => typeof p === "string" && p.trim().length > 40) || ""
      : ""

    const summary = typeof result?.summary === "string" ? result.summary : ""
    const basis = sectionParagraph || summary || explicit
    if (!basis) return ""
    const clean = basis.replace(/\s+/g, " ").trim()
    return clean.length > 155 ? `${clean.slice(0, 152)}…` : clean
  }

  const derivedMetaDescription = deriveMetaDescription()

  function buildHtmlFromSections() {
    const title = result?.title || "SEO-ready article"
    const sections = Array.isArray(result?.sections) ? result.sections : []
    const faqs = Array.isArray(result?.faqs) ? result.faqs : []
    const citations = Array.isArray(result?.citations) ? result.citations : []

    if (!sections.length && !faqs.length && !citations.length) return ""

    const sectionHtml = sections
      .map((section: any) => {
        if (!section?.heading && !section?.paragraphs?.length) return ""
        const paragraphs = (section.paragraphs || []).map((p: string) => `<p>${sanitizeHtml(p)}</p>`).join("\n")
        const heading = section.heading ? `<h2>${sanitizeHtml(section.heading)}</h2>` : ""
        return `<section>${heading}${paragraphs}</section>`
      })
      .join("\n")

    const faqHtml = faqs.length
      ? ["<h2>FAQs</h2>", ...faqs.map((f: any) => `<h3>${sanitizeHtml(f.q)}</h3><p>${sanitizeHtml(f.a)}</p>`)].join("\n")
      : ""

    const citationHtml = citations.length
      ? ["<h2>Sources & Citations</h2>", `<ul>${citations
          .map((c: any) => `<li><a href="${c.url}" target="_blank" rel="noopener noreferrer">${sanitizeHtml(c.title || c.url)}</a></li>`)
          .join("\n")}</ul>`].join("\n")
      : ""

    return [`<h1>${sanitizeHtml(title)}</h1>`, sectionHtml, faqHtml, citationHtml].filter(Boolean).join("\n")
  }

  const titleIdeas = (() => {
    const primary = result?.title || "SEO Article"
    const keywords: string[] = derivedKeywords

    const alternates = Array.isArray(result?.alternative_titles) ? result.alternative_titles.filter(Boolean) : []
    const year = new Date().getFullYear()

    const variants = Array.from(new Set([
      primary,
      ...alternates,
      keywords[0] ? `${primary}: ${keywords[0]} strategies` : null,
      keywords[0] && keywords[1] ? `${keywords[0]} vs ${keywords[1]} — what wins in ${year}` : null,
      `${primary} (${year} edition)`
    ].filter(Boolean)))

    return variants.map((title) => {
      const lengthScore = title.length >= 45 && title.length <= 65 ? 60 : 45
      const keywordScore = keywords.reduce((score, kw) => score + (title.toLowerCase().includes(String(kw).toLowerCase()) ? 8 : 0), 0)
      const clarityScore = /guide|how|vs|checklist|framework|playbook/i.test(title) ? 12 : 6
      const freshnessScore = title.includes(String(year)) ? 10 : 5
      return { title, score: Math.min(100, lengthScore + keywordScore + clarityScore + freshnessScore) }
    })
  })()

  function buildDefaultSocialPosts() {
    const title = result?.title || "Your article"
    const desc = derivedMetaDescription || result?.summary || ""
    const kws = derivedKeywords.slice(0, 6).join(", ")
    const primaryKeyword = derivedKeywords[0] || ""
    const supporting = derivedKeywords.slice(1, 3).join(" · ")

    return [
      {
        platform: "linkedin",
        content: `${title}\n\nHook: why ${primaryKeyword || "this topic"} matters now.\nStory: 3 lines on the shift in 2025.\nValue: 3 bullets with metrics.\nCTA: Read the full guide for templates.\n#${primaryKeyword || "SEO"} ${supporting}`.slice(0, 700),
        hint: "6–8 lines, 1–2 niche hashtags, add a link CTA",
      },
      {
        platform: "x",
        content: `Thread on ${primaryKeyword || "this topic"}:\n1/ Hook with a stat or pain\n2/ Playbook: 3 bullets\n3/ Example + metric\n4/ CTA → read the full article`.slice(0, 280),
        hint: "Pin tweet 1, thread 4–6 posts for reach",
      },
      {
        platform: "reddit",
        content: `Title: ${title}\n\nBody: quick hook on ${primaryKeyword || "the topic"}.\n- Insight 1 with a metric\n- Insight 2 with an example\n- Insight 3 with a tool tip\nQuestion: How are you tackling this? Source: include one citation from the article.`,
        hint: "Pick a community (r/SEO, r/Entrepreneur); conversational tone wins",
      },
      {
        platform: "facebook",
        content: `${title}\n${desc}\n\n• Problem → quick win\n• Tool/step with 1 stat\n• CTA: read the full guide for templates`.slice(0, 600),
        hint: "Keep it scannable with 3 bullets and one link",
      },
      {
        platform: "instagram",
        content: `${title} ✨ ${desc}\nHook → 3 tips → CTA slide. Hashtags: ${kws}`.slice(0, 450),
        hint: "Carousel caption with 3 tips + CTA slide",
      },
      {
        platform: "tiktok",
        content: `Script: Hook (“${title} in 20s”), 3 punchy tips with stats, CTA to read more. Overlay keywords: ${kws}`.slice(0, 320),
        hint: "15–20s voiceover with on-screen bullets and overlays",
      },
      {
        platform: "youtube",
        content: `${title} — for ${primaryKeyword || "marketers"}.\nTimestamps: 00:10 hook, 01:00 playbook, 02:30 examples, 03:30 tools. CTA + link in first line. Keywords: ${kws}`.slice(0, 700),
        hint: "Add 3–5 keywords + link in first line",
      },
      {
        platform: "email",
        content: `Subject: ${title}\nPreview: ${desc}\nBody: Hook → 3 bullets → CTA → P.S. with related resource`.slice(0, 650),
        hint: "Fits newsletters or drips; add first-name personalization",
      },
    ]
  }

  const socialPostsList: { platform: string; content: string; hint?: string }[] = (() => {
    const sp = result?.social_posts
    if (Array.isArray(sp)) return sp as any
    if (sp && typeof sp === "object") {
      const mapEntries = Object.entries(sp).map(([platform, content]: any) => ({ platform, content }))
      const withHints = mapEntries.map((entry: any) => {
        const hintFallback = buildDefaultSocialPosts().find((p) => p.platform === entry.platform)?.hint
        return { ...entry, hint: entry?.hint || hintFallback }
      })
      return withHints
    }
    return buildDefaultSocialPosts()
  })()

  useEffect(() => {
    const next: Record<string, string> = {}
    socialPostsList.forEach((post) => {
      next[post.platform] = post.content || ""
    })
    setSocialEdits(next)
  }, [result?.id, result?.title, socialPostsList.map((p) => `${p.platform}:${p.content}`).join("|")])

  const safeHtml = ensureHtml(result?.html, result?.content)
  const safeMarkdown = typeof result?.markdown === "string" ? result.markdown : ""
  const fallbackMarkdownHtml = sanitizeHtml(safeMarkdown)
  const synthesizedHtml = buildHtmlFromSections()

  const hasHeading = (html: string | undefined | null) =>
    typeof html === "string" ? /<h[1-3][^>]*>/i.test(html) : false

  // Prefer synthesized HTML with real headings if the upstream HTML/markdown lacks H tags
  const primaryHtml = hasHeading(safeHtml) ? safeHtml : undefined
  const markdownHtml = hasHeading(fallbackMarkdownHtml) ? fallbackMarkdownHtml : undefined
  const renderedHtml = primaryHtml || markdownHtml || synthesizedHtml || fallbackMarkdownHtml || safeHtml

  // Bail out early if the payload is missing or malformed instead of throwing.
  if (!result || typeof result !== "object") {
    return (
      <Card className="border-2 border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="text-lg">Preview unavailable</CardTitle>
          <p className="text-sm text-muted-foreground">
            We could not render the generated article because the response was incomplete. Please try generating again.
          </p>
        </CardHeader>
      </Card>
    )
  }

  function copyToClipboard(text: string, label: string) {
    const fallbackCopy = () => {
      try {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'absolute'
        textarea.style.left = '-9999px'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        setCopied(label)
        setTimeout(() => setCopied(null), 2000)
      } catch (error) {
        console.error('Copy failed', error)
        setCopied(null)
      }
    }

    try {
      if (!navigator?.clipboard?.writeText) {
        fallbackCopy()
        return
      }

      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopied(label)
          setTimeout(() => setCopied(null), 2000)
        })
        .catch(() => fallbackCopy())
    } catch (error) {
      console.error('Copy unavailable', error)
      fallbackCopy()
    }
  }

  function downloadFile(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleSave() {
    if (!isAuthenticated) {
      alert("Please sign in to save articles")
      return
    }

    setSaving(true)
    try {
      const textForCount = ensureHtml(result?.html || "", result?.markdown || "").replace(/<[^>]+>/g, " ")
      const derivedCount = textForCount ? textForCount.split(/\s+/).filter(Boolean).length : 0
      const wordCount = Number(result.word_count) || derivedCount
      const payload = {
        title: result.title || "Untitled",
        data: result,
        word_count: wordCount,
        reading_time_minutes: Math.max(1, Math.round(wordCount / 220)),
        status: result.status || "draft",
        seo_score: result.seo_score ?? null,
      }

      if (result.article_id) {
        await updateArticle(result.article_id, payload)
      } else {
        await saveArticle(payload)
      }

      setSaved(true)
      setTimeout(() => {
        router.push('/library')
      }, 1500)

      if (onSave) onSave()
    } catch (e: any) {
      alert(e?.message || "Failed to save article")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card className="border-2 border-green-200 dark:border-green-800">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Generated Successfully
                </Badge>
                {result?.word_count && (
                  <Badge variant="outline">
                    <FileText className="w-3 h-3 mr-1" />
                    {result.word_count.toLocaleString()} words
                  </Badge>
                )}
                {result?.seo_score !== undefined && (
                  <Badge className={result.seo_score >= 80 ? "bg-green-500 text-white" : result.seo_score >= 60 ? "bg-yellow-500 text-white" : "bg-red-500 text-white"}>
                    <TrendingUp className="w-3 h-3 mr-1" />
                    SEO: {result.seo_score}/100
                  </Badge>
                )}
                {result?.readability_score && (
                  <Badge variant="outline">
                    <Eye className="w-3 h-3 mr-1" />
                    Readability: {result.readability_score}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-3xl mb-2">{result?.title || "Your Article"}</CardTitle>
              {derivedMetaDescription && (
                <p className="text-muted-foreground">{derivedMetaDescription}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {isAuthenticated && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    className="gradient-btn text-white"
                    size="sm"
                    onClick={handleSave}
                    disabled={saving || saved}
                  >
                    {saved ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Saved!
                      </>
                    ) : saving ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save to Library
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(result?.html || result?.markdown || '', 'article')}
              >
                {copied === 'article' ? (
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadFile(result?.markdown || result?.html || '', `${result?.title || 'article'}.md`, 'text/markdown')}
              >
                <Download className="mr-2 h-4 w-4" />
                Markdown
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadFile(result?.html || '', `${result?.title || 'article'}.html`, 'text/html')}
              >
                <Download className="mr-2 h-4 w-4" />
                HTML
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 mb-6">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="seo">SEO Data</TabsTrigger>
          <TabsTrigger value="social">Social Posts</TabsTrigger>
          <TabsTrigger value="citations">Citations</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="meta">Meta Tags</TabsTrigger>
        </TabsList>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          {heroImage && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-purple-500" />
                  <CardTitle className="text-lg">AI-Generated Hero Image</CardTitle>
                  <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                    Gemini 2.5 Flash
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <img
                  src={heroImage}
                  alt={result.title || 'Article hero image'}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-8 space-y-4">
              {renderedHtml ? (
                <div
                  className="prose prose-lg dark:prose-invert max-w-none
                             prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-slate-50
                             prose-h1:text-4xl prose-h1:font-black prose-h1:mb-6 prose-h1:leading-tight
                             prose-h2:text-3xl prose-h2:font-extrabold prose-h2:mt-10 prose-h2:pt-4 prose-h2:border-l-4 prose-h2:border-primary prose-h2:pl-3 prose-h2:bg-muted/40 prose-h2:rounded
                             prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:text-primary
                             prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-[17px]
                             prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                             prose-img:rounded-lg prose-img:shadow-md
                             prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-strong:text-foreground"
                  dangerouslySetInnerHTML={{ __html: renderedHtml }}
                />
              ) : (
                <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground bg-muted/30">
                  No previewable HTML was returned. Try generating again or copy the markdown tab to continue editing.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Data Tab */}
        <TabsContent value="seo" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Tags className="w-5 h-5 text-green-500" />
                  Title A/B Ideas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {titleIdeas.map((idea, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-muted/40">
                    <div>
                      <p className="font-medium">{idea.title}</p>
                      <p className="text-xs text-muted-foreground">Optimised for length, clarity, and keyword inclusion.</p>
                    </div>
                    <Badge>{idea.score}/100</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Tags className="w-5 h-5 text-blue-500" />
                  Keywords
                </CardTitle>
              </CardHeader>
              <CardContent>
              {derivedKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {derivedKeywords.map((keyword: string, i: number) => (
                      <Badge key={i} variant="secondary">{keyword}</Badge>
                    ))}
                </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No keywords extracted</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Tags className="w-5 h-5 text-amber-500" />
                  Next keywords to target
                </CardTitle>
              </CardHeader>
              <CardContent>
                {nextKeywords.length ? (
                  <div className="flex flex-wrap gap-2">
                    {nextKeywords.map((kw, i) => (
                      <Badge key={i} variant="secondary">{kw}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">We’ll suggest supporting keywords after your next generation.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-green-500" />
                  Internal Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Array.isArray(result?.internal_links) && result.internal_links.length > 0 ? (
                  <ul className="space-y-2">
                    {result.internal_links.slice(0, 5).map((link: any, i: number) => (
                      <li key={i} className="text-sm">
                        <a href={link.url} className="text-primary hover:underline">
                          {link.anchor_text || link.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No internal links suggested</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                SEO Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>SEO Score</span>
                  <span className="font-semibold">{result?.seo_score || 0}/100</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                    style={{ width: `${result?.seo_score || 0}%` }}
                  />
                </div>
              </div>
              {result?.readability_score && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Readability Score</span>
                    <span className="font-semibold">{result.readability_score}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {result.readability_score >= 60 ? 'Easy to read' : 'Moderate difficulty'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Posts Tab */}
        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Share2 className="w-5 h-5 text-blue-500" />
                Social Media Posts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {socialPostsList.length > 0 ? (
                socialPostsList.map((post: any, i: number) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/50 border space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="capitalize">
                        <Globe className="w-3 h-3 mr-1" />
                        {post.platform || 'General'}
                      </Badge>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {post.hint && <span>{post.hint}</span>}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(socialEdits[post.platform] || post.content, `social-${i}`)}
                        >
                          {copied === `social-${i}` ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      value={socialEdits[post.platform] ?? post.content ?? ''}
                      onChange={(e) =>
                        setSocialEdits((prev) => ({
                          ...prev,
                          [post.platform]: e.target.value,
                        }))
                      }
                      className="min-h-[120px] text-sm"
                    />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No social posts generated</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Citations Tab */}
        <TabsContent value="citations">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                Citations & Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Array.isArray(result?.citations) && result.citations.length > 0 ? (
                <ol className="space-y-3 list-decimal list-inside">
                  {result.citations.map((citation: any, i: number) => (
                    <li key={i} className="text-sm">
                      <a
                        href={citation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {citation.title || citation.url}
                      </a>
                      {citation.description && (
                        <p className="ml-5 mt-1 text-muted-foreground">{citation.description}</p>
                      )}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-muted-foreground">No citations available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faqs">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-500" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.isArray(result?.faqs) && result.faqs.length > 0 ? (
                result.faqs.map((faq: any, i: number) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/50 border">
                    <h4 className="font-semibold mb-2">{faq.question}</h4>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No FAQs generated</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Meta Tags Tab */}
        <TabsContent value="meta">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Code className="w-5 h-5 text-purple-500" />
                Meta Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result?.meta_title && (
                <div>
                  <label className="text-sm font-semibold">Title Tag</label>
                  <div className="mt-1 p-3 rounded-lg bg-muted/50 border font-mono text-sm">
                    {result.meta_title}
                  </div>
                </div>
              )}
              {derivedMetaDescription && (
                <div>
                  <label className="text-sm font-semibold">Meta Description</label>
                  <div className="mt-1 p-3 rounded-lg bg-muted/50 border font-mono text-sm">
                    {derivedMetaDescription}
                  </div>
                </div>
              )}
              {Array.isArray(result?.meta_keywords) && result.meta_keywords.length > 0 && (
                <div>
                  <label className="text-sm font-semibold">Meta Keywords</label>
                  <div className="mt-1 p-3 rounded-lg bg-muted/50 border">
                    <div className="flex flex-wrap gap-2">
                      {result.meta_keywords.map((keyword: string, i: number) => (
                        <Badge key={i} variant="secondary">{keyword}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
