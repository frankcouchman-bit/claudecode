"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { listArticles, deleteArticle } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  FileText,
  Search,
  Calendar,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Download,
  Copy,
  CheckCircle2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function LibraryPage() {
  const router = useRouter()
  const [articles, setArticles] = useState<any[]>([])
  const [filteredArticles, setFilteredArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [filterBy, setFilterBy] = useState("all")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadArticles()
  }, [])

  useEffect(() => {
    filterAndSortArticles()
  }, [articles, searchQuery, sortBy, filterBy])

  async function loadArticles() {
    setLoading(true)
    setError(null)
    try {
      const data = await listArticles()
      // Normalize the returned data to always be an array
      const normalized = Array.isArray(data) ? data : ((data as any)?.articles ?? [])
      setArticles(normalized)
    } catch (e: any) {
      setError(e?.message || "Failed to load articles")
    } finally {
      setLoading(false)
    }
  }

  function filterAndSortArticles() {
    let filtered = [...articles]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.topic?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (filterBy !== "all") {
      filtered = filtered.filter(article => {
        if (filterBy === "high-seo") return (article.seo_score || 0) >= 80
        if (filterBy === "low-seo") return (article.seo_score || 0) < 60
        if (filterBy === "recent") {
          const date = new Date(article.created_at)
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          return date > weekAgo
        }
        return true
      })
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      if (sortBy === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      }
      if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "")
      }
      if (sortBy === "seo") {
        return (b.seo_score || 0) - (a.seo_score || 0)
      }
      return 0
    })

    setFilteredArticles(filtered)
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this article?")) return

    try {
      await deleteArticle(id)
      setArticles(articles.filter(a => a.id !== id))
    } catch (e: any) {
      setError(e?.message || "Failed to delete article")
    }
  }

  function getSEOBadgeColor(score: number) {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="container py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 gradient-text">Article Library</h1>
            <p className="text-muted-foreground">Manage and organize all your generated articles</p>
          </div>
          <Link href="/article-writer">
            <Button className="gradient-btn text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Article
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="title">Title (A-Z)</SelectItem>
                  <SelectItem value="seo">SEO Score (High-Low)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Articles</SelectItem>
                  <SelectItem value="recent">Last 7 Days</SelectItem>
                  <SelectItem value="high-seo">High SEO (80+)</SelectItem>
                  <SelectItem value="low-seo">Needs Improvement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredArticles.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="inline-flex p-6 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 mb-6">
            <FileText className="w-12 h-12 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold mb-2">No Articles Found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery ? "Try adjusting your search or filters" : "Start creating your first article"}
          </p>
          <Link href="/article-writer">
            <Button className="gradient-btn text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Article
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Articles Grid */}
      {!loading && filteredArticles.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-xl transition-all group border-2 hover:border-purple-200 dark:hover:border-purple-800">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title || "Untitled Article"}
                    </CardTitle>
                    {article.seo_score && (
                      <Badge className={`${getSEOBadgeColor(article.seo_score)} text-white border-0 shrink-0`}>
                        {article.seo_score}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(article.created_at).toLocaleDateString()}
                    </span>
                    {article.word_count && (
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {article.word_count.toLocaleString()} words
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  {article.meta_description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {article.meta_description}
                    </p>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Link href={`/library/${article.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/library/${article.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(article.id)}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Stats Footer */}
      {!loading && filteredArticles.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          Showing {filteredArticles.length} of {articles.length} articles
        </motion.div>
      )}
    </div>
  )
}
