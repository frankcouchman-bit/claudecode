"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  FileText,
  Link2,
  BarChart3,
  MessageSquare,
  Image as ImageIcon,
  TrendingUp,
  CheckCircle2,
  Globe,
  Zap,
  Target,
  Award
} from "lucide-react"
import { cardDepthVariants, staggerContainer, staggerItem, floatingAnimation } from "@/lib/premium-effects"

const features = [
  {
    icon: Search,
    title: "SERP Research & Analysis",
    description: "Analyzes top 10 Google results for your keywords. Identifies what's ranking, content structure, word count, and search intent to create content that matches what Google rewards.",
    color: "from-purple-600 to-blue-600",
    badge: "AI-Powered"
  },
  {
    icon: FileText,
    title: "Long-Form Content (1500-3000+ Words)",
    description: "Generates complete, publication-ready articles with proper structure, H2/H3 headings, and natural flow. Not just paragraphs—full articles with intro, body, and conclusion.",
    color: "from-blue-600 to-cyan-600",
    badge: "High Quality"
  },
  {
    icon: Target,
    title: "Perfect Meta Tags & Descriptions",
    description: "SEO-optimized meta titles (under 60 chars) and descriptions (under 160 chars) that match search intent. Increases click-through rates from search results.",
    color: "from-green-600 to-emerald-600",
    badge: "SEO Optimized"
  },
  {
    icon: Link2,
    title: "Internal Linking Suggestions",
    description: "AI suggests 5-10 relevant internal links based on your content. Improves site structure, distributes page authority, and keeps visitors engaged longer.",
    color: "from-pink-600 to-rose-600",
    badge: "Smart Linking"
  },
  {
    icon: BarChart3,
    title: "Keyword Density & Optimization",
    description: "Automatically optimizes keyword placement and density. Tracks primary and secondary keywords, ensures natural distribution without over-optimization.",
    color: "from-orange-600 to-amber-600",
    badge: "Keyword Research"
  },
  {
    icon: MessageSquare,
    title: "FAQ Schema Markup",
    description: "Generates 3-5 relevant FAQs with schema markup. Increases chances of appearing in Google's featured snippets and \"People Also Ask\" sections.",
    color: "from-indigo-600 to-purple-600",
    badge: "Rich Snippets"
  },
  {
    icon: CheckCircle2,
    title: "Credible Citations & Sources",
    description: "Every article includes 3-5 citations from authoritative sources (.edu, .gov, industry leaders). Builds trust and establishes content credibility.",
    color: "from-teal-600 to-cyan-600",
    badge: "Fact-Checked"
  },
  {
    icon: ImageIcon,
    title: "AI-Generated Featured Images",
    description: "Creates custom featured images using Gemini 2.5 Flash. Professional, relevant visuals that enhance engagement and social media sharing.",
    color: "from-violet-600 to-fuchsia-600",
    badge: "Visual Content"
  },
  {
    icon: Globe,
    title: "25+ Languages Supported",
    description: "Write in English, Spanish, French, German, Japanese, Chinese, and 20+ more languages. AI understands local search intent and cultural context.",
    color: "from-red-600 to-pink-600",
    badge: "Multilingual"
  },
  {
    icon: TrendingUp,
    title: "Readability & SEO Scoring",
    description: "Get instant scores for readability (Flesch-Kincaid) and SEO optimization. Know exactly how your content will perform before publishing.",
    color: "from-yellow-600 to-orange-600",
    badge: "Analytics"
  },
  {
    icon: Zap,
    title: "Social Media Posts Included",
    description: "Generates 3-5 promotional posts for Twitter, LinkedIn, and Facebook. Save time on content distribution and amplify your reach.",
    color: "from-blue-600 to-indigo-600",
    badge: "Marketing"
  },
  {
    icon: Award,
    title: "Publication-Ready HTML & Markdown",
    description: "Export in HTML (with proper tags) or Markdown. Copy-paste directly into WordPress, Ghost, Medium, or any CMS. Zero formatting needed.",
    color: "from-emerald-600 to-teal-600",
    badge: "Export Ready"
  }
]

export function FeaturesShowcase() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      {/* Decorative elements */}
      <motion.div
        className="absolute top-40 left-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"
        variants={floatingAnimation}
        initial="initial"
        animate="animate"
      />
      <motion.div
        className="absolute bottom-40 right-20 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl"
        animate={{
          y: [10, -10, 10],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
            Complete SEO Solution
          </Badge>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Everything You Need to Rank on Google
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Not just an AI writer—a complete SEO content platform. Every feature is designed to help you rank higher, faster, and easier.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={staggerItem}
              >
                <motion.div
                  variants={cardDepthVariants}
                  initial="initial"
                  whileHover="hover"
                >
                  <Card className="h-full border-2 border-purple-100 dark:border-purple-900 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg relative overflow-hidden group">
                    {/* Gradient accent on hover */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(135deg, ${feature.color.split(' ')[0].replace('from-', 'rgba(147, 51, 234, 0.05)')} 0%, ${feature.color.split(' ')[1].replace('to-', 'rgba(59, 130, 246, 0.05)')} 100%)`
                      }}
                    />

                    <CardContent className="p-6 relative z-10">
                      {/* Icon */}
                      <motion.div
                        className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4`}
                        whileHover={{
                          rotate: [0, -10, 10, -10, 0],
                          scale: 1.1
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </motion.div>

                      {/* Badge */}
                      <Badge variant="secondary" className="mb-3 text-xs">
                        {feature.badge}
                      </Badge>

                      {/* Title */}
                      <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            All features included in every plan. No upsells, no hidden features.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Free Plan Available</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>No Credit Card</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
