"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Sparkles, ArrowRight, CheckCircle2, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"
import { scaleAndFade, premiumButtonVariants } from "@/lib/premium-effects"

interface ConversionPopupProps {
  delaySeconds?: number
  showExitIntent?: boolean
}

export function ConversionPopup({ delaySeconds = 15, showExitIntent = true }: ConversionPopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    // Check if popup has been shown before (localStorage)
    const popupShown = localStorage.getItem("seoscribe-popup-shown")
    const lastShown = localStorage.getItem("seoscribe-popup-last-shown")

    // Don't show if shown within last 24 hours
    if (lastShown) {
      const hoursSinceLastShown = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60)
      if (hoursSinceLastShown < 24) {
        return
      }
    }

    // Time-based trigger
    const timer = setTimeout(() => {
      if (!hasShown) {
        setIsOpen(true)
        setHasShown(true)
        localStorage.setItem("seoscribe-popup-shown", "true")
        localStorage.setItem("seoscribe-popup-last-shown", Date.now().toString())
      }
    }, delaySeconds * 1000)

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (showExitIntent && e.clientY <= 0 && !hasShown) {
        setIsOpen(true)
        setHasShown(true)
        localStorage.setItem("seoscribe-popup-shown", "true")
        localStorage.setItem("seoscribe-popup-last-shown", Date.now().toString())
      }
    }

    if (showExitIntent) {
      document.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      clearTimeout(timer)
      if (showExitIntent) {
        document.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [delaySeconds, showExitIntent, hasShown])

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 dark:from-gray-900 dark:via-purple-950/30 dark:to-blue-950/30">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gradient accent */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600" />

        {/* Floating gradient orbs */}
        <motion.div
          className="absolute -top-20 -right-20 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="relative z-10 p-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-sm font-medium mb-4"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
            Limited Time Offer
          </motion.div>

          {/* Header */}
          <DialogHeader className="space-y-4 mb-6">
            <DialogTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Write Your First SEO Article in 20 Minutes
            </DialogTitle>
            <DialogDescription className="text-lg text-gray-700 dark:text-gray-300">
              Generate SEO-optimized articles with embedded FAQs, citations, and AI images—all in one click
            </DialogDescription>
          </DialogHeader>

          {/* Benefits */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-start gap-3"
            >
              <div className="flex-shrink-0 p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white mb-1">
                  SERP-Aware Content
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Analyzes top-ranking pages and creates content that ranks
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-start gap-3"
            >
              <div className="flex-shrink-0 p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white mb-1">
                  Complete SEO Package
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Meta tags, citations, internal links, FAQ schema included
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-start gap-3"
            >
              <div className="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white mb-1">
                  Save 8+ Hours Per Article
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  From research to final draft in under 20 minutes
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-start gap-3"
            >
              <div className="flex-shrink-0 p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white mb-1">
                  No Credit Card Required
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Start with 1 free article per week forever
                </div>
              </div>
            </motion.div>
          </div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-8 p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl border border-purple-200 dark:border-purple-800"
          >
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {["FC", "SP", "MC"].map((initials, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-xs font-semibold border-2 border-white dark:border-gray-900"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-white text-sm">
                  Everything Included, Nothing Extra
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Hero images, FAQs, citations, schema markup—all generated automatically
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/article-writer" className="flex-1" onClick={handleClose}>
              <motion.div
                variants={premiumButtonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="w-full"
              >
                <Button size="lg" className="w-full gradient-btn text-white text-lg h-14 relative overflow-hidden group">
                  <span className="relative z-10 flex items-center justify-center">
                    Generate Free Demo Article
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </Button>
              </motion.div>
            </Link>

            <Link href="/auth" className="flex-1" onClick={handleClose}>
              <Button
                variant="outline"
                size="lg"
                className="w-full text-lg h-14 border-2 border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950 transition-all"
              >
                Sign Up Free
              </Button>
            </Link>
          </div>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
            Free forever plan • No credit card • Cancel anytime
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
