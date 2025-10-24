import type { Metadata } from "next"
import Demo from "@/components/sections/demo"
export const metadata: Metadata = {
  title: "Writing Tool | SEOScribe",
  description: "Headlines, briefs, meta tags, internal links, readability & more."
}
export default function Page() {
  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold">Writing Tool</h1>
      <p className="mt-3 text-muted-foreground">Headlines, briefs, meta tags, internal links, readability & more.</p>
      <div className="mt-8"><Demo /></div>
    </div>
  )
}
