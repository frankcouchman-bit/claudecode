"use client"

import { motion } from "framer-motion"
import { Image, FileText, Globe, Award } from "lucide-react"

export function SocialProof() {
  const stats = [
    {
      icon: Image,
      value: "AI Images",
      label: "Included Free",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: FileText,
      value: "Embedded FAQs",
      label: "Inside Articles",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Globe,
      value: "25+ Languages",
      label: "Same Quality",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Award,
      value: "Citations",
      label: "Auto-Generated",
      color: "from-purple-500 to-pink-500"
    }
  ]

  return (
    <section className="py-16 border-y bg-muted/30">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex mb-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function TrustBadges() {
  const badges = [
    "No Credit Card Required",
    "Cancel Anytime",
    "All Features Included",
    "Money-Back Guarantee"
  ]

  return (
    <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
      {badges.map((badge, index) => (
        <div
          key={index}
          className="flex items-center gap-2 px-4 py-2 rounded-full border bg-background/50"
        >
          <Award className="w-4 h-4 text-primary" />
          <span>{badge}</span>
        </div>
      ))}
    </div>
  )
}
