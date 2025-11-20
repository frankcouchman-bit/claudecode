"use client"

import Demo from "@/components/sections/demo"
import { FAQSection } from "@/components/faq-section"
import { SocialProof, TrustBadges } from "@/components/social-proof"
import { ImageGenerationShowcase } from "@/components/image-generation-showcase"
import { SEOImprovementChart, RankingProgressBar, TrafficGrowthGraph } from "@/components/seo-visualizations"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Sparkles,
  FileText,
  Search,
  Image,
  Link2,
  Zap,
  CheckCircle2,
  ArrowRight,
  Clock,
  Target,
  TrendingUp,
  Shield
} from "lucide-react"

export default function Page() {
  const benefits = [
    {
      icon: Clock,
      title: "Save 10+ Hours Per Article",
      description: "Go from research to published article in minutes, not days. Our AI handles the heavy lifting."
    },
    {
      icon: Target,
      title: "Rank on Google Page 1",
      description: "SERP-aware content that mirrors top-ranking articles and search intent perfectly."
    },
    {
      icon: TrendingUp,
      title: "10x Your Content Output",
      description: "Publish consistently without burning out. Scale your content marketing effortlessly."
    },
    {
      icon: Shield,
      title: "100% Original & Plagiarism-Free",
      description: "Every article is unique, well-researched, and passes all plagiarism checks."
    }
  ]

  const features = [
    {
      icon: Search,
      title: "Real-Time SERP Research",
      description: "Analyzes top-ranking content to understand what Google rewards"
    },
    {
      icon: FileText,
      title: "1,500-3,000 Word Articles",
      description: "Long-form, comprehensive content that establishes authority"
    },
    {
      icon: Image,
      title: "Auto Citations & Images",
      description: "Credible sources cited automatically with relevant imagery"
    },
    {
      icon: Link2,
      title: "Perfect On-Page SEO",
      description: "Meta tags, schema markup, internal links, and Open Graph included"
    },
    {
      icon: Zap,
      title: "Generated in 60 Seconds",
      description: "From topic to polished draft faster than you can make coffee"
    },
    {
      icon: CheckCircle2,
      title: "Export Ready",
      description: "Markdown, HTML, or WordPress—publish anywhere instantly"
    }
  ]

  const faqs = [
    {
      question: "How does the AI Article Writer work?",
      answer: "Our AI analyzes top-ranking Google results for your target keyword, understands search intent, and generates a comprehensive SEO-optimized article with proper structure, citations, and metadata. It uses advanced language models trained specifically for content marketing."
    },
    {
      question: "Can the AI writer help me rank on Google?",
      answer: "Yes! Our tool is SERP-aware, meaning it analyzes what's currently ranking for your keywords and creates content that mirrors successful patterns. Combined with proper keyword optimization, internal linking, and schema markup, you get content built to rank."
    },
    {
      question: "How long are the articles generated?",
      answer: "Articles typically range from 1,500 to 3,000 words depending on your topic and target word count. You can specify your preferred length, and our AI will create comprehensive, in-depth content that thoroughly covers the subject."
    },
    {
      question: "Is the content plagiarism-free?",
      answer: "Absolutely. Every article is generated fresh using AI, making it 100% original. We recommend running it through plagiarism checkers like Copyscape for peace of mind, but our content consistently passes all originality tests."
    },
    {
      question: "Do I need to edit the generated articles?",
      answer: "While our AI produces high-quality, publish-ready content, we recommend reviewing and adding your unique insights, brand voice, and specific examples. Think of it as a 95% complete first draft that you can polish to perfection."
    },
    {
      question: "What formats can I export articles in?",
      answer: "You can export in Markdown, HTML, or directly to WordPress. All exports include properly formatted headings, citations, meta descriptions, and are ready to publish immediately."
    },
    {
      question: "How many articles can I generate per month?",
      answer:
        "Free plan includes 1 article per week with AI-generated hero images and 1 SEO tool per week. Pro plan offers 10 articles per day and 5 tool uses per day, giving you the freedom to scale your content production without limits."
    },
    {
      question: "Does it include keyword research?",
      answer: "Yes! Our AI performs real-time SERP research to identify related keywords, LSI terms, and semantic variations that should be included in your content for maximum SEO impact."
    }
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-mesh">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />

        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex mb-6"
            >
              <Badge className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 border-0 text-white">
                <Sparkles className="w-3 h-3 mr-2" />
                #1 AI Article Writer for SEO
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              Generate SEO Articles That{" "}
              <span className="gradient-text">Rank & Convert</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
            >
              Create 1,500-3,000 word, SERP-optimized articles with citations, images, and perfect on-page SEO in under 60 seconds.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Button size="lg" className="gradient-btn text-white px-8 h-14 text-lg">
                Start Writing for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Link href="#demo">
                <Button variant="outline" size="lg" className="px-8 h-14 text-lg border-2">
                  Watch Demo
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
                <span>1 article per week free</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <SocialProof />

      {/* Benefits Section */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Content Teams Love SEOScribe
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stop spending weeks on a single article. Start ranking faster.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-shadow border-2">
                    <CardContent className="p-8">
                      <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">{benefit.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="gradient-text">Dominate SERPs</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive features built for serious content marketers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="h-full hover:shadow-xl transition-all hover:border-purple-200 dark:hover:border-purple-800">
                    <CardContent className="p-6">
                      <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* AI Image Generation Showcase */}
      <section className="py-24">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
              AI-Powered Visuals
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Every Article Gets a <span className="gradient-text">Unique AI Image</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              No more searching for stock photos. Our Gemini 2.5-powered system generates custom hero images for every article.
            </p>
          </div>
          <ImageGenerationShowcase />
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-24">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              See It In Action
            </h2>
            <p className="text-xl text-muted-foreground">
              Generate your first SEO-optimized article in 60 seconds
            </p>
          </div>
          <Demo />
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-y bg-muted/20">
        <div className="container">
          <TrustBadges />
        </div>
      </section>

      {/* SEO Performance Metrics */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
              Proven Results
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Watch Your Rankings <span className="gradient-text">Soar</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              How SEOScribe helps you rank higher and drive more traffic
            </p>
          </div>

          <div className="space-y-12">
            <SEOImprovementChart />
            <div className="max-w-3xl mx-auto">
              <RankingProgressBar />
            </div>
            <TrafficGrowthGraph />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title="Frequently Asked Questions"
        description="Everything you need to know about our AI Article Writer"
        faqs={faqs}
      />

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-b from-transparent via-purple-50/30 to-transparent dark:via-purple-950/20">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to 10x Your Content Output?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start creating SEO-optimized articles with embedded FAQs, citations, and AI images today
          </p>
          <Link href="/auth">
            <Button size="lg" className="gradient-btn text-white px-12 h-16 text-xl">
              Start Writing for Free
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • 1 article per week free • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  )
}
