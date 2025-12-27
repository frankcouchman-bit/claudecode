"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { saveArticle } from "@/lib/api"
import DOMPurify from "isomorphic-dompurify"
import { renderMarkdownToHtml } from "@/lib/render-markdown"
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

  const resolveContent = () => {
    const sectionBlocks = Array.isArray((result as any)?.sections)
      ? (result as any).sections
      : Array.isArray((result as any)?.article?.sections)
        ? (result as any).article.sections
        : null

    if (sectionBlocks && sectionBlocks.length > 0) {
      return sectionBlocks
        .map((section: any) => {
          const heading = coerceText(section?.heading || section?.title || "")
          const body = coerceText(section?.content || section?.body || section?.text || "")
          return `${heading ? `## ${heading}\n\n` : ""}${body}`
        })
        .join("\n\n")
    }

    const candidates = [
      result?.html,
      result?.markdown,
      result?.content,
      result?.body,
      result?.article?.html,
      result?.article?.markdown,
      result?.article?.content,
    ]

    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim().length > 0) {
        return candidate
      }

      if (candidate && typeof candidate === "object") {
        const nested = (candidate as any)?.html || (candidate as any)?.markdown || (candidate as any)?.content
        if (typeof nested === "string" && nested.trim().length > 0) {
          return nested
        }
      }
    }

    return ""
  }

  const rawContent = resolveContent()
  const normalizedContent = typeof rawContent === "string" && rawContent.trim().length > 0
    ? rawContent
    : coerceText(rawContent)

  const markdownContent = typeof result?.markdown === "string" && result.markdown.trim().length > 0
    ? result.markdown
    : normalizedContent

  const renderedHtml = /<\w+/i.test(normalizedContent)
    ? normalizedContent
    : renderMarkdownToHtml(normalizedContent)

  const htmlContent = DOMPurify.sanitize(renderedHtml || "")
  const displayHtml = htmlContent

  const computedWordCount = markdownContent
    ? markdownContent.split(/\s+/).filter(Boolean).length
    : 0
  const safeWordCount = Number(result?.word_count ?? result?.wordCount ?? computedWordCount) || computedWordCount
  const safeSeoScore = Number(result?.seo_score ?? result?.seoScore ?? 0) || 0
  const safeMetaTitle = coerceText(result?.meta_title || result?.metaTitle || result?.title)
  const safeMetaDescription = coerceText(result?.meta_description || result?.metaDescription)
  const safeReadability = (() => {
    const candidate = result?.readability_score ?? result?.readabilityScore
    const num = Number(candidate)
    if (Number.isFinite(num) && num > 0) return num
    if (typeof candidate === "string" && candidate.trim().length > 0) return candidate
    return null
  })()

  const safeTitle = coerceText(result?.title || result?.topic || "Your Article")

  const keywords = Array.isArray(result?.keywords)
    ? result.keywords.map((kw: any) => coerceText(kw)).filter(Boolean)
    : []

  const metaKeywords = Array.isArray(result?.meta_keywords)
    ? result.meta_keywords.map((kw: any) => coerceText(kw)).filter(Boolean)
    : []

  const internalLinks = Array.isArray(result?.internal_links)
    ? result.internal_links
        .map((link: any) => ({
          url: coerceText(link?.url || ""),
          anchor_text: coerceText(link?.anchor_text || link?.anchorText || link?.title || link?.url || ""),
        }))
        .filter(link => link.url.length > 0)
    : []

  const citations = Array.isArray(result?.citations)
    ? result.citations.map((citation: any) => ({
        url: coerceText(citation?.url || ""),
        title: coerceText(citation?.title || citation?.url || ""),
        description: coerceText(citation?.description || ""),
      }))
    : []

  const faqs = Array.isArray(result?.faqs)
    ? result.faqs.map((faq: any) => ({
        question: coerceText(faq?.question || ""),
        answer: coerceText(faq?.answer || ""),
      })).filter(f => f.question || f.answer)
    : []

  const socialPosts = (() => {
    const sp = result?.social_posts
    if (Array.isArray(sp)) return sp
    if (sp && typeof sp === "object") return Object.entries(sp).map(([platform, content]: any) => ({ platform, content }))
    return []
  })().map((post: any) => ({
    platform: coerceText(post.platform || "General"),
    content: coerceText(post.content || ""),
  }))

  const safeImageUrl = (() => {
    const urlCandidate = result?.image_url || result?.image?.image_url || result?.image?.image_b64 || ""
    const coerced = coerceText(urlCandidate)
    return coerced.trim().length > 0 ? coerced : ""
  })()

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
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
      const payload = {
        title: coerceText(result.title || result.topic || "Untitled Article"),
        topic: coerceText(result.topic || result.title),
        content: htmlContent || markdownContent,
        markdown: markdownContent,
        html: htmlContent,
        meta_title: coerceText(result.meta_title || result.metaTitle || result.title),
        meta_description: coerceText(result.meta_description || result.metaDescription),
        meta_keywords: metaKeywords,
        seo_score: Number(result.seo_score ?? result.seoScore ?? 0) || 0,
        readability_score: Number(result.readability_score ?? result.readabilityScore ?? 0) || undefined,
        word_count: Number(result.word_count ?? result.wordCount ?? 0) ||
          (markdownContent ? markdownContent.split(/\s+/).filter(Boolean).length : undefined),
        // Use nested image object if present
        image_url: safeImageUrl,
        citations,
        faqs,
        social_posts: socialPosts,
        keywords,
        internal_links: internalLinks,
      }

      const response = await saveArticle(payload)

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
                {safeWordCount > 0 && (
                  <Badge variant="outline">
                    <FileText className="w-3 h-3 mr-1" />
                    {safeWordCount.toLocaleString()} words
                  </Badge>
                )}
                {Number.isFinite(safeSeoScore) && (
                  <Badge className={safeSeoScore >= 80 ? "bg-green-500 text-white" : safeSeoScore >= 60 ? "bg-yellow-500 text-white" : "bg-red-500 text-white"}>
                    <TrendingUp className="w-3 h-3 mr-1" />
                    SEO: {safeSeoScore}/100
                  </Badge>
                )}
                {safeReadability && (
                  <Badge variant="outline">
                    <Eye className="w-3 h-3 mr-1" />
                    Readability: {safeReadability}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-3xl mb-2">{safeTitle}</CardTitle>
              {safeMetaDescription && (
                <p className="text-muted-foreground">{safeMetaDescription}</p>
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
                onClick={() => copyToClipboard(htmlContent || markdownContent || '', 'article')}
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
                onClick={() => downloadFile(markdownContent || htmlContent || '', `${safeTitle || 'article'}.md`, 'text/markdown')}
              >
                <Download className="mr-2 h-4 w-4" />
                Markdown
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadFile(htmlContent || '', `${safeTitle || 'article'}.html`, 'text/html')}
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
          {safeImageUrl && (
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
                  src={safeImageUrl}
                  alt={safeTitle || 'Article hero image'}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-8">
              {displayHtml.trim().length > 0 ? (
                <div
                  className="prose prose-lg dark:prose-invert max-w-none
                             prose-headings:font-black prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-white
                             prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl
                             prose-p:text-muted-foreground prose-p:leading-relaxed
                             prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                             prose-img:rounded-lg prose-img:shadow-md
                             prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
                  dangerouslySetInnerHTML={{ __html: displayHtml }}
                />
              ) : (
                <p className="text-muted-foreground text-sm">No article body was returned. Please regenerate.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Data Tab */}
        <TabsContent value="seo" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Tags className="w-5 h-5 text-blue-500" />
                  Keywords
                </CardTitle>
              </CardHeader>
              <CardContent>
                {keywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword: string, i: number) => (
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
                  <Link2 className="w-5 h-5 text-green-500" />
                  Internal Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                {internalLinks.length > 0 ? (
                  <ul className="space-y-2">
                    {internalLinks.slice(0, 5).map((link: any, i: number) => (
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
                  <span className="font-semibold">{safeSeoScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                    style={{ width: `${safeSeoScore}%` }}
                  />
                </div>
              </div>
              {safeReadability && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Readability Score</span>
                    <span className="font-semibold">{safeReadability}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {Number(safeReadability) >= 60 ? 'Easy to read' : 'Moderate difficulty'}
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
              {socialPosts.length > 0 ? (
                socialPosts.map((post: any, i: number) => {
                  const content = coerceText(post.content)
                  return (
                    <div key={i} className="p-4 rounded-lg bg-muted/50 border space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="capitalize">
                          <Globe className="w-3 h-3 mr-1" />
                          {post.platform || 'General'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(content, `social-${i}`)}
                        >
                          {copied === `social-${i}` ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-sm">{content}</p>
                    </div>
                  )
                })
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
              {citations.length > 0 ? (
                <ol className="space-y-3 list-decimal list-inside">
                  {citations.map((citation: any, i: number) => (
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
              {faqs.length > 0 ? (
                faqs.map((faq: any, i: number) => (
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
              {safeMetaTitle && (
                <div>
                  <label className="text-sm font-semibold">Title Tag</label>
                  <div className="mt-1 p-3 rounded-lg bg-muted/50 border font-mono text-sm">
                    {safeMetaTitle}
                  </div>
                </div>
              )}
              {safeMetaDescription && (
                <div>
                  <label className="text-sm font-semibold">Meta Description</label>
                  <div className="mt-1 p-3 rounded-lg bg-muted/50 border font-mono text-sm">
                    {safeMetaDescription}
                  </div>
                </div>
              )}
              {metaKeywords.length > 0 && (
                <div>
                  <label className="text-sm font-semibold">Meta Keywords</label>
                  <div className="mt-1 p-3 rounded-lg bg-muted/50 border">
                    <div className="flex flex-wrap gap-2">
                      {metaKeywords.map((keyword: string, i: number) => (
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
