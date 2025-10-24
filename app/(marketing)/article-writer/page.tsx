import type { Metadata } from "next"
import Demo from "@/components/sections/demo"
export const metadata: Metadata = {
  title: "Article Writer | SEOScribe",
  description: "Generate 2,000–6,000 word SEO articles with citations, images, and meta."
}
export default function Page() {
  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold">Article Writer</h1>
      <p className="mt-3 text-muted-foreground">Generate 2,000–6,000 word SEO articles with citations, images, and meta.</p>
      <div className="mt-8"><Demo /></div>
    </div>
  )
}
