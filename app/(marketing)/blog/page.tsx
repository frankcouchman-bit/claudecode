
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, BookOpenText, Clock3 } from "lucide-react"

// Metadata for each blog post.  Keeping this list in one place allows the
// blog index to render a summary of all articles.  If you add a new
// post, update this array accordingly.  The `date` field is a string
// that can be customised per article.
const posts = [
  {
    slug: "best-ai-seo-article-writer-2025",
    title: "Best AI SEO Article Writers for 2025 – Reviewed",
    description:
      "Discover the top AI tools for SEO writers in 2025 and learn how to choose the right platform for your content marketing.",
    date: "2025-01-15",
    readTime: "18 min read",
    hero: "/blog/ai-seo-writer.jpg",
  },
  {
    slug: "ai-content-generators-on-page-seo",
    title: "How AI Content Generators Improve On‑Page SEO",
    description:
      "Explore how modern AI generators handle keyword research, meta tags and internal links to boost your on‑page optimisation.",
    date: "2025-02-01",
    readTime: "16 min read",
    hero: "/blog/ai-onpage-seo.jpg",
  },
  {
    slug: "long-form-content-vs-short-form",
    title: "Long‑Form vs Short‑Form Content: Why 3k+ Words Win",
    description:
      "Analyse the benefits of longer articles for SEO and discover when shorter pieces still have a place in your strategy.",
    date: "2025-02-15",
    readTime: "14 min read",
    hero: "/blog/long-vs-short.jpg",
  },
  {
    slug: "keyword-research-ai-writers",
    title: "Keyword Research Strategies for AI Writers",
    description:
      "Learn how to perform effective keyword research for AI‑generated content, including clustering and search intent analysis.",
    date: "2025-03-15",
    readTime: "18 min read",
    hero: "/blog/keyword-research.jpg",
  },
  {
    slug: "meta-descriptions-ai",
    title: "Creating Compelling Meta Descriptions with AI",
    description:
      "Find out how AI can craft click‑worthy meta descriptions and avoid common pitfalls like truncation and keyword stuffing.",
    date: "2025-04-01",
    readTime: "12 min read",
    hero: "/blog/meta-descriptions.jpg",
  },
  {
    slug: "scaling-content-production-ai",
    title: "Scaling Your Content Production with AI Tools",
    description:
      "Discover how AI accelerates research, drafting and publishing to help you produce more content without burning out.",
    date: "2025-04-15",
    readTime: "17 min read",
    hero: "/blog/scaling-content.jpg",
  },
  {
    slug: "serp-analysis-ai-tools",
    title: "SERP Analysis: How AI Tools Mirror Top‑Ranking Results",
    description:
      "Understand how AI analyses search results and competitor content to help you build articles that outrank the competition.",
    date: "2025-05-01",
    readTime: "15 min read",
    hero: "/blog/serp-analysis.jpg",
  },
  {
    slug: "optimizing-readability-with-ai",
    title: "Optimising Readability with AI: Tips and Tools",
    description:
      "Readable content converts. Learn how AI evaluates and improves readability to keep users engaged and satisfied.",
    date: "2025-05-15",
    readTime: "13 min read",
    hero: "/blog/readability.jpg",
  },
  {
    slug: "ai-content-generation-ethics-quality",
    title: "AI Content Generation Ethics and Quality Control",
    description:
      "Explore the ethical considerations of AI writing, including originality, transparency and maintaining reader trust.",
    date: "2025-06-01",
    readTime: "19 min read",
    hero: "/blog/ai-ethics.jpg",
  },
]

export default function BlogIndexPage() {
  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <div className="container py-12 space-y-10">
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm border text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Long-form, SEO-perfect insights</span>
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">Insights that read like polished drafts</h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                Every post now ships with structured metadata, internal linking suggestions, and built-in expansion checklists so you can turn any idea into a 3k–5k word pillar article—no client-side errors, no broken layouts.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 border">
                <BookOpenText className="h-4 w-4" />
                <span>10+ in-depth guides</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 border">
                <Clock3 className="h-4 w-4" />
                <span>15–20 minute reads</span>
              </div>
            </div>
          </div>
          <Card className="border-2 border-purple-100 dark:border-purple-900/40 shadow-lg">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">Generate perfect articles, then refine with these guides</h2>
              <p className="text-muted-foreground">
                The blog doubles as an optimization companion for AI-generated drafts. Each post includes a reusable appendix so demo, free, and Pro users can lengthen content within their plan limits without sacrificing quality.
              </p>
              <div className="flex gap-3">
                <Link href="/article-writer" className="w-full">
                  <Badge className="w-full justify-center py-3 text-base bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    Open the Article Writer
                  </Badge>
                </Link>
                <Link href="/writing-tool" className="w-full">
                  <Badge variant="outline" className="w-full justify-center py-3 text-base">
                    See the SEO toolkit
                  </Badge>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.slug} className="group h-full overflow-hidden border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-800 shadow-sm hover:shadow-xl transition-all">
              {post.hero && (
                <div className="h-40 w-full overflow-hidden">
                  <img
                    src={post.hero}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <Badge variant="outline">{post.readTime}</Badge>
                </div>
                <CardTitle className="text-xl font-semibold leading-tight">
                  <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground line-clamp-3">
                  {post.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground flex items-center justify-between">
                <span>SEO-optimised · Includes expansion checklist</span>
                <Badge variant="secondary" className="opacity-80">Pillar-ready</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}