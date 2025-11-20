"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, HelpCircle } from "lucide-react"
import { fadeInUp, cardDepthVariants } from "@/lib/premium-effects"

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "What exactly does SEOScribe do?",
    answer: "SEOScribe is an AI-powered SEO content platform that generates complete, publication-ready articles optimized for search engines. It analyzes top-ranking pages (SERP research), creates long-form content (1500-3000+ words), adds citations from credible sources, generates meta titles and descriptions, suggests internal links, creates FAQ schemas, and provides social media posts—all in under 20 minutes. You get everything you need to rank: researched content, perfect on-page SEO, and ready-to-publish HTML or Markdown."
  },
  {
    question: "How is this different from ChatGPT or other AI writers?",
    answer: "Unlike general AI writers, SEOScribe is specifically built for SEO. It doesn't just write—it researches your competitors, analyzes what's ranking on Google, optimizes keyword density, structures content with proper H2/H3 headers, adds schema markup, generates meta tags that match search intent, and provides readability scores. ChatGPT writes content; SEOScribe creates content that ranks. Every article includes citations, internal linking suggestions, and is optimized based on real SERP data."
  },
  {
    question: "What do I get with each article generation?",
    answer: "Every article includes: (1) Complete long-form content (1500-3000+ words) written in your chosen tone and language, (2) SEO-optimized meta title and description, (3) 5-10 relevant keywords with density analysis, (4) 3-5 credible citations with sources, (5) FAQ section with schema markup, (6) 5-10 internal linking suggestions, (7) Social media posts for promotion, (8) AI-generated featured image, (9) Readability and SEO score, (10) Both HTML and Markdown formats. Everything is publication-ready."
  },
  {
    question: "Do the articles actually rank on Google?",
    answer: "Yes. SEOScribe uses SERP-aware content generation, meaning it analyzes what's currently ranking for your target keywords and creates content that matches search intent. Our users report ranking on page 1 within 2-8 weeks for low to medium competition keywords. The key is that we don't just write—we optimize based on what Google is already rewarding. Plus, proper meta tags, schema markup, and internal linking significantly boost your ranking potential."
  },
  {
    question: "What's included in the Free plan?",
    answer:
      "The Free plan gives you 1 complete article per week (not just 10,000 words—a full article with all SEO features). You also get 1 SEO tool usage per week (headline generator, meta tag optimizer, readability analyzer, etc.). No credit card required. It's perfect for bloggers, freelancers or anyone who wants to test the quality before upgrading. Free users receive the same quality as Pro—just with stricter usage limits."
  },
  {
    question: "What's the difference between Free and Pro plans?",
    answer:
      "Free plan: 1 article/week + 1 tool/week. Pro plan ($24/month): 10 articles/day (up to 300/month) + 5 tools/day + unlimited revisions + priority generation + saved article library + bulk export. Pro is designed for agencies, content teams and serious marketers who need to scale content production. Both plans deliver the same AI quality, SERP research and full SEO optimization—only the usage limits differ."
  },
  {
    question: "Can I edit the articles after they're generated?",
    answer: "Absolutely. Every article is saved to your library where you can edit the title, content, meta tags, and keywords. The built-in editor supports both Markdown and HTML. You can refine the AI output, add your own insights, adjust the tone, or completely rewrite sections. SEOScribe gives you a 90% done draft—you add the final 10% of your expertise and personality."
  },
  {
    question: "What languages are supported?",
    answer: "SEOScribe supports 25+ languages including English, Spanish, French, German, Italian, Portuguese, Dutch, Russian, Japanese, Chinese (Simplified & Traditional), Korean, Arabic, Hindi, and more. The AI writes naturally in each language and understands local search intent. Meta tags, citations, and SEO optimization work across all languages."
  },
  {
    question: "How do the SEO tools work?",
    answer: "We provide 6 specialized SEO tools: (1) Headline Generator—creates 10 click-worthy titles based on your topic, (2) Meta Tag Optimizer—generates SEO-perfect title/description under character limits, (3) Internal Link Suggester—finds relevant pages to link based on your content, (4) Readability Analyzer—scores your content and suggests improvements, (5) Content Brief Generator—creates outlines for any topic, (6) Keyword Density Checker—ensures proper keyword distribution. Each tool uses AI trained on top-ranking content."
  },
  {
    question: "Are the citations real and credible?",
    answer: "Yes. SEOScribe performs real-time web research and pulls citations from authoritative sources. Each citation includes the source title and URL. We prioritize .edu, .gov, established publications, and industry-leading websites. The AI cross-references facts before including them. However, we always recommend manually verifying citations before publishing—especially for sensitive topics. The citations give you a strong starting point for fact-checking."
  },
  {
    question: "Can I use SEOScribe for client work or commercial projects?",
    answer: "Yes, 100%. All content generated with SEOScribe is yours to use however you want—client projects, commercial websites, resale, white-label services, etc. There are no usage restrictions. Many agencies use SEOScribe to scale their content production. We don't claim any rights to your generated content."
  },
  {
    question: "What if I'm not satisfied with an article?",
    answer: "Free users can regenerate articles as per their plan limits (1/week). Pro users get unlimited regenerations—just adjust your prompt (tone, keywords, target audience) and regenerate instantly. You can also use the editor to refine any section. Our AI improves with more specific prompts. If you're consistently unsatisfied, contact support and we'll help optimize your inputs for better results."
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="relative py-24 overflow-hidden bg-white dark:bg-gray-950">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-blue-50/50 dark:from-purple-950/20 dark:via-transparent dark:to-blue-950/20" />

      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          {...fadeInUp}
          className="text-center mb-16"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block mb-4"
          >
            <HelpCircle className="w-12 h-12 text-purple-600 mx-auto" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to know about SEOScribe and how it helps you rank on Google
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <motion.div
                variants={cardDepthVariants}
                initial="initial"
                whileHover="hover"
              >
                <Card className="border-2 border-purple-100 dark:border-purple-900 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg overflow-hidden">
                  <CardContent className="p-0">
                    {/* Question */}
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full text-left p-6 flex items-center justify-between gap-4 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-colors"
                    >
                      <span className="font-semibold text-lg text-gray-900 dark:text-white pr-4">
                        {faq.question}
                      </span>
                      <motion.div
                        animate={{ rotate: openIndex === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown className="w-6 h-6 text-purple-600" />
                      </motion.div>
                    </button>

                    {/* Answer */}
                    <AnimatePresence>
                      {openIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-2 text-gray-700 dark:text-gray-300 leading-relaxed border-t border-purple-100 dark:border-purple-900">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* CTA at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <a
            href="mailto:support@seoscribe.com"
            className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-semibold underline underline-offset-4"
          >
            Contact our support team
          </a>
        </motion.div>
      </div>
    </section>
  )
}
