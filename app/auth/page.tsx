'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { captureTokensFromURL, getAccessToken } from "@/lib/auth"
import { googleAuthURL, API_BASE } from "@/lib/api"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PremiumBackground } from "@/components/premium-background"
import {
  Sparkles,
  CheckCircle2,
  Image,
  FileText,
  Globe,
  Zap,
  AlertCircle
} from "lucide-react"

export default function Page(){
  const router = useRouter()
  const [redirecting, setRedirecting] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [signingIn, setSigningIn] = useState(false)

  useEffect(() => {
    let mounted = true

    console.log('[AUTH PAGE] Component mounted')

    const handleAuth = async () => {
      // First, capture tokens from URL if present
      const hadTokensInURL = captureTokensFromURL()

      if (hadTokensInURL) {
        console.log('[AUTH PAGE] Tokens captured from URL, waiting before redirect')
      }

      // Wait a bit for localStorage to sync
      await new Promise(resolve => setTimeout(resolve, 500))

      if (!mounted) return

      // Check if user is authenticated
      const token = getAccessToken()
      console.log('[AUTH PAGE] Checking auth status:', !!token)

      if (token) {
        console.log('[AUTH PAGE] User is authenticated, redirecting to dashboard')
        setRedirecting(true)

        // Redirect using window.location for reliability
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            console.log('[AUTH PAGE] Executing redirect')
            window.location.href = '/dashboard'
          }
        }, 500)
      } else {
        console.log('[AUTH PAGE] User not authenticated, staying on auth page')
      }
    }

    handleAuth()

    return () => {
      mounted = false
    }
  }, [])

  const handleGoogleSignIn = async () => {
    if (typeof window !== 'undefined') {
      setSigningIn(true)
      setAuthError(null)

      const redirectUrl = `${window.location.origin}/auth`
      const authUrl = googleAuthURL(redirectUrl)

      console.log('[AUTH PAGE] Initiating Google OAuth sign-in')
      console.log('[AUTH PAGE] Current origin:', window.location.origin)
      console.log('[AUTH PAGE] Redirect URL:', redirectUrl)
      console.log('[AUTH PAGE] Backend API:', API_BASE)
      console.log('[AUTH PAGE] Full OAuth URL:', authUrl)

      // Redirect to OAuth endpoint - the backend will redirect to Google
      // Note: We don't pre-test the endpoint because CORS prevents reliable testing
      // If there's a configuration issue, the user will see an error page from the backend
      window.location.href = authUrl
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
                <CardTitle className="text-3xl">Sign In or Create Account</CardTitle>
                <CardDescription className="text-base">
                  Get started instantly with Google - no password required
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 py-8">
                {/* Google Sign In - Primary CTA */}
                <div className="space-y-4">
                  <Button
                    size="lg"
                    className="w-full h-14 text-lg gradient-btn text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={signingIn || redirecting}
                  >
                    {signingIn ? (
                      <>
                        <div className="animate-spin mr-3 h-6 w-6 border-3 border-white border-t-transparent rounded-full" />
                        Connecting to Google...
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                          <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                      </>
                    )}
                  </Button>

                  {authError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-red-800 dark:text-red-200 mb-1">
                            Sign-in Error
                          </h4>
                          <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                            {authError}
                          </p>

                          {authError.includes('FRONTEND_URL') && typeof window !== 'undefined' && (
                            <div className="text-xs bg-red-100 dark:bg-red-900/40 p-3 rounded border border-red-200 dark:border-red-800 mb-3">
                              <p className="font-semibold mb-2">How to fix this:</p>
                              <ol className="list-decimal list-inside space-y-1 ml-1">
                                <li>Go to your Cloudflare dashboard</li>
                                <li>Open your Worker ({API_BASE.includes('seoscribe') ? 'seoscribe' : 'your worker'})</li>
                                <li>Go to Settings → Variables</li>
                                <li>Set <code className="bg-red-200 dark:bg-red-800 px-1 rounded font-mono">FRONTEND_URL</code> to: <code className="bg-red-200 dark:bg-red-800 px-1 rounded font-mono">{window.location.origin}</code></li>
                                <li>Save and deploy your Worker</li>
                              </ol>
                            </div>
                          )}

                          <div className="text-xs text-red-600 dark:text-red-400">
                            <p className="mb-1">Other things to check:</p>
                            <ul className="list-disc list-inside space-y-0.5 ml-1">
                              <li>Your internet connection is stable</li>
                              <li>Google OAuth is enabled in your Supabase project</li>
                              <li>The backend API URL is correct</li>
                            </ul>
                          </div>
                          <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800 flex gap-3">
                            <Link
                              href="/debug"
                              className="text-xs text-red-700 dark:text-red-300 hover:underline font-medium"
                            >
                              View Debug Info →
                            </Link>
                            <Link
                              href="/setup"
                              className="text-xs text-red-700 dark:text-red-300 hover:underline font-medium"
                            >
                              Setup Guide →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {!authError && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Instant access - no email verification</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Account created automatically on first sign-in</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 space-y-2">
                  <p className="text-xs text-center text-muted-foreground">
                    By continuing, you agree to our{" "}
                    <Link href="/terms" className="underline hover:text-purple-600 font-medium">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="underline hover:text-purple-600 font-medium">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
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
