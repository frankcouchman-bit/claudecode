"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { getArticle, deleteArticle, expandDraft, updateArticle } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuota } from "@/contexts/quota-context"
import {
  ArrowLeft,
  Edit,
  Trash2,
  TrendingUp,
  BookOpen,
  FileText,
  Share2,
  Link2,
  MessageSquare,
  Target,
  RefreshCw,
  Sparkles
} from "lucide-react"

export default function ArticleViewPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [regenerateDialogOpen, setRegenerateDialogOpen] = useState(false)
  const [targetWordCount, setTargetWordCount] = useState("3000")
  const { quota } = useQuota()

  useEffect(() => {
    const cap = quota.plan === 'pro' ? 3000 : 2000
    if ((parseInt(targetWordCount) || cap) > cap) {
      setTargetWordCount(String(cap))
    }
  }, [quota.plan])

  useEffect(() => {
    if (id) {
      loadArticle()
    }
  }, [id])

  async function loadArticle() {
    try {
      setLoading(true)
      const data = await getArticle(id)
      setArticle(data)
    } catch (e: any) {
      console.error("Failed to load article:", e)
      alert(e?.message || "Failed to load article")
      router.push("/library")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this article?")) return

    try {
      setDeleting(true)
      await deleteArticle(id)
      router.push("/library")
    } catch (e: any) {
      alert(e?.message || "Failed to delete article")
    } finally {
      setDeleting(false)
    }
  }

  async function handleRegenerate() {
    if (!article) return

    const currentWordCount = article.word_count || 0
    const planCap = quota.plan === 'pro' ? 3000 : 2000
    const targetWords = Math.min(parseInt(targetWordCount) || planCap, planCap)

    if (targetWords <= currentWordCount) {
      if (!confirm(`Current article has ${currentWordCount} words. Target is ${targetWords} words. This will regenerate (not expand) the article. Continue?`)) {
        return
      }
    }

    try {
      setRegenerating(true)
      setRegenerateDialogOpen(false)

      const existingContent = article.markdown || article.html || article.content || ""
      const existingHeadings = extractHeadings(existingContent)

      const expandedArticle = await expandDraft({
        article_id: id,
        article_json: article,
        context: existingContent,
        keyword: article.topic || article.title,
        target_word_count: targetWords,
        website_url: article.website_url || "",
        region: article.region || "",
        with_image: true,
        expansion_mode: true,
        existing_headings: existingHeadings,
      })

    const baseSections = coerceSections(article?.sections, article?.html || article?.markdown || existingContent)
    const incomingSections = coerceSections(expandedArticle?.sections, expandedArticle?.html || expandedArticle?.markdown || "")

    const mergedSections = mergeSections(baseSections, incomingSections)
    const mergedFaqs = mergeFaqs(article?.faqs, expandedArticle?.faqs)
    const mergedCitations = mergeByUrl(article?.citations, expandedArticle?.citations)
    const mergedLinks = mergeByUrl(article?.internal_links, expandedArticle?.internal_links)
    const mergedKeywords = mergeKeywords(article?.seo_keywords, expandedArticle?.seo_keywords)

      const mergedMarkdown = [article.markdown, expandedArticle?.markdown].filter(Boolean).join("\n\n")
      const mergedHtml = [article.html, expandedArticle?.html].filter(Boolean).join("\n")
      const mergedContent = mergedMarkdown || mergedHtml || existingContent
      const combinedWordCount = Math.max(
        countWords(mergedContent),
        expandedArticle?.word_count || 0,
        article.word_count || 0
      )

      await updateArticle(id, {
        title: expandedArticle?.title || article.title,
        data: {
          ...article,
          ...expandedArticle,
          sections: mergedSections,
          faqs: mergedFaqs,
          citations: mergedCitations,
          internal_links: mergedLinks,
          seo_keywords: mergedKeywords,
          markdown: mergedMarkdown,
          html: mergedHtml,
          image_url: expandedArticle?.image_url || article.image_url,
        },
        word_count: combinedWordCount,
        reading_time_minutes: Math.max(1, Math.round(combinedWordCount / 220)),
        meta_title: expandedArticle?.meta_title || article.meta_title,
        meta_description: expandedArticle?.meta_description || article.meta_description,
        seo_score: expandedArticle?.seo_score || article.seo_score,
        updated_at: new Date().toISOString(),
      })

      await loadArticle()

      alert(`✅ Article successfully expanded from ${currentWordCount} to ~${targetWords} words!`)
    } catch (e: any) {
      alert(e?.message || "Failed to expand article")
    } finally {
      setRegenerating(false)
    }
  }

  // Helper function to extract headings from content
  function extractHeadings(content: string): string[] {
    const headings: string[] = []
    // Extract markdown headings
    const mdHeadings = content.match(/^#{1,6}\s+(.+)$/gm)
    if (mdHeadings) {
      headings.push(...mdHeadings.map(h => h.replace(/^#+\s+/, '')))
    }
    // Extract HTML headings
    const htmlHeadings = content.match(/<h[1-6][^>]*>(.+?)<\/h[1-6]>/gi)
    if (htmlHeadings) {
      headings.push(...htmlHeadings.map(h => h.replace(/<[^>]+>/g, '')))
    }
    return headings
  }

  function mergeSections(current: any, incoming: any) {
    const base = Array.isArray(current) ? current : []
    const next = Array.isArray(incoming) ? incoming : []
    const map = new Map<string, { heading: string; paragraphs: string[] }>()

    const addSection = (section: any) => {
      if (!section) return
      const heading = capitalizeHeading(String(section.heading || "").trim())
      const key = heading.toLowerCase() || `section-${map.size}`
      const paragraphs = Array.isArray(section.paragraphs)
        ? section.paragraphs.map((p: any) => String(p || "").trim()).filter(Boolean)
        : []
      if (!map.has(key)) {
        map.set(key, { heading, paragraphs })
      } else {
        const existing = map.get(key)!
        const mergedParas = Array.from(new Set([...existing.paragraphs, ...paragraphs].filter(Boolean)))
        map.set(key, { heading: existing.heading || heading, paragraphs: mergedParas })
      }
    }

    base.forEach(addSection)
    next.forEach(addSection)

    return Array.from(map.values()).filter((s) => s.heading || s.paragraphs.length)
  }

  function coerceSections(sections: any, fallbackContent: string) {
    if (Array.isArray(sections) && sections.some((s) => s?.paragraphs?.length || s?.heading)) {
      return sections.map((s) => ({
        heading: capitalizeHeading(String(s?.heading || "").trim()),
        paragraphs: Array.isArray(s?.paragraphs)
          ? s.paragraphs.map((p: any) => String(p || "").trim()).filter(Boolean)
          : [],
      }))
    }

    const parsedFromHtml = parseSectionsFromHtml(toHtmlish(fallbackContent))
    if (parsedFromHtml.length) return parsedFromHtml

    return []
  }

  function toHtmlish(content: string) {
    if (!content) return ""
    // Roughly convert markdown headings to HTML tags so we can reuse the HTML parser.
    return content
      .replace(/^###\s+(.*)$/gim, "<h3>$1</h3>")
      .replace(/^##\s+(.*)$/gim, "<h2>$1</h2>")
      .replace(/^#\s+(.*)$/gim, "<h1>$1</h1>")
  }

  function parseSectionsFromHtml(html: string) {
    if (!html) return [] as { heading: string; paragraphs: string[] }[]
    const sections: { heading: string; paragraphs: string[] }[] = []
    const headingRegex = /<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi
    let match: RegExpExecArray | null
    let lastIndex = 0
    let current: { heading: string; paragraphs: string[] } | null = null

    const cleanText = (input: string) =>
      input
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim()

    const pushParagraphs = (raw: string) => {
      const normalized = raw.replace(/<p[^>]*>/gi, "\n").replace(/<\/p>/gi, "\n").replace(/<br\s*\/?/gi, "\n")
      const chunks = normalized
        .split(/\n{2,}/)
        .map((p) => cleanText(p))
        .filter(Boolean)
      if (chunks.length && current) {
        current.paragraphs.push(...chunks)
      }
    }

    while ((match = headingRegex.exec(html))) {
      if (current) {
        const between = html.slice(lastIndex, match.index)
        pushParagraphs(between)
        sections.push(current)
      }
      const headingText = cleanText(match[1])
      current = { heading: capitalizeHeading(headingText), paragraphs: [] }
      lastIndex = match.index + match[0].length
    }

    if (current) {
      const tail = html.slice(lastIndex)
      pushParagraphs(tail)
      sections.push(current)
    }

    return sections.filter((s) => s.heading || s.paragraphs.length)
  }

  function capitalizeHeading(text: string) {
    if (!text) return ""
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  function mergeFaqs(current: any, incoming: any) {
    const base = Array.isArray(current) ? current : []
    const next = Array.isArray(incoming) ? incoming : []
    const map = new Map<string, { q: string; a: string }>()
    const addFaq = (faq: any) => {
      if (!faq) return
      const q = String(faq.q || "").trim()
      const a = String(faq.a || "").trim()
      if (!q && !a) return
      if (!map.has(q.toLowerCase())) {
        map.set(q.toLowerCase(), { q, a })
      }
    }
    base.forEach(addFaq)
    next.forEach(addFaq)
    return Array.from(map.values())
  }

  function mergeByUrl(current: any, incoming: any) {
    const base = Array.isArray(current) ? current : []
    const next = Array.isArray(incoming) ? incoming : []
    const seen = new Set<string>()
    const merged: any[] = []
    const add = (item: any) => {
      if (!item) return
      const url = String(item.url || "").trim()
      const key = url || JSON.stringify(item)
      if (seen.has(key)) return
      seen.add(key)
      merged.push(item)
    }
    base.forEach(add)
    next.forEach(add)
    return merged
  }

  function mergeKeywords(current: any, incoming: any) {
    const base = Array.isArray(current) ? current : []
    const next = Array.isArray(incoming) ? incoming : []
    return Array.from(new Set([...base, ...next].filter(Boolean))).slice(0, 50)
  }

  function countWords(text: string) {
    return String(text || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .filter(Boolean).length
  }

  function getSEOBadgeColor(score: number) {
    if (score >= 80) return "bg-green-500 text-white"
    if (score >= 60) return "bg-yellow-500 text-white"
    return "bg-red-500 text-white"
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">Article not found</p>
        <Button onClick={() => router.push("/library")} className="mt-4">
          Back to Library
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }} className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/library")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Library
          </Button>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {article.title || "Untitled Article"}
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={getSEOBadgeColor(article.seo_score || 0)}>
                  SEO: {article.seo_score || 0}/100
                </Badge>
                {article.readability_score && (
                  <Badge variant="outline">
                    Readability: {article.readability_score}
                  </Badge>
                )}
                {article.word_count && (
                  <Badge variant="outline">
                    {article.word_count} words
                  </Badge>
                )}
                <Badge variant="outline" className="text-gray-500">
                  {new Date(article.created_at).toLocaleDateString()}
                </Badge>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => router.push(`/library/${id}/edit`)}
                className="gradient-btn"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>

              <Dialog open={regenerateDialogOpen} onOpenChange={setRegenerateDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950"
                    disabled={regenerating}
                  >
                    {regenerating ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full" />
                        Expanding...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Expand Article
                      </>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      Expand Article
                    </DialogTitle>
                    <DialogDescription>
                      Add more content, headings, and depth to your article. The AI will naturally extend your existing content to reach the target word count.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Target Word Count</label>
                      <Select value={targetWordCount} onValueChange={setTargetWordCount}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select word count" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1500">1,500 words</SelectItem>
                          <SelectItem value="2000">2,000 words (Free max)</SelectItem>
                          <SelectItem value="2500">2,500 words</SelectItem>
                          <SelectItem value="3000">3,000 words (Pro max)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-2">
                        Current article: {article?.word_count?.toLocaleString() || 0} words
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleRegenerate}
                        className="flex-1 gradient-btn"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Expand Article
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setRegenerateDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <strong>How it works:</strong> The AI will analyze your existing content and add new sections, headings, examples, and detailed explanations that naturally flow from what you already have.
                      </p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                        <strong>Note:</strong> This counts as 1 article generation toward your weekly (free) or daily (pro) quota.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                onClick={handleDelete}
                disabled={deleting}
                className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Featured Image */}
        {article.image_url && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="mb-8"
          >
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-96 object-cover rounded-xl shadow-lg"
            />
          </motion.div>
        )}

        {/* Meta Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="grid md:grid-cols-3 gap-4 mb-8"
        >
          <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold">SEO Score</h3>
              </div>
              <p className="text-3xl font-bold text-purple-600">
                {article.seo_score || 0}
                <span className="text-sm text-gray-500">/100</span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-pink-100 hover:border-pink-300 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-5 h-5 text-pink-600" />
                <h3 className="font-semibold">Readability</h3>
              </div>
              <p className="text-3xl font-bold text-pink-600">
                {article.readability_score || "N/A"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">Word Count</h3>
              </div>
              <p className="text-3xl font-bold text-blue-600">
                {article.word_count?.toLocaleString() || 0}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Meta Tags */}
        {(article.meta_title || article.meta_description) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <Card className="mb-8 border-2 border-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  SEO Meta Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {article.meta_title && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Meta Title</label>
                    <p className="text-gray-600 mt-1">{article.meta_title}</p>
                  </div>
                )}
                {article.meta_description && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Meta Description</label>
                    <p className="text-gray-600 mt-1">{article.meta_description}</p>
                  </div>
                )}
                {article.keywords && article.keywords.length > 0 && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Keywords</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {article.keywords.map((kw: string, i: number) => (
                        <Badge key={i} variant="secondary">{kw}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <Card className="mb-8 border-2 border-gray-100">
            <CardHeader>
              <CardTitle>Article Content</CardTitle>
            </CardHeader>
            <CardContent>
              {article.html ? (
                <div
                  className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-purple-600 prose-strong:text-gray-900"
                  dangerouslySetInnerHTML={{ __html: article.html }}
                />
              ) : article.markdown ? (
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {article.markdown}
                </div>
              ) : article.content ? (
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {article.content}
                </div>
              ) : (
                <p className="text-gray-400 italic">No content available</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Internal Links */}
        {article.internal_links && article.internal_links.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <Card className="mb-8 border-2 border-green-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-green-600" />
                  Internal Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {article.internal_links.map((link: any, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">→</span>
                      <div>
                        <a
                          href={link.url || "#"}
                          className="text-purple-600 hover:text-purple-800 font-medium"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.anchor || link.text || link.url}
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Citations */}
        {article.citations && article.citations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <Card className="mb-8 border-2 border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Citations & Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 list-decimal list-inside">
                  {article.citations.map((citation: any, i: number) => (
                    <li key={i} className="text-gray-700">
                      {citation.url ? (
                        <a
                          href={citation.url}
                          className="text-blue-600 hover:text-blue-800 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {citation.title || citation.source || citation.url}
                        </a>
                      ) : (
                        <span>{citation.title || citation.source || citation}</span>
                      )}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* FAQs */}
        {article.faqs && article.faqs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <Card className="mb-8 border-2 border-yellow-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-yellow-600" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {article.faqs.map((faq: any, i: number) => (
                    <div key={i}>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {faq.question || faq.q}
                      </h3>
                      <p className="text-gray-700">
                        {faq.answer || faq.a}
                      </p>
                      {i < article.faqs.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Social Posts */}
        {article.social_posts && article.social_posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <Card className="mb-8 border-2 border-pink-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-pink-600" />
                  Social Media Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {article.social_posts.map((post: any, i: number) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      {post.platform && (
                        <Badge className="mb-2">{post.platform}</Badge>
                      )}
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {post.content || post.text || post}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
