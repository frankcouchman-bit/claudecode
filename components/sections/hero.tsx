"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight, CheckCircle2, TrendingUp, Users, Zap } from "lucide-react"
import { ParticleBackground, GradientOrbs, GridPattern } from "@/components/particle-background"
import { AnimatedCounter } from "@/components/animated-counter"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-mesh">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/30 to-transparent dark:via-purple-950/20" />

      {/* Premium background effects */}
      <GridPattern />
      <ParticleBackground />
      <GradientOrbs />

      <div className="container relative py-32 lg:py-40">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex mb-6"
          >
            <Badge className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 border-0 text-white">
              <Sparkles className="w-3 h-3 mr-2" />
              AI-Powered SEO Writing Platform
            </Badge>
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

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link href="/article-writer">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" className="gradient-btn text-white px-8 h-12 text-lg group shadow-lg hover:shadow-xl transition-shadow">
                  Generate a Demo Article
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>
            <Link href="/pricing">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" size="lg" className="px-8 h-12 text-lg border-2 hover:border-primary hover:bg-primary/5 transition-all">
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

          {/* Animated Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            <motion.div
              className="text-center p-6 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50"
              whileHover={{ scale: 1.05, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold gradient-text">
                <AnimatedCounter value={50000} suffix="+" />
              </div>
              <div className="text-sm text-muted-foreground mt-2">Articles Generated</div>
            </motion.div>

            <motion.div
              className="text-center p-6 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50"
              whileHover={{ scale: 1.05, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold gradient-text">
                <AnimatedCounter value={4.9} suffix="/5" />
              </div>
              <div className="text-sm text-muted-foreground mt-2">User Rating</div>
            </motion.div>

            <motion.div
              className="text-center p-6 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50"
              whileHover={{ scale: 1.05, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold gradient-text">
                <AnimatedCounter value={10000} suffix="+" />
              </div>
              <div className="text-sm text-muted-foreground mt-2">Active Users</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
