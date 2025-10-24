"use client"

import Demo from "@/components/sections/demo"
import { FAQSection } from "@/components/faq-section"
import { SocialProof } from "@/components/social-proof"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Wrench,
  Heading,
  Tags,
  Link2,
  Eye,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BarChart
} from "lucide-react"

export default function Page() {
  const tools = [
    {
      icon: Heading,
      title: "Headline Generator",
      description: "Create click-worthy headlines that boost CTR by up to 300%"
    },
    {
      icon: Tags,
      title: "Meta Tag Optimizer",
      description: "Perfect meta titles and descriptions for maximum SERP visibility"
    },
    {
      icon: Link2,
      title: "Internal Link Suggester",
      description: "Smart recommendations for internal linking structure"
    },
    {
      icon: Eye,
      title: "Readability Analyzer",
      description: "Score and improve content readability for your audience"
    },
    {
      icon: Lightbulb,
      title: "Content Brief Generator",
      description: "Comprehensive outlines based on top-ranking content"
    },
    {
      icon: BarChart,
      title: "Keyword Density Checker",
      description: "Ensure optimal keyword usage without over-optimization"
    }
  ]

  const faqs = [
    {
      question: "What writing tools are included?",
      answer: "SEOScribe includes 20+ specialized writing tools: headline generator, meta tag optimizer, content brief creator, readability analyzer, keyword density checker, internal link suggester, FAQ generator, outline creator, and more. All tools are designed to improve your content's SEO and engagement."
    },
    {
      question: "How do the SEO writing tools improve rankings?",
      answer: "Our tools analyze top-ranking content to identify patterns that work. The headline generator creates compelling titles that improve CTR, meta tag optimizer ensures proper SERP display, and readability analyzer makes content more engaging—all factors Google considers in rankings."
    },
    {
      question: "Can I use these tools without generating full articles?",
      answer: "Absolutely! Each tool works independently. Use just the headline generator for social posts, or the meta tag optimizer for existing content. Mix and match tools based on your needs."
    },
    {
      question: "Do the tools work for non-English content?",
      answer: "Yes! Most tools support 25+ languages including Spanish, French, German, Portuguese, and more. Some advanced features work best in English but all core functionality is multilingual."
    }
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-mesh">
        <div className="absolute top-20 left-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />

        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex mb-6"
            >
              <Badge className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-green-600 to-blue-600 border-0 text-white">
                <Wrench className="w-3 h-3 mr-2" />
                20+ Professional Writing Tools
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              SEO Writing Tools That{" "}
              <span className="gradient-text">Get Results</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
            >
              Headlines, meta tags, content briefs, internal links, readability analysis, and more—all optimized for SEO success.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link href="/auth">
                <Button size="lg" className="gradient-btn text-white px-8 h-14 text-lg">
                  Try Tools for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#tools">
                <Button variant="outline" size="lg" className="px-8 h-14 text-lg border-2">
                  Explore Tools
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-6 text-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>All tools included free</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Unlimited usage</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <SocialProof />

      {/* Tools Grid */}
      <section id="tools" className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Your Complete{" "}
              <span className="gradient-text">SEO Writing Toolkit</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create, optimize, and publish content that ranks
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {tools.map((tool, index) => {
              const Icon = tool.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="h-full hover:shadow-xl transition-all hover:border-green-200 dark:hover:border-green-800">
                    <CardContent className="p-6">
                      <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 mb-4">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {tool.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">+ 14 more specialized tools included</p>
            <Link href="/auth">
              <Button size="lg" className="gradient-btn text-white">
                <Sparkles className="mr-2 h-5 w-5" />
                Get Full Access Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-24 bg-muted/30">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              See the Tools in Action
            </h2>
            <p className="text-xl text-muted-foreground">
              Try our article generator—combines all tools in one workflow
            </p>
          </div>
          <Demo />
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title="Frequently Asked Questions"
        description="Learn more about our SEO writing tools"
        faqs={faqs}
      />

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-b from-transparent via-green-50/30 to-transparent dark:via-green-950/20">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Level Up Your Content?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get instant access to 20+ professional SEO writing tools
          </p>
          <Link href="/auth">
            <Button size="lg" className="gradient-btn text-white px-12 h-16 text-xl">
              Start Using Tools Free
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • All tools included • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  )
}
