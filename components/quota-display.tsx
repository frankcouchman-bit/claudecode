"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AnimatedProgress, AnimatedBadge } from "@/components/animated-counter"
import { getQuota, getRemainingQuota, type QuotaLimits } from "@/lib/quota-enforcement"
import { Zap, Crown, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"

interface QuotaDisplayProps {
  isAuthenticated: boolean
  onUpgrade?: () => void
}

export function QuotaDisplay({ isAuthenticated, onUpgrade }: QuotaDisplayProps) {
  const [mounted, setMounted] = useState(false)
  const [quota, setQuota] = useState<QuotaLimits | null>(null)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const currentQuota = getQuota()
    setQuota(currentQuota)

    // Show upgrade prompt if free user is running low
    if (isAuthenticated && currentQuota.plan === 'free' && currentQuota.weekGenerations >= 1) {
      setShowUpgradePrompt(true)
    }
  }, [mounted, isAuthenticated])

  if (!mounted || !quota) return null

  const isPro = quota.plan === 'pro'
  const articlesMax = isPro ? 15 : 1
  const articlesUsed = isPro ? quota.todayGenerations : quota.weekGenerations
  const articlesRemaining = articlesMax - articlesUsed
  const percentage = (articlesUsed / articlesMax) * 100

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-20 right-4 z-40 w-80"
      >
        <Card className="border-2 shadow-xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                {isPro ? (
                  <>
                    <Crown className="w-4 h-4 text-yellow-500" />
                    <span className="gradient-text">Pro Plan</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-gray-500" />
                    Free Plan
                  </>
                )}
              </CardTitle>
              {isPro && (
                <AnimatedBadge variant="success" pulse>
                  Active
                </AnimatedBadge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Article Generation Quota */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Article Generation</span>
                <span className="text-xs text-muted-foreground">
                  {articlesRemaining} left
                </span>
              </div>
              <AnimatedProgress
                value={articlesUsed}
                max={articlesMax}
                showLabel={false}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {isPro ? 'Resets daily at midnight' : 'Resets weekly on Monday'}
              </p>
            </div>

            {/* Tool Usage Quota */}
            {isAuthenticated && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Tool Usage</span>
                  <span className="text-xs text-muted-foreground">
                    {(isPro ? 10 : 1) - quota.toolsToday} left
                  </span>
                </div>
                <AnimatedProgress
                  value={quota.toolsToday}
                  max={isPro ? 10 : 1}
                  showLabel={false}
                />
              </div>
            )}

            {/* Upgrade CTA for Free Users */}
            {!isPro && isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="pt-2 border-t"
              >
                <div className="text-xs text-muted-foreground mb-2">
                  Upgrade to Pro for:
                </div>
                <ul className="text-xs space-y-1 mb-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    15 articles per day
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    10 tool uses per day
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    Priority support
                  </li>
                </ul>
                <Link href="/pricing">
                  <Button className="w-full gradient-btn text-white" size="sm">
                    <Crown className="w-3 h-3 mr-2" />
                    Upgrade to Pro
                  </Button>
                </Link>
              </motion.div>
            )}

            {/* Guest User Info */}
            {!isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="pt-2 border-t"
              >
                <div className="flex items-start gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    {quota.demoUsed
                      ? "Demo used. Sign up to continue generating articles."
                      : "Try the demo! Sign up for unlimited access."}
                  </p>
                </div>
                <Link href="/auth">
                  <Button className="w-full gradient-btn text-white" size="sm">
                    Sign Up Free
                  </Button>
                </Link>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Upgrade Success Animation */}
      <AnimatePresence>
        {showUpgradePrompt && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Card className="border-2 border-yellow-500 shadow-2xl max-w-sm bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-yellow-500">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Weekly Limit Reached!</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Upgrade to Pro for 15 articles per day
                    </p>
                    <div className="flex gap-2">
                      <Link href="/pricing" className="flex-1">
                        <Button className="w-full gradient-btn text-white" size="sm">
                          Upgrade Now
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowUpgradePrompt(false)}
                      >
                        Later
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Mini quota indicator for header
export function QuotaBadge({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [mounted, setMounted] = useState(false)
  const [quota, setQuota] = useState<QuotaLimits | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    setQuota(getQuota())
  }, [mounted])

  if (!mounted || !quota || !isAuthenticated) return null

  const isPro = quota.plan === 'pro'
  const remaining = isPro
    ? 15 - quota.todayGenerations
    : 1 - quota.weekGenerations

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      <Badge
        variant="outline"
        className={`${
          remaining === 0 ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'
        }`}
      >
        <Zap className="w-3 h-3 mr-1" />
        {remaining} left
      </Badge>
    </motion.div>
  )
}
