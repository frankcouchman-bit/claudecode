'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { captureTokensFromURL, clearTokens, getAccessToken, isAuthed } from "@/lib/auth"
import { sendMagicLink, googleAuthURL } from "@/lib/api"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PremiumBackground } from "@/components/premium-background"
import {
  Mail,
  Sparkles,
  CheckCircle2,
  Image,
  FileText,
  Globe,
  ArrowRight,
  Zap
} from "lucide-react"

export default function Page(){
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState<string|null>(null)
  const [loading, setLoading] = useState(false)
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    // Capture tokens from URL if present.  This stores access and
    // refresh tokens in localStorage when the magic link or OAuth
    // callback returns to this page.
    captureTokensFromURL()

    // After a short delay, verify whether a valid token exists.  We
    // explicitly use isAuthed() rather than simply checking for any
    // token, because expired or malformed tokens can remain in
    // localStorage and cause redirect loops.  If a valid token is
    // present, redirect to the dashboard.  Otherwise clear the
    // invalid tokens so the user can sign in again without being
    // bounced back to this page.
    const timer = setTimeout(() => {
      if (isAuthed()) {
        setRedirecting(true)
        if (typeof window !== 'undefined') {
          window.location.href = '/dashboard'
        } else {
          router.push('/dashboard')
        }
      } else {
        clearTokens()
        setRedirecting(false)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [router])

  async function magic() {
    if (!email.trim()) {
      setErr('Please enter your email')
      return
    }
    setErr(null)
    setLoading(true)
    try {
      await sendMagicLink(
        email,
        typeof window !== 'undefined' ? window.location.origin + '/auth' : undefined
      )
      setSent(true)
    } catch(e: any) {
      setErr(e?.message || 'Failed to send magic link')
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: Image,
      title: "AI-Generated Images",
      description: "Hero images included with every article"
    },
    {
      icon: FileText,
      title: "Embedded FAQs",
      description: "Boost word count by 500-800 words"
    },
    {
      icon: Globe,
      title: "25+ Languages",
      description: "Same quality in any language"
    },
    {
      icon: Zap,
      title: "Generate in 60 Seconds",
      description: "From topic to published article"
    }
  ]

  // Show redirecting message if authenticated
  if (redirecting) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900">
        <PremiumBackground />
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900">
      {/* Premium background effects */}
      <PremiumBackground />

      <div className="container relative py-16">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">

          {/* Left Side - Features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block"
          >
            <div className="mb-6">
              <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 border-0 text-white">
                <Sparkles className="w-3 h-3 mr-2" />
                Start Creating Today
              </Badge>
              <h1 className="text-5xl font-bold mb-4">
                Welcome to{" "}
                <span className="gradient-text">SEOScribe</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Start creating SEO-optimized articles with embedded FAQs, citations, and AI images
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50"
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-8 flex flex-wrap gap-4 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>1 article per day free</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Auth Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-2xl shadow-purple-500/20 backdrop-blur-lg bg-white/90 dark:bg-gray-900/90">
              {/* Gradient accent */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-t-lg" />

              <CardHeader className="pt-8">
                <CardTitle className="text-3xl">Sign In</CardTitle>
                <CardDescription className="text-base">
                  Choose your preferred sign-in method
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {!sent ? (
                  <>
                    {/* Google Sign In */}
                    <a
                      href={googleAuthURL(typeof window !== 'undefined' ? window.location.origin + '/auth' : undefined)}
                      className="block"
                    >
                      <Button
                        variant="outline"
                        className="w-full h-12 text-base border-2 hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950 transition-all"
                        type="button"
                      >
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                      </Button>
                    </a>

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-gray-900 px-2 text-muted-foreground">
                          Or continue with email
                        </span>
                      </div>
                    </div>

                    {/* Magic Link */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && magic()}
                            className="pl-10 h-12 text-base"
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <Button
                        onClick={magic}
                        disabled={loading}
                        className="w-full gradient-btn text-white h-12 text-base"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Mail className="mr-2 h-5 w-5" />
                            Send Magic Link
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>

                      {err && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-sm"
                        >
                          {err}
                        </motion.div>
                      )}
                    </div>

                    <p className="text-xs text-center text-muted-foreground">
                      By signing in, you agree to our{" "}
                      <Link href="/terms" className="underline hover:text-purple-600">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="underline hover:text-purple-600">
                        Privacy Policy
                      </Link>
                    </p>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="inline-flex p-4 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                      <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Check Your Email!</h3>
                    <p className="text-muted-foreground mb-4">
                      We've sent a magic link to <strong>{email}</strong>
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      Click the link in the email to sign in. The link expires in 10 minutes.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSent(false)
                        setEmail('')
                      }}
                      className="w-full"
                    >
                      Use a different email
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Mobile Features */}
            <div className="lg:hidden mt-8 space-y-3">
              <p className="text-sm text-muted-foreground text-center mb-4">
                What you get with SEOScribe:
              </p>
              {features.slice(0, 2).map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={feature.title}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm"
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">{feature.title}</span>
                      <span className="text-muted-foreground"> - {feature.description}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
