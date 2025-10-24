import { Button } from "@/components/ui/button"
import Link from "next/link"
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container py-24">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tight">Write SEO articles that actually rank.</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            SERP-aware long-form content with citations, internal links, and meta—ready in minutes.
          </p>
          <div className="mt-8 flex gap-4">
            <Link href="/article-writer"><Button size="lg">Generate a Demo Article</Button></Link>
            <Link href="/pricing"><Button variant="outline" size="lg">See Pricing</Button></Link>
          </div>
        </div>
      </div>
    </section>
  )
}
