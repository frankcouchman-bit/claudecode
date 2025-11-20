import type { Metadata } from "next"
import { Pricing as PricingSection } from "@/components/sections/pricing"

export const metadata: Metadata = {
  title: "Pricing Plans - Free & Pro AI SEO Content Writer | SEOScribe",
  // Update description to reflect new article limits
  description:
    "Choose your plan: Free (1 article/week) or Pro ($24/month, 10 articles/day). No contracts, cancel anytime. Start with the free plan—no credit card required.",
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
    // Update OG description to new limits
    description:
      "Start free with 1 article/week or go Pro for $24/month with 10 articles/day. No credit card required for the free plan.",
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
            // Update to reflect weekly tool limit for free plan
            "description": "1 article per week, 1 tool per week"
          },
          {
            "@type": "Offer",
            "name": "Pro Plan",
            "price": "24",
            "priceCurrency": "USD",
            "billingDuration": "P1M",
            // Update to reflect new pro plan limits
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
