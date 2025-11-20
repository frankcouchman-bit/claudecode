"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AnimatedProgress, AnimatedBadge } from "@/components/animated-counter"
import { getQuota, getRemainingQuota, type QuotaLimits } from "@/lib/quota-enforcement"
import { Zap, Crown, TrendingUp, AlertCircle, CheckCircle2, X } from "lucide-react"
import Link from "next/link"

interface QuotaDisplayProps {
  isAuthenticated: boolean
  onUpgrade?: () => void
}

export function QuotaDisplay({ isAuthenticated, onUpgrade }: QuotaDisplayProps) {
  // We intentionally do not render the quota overlay anymore.  The
  // dashboard and header show quota information via the QuotaBadge and
  // other UI elements.  Returning null here prevents the legacy overlay
  // (with free plan popups and upgrade prompts) from appearing and
  // interfering with user experience.
  return null
}

// Mini quota indicator for header
export function QuotaBadge({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [quota, setQuota] = useState<QuotaLimits | null>(null)

  useEffect(() => {
    setQuota(getQuota())
  }, [])

  if (!quota || !isAuthenticated) return null

  const isPro = quota.plan === 'pro'
  const remaining = isPro
    ? 10 - quota.todayGenerations
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
