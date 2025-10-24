"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { getArticle, updateArticle } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, X } from "lucide-react"

export default function ArticleEditPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form fields
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [keywords, setKeywords] = useState("")

  useEffect(() => {
    if (id) {
      loadArticle()
    }
  }, [id])

  async function loadArticle() {
    try {
      setLoading(true)
      const data = await getArticle(id)

      // Populate form fields
      setTitle(data.title || "")
      setContent(data.markdown || data.html || data.content || "")
      setMetaTitle(data.meta_title || "")
      setMetaDescription(data.meta_description || "")
      setKeywords(
        Array.isArray(data.keywords)
          ? data.keywords.join(", ")
          : data.keywords || ""
      )
    } catch (e: any) {
      console.error("Failed to load article:", e)
      alert(e?.message || "Failed to load article")
      router.push("/library")
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!title.trim()) {
      alert("Please enter a title")
      return
    }

    if (!content.trim()) {
      alert("Please enter some content")
      return
    }

    try {
      setSaving(true)

      // Parse keywords
      const keywordsArray = keywords
        .split(",")
        .map(k => k.trim())
        .filter(k => k.length > 0)

      await updateArticle(id, {
        title: title.trim(),
        content: content.trim(),
        markdown: content.trim(),
        meta_title: metaTitle.trim() || title.trim(),
        meta_description: metaDescription.trim(),
        keywords: keywordsArray,
        updated_at: new Date().toISOString()
      })

      alert("Article saved successfully!")
      router.push(`/library/${id}`)
    } catch (e: any) {
      alert(e?.message || "Failed to save article")
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    if (confirm("Are you sure? Any unsaved changes will be lost.")) {
      router.push(`/library/${id}`)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.push(`/library/${id}`)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Article
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Edit Article
              </h1>
              <p className="text-gray-600">Make changes to your article content and SEO settings</p>
            </div>
            <Badge variant="outline" className="text-gray-500">
              Editing
            </Badge>
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          className="space-y-6"
        >
          {/* Title */}
          <Card className="border-2 border-purple-100">
            <CardHeader>
              <CardTitle>Article Title</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title..."
                className="text-xl font-semibold"
              />
            </CardContent>
          </Card>

          {/* Content */}
          <Card className="border-2 border-purple-100">
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <p className="text-sm text-gray-500">
                Edit your article content in Markdown or HTML format
              </p>
            </CardHeader>
            <CardContent>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article content here..."
                className="min-h-[400px] font-mono text-sm leading-relaxed"
              />
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                <span>{content.split(/\s+/).filter(w => w.length > 0).length} words</span>
                <span>•</span>
                <span>{content.length} characters</span>
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card className="border-2 border-green-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                SEO Settings
              </CardTitle>
              <p className="text-sm text-gray-500">
                Optimize your article for search engines
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Meta Title */}
              <div>
                <Label htmlFor="meta-title" className="text-sm font-semibold">
                  Meta Title
                </Label>
                <Input
                  id="meta-title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="SEO-optimized title (defaults to article title)"
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {metaTitle.length}/60 characters
                </p>
              </div>

              {/* Meta Description */}
              <div>
                <Label htmlFor="meta-description" className="text-sm font-semibold">
                  Meta Description
                </Label>
                <Textarea
                  id="meta-description"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Brief description for search results..."
                  className="mt-2 min-h-[80px]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {metaDescription.length}/160 characters
                </p>
              </div>

              {/* Keywords */}
              <div>
                <Label htmlFor="keywords" className="text-sm font-semibold">
                  Keywords
                </Label>
                <Input
                  id="keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate keywords with commas
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center gap-4 pt-4"
          >
            <Button
              onClick={handleSave}
              disabled={saving}
              className="gradient-btn flex-1 md:flex-none md:min-w-[200px]"
              size="lg"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>

            <Button
              onClick={handleCancel}
              disabled={saving}
              variant="outline"
              size="lg"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </motion.div>

          {/* Help Text */}
          <Card className="border border-blue-100 bg-blue-50/50">
            <CardContent className="p-4">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Use Markdown formatting for better readability.
                Your content will be automatically converted to HTML for display.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
