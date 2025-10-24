"use client"

import { motion } from "framer-motion"
import { Star, Users, TrendingUp, Award } from "lucide-react"

export function SocialProof() {
  const stats = [
    {
      icon: Users,
      value: "10,000+",
      label: "Active Users",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "User Rating",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: TrendingUp,
      value: "50K+",
      label: "Articles Generated",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Award,
      value: "#1",
      label: "SEO Content Tool",
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
    "Featured on Product Hunt",
    "G2 High Performer 2024",
    "SOC 2 Type II Certified",
    "GDPR Compliant"
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
