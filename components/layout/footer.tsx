import Link from "next/link"
export function Footer() {
  return (
    <footer className="border-t mt-20">
      <div className="container py-10 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} SEOScribe. All rights reserved.</p>
        <nav className="flex gap-6">
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
      </div>
    </footer>
  )
}
