"use client"

import { useState } from "react"
import { useQuota } from "@/contexts/quota-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, Sparkles } from "lucide-react"
import { clearTokens, isAuthed } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const router = useRouter()

  // Determine if the user is authenticated using the QuotaProvider.  If
  // not wrapped in a QuotaProvider (e.g. during static build), default to
  // false.  This hook must be called unconditionally to satisfy the
  // Rules of Hooks.
  let isAuthenticated = false
  try {
    const { isAuthenticated: authFlag } = useQuota()
    // Fallback to checking token directly via isAuthed() in case the
    // QuotaProvider has not updated yet.  This ensures the header
    // reflects signed-in state immediately after login.
    isAuthenticated = authFlag || isAuthed()
  } catch {
    isAuthenticated = isAuthed()
  }

  // Base navigation items that are always visible
  const baseNavItems = [
    { href: "/article-writer", label: "Article Writer" },
    { href: "/ai-writer", label: "AI Writer" },
    { href: "/writing-tool", label: "Tools" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
  ]

  // Include the dashboard link only when the user is authenticated
  const navItems = isAuthenticated
    ? [...baseNavItems, { href: "/dashboard", label: "Dashboard" }]
    : baseNavItems

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
          <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="gradient-text">SEOScribe</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {/* Show different actions based on authentication */}
          {isAuthenticated ? (
            <>
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  clearTokens()
                  router.push('/')
                }}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/article-writer">
                <Button variant="outline" className="hover:border-primary">
                  Try Demo
                </Button>
              </Link>
              <Link href="/auth">
                <Button className="gradient-btn text-white">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="relative w-9 h-9"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg"
          >
            <nav className="container py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t">
                {isAuthenticated ? (
                  <>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setMobileMenuOpen(false)
                        router.push('/dashboard')
                      }}
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        clearTokens()
                        setMobileMenuOpen(false)
                        router.push('/')
                      }}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/article-writer" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Try Demo
                      </Button>
                    </Link>
                    <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full gradient-btn text-white">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
