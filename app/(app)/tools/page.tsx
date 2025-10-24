"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heading,
  Tags,
  Link2,
  Eye,
  Lightbulb,
  BarChart,
  Sparkles,
  Copy,
  CheckCircle2
} from "lucide-react"

export default function ToolsPage() {
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

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  // Mock functions - replace with actual API calls
  function generateHeadlines() {
    setLoading('headlines')
    setTimeout(() => {
      setHeadlineResults([
        `${headlineInput}: The Ultimate Guide for 2024`,
        `How to Master ${headlineInput} in 30 Days`,
        `10 Proven ${headlineInput} Strategies That Actually Work`,
        `${headlineInput} Secrets: What Experts Don't Tell You`,
        `The Complete ${headlineInput} Checklist [2024 Edition]`
      ])
      setLoading(null)
    }, 1000)
  }

  function optimizeMetaTags() {
    setLoading('meta')
    setTimeout(() => {
      setMetaResults({
        title: `${metaInput} - Complete Guide & Best Practices`,
        description: `Discover everything about ${metaInput}. Learn proven strategies, tips, and techniques to get results. Updated for 2024.`
      })
      setLoading(null)
    }, 1000)
  }

  function suggestLinks() {
    setLoading('links')
    setTimeout(() => {
      setLinkResults([
        { anchor: "related guide", url: "/guide" },
        { anchor: "best practices", url: "/best-practices" },
        { anchor: "case studies", url: "/case-studies" },
        { anchor: "FAQ section", url: "/faq" }
      ])
      setLoading(null)
    }, 1000)
  }

  function analyzeReadability() {
    setLoading('readability')
    setTimeout(() => {
      const words = readabilityInput.split(' ').length
      const sentences = readabilityInput.split(/[.!?]+/).length
      const score = Math.min(100, Math.max(0, 100 - (words / sentences) * 3))
      setReadabilityScore(Math.round(score))
      setLoading(null)
    }, 1000)
  }

  function generateBrief() {
    setLoading('brief')
    setTimeout(() => {
      setBriefResult({
        outline: [
          "Introduction",
          "Main Concept",
          "Key Benefits",
          "Step-by-Step Guide",
          "Common Mistakes",
          "FAQs",
          "Conclusion"
        ],
        keywords: ["primary keyword", "secondary keyword", "LSI terms"],
        wordCount: "2000-2500 words recommended"
      })
      setLoading(null)
    }, 1000)
  }

  function checkKeywordDensity() {
    setLoading('keywords')
    setTimeout(() => {
      const words = keywordInput.toLowerCase().split(/\s+/)
      const frequency: any = {}
      words.forEach(word => {
        if (word.length > 3) {
          frequency[word] = (frequency[word] || 0) + 1
        }
      })
      const sorted = Object.entries(frequency)
        .sort(([, a]: any, [, b]: any) => b - a)
        .slice(0, 10)
        .map(([word, count]: any) => ({
          word,
          count,
          density: ((count / words.length) * 100).toFixed(2)
        }))
      setKeywordResults(sorted)
      setLoading(null)
    }, 1000)
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">SEO Writing Tools</h1>
        <p className="text-muted-foreground">Professional tools to optimize your content for search engines</p>
      </div>

      <Tabs defaultValue="headline" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="headline">Headlines</TabsTrigger>
          <TabsTrigger value="meta">Meta Tags</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="readability">Readability</TabsTrigger>
          <TabsTrigger value="brief">Brief</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
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
