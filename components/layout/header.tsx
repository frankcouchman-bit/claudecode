"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, Sparkles, User, LogOut, Crown, FileText, LayoutDashboard } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { isAuthed, clearTokens } from "@/lib/auth"
import { getProfile } from "@/lib/api"

export function Header() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const checkAuth = async () => {
      const authed = isAuthed()
      console.log('[HEADER] Auth check:', authed)
      setAuthenticated(authed)

      if (authed) {
        try {
          const p = await getProfile()
          console.log('[HEADER] Profile loaded:', p)
          setProfile(p)
        } catch (e) {
          console.error('[HEADER] Failed to load profile:', e)
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [mounted])

  const handleSignOut = () => {
    clearTokens()
    setAuthenticated(false)
    setProfile(null)
    router.push('/')
  }

  const navItems = [
    { href: "/article-writer", label: "Article Writer" },
    { href: "/ai-writer", label: "AI Writer" },
    { href: "/writing-tool", label: "Tools" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
  ]

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="gradient-text">SEOScribe</span>
          </Link>
        </div>
      </header>
    )
  }

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
          {!loading && !authenticated && (
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
          {!loading && authenticated && (
            <>
              <Link href="/dashboard">
                <Button variant="outline" className="hover:border-primary">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <User className="h-4 w-4" />
                    {profile?.email?.split('@')[0] || 'Account'}
                    {profile?.plan === 'pro' && (
                      <Badge className="ml-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 px-1.5 py-0 text-xs">
                        PRO
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{profile?.email}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {profile?.plan || 'free'} Plan
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/library')}>
                    <FileText className="mr-2 h-4 w-4" />
                    My Articles
                  </DropdownMenuItem>
                  {profile?.plan !== 'pro' && (
                    <DropdownMenuItem onClick={() => router.push('/pricing')}>
                      <Crown className="mr-2 h-4 w-4" />
                      Upgrade to Pro
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                {!loading && authenticated && (
                  <>
                    <div className="px-3 py-2 bg-muted rounded-lg mb-2">
                      <p className="text-sm font-medium">{profile?.email}</p>
                      <p className="text-xs text-muted-foreground capitalize flex items-center gap-2">
                        {profile?.plan || 'free'} Plan
                        {profile?.plan === 'pro' && (
                          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 px-1.5 py-0 text-xs">
                            PRO
                          </Badge>
                        )}
                      </p>
                    </div>
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/library" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        My Articles
                      </Button>
                    </Link>
                    {profile?.plan !== 'pro' && (
                      <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full justify-start">
                          <Crown className="mr-2 h-4 w-4" />
                          Upgrade to Pro
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-600"
                      onClick={() => {
                        handleSignOut()
                        setMobileMenuOpen(false)
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                )}
                {!loading && !authenticated && (
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
