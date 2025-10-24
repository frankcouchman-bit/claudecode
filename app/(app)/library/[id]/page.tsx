"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { getArticle, deleteArticle } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
  Target
} from "lucide-react"

export default function ArticleViewPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

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

            <div className="flex gap-2">
              <Button
                onClick={() => router.push(`/library/${id}/edit`)}
                className="gradient-btn"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
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
