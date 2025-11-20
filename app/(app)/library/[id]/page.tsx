"use client"

import { useState, useEffect } from "react"
import { useQuota } from "@/contexts/quota-context"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { getArticle, deleteArticle, generateDraft, updateArticle } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

  const { quota, isAuthenticated } = useQuota()
  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [regenerateDialogOpen, setRegenerateDialogOpen] = useState(false)
  // Default to 3000 which the backend is known to support.  Smaller
  // selections will be attempted first but a fallback to 3000 is used on
  // failures (see handleRegenerate).
  // Determine allowed word count options based on plan.  Guests can expand up to 1.5k words,
  // free users up to 2k words, and pro users up to 3.5k words.  Provide intermediate
  // increments for pro users.  Default to the highest allowed option for the plan.
  const plan = isAuthenticated ? quota.plan : 'guest'
  const wordOptions =
    plan === 'pro'
      ? ['1500', '2000', '2500', '3000']
      : plan === 'free'
      ? ['1500', '2000']
      : ['1500']
  const [targetWordCount, setTargetWordCount] = useState(wordOptions[wordOptions.length - 1])

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
    const targetWords = parseInt(targetWordCount) || 2500

    // If target is same or less than current, warn user
    if (targetWords <= currentWordCount) {
      if (!confirm(`Current article has ${currentWordCount} words. Target is ${targetWords} words. This will regenerate (not expand) the article. Continue?`)) {
        return
      }
    }

    try {
      setRegenerating(true)
      setRegenerateDialogOpen(false)

      // Prepare existing content for expansion
      const existingContent = article.markdown || article.html || article.content || ""
      const existingHeadings = extractHeadings(existingContent)

      // Build the base payload for expansion
      const basePayload = {
        topic: article.title || article.topic,
        tone: article.tone || "professional",
        language: article.language || "en",
        target_word_count: targetWords,
        research: true,
        generate_social: true,
        generate_image: true,
        generate_faqs: true,
        existing_content: existingContent,
        existing_headings: existingHeadings,
        expansion_mode: true,
        expansion_instructions: `Expand the existing article from ${currentWordCount} words to approximately ${targetWords} words. Add new sections, headings, and detailed content that naturally flows from the existing content. Include additional research, examples, case studies, and deeper explanations. Maintain consistency in tone and style with the existing content.`
      }

      // Helper to apply expanded article and update state
      const applyExpandedArticle = async (expandedArticle: any) => {
        // Merge expanded content with existing metadata
        await updateArticle(id, {
          title: expandedArticle.title || article.title,
          content: expandedArticle.content,
          markdown: expandedArticle.markdown,
          html: expandedArticle.html,
          word_count: expandedArticle.word_count || targetWords,
          meta_title: expandedArticle.meta_title || article.meta_title,
          meta_description: expandedArticle.meta_description || article.meta_description,
          keywords: expandedArticle.keywords || article.keywords,
          citations: [...(article.citations || []), ...(expandedArticle.citations || [])],
          internal_links: [...(article.internal_links || []), ...(expandedArticle.internal_links || [])],
          faqs: [...(article.faqs || []), ...(expandedArticle.faqs || [])],
          seo_score: expandedArticle.seo_score || article.seo_score,
          updated_at: new Date().toISOString()
        })

        // Reload article to show expanded content
        await loadArticle()

        alert(`✅ Article successfully expanded from ${currentWordCount} to ~${targetWords} words!`)
      }

      try {
        // Attempt expansion with requested word count
        const expandedArticle = await generateDraft(basePayload)
        await applyExpandedArticle(expandedArticle)
      } catch (expErr: any) {
        // If the backend rejects the target with a 404 (Not found), try 3000
        const message = expErr?.message?.toLowerCase() || ''
        if (message.includes('not found')) {
          try {
            const fallbackPayload = { ...basePayload, target_word_count: 3000 }
            console.warn('Retrying expansion with fallback word count:', fallbackPayload.target_word_count)
            const fallbackArticle = await generateDraft(fallbackPayload)
            await applyExpandedArticle(fallbackArticle)
          } catch (fallbackErr: any) {
            alert(fallbackErr?.message || 'Failed to expand article')
          }
        } else {
          alert(expErr?.message || 'Failed to expand article')
        }
      }
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
                          {wordOptions.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {parseInt(opt).toLocaleString()} words
                              {opt === '2500' && plan === 'pro' ? ' (recommended)' : ''}
                            </SelectItem>
                          ))}
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
                        <strong>Note:</strong> This counts as 1 article generation against your daily quota.
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
                {Array.isArray(article.keywords) && article.keywords.length > 0 && (
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
                  className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-a:text-purple-600 prose-strong:text-gray-900"
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
        {Array.isArray(article.internal_links) && article.internal_links.length > 0 && (
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
        {Array.isArray(article.citations) && article.citations.length > 0 && (
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
        {Array.isArray(article.faqs) && article.faqs.length > 0 && (
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
        {Array.isArray(article.social_posts) && article.social_posts.length > 0 && (
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
