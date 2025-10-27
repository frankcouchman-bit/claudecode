"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Image,
  FileText,
  Award,
  Globe,
  TrendingUp,
  CheckCircle2,
  Zap,
  Link2
} from "lucide-react"
import { staggerContainer, staggerItem } from "@/lib/premium-effects"

const trustBadges = [
  {
    icon: Image,
    title: "AI-Generated Images",
    description: "Included in every article",
    color: "from-blue-600 to-cyan-600"
  },
  {
    icon: FileText,
    title: "Embedded FAQs",
    description: "Inside article content",
    color: "from-purple-600 to-pink-600"
  },
  {
    icon: Award,
    title: "Auto Citations",
    description: "Credible sources included",
    color: "from-yellow-600 to-orange-600"
  },
  {
    icon: Link2,
    title: "Internal Links",
    description: "SEO-optimized suggestions",
    color: "from-green-600 to-emerald-600"
  }
]

const stats = [
  {
    icon: FileText,
    value: "2K-6K",
    label: "Words Per Article",
    color: "text-purple-600"
  },
  {
    icon: Globe,
    value: "25+",
    label: "Languages Supported",
    color: "text-blue-600"
  },
  {
    icon: Image,
    value: "FREE",
    label: "AI Hero Images",
    color: "text-green-600"
  },
  {
    icon: Zap,
    value: "< 60s",
    label: "Generation Time",
    color: "text-pink-600"
  }
]

export function TrustSection() {
  return (
    <section className="relative py-16 overflow-hidden bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 dark:from-gray-950 dark:via-purple-950/20 dark:to-blue-950/20">
      <div className="container">
        {/* Trust Badges */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-12"
        >
          {trustBadges.map((badge) => {
            const Icon = badge.icon
            return (
              <motion.div
                key={badge.title}
                variants={staggerItem}
              >
                <Card className="border-2 border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg hover:border-purple-200 dark:hover:border-purple-800 transition-colors">
                  <CardContent className="p-4 text-center">
                    <motion.div
                      className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${badge.color} mb-2`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </motion.div>
                    <div className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                      {badge.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {badge.description}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-2 border-purple-200 dark:border-purple-800 rounded-2xl p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                  </motion.div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Guarantee Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 text-center"
        >
          <Badge className="px-6 py-3 text-sm bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Free Forever Plan • No Credit Card Required • Cancel Anytime
          </Badge>
        </motion.div>
      </div>
    </section>
  )
}
