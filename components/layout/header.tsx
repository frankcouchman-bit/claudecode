"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-bold text-xl">SEOScribe</Link>
        <nav className="hidden md:flex gap-6 text-sm">
          <Link href="/article-writer">Article Writer</Link>
          <Link href="/ai-writer">AI Writer</Link>
          <Link href="/writing-tool">Tools</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/dashboard">Dashboard</Link>
        </nav>
        <div className="flex gap-2">
          <Link href="/article-writer"><Button variant="outline">Try Demo</Button></Link>
          <Link href="/auth"><Button>Sign In</Button></Link>
        </div>
      </div>
    </header>
  )
}
