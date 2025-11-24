"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Sparkles, LogOut } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useQuota } from "@/contexts/quota-context"
import { clearTokens, isAuthed } from "@/lib/auth"
import { getProfile } from "@/lib/api"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const router = useRouter()
  const { isAuthenticated } = useQuota()
  // Determine authentication solely by checking local tokens. The quota
  // state may lag behind when tokens are cleared, so we rely on isAuthed()
  // to avoid showing the wrong action in the header while contexts load.
  const authed = isAuthed()

  // Store the authenticated user's email to personalise the header.  We
  // fetch the profile when the user is authenticated.  If no email is
  // available the name remains empty and the header simply shows "Account".
  const [userEmail, setUserEmail] = useState<string>("")
  useEffect(() => {
    if (authed) {
      getProfile().then((profile: any) => {
        if (profile?.email) setUserEmail(profile.email)
      }).catch(() => {
        // ignore profile fetch errors
      })
    } else {
      setUserEmail("")
    }
  }, [authed])

  // Navigation items vary by auth state so signed-in users see only the essentials.
  const navItems = authed
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/blog", label: "Blog" },
        { href: "/pricing", label: "Pricing" },
      ]
    : [
        { href: "/article-writer", label: "Article Writer" },
        { href: "/ai-writer", label: "AI Writer" },
        { href: "/writing-tool", label: "Tools" },
        { href: "/pricing", label: "Pricing" },
        { href: "/blog", label: "Blog" },
      ]

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg shadow-sm">
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
          {/* Show Try Demo only when not authenticated */}
          {!authed && (
            <Link href="/article-writer">
              <Button variant="outline" className="hover:border-primary">
                Try Demo
              </Button>
            </Link>
          )}
          {/* Show sign in or sign out accordingly */}
          {authed ? (
            <Button
              variant="outline"
              onClick={() => {
                clearTokens()
                router.push('/')
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {userEmail ? userEmail.split('@')[0] : 'Account'} (Sign Out)
            </Button>
          ) : (
            <Link href="/auth">
              <Button className="gradient-btn text-white">
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
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
                {!isAuthenticated && (
                  <Link href="/article-writer" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Try Demo
                    </Button>
                  </Link>
                )}
                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      clearTokens()
                      setMobileMenuOpen(false)
                      router.push('/')
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                  </Button>
                ) : (
                  <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full gradient-btn text-white">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
