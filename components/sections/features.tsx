"use client"

import { motion } from "framer-motion"
import {
  Search,
  FileText,
  Link2,
  Image,
  BarChart3,
  Zap,
  Shield,
  Globe,
  Sparkles
} from "lucide-react"

export function Features() {
  const items = [
    {
      icon: Search,
      title: "SERP Research",
      desc: "Real-time SERP analysis and search intent mirroring for content that ranks.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: FileText,
      title: "Citations & Sources",
      desc: "Automatic inline citations with credible sources and hero images.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Link2,
      title: "On-Page SEO",
      desc: "Perfect meta tags, schema markup, internal links, and Open Graph.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Sparkles,
      title: "AI-Powered Writing",
      desc: "GPT-4 powered content that reads naturally and engages readers.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      desc: "Track performance, word count, and SEO scores in real-time.",
      color: "from-violet-500 to-purple-500"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      desc: "Generate 2000+ word articles in under 60 seconds.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Shield,
      title: "Plagiarism Free",
      desc: "100% original content with built-in plagiarism detection.",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: Globe,
      title: "Multi-Language",
      desc: "Support for 25+ languages with native-level quality.",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Image,
      title: "Rich Media",
      desc: "Auto-suggest relevant images, videos, and infographics.",
      color: "from-teal-500 to-green-500"
    }
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <section className="container py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Everything You Need to{" "}
          <span className="gradient-text">Dominate SERPs</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Powerful features designed to help you create content that ranks higher and converts better.
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {items.map((feature) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={feature.title}
              variants={item}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300"
                   style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />

              <div className="relative glass rounded-2xl p-6 h-full border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
