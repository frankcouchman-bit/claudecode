import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, Clock3, Feather, Sparkles } from "lucide-react"
import type { ReactNode } from "react"

interface BlogPostLayoutProps {
  title: string
  description: string
  published: string
  readTime?: string
  tags?: string[]
  heroImage?: string
  children: ReactNode
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function BlogPostLayout({
  title,
  description,
  published,
  readTime = "18 min read",
  tags = [],
  heroImage,
  children,
}: BlogPostLayoutProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: published,
    dateModified: published,
    author: {
      "@type": "Organization",
      name: "SEOScribe",
    },
    image: heroImage ? [heroImage] : undefined,
    publisher: {
      "@type": "Organization",
      name: "SEOScribe",
      logo: {
        "@type": "ImageObject",
        url: "/logo.png",
      },
    },
  }

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <div className="border-b bg-white/70 dark:bg-slate-950/70 backdrop-blur sticky top-0 z-10 hidden lg:block">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Feather className="h-4 w-4 text-primary" />
            <span>SEOScribe Journal</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <span>{formatDate(published)}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1">
              <Clock3 className="h-4 w-4" />
              <span>{readTime}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/60 via-blue-50/60 to-teal-50/60 dark:from-purple-900/30 dark:via-slate-900 dark:to-blue-900/30" aria-hidden />
        <div className="absolute -left-20 -top-16 h-48 w-48 rounded-full bg-purple-400/20 blur-3xl" aria-hidden />
        <div className="absolute -right-10 top-10 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl" aria-hidden />

        <header className="container relative py-14 lg:py-18">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border bg-white/80 px-3 py-1 text-sm text-muted-foreground shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Long-form, SEO-perfect</span>
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white">
                {title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>{formatDate(published)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                <span>{readTime}</span>
              </div>
              {tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-white/60 dark:bg-slate-900/60">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {heroImage && (
            <div className="mt-10 overflow-hidden rounded-2xl border bg-white shadow-xl dark:bg-slate-950">
              <img
                src={heroImage}
                alt={title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          )}
        </header>
      </div>

      <div className="container grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] py-6 lg:py-10">
        <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:scroll-mt-24 prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg">
          {children}
        </article>

        <aside className="space-y-4">
          <Card className="border-2 border-purple-100 dark:border-purple-900/40">
            <CardContent className="space-y-3 p-5">
              <h3 className="text-lg font-semibold">SEO quality checklist</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✔️ Clear H1 + descriptive H2/H3 structure</li>
                <li>✔️ Readability tuned for humans and search engines</li>
                <li>✔️ Rich internal links to related SEOScribe guides</li>
                <li>✔️ Conversion CTA for article generation</li>
                <li>✔️ Schema-ready metadata for faster indexing</li>
              </ul>
              <Separator />
              <p className="text-sm text-muted-foreground">
                Every article is engineered to be extended into 3k-5k word pillar pieces. Upgrade to Pro to unlock the longest drafts.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>

      <div className="container pb-12">
        <Card className="border-2 border-blue-100 dark:border-blue-900/40">
          <CardContent className="p-6 space-y-3">
            <h3 className="text-xl font-semibold">Continue your SEO journey</h3>
            <p className="text-sm text-muted-foreground">These SEOScribe guides interlink with this article to lift topical authority and reader depth.</p>
            <ul className="grid gap-2 md:grid-cols-2 text-sm text-primary">
              <li><a className="hover:underline" href="/blog/ai-content-generators-on-page-seo">AI content generators for on-page SEO</a></li>
              <li><a className="hover:underline" href="/blog/best-ai-seo-article-writer-2025">Best AI SEO article writers in 2025</a></li>
              <li><a className="hover:underline" href="/blog/keyword-research-ai-writers">Keyword research strategies for AI writers</a></li>
              <li><a className="hover:underline" href="/blog/serp-analysis-ai-tools">SERP analysis: how AI mirrors top results</a></li>
              <li><a className="hover:underline" href="/tools">Open the SEO tools dashboard</a></li>
              <li><a className="hover:underline" href="/article-writer">Generate a pillar article now</a></li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </div>
  )
}
