"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Check, Zap } from "lucide-react"
import Link from "next/link"

export function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "Forever",
      description: "Perfect for trying out SEOScribe",
      features: [
        "1 article per week",
        "AI-generated hero images",
        "Basic SERP research",
        "Export to Markdown",
        "25+ languages",
        "Community support"
      ],
      cta: "Start Free",
      variant: "outline" as const,
      href: "/auth"
    },
    {
      name: "Pro",
      price: "$24",
      period: "per month",
      description: "Everything you need to dominate SERPs",
      features: [
        "10 articles per day",
        "AI-generated hero images",
        "Advanced SERP research",
        "Auto citations & FAQs",
        "25+ languages",
        "Internal link suggestions",
        "Priority support",
        "Advanced analytics",
        "API access"
      ],
      cta: "Get Started",
      popular: true,
      variant: "default" as const,
      href: "/auth"
    }
  ]

  return (
    <section className="container py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Simple, Transparent{" "}
          <span className="gradient-text">Pricing</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Start free, upgrade when you're ready. No hidden fees, cancel anytime.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {plan.popular && (
              <div className="absolute -top-5 left-0 right-0 flex justify-center">
                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 px-4 py-1">
                  <Zap className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}

            <Card className={`relative overflow-hidden h-full ${
              plan.popular
                ? 'border-2 border-purple-300 dark:border-purple-700 shadow-xl shadow-purple-500/20'
                : ''
            }`}>
              {plan.popular && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5" />
              )}

              <CardHeader className="relative pb-8">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  {plan.period !== "Forever" && (
                    <span className="text-muted-foreground ml-2">/{plan.period}</span>
                  )}
                  {plan.period === "Forever" && (
                    <span className="text-muted-foreground ml-2 text-lg">{plan.period}</span>
                  )}
                </div>
                <CardDescription className="text-base mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="relative space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="relative pt-6">
                <Link href={plan.href} className="w-full">
                  <Button
                    variant={plan.variant}
                    className={`w-full h-12 text-base ${
                      plan.popular ? 'gradient-btn text-white' : ''
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Trust signals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 text-center"
      >
        <p className="text-sm text-muted-foreground mb-4">AI images, embedded FAQs, and citations included in every article</p>
        <div className="flex flex-wrap justify-center gap-8 items-center text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>14-day money back guarantee</span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
