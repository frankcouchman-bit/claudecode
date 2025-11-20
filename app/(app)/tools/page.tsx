"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuota } from "@/contexts/quota-context"
import { canUseTool, recordToolUsage } from "@/lib/quota-enforcement"
import {
  generateHeadlines as apiGenerateHeadlines,
  optimizeMetaTags as apiOptimizeMetaTags,
  suggestInternalLinks as apiSuggestInternalLinks,
  analyzeReadability as apiAnalyzeReadability,
  generateContentBrief as apiGenerateContentBrief,
  checkKeywordDensity as apiCheckKeywordDensity,
  analyzeHeadlineApi,
  serpPreview,
  checkPlagiarism,
  competitorAnalysis
} from "@/lib/api"
import {
  Heading,
  Tags,
  Link2,
  Eye,
  Lightbulb,
  BarChart,
  Sparkles,
  Copy,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

export default function ToolsPage() {
  const { quota, isAuthenticated, updateQuota, syncWithBackend } = useQuota()
  const [headlineInput, setHeadlineInput] = useState("")
  const [headlineResults, setHeadlineResults] = useState<string[]>([])
  const [metaInput, setMetaInput] = useState("")
  const [metaResults, setMetaResults] = useState<any>(null)
  const [linkInput, setLinkInput] = useState("")
  const [linkResults, setLinkResults] = useState<any[]>([])
  const [readabilityInput, setReadabilityInput] = useState("")
  const [readabilityScore, setReadabilityScore] = useState<number | null>(null)
  const [briefInput, setBriefInput] = useState("")
  const [briefResult, setBriefResult] = useState<any>(null)
  const [keywordInput, setKeywordInput] = useState("")
  const [keywordResults, setKeywordResults] = useState<any>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // New tool state
  const [headlineAnalysisInput, setHeadlineAnalysisInput] = useState("")
  const [headlineAnalysisResult, setHeadlineAnalysisResult] = useState<any>(null)
  const [serpTitle, setSerpTitle] = useState("")
  const [serpDescription, setSerpDescription] = useState("")
  const [serpUrl, setSerpUrl] = useState("")
  const [serpResult, setSerpResult] = useState<any>(null)
  const [plagiarismInput, setPlagiarismInput] = useState("")
  const [plagiarismResult, setPlagiarismResult] = useState<any>(null)
  const [competitorKeyword, setCompetitorKeyword] = useState("")
  const [competitorResult, setCompetitorResult] = useState<any>(null)

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  function checkQuotaAndRecordUsage(toolName: string): boolean {
    const { allowed, reason } = canUseTool(quota, isAuthenticated)
    if (!allowed) {
      setError(reason || "Tool usage limit reached")
      return false
    }

    // Record usage
    const updatedQuota = recordToolUsage(quota)
    updateQuota(updatedQuota)

    // Sync with backend
    if (isAuthenticated) {
      setTimeout(() => syncWithBackend(), 500)
    }

    setError(null)
    return true
  }

  async function generateHeadlines() {
    if (!headlineInput.trim()) {
      setError("Please enter a topic")
      return
    }

    if (!checkQuotaAndRecordUsage('headlines')) return

    setLoading('headlines')
    try {
      const result = await apiGenerateHeadlines({ topic: headlineInput })
      setHeadlineResults(result.headlines || [])
    } catch (e: any) {
      setError(e?.message || "Failed to generate headlines")
      setHeadlineResults([])
    } finally {
      setLoading(null)
    }
  }

  async function optimizeMetaTags() {
    if (!metaInput.trim()) {
      setError("Please enter a title")
      return
    }

    if (!checkQuotaAndRecordUsage('meta')) return

    setLoading('meta')
    try {
      const result = await apiOptimizeMetaTags({ title: metaInput })
      setMetaResults(result)
    } catch (e: any) {
      setError(e?.message || "Failed to optimize meta tags")
      setMetaResults(null)
    } finally {
      setLoading(null)
    }
  }

  async function suggestLinks() {
    if (!linkInput.trim()) {
      setError("Please enter content")
      return
    }

    if (!checkQuotaAndRecordUsage('links')) return

    setLoading('links')
    try {
      const result = await apiSuggestInternalLinks({ content: linkInput })
      setLinkResults(result.links || [])
    } catch (e: any) {
      setError(e?.message || "Failed to suggest links")
      setLinkResults([])
    } finally {
      setLoading(null)
    }
  }

  async function analyzeReadability() {
    if (!readabilityInput.trim()) {
      setError("Please enter content")
      return
    }

    if (!checkQuotaAndRecordUsage('readability')) return

    setLoading('readability')
    try {
      const result = await apiAnalyzeReadability({ content: readabilityInput })
      setReadabilityScore(result.score || 0)
    } catch (e: any) {
      setError(e?.message || "Failed to analyze readability")
      setReadabilityScore(null)
    } finally {
      setLoading(null)
    }
  }

  async function generateBrief() {
    if (!briefInput.trim()) {
      setError("Please enter a topic")
      return
    }

    if (!checkQuotaAndRecordUsage('brief')) return

    setLoading('brief')
    try {
      const result = await apiGenerateContentBrief({ topic: briefInput })
      setBriefResult(result)
    } catch (e: any) {
      setError(e?.message || "Failed to generate brief")
      setBriefResult(null)
    } finally {
      setLoading(null)
    }
  }

  async function checkKeywordDensity() {
    if (!keywordInput.trim()) {
      setError("Please enter content")
      return
    }

    if (!checkQuotaAndRecordUsage('keywords')) return

    setLoading('keywords')
    try {
      const result = await apiCheckKeywordDensity({ content: keywordInput })
      setKeywordResults(result.keywords || [])
    } catch (e: any) {
      setError(e?.message || "Failed to check keyword density")
      setKeywordResults(null)
    } finally {
      setLoading(null)
    }
  }

  // New tool actions
  async function analyzeHeadline() {
    if (!headlineAnalysisInput.trim()) {
      setError("Please enter a headline")
      return
    }
    if (!checkQuotaAndRecordUsage('headline')) return
    setLoading('headline')
    try {
      const res = await analyzeHeadlineApi({ headline: headlineAnalysisInput })
      setHeadlineAnalysisResult(res)
    } catch (e: any) {
      setError(e?.message || 'Failed to analyze headline')
      setHeadlineAnalysisResult(null)
    } finally {
      setLoading(null)
    }
  }

  async function doSerpPreview() {
    if (!serpTitle.trim() || !serpDescription.trim() || !serpUrl.trim()) {
      setError('Please fill out title, description and URL')
      return
    }
    if (!checkQuotaAndRecordUsage('serp')) return
    setLoading('serp')
    try {
      const res = await serpPreview({ title: serpTitle, description: serpDescription, url: serpUrl })
      setSerpResult(res)
    } catch (e: any) {
      setError(e?.message || 'Failed to generate SERP preview')
      setSerpResult(null)
    } finally {
      setLoading(null)
    }
  }

  async function checkPlagiarismAction() {
    if (!plagiarismInput.trim()) {
      setError('Please enter content to check for plagiarism')
      return
    }
    if (!checkQuotaAndRecordUsage('plagiarism')) return
    setLoading('plagiarism')
    try {
      const res = await checkPlagiarism({ content: plagiarismInput })
      setPlagiarismResult(res)
    } catch (e: any) {
      setError(e?.message || 'Failed to check plagiarism')
      setPlagiarismResult(null)
    } finally {
      setLoading(null)
    }
  }

  async function runCompetitorAnalysis() {
    if (!competitorKeyword.trim()) {
      setError('Please enter a keyword')
      return
    }
    if (!checkQuotaAndRecordUsage('competitor')) return
    setLoading('competitor')
    try {
      const res = await competitorAnalysis({ keyword: competitorKeyword })
      setCompetitorResult(res)
    } catch (e: any) {
      setError(e?.message || 'Failed to analyze competitors')
      setCompetitorResult(null)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">SEO Writing Tools</h1>
        <p className="text-muted-foreground">Professional tools to optimize your content for search engines</p>

        {/* Quota Info */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
          >
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Sign in to access all writing tools. Free plan includes 1 tool use per week.
            </p>
          </motion.div>
        )}

        {/* Global Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 flex items-center gap-2 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
            >
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm flex-1">{error}</p>
              {!isAuthenticated && error.includes("Sign in") && (
                <Link href="/auth">
                  <Button size="sm" className="gradient-btn text-white">
                    Sign In
                  </Button>
                </Link>
              )}
              {isAuthenticated && error.includes("Upgrade") && (
                <Link href="/pricing">
                  <Button size="sm" className="gradient-btn text-white">
                    Upgrade
                  </Button>
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Tabs defaultValue="headline" className="space-y-6">
        {/* Tab bar: include all tools available via the backend */}
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-10 overflow-x-auto">
          <TabsTrigger value="headline">Headlines</TabsTrigger>
          <TabsTrigger value="meta">Meta Tags</TabsTrigger>
          <TabsTrigger value="links">Internal Links</TabsTrigger>
          <TabsTrigger value="readability">Readability</TabsTrigger>
          <TabsTrigger value="brief">Brief</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="headline-analysis">Headline Analysis</TabsTrigger>
          <TabsTrigger value="serp">SERP Preview</TabsTrigger>
          <TabsTrigger value="plagiarism">Plagiarism</TabsTrigger>
          <TabsTrigger value="competitor">Competitor</TabsTrigger>
        </TabsList>

        {/* Headline Generator */}
        <TabsContent value="headline">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                  <Heading className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>Headline Generator</CardTitle>
                  <CardDescription>Create attention-grabbing headlines that boost CTR</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Enter your topic..."
                  value={headlineInput}
                  onChange={e => setHeadlineInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && generateHeadlines()}
                />
                <Button onClick={generateHeadlines} disabled={loading === 'headlines'} className="gradient-btn text-white">
                  {loading === 'headlines' ? 'Generating...' : 'Generate'}
                </Button>
              </div>

              {headlineResults.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground">Generated Headlines:</h4>
                  {headlineResults.map((headline, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                      <span className="text-sm">{headline}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(headline, `headline-${i}`)}
                      >
                        {copied === `headline-${i}` ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Meta Tag Optimizer */}
        <TabsContent value="meta">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Tags className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>Meta Tag Optimizer</CardTitle>
                  <CardDescription>Perfect meta titles and descriptions for SERP visibility</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Enter your topic or page title..."
                  value={metaInput}
                  onChange={e => setMetaInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && optimizeMetaTags()}
                />
                <Button onClick={optimizeMetaTags} disabled={loading === 'meta'} className="gradient-btn text-white">
                  {loading === 'meta' ? 'Optimizing...' : 'Optimize'}
                </Button>
              </div>

              {metaResults && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Meta Title</label>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                      <span className="text-sm font-mono">{metaResults.title}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(metaResults.title, 'meta-title')}
                      >
                        {copied === 'meta-title' ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{metaResults.title.length} characters</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Meta Description</label>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                      <span className="text-sm font-mono">{metaResults.description}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(metaResults.description, 'meta-desc')}
                      >
                        {copied === 'meta-desc' ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{metaResults.description.length} characters</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Internal Link Suggester */}
        <TabsContent value="links">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                  <Link2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>Internal Link Suggester</CardTitle>
                  <CardDescription>Smart recommendations for internal linking</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Enter your content topic..."
                  value={linkInput}
                  onChange={e => setLinkInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && suggestLinks()}
                />
                <Button onClick={suggestLinks} disabled={loading === 'links'} className="gradient-btn text-white">
                  {loading === 'links' ? 'Analyzing...' : 'Suggest'}
                </Button>
              </div>

              {linkResults.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground">Suggested Links:</h4>
                  {linkResults.map((link: any, i) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/50 border">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-semibold">Anchor: </span>
                          <span className="text-sm text-primary">{link.anchor}</span>
                        </div>
                        <Badge variant="outline">{link.url}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Readability Analyzer */}
        <TabsContent value="readability">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>Readability Analyzer</CardTitle>
                  <CardDescription>Score and improve content readability</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your content here..."
                value={readabilityInput}
                onChange={e => setReadabilityInput(e.target.value)}
                rows={6}
              />
              <Button onClick={analyzeReadability} disabled={loading === 'readability'} className="gradient-btn text-white">
                {loading === 'readability' ? 'Analyzing...' : 'Analyze'}
              </Button>

              {readabilityScore !== null && (
                <div className="p-6 rounded-lg bg-muted/50 border text-center">
                  <div className="text-5xl font-bold mb-2">{readabilityScore}/100</div>
                  <p className="text-muted-foreground">
                    {readabilityScore >= 80 ? 'Excellent!' : readabilityScore >= 60 ? 'Good' : 'Needs improvement'}
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 mt-4">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: `${readabilityScore}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Brief Generator */}
        <TabsContent value="brief">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>Content Brief Generator</CardTitle>
                  <CardDescription>Comprehensive outlines based on top-ranking content</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Enter your topic..."
                  value={briefInput}
                  onChange={e => setBriefInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && generateBrief()}
                />
                <Button onClick={generateBrief} disabled={loading === 'brief'} className="gradient-btn text-white">
                  {loading === 'brief' ? 'Generating...' : 'Generate'}
                </Button>
              </div>

              {briefResult && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Recommended Outline:</h4>
                    <ol className="list-decimal list-inside space-y-1">
                      {briefResult.outline.map((item: string, i: number) => (
                        <li key={i} className="text-sm">{item}</li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Target Keywords:</h4>
                    <div className="flex flex-wrap gap-2">
                      {briefResult.keywords.map((keyword: string, i: number) => (
                        <Badge key={i} variant="secondary">{keyword}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Badge>{briefResult.wordCount}</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Keyword Density Checker */}
        <TabsContent value="keywords">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500">
                  <BarChart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>Keyword Density Checker</CardTitle>
                  <CardDescription>Ensure optimal keyword usage</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your content here..."
                value={keywordInput}
                onChange={e => setKeywordInput(e.target.value)}
                rows={6}
              />
              <Button onClick={checkKeywordDensity} disabled={loading === 'keywords'} className="gradient-btn text-white">
                {loading === 'keywords' ? 'Analyzing...' : 'Check Density'}
              </Button>

              {keywordResults && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground">Top Keywords:</h4>
                  <div className="space-y-2">
                    {keywordResults.map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                        <span className="text-sm font-semibold">{item.word}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">{item.count} times</span>
                          <Badge variant="outline">{item.density}%</Badge>
                        </div>
                      </div>
                    ))}
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
