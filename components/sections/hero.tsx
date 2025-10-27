"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight, CheckCircle2, Image, FileText, Globe } from "lucide-react"
import { PremiumBackground } from "@/components/premium-background"
import { AnimatedCounter } from "@/components/animated-counter"
import {
  premiumButtonVariants,
  cardDepthVariants,
  pulsatingBadge,
  staggerContainer,
  staggerItem
} from "@/lib/premium-effects"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900">
      {/* Premium background effects */}
      <PremiumBackground />

      <div className="container relative py-32 lg:py-40">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge with pulsating effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex mb-6"
          >
            <motion.div
              variants={pulsatingBadge}
              initial="initial"
              animate="pulse"
            >
              <Badge className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 border-0 text-white shadow-lg">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Sparkles className="w-3 h-3 mr-2" />
                </motion.div>
                AI-Powered SEO Writing Platform
              </Badge>
            </motion.div>
          </motion.div>

          {/* Main headline with gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            Write SEO Articles That{" "}
            <span className="gradient-text animate-glow">
              Actually Rank
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12"
          >
            SERP-aware long-form content with citations, internal links, and perfect meta tags—ready in minutes, not hours.
          </motion.p>

          {/* CTA Buttons with premium effects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link href="/article-writer">
              <motion.div
                variants={premiumButtonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <Button size="lg" className="gradient-btn text-white px-8 h-12 text-lg group relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    Generate a Demo Article
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
            <Link href="/pricing">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button variant="outline" size="lg" className="px-8 h-12 text-lg border-2 hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950 transition-all backdrop-blur-sm bg-white/80">
                  See Pricing
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
          >
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>No credit card required</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>1 article per week free</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>Cancel anytime</span>
            </motion.div>
          </motion.div>

          {/* Unique Features Showcase */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            <motion.div
              variants={cardDepthVariants}
              initial="initial"
              whileHover="hover"
              className="text-center p-6 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-2 border-purple-200/50 dark:border-purple-800/50"
            >
              <motion.div
                className="inline-flex p-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 mb-3"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Image className="w-6 h-6 text-white" />
              </motion.div>
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                AI Images
              </div>
              <div className="text-sm text-muted-foreground mt-2 font-medium">Included in every article</div>
              <div className="text-xs text-muted-foreground mt-1">Most competitors charge extra</div>
            </motion.div>

            <motion.div
              variants={cardDepthVariants}
              initial="initial"
              whileHover="hover"
              className="text-center p-6 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-2 border-green-200/50 dark:border-green-800/50"
            >
              <motion.div
                className="inline-flex p-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 mb-3"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <FileText className="w-6 h-6 text-white" />
              </motion.div>
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                Embedded FAQs
              </div>
              <div className="text-sm text-muted-foreground mt-2 font-medium">Inside article content</div>
              <div className="text-xs text-muted-foreground mt-1">Boosts word count + SEO</div>
            </motion.div>

            <motion.div
              variants={cardDepthVariants}
              initial="initial"
              whileHover="hover"
              className="text-center p-6 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-2 border-blue-200/50 dark:border-blue-800/50"
            >
              <motion.div
                className="inline-flex p-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 mb-3"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Globe className="w-6 h-6 text-white" />
              </motion.div>
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                25+ Languages
              </div>
              <div className="text-sm text-muted-foreground mt-2 font-medium">Global content creation</div>
              <div className="text-xs text-muted-foreground mt-1">Same quality, any language</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
