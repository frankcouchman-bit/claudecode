"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { saveArticle } from "@/lib/api"
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
      const response = await saveArticle({
        title: result.title,
        content: result.html || result.markdown,
        markdown: result.markdown,
        html: result.html,
        meta_title: result.meta_title,
        meta_description: result.meta_description,
        meta_keywords: result.meta_keywords || result.keywords,
        seo_score: result.seo_score,
        readability_score: result.readability_score,
        word_count: result.word_count,
        image_url: result.image_url,
        citations: result.citations,
        faqs: result.faqs,
        social_posts: result.social_posts,
        keywords: result.keywords,
        internal_links: result.internal_links
      })

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
              {result?.meta_description && (
                <p className="text-muted-foreground">{result.meta_description}</p>
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
          {result?.image_url && (
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
                  src={result.image_url}
                  alt={result.title || 'Article hero image'}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-8">
              <div
                className="prose prose-lg dark:prose-invert max-w-none
                           prose-headings:font-bold prose-headings:gradient-text
                           prose-p:text-muted-foreground prose-p:leading-relaxed
                           prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                           prose-img:rounded-lg prose-img:shadow-md
                           prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
                dangerouslySetInnerHTML={{ __html: result?.html || "" }}
              />
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
                {result?.keywords && result.keywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.map((keyword: string, i: number) => (
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
                {result?.internal_links && result.internal_links.length > 0 ? (
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
              {result?.social_posts && result.social_posts.length > 0 ? (
                result.social_posts.map((post: any, i: number) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/50 border space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="capitalize">
                        <Globe className="w-3 h-3 mr-1" />
                        {post.platform || 'General'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(post.content, `social-${i}`)}
                      >
                        {copied === `social-${i}` ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm">{post.content}</p>
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
              {result?.citations && result.citations.length > 0 ? (
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
              {result?.faqs && result.faqs.length > 0 ? (
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
              {result?.meta_description && (
                <div>
                  <label className="text-sm font-semibold">Meta Description</label>
                  <div className="mt-1 p-3 rounded-lg bg-muted/50 border font-mono text-sm">
                    {result.meta_description}
                  </div>
                </div>
              )}
              {result?.meta_keywords && result.meta_keywords.length > 0 && (
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
