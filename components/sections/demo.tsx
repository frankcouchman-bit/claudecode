"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { generateDraft } from "@/lib/api"
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
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function Demo() {
  const { quota, isAuthenticated, updateQuota, syncWithBackend } = useQuota()
  const [topic, setTopic] = useState("")
  const [language, setLanguage] = useState("en")
  const [tone, setTone] = useState("professional")
  const [wordCount, setWordCount] = useState("3000")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

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
      const r = await generateDraft({
        topic: topic.trim(),
        tone: tone,
        language: language,
        target_word_count: parseInt(wordCount) || 3000,
        research: true,
        generate_social: true,
        generate_image: true,
        generate_faqs: true
      })

      // Record successful generation and update global state
      const updatedQuota = recordArticleGeneration(quota, isAuthenticated)
      updateQuota(updatedQuota)

      // Sync with backend if authenticated
      if (isAuthenticated) {
        setTimeout(() => syncWithBackend(), 1000)
      }

      setResult(r)
    } catch (e: any) {
      setError(e?.message || "Failed to generate")
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
                  <SelectItem value="2000">2,000 words</SelectItem>
                  <SelectItem value="3000">3,000 words</SelectItem>
                  <SelectItem value="4000">4,000 words</SelectItem>
                  <SelectItem value="5000">5,000 words</SelectItem>
                  <SelectItem value="6000">6,000 words</SelectItem>
                </SelectContent>
              </Select>

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
