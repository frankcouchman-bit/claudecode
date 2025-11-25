import type { Metadata } from "next"
import { Pricing as PricingSection } from "@/components/sections/pricing"

export const metadata: Metadata = {
  title: "Pricing Plans - Free & Pro AI SEO Content Writer | SEOScribe",
  description: "Choose your plan: Free (1 article/week, 1 tool/day) or Pro ($24/month, 5 articles/day, 10 tools/day). No contracts, cancel anytime. Start with free plan—no credit card required.",
  keywords: [
    "SEO content pricing",
    "AI writer pricing",
    "content writing tool cost",
    "SEO software pricing",
    "free SEO tool",
    "affordable content writer",
    "AI writing subscription"
  ],
  openGraph: {
    title: "SEOScribe Pricing - Free & Pro Plans Available",
    description: "Start free with 1 article/week and 1 tool/day or go Pro for $24/month with 5 articles/day and 10 tools/day. No credit card required for free plan.",
    type: "website",
    url: "https://seoscribe.com/pricing"
  },
  alternates: {
    canonical: "https://seoscribe.com/pricing"
  }
}

export default function Page() {
  return (
    <>
      {/* JSON-LD for Pricing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "SEOScribe",
            "offers": [
              {
                "@type": "Offer",
                "name": "Free Plan",
                "price": "0",
                "priceCurrency": "USD",
                "description": "1 article per week, 1 tool per week"
              },
              {
                "@type": "Offer",
                "name": "Pro Plan",
                "price": "24",
                "priceCurrency": "USD",
                "billingDuration": "P1M",
                "description": "10 articles per day, 5 tools per day, unlimited revisions"
              }
            ]
          })
        }}
      />
      <PricingSection />
    </>
  )
}
