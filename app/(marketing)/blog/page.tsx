
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
  },
  {
    slug: "ai-content-generators-on-page-seo",
    title: "How AI Content Generators Improve On‑Page SEO",
    description:
      "Explore how modern AI generators handle keyword research, meta tags and internal links to boost your on‑page optimisation.",
    date: "2025-02-01",
  },
  {
    slug: "long-form-content-vs-short-form",
    title: "Long‑Form vs Short‑Form Content: Why 3k+ Words Win",
    description:
      "Analyse the benefits of longer articles for SEO and discover when shorter pieces still have a place in your strategy.",
    date: "2025-02-15",
  },
  {
    slug: "keyword-research-ai-writers",
    title: "Keyword Research Strategies for AI Writers",
    description:
      "Learn how to perform effective keyword research for AI‑generated content, including clustering and search intent analysis.",
    date: "2025-03-15",
  },
  {
    slug: "meta-descriptions-ai",
    title: "Creating Compelling Meta Descriptions with AI",
    description:
      "Find out how AI can craft click‑worthy meta descriptions and avoid common pitfalls like truncation and keyword stuffing.",
    date: "2025-04-01",
  },
  {
    slug: "scaling-content-production-ai",
    title: "Scaling Your Content Production with AI Tools",
    description:
      "Discover how AI accelerates research, drafting and publishing to help you produce more content without burning out.",
    date: "2025-04-15",
  },
  {
    slug: "serp-analysis-ai-tools",
    title: "SERP Analysis: How AI Tools Mirror Top‑Ranking Results",
    description:
      "Understand how AI analyses search results and competitor content to help you build articles that outrank the competition.",
    date: "2025-05-01",
  },
  {
    slug: "optimizing-readability-with-ai",
    title: "Optimising Readability with AI: Tips and Tools",
    description:
      "Readable content converts. Learn how AI evaluates and improves readability to keep users engaged and satisfied.",
    date: "2025-05-15",
  },
  {
    slug: "ai-content-generation-ethics-quality",
    title: "AI Content Generation Ethics and Quality Control",
    description:
      "Explore the ethical considerations of AI writing, including originality, transparency and maintaining reader trust.",
    date: "2025-06-01",
  },
]

export default function BlogIndexPage() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-6">Insights & Guides</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Dive deep into the world of AI writing and SEO.  Our long‑form blog posts explore
        strategies, tools and best practices to help you create content that ranks and converts.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.slug} className="hover:shadow-lg transition-shadow border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-700">
            <CardHeader>
              <CardTitle className="text-xl font-semibold mb-1">
                <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                  {post.title}
                </Link>
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {post.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground flex items-center justify-between">
              <span>{new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <Badge variant="outline">15+ min read</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}