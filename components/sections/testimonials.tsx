"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Quote, Star } from "lucide-react"
import { cardDepthVariants, staggerContainer, staggerItem } from "@/lib/premium-effects"

interface Testimonial {
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar: string
  initials: string
}

const testimonials: Testimonial[] = [
  {
    name: "Frank Clevo",
    role: "Content Marketing Director",
    company: "TechVenture Inc",
    content: "SEOScribe has completely transformed our content workflow. We went from spending 8 hours per article to just 20 minutes, and our organic traffic increased by 340% in 3 months. The AI-generated content ranks on page 1 for our target keywords consistently.",
    rating: 5,
    avatar: "/avatars/frank.jpg",
    initials: "FC"
  },
  {
    name: "Stacy Pit",
    role: "SEO Manager",
    company: "Digital Growth Agency",
    content: "This is the best SEO writing tool I've ever used. The SERP analysis is incredibly accurate, and the internal linking suggestions save me hours. Our clients are seeing 250% more impressions and their average position improved from 8.2 to 3.1. It's like having an SEO expert write every article.",
    rating: 5,
    avatar: "/avatars/stacy.jpg",
    initials: "SP"
  },
  {
    name: "Marcus Chen",
    role: "Founder",
    company: "StartupBlog",
    content: "I was skeptical about AI content, but SEOScribe proved me wrong. The articles are well-researched, properly cited, and actually read naturally. I've published 50+ articles and they're all ranking. The meta tag optimization alone is worth the subscription.",
    rating: 5,
    avatar: "/avatars/marcus.jpg",
    initials: "MC"
  }
]

export function Testimonials() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950">
      {/* Decorative gradient orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 10,
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
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block mb-4"
          >
            <Quote className="w-12 h-12 text-purple-600 mx-auto" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            What Makes SEOScribe Different?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Embedded FAQs, AI images, and citations included—features others charge extra for
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              variants={staggerItem}
            >
              <motion.div
                variants={cardDepthVariants}
                initial="initial"
                whileHover="hover"
              >
                <Card className="h-full border-2 border-purple-100 dark:border-purple-900 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg overflow-hidden relative">
                  {/* Gradient accent */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600" />

                  {/* Floating quote icon */}
                  <motion.div
                    className="absolute top-4 right-4 text-purple-200 dark:text-purple-900"
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2
                    }}
                  >
                    <Quote className="w-16 h-16 opacity-50" />
                  </motion.div>

                  <CardContent className="p-6 relative z-10">
                    {/* Star Rating */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        </motion.div>
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center gap-4 pt-4 border-t border-purple-100 dark:border-purple-900">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Avatar className="w-12 h-12 border-2 border-purple-200 dark:border-purple-800">
                          <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white font-semibold">
                            {testimonial.initials}
                          </AvatarFallback>
                        </Avatar>
                      </motion.div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </div>
                        <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                          {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-2 border-purple-200 dark:border-purple-800 rounded-full">
            <div className="flex -space-x-2">
              {testimonials.map((t) => (
                <Avatar key={t.name} className="w-8 h-8 border-2 border-white dark:border-gray-900">
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-xs">
                    {t.initials}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              <strong className="text-purple-600 dark:text-purple-400">All features included</strong> with every article
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
