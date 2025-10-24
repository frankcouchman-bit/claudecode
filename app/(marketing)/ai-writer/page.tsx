import type { Metadata } from "next"
import Demo from "@/components/sections/demo"
export const metadata: Metadata = {
  title: "AI Writer | SEOScribe",
  description: "Fast drafts with SERP-aware research and export to CMS."
}
export default function Page() {
  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold">AI Writer</h1>
      <p className="mt-3 text-muted-foreground">Fast drafts with SERP-aware research and export to CMS.</p>
      <div className="mt-8"><Demo /></div>
    </div>
  )
}
