"use client"

import { motion } from "framer-motion"
import { Image as ImageIcon, Sparkles, Wand2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function ImageGenerationShowcase() {
  return (
    <div className="relative">
      <Card className="border-2 border-purple-200 dark:border-purple-800 overflow-hidden">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2">
            {/* Left side - Visual */}
            <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-8 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {/* Simulated image placeholder */}
                <div className="w-64 h-40 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-lg shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-white/80" />
                  </div>
                  {/* Sparkle animation */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute top-2 right-2"
                  >
                    <Sparkles className="w-6 h-6 text-yellow-300" />
                  </motion.div>
                </div>

                {/* Magic wand animation */}
                <motion.div
                  initial={{ x: -50, y: -50, opacity: 0 }}
                  whileInView={{ x: 0, y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="absolute -top-4 -right-4"
                >
                  <div className="p-3 bg-white dark:bg-gray-900 rounded-full shadow-xl border-2 border-purple-500">
                    <Wand2 className="w-6 h-6 text-purple-600" />
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Right side - Content */}
            <div className="p-8 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full w-fit mb-4">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                  AI-Powered
                </span>
              </div>

              <h3 className="text-2xl font-bold mb-3">
                Every Article Gets a <span className="gradient-text">Unique Hero Image</span>
              </h3>

              <p className="text-muted-foreground mb-4 leading-relaxed">
                Our advanced AI generates a custom, high-quality hero image for every article you create.
                No stock photos, no repetitive visuals—just unique, contextual imagery that perfectly
                matches your content.
              </p>

              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                  <span><strong>Powered by Gemini 2.5:</strong> Latest AI image generation technology</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                  <span><strong>Contextual & Relevant:</strong> Images match your topic and tone</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                  <span><strong>100% Unique:</strong> No stock photo repeats or copyright issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                  <span><strong>Blog-Ready:</strong> Optimized dimensions for hero banners</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
