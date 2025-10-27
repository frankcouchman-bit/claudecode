import { Metadata } from "next"
import { Hero } from "@/components/sections/hero"
import { Logos } from "@/components/sections/logos"
import { Features } from "@/components/sections/features"
import { FeaturesShowcase } from "@/components/sections/features-showcase"
import { Testimonials } from "@/components/sections/testimonials"
import { TrustSection } from "@/components/sections/trust-section"
import { FAQ } from "@/components/sections/faq"
import { Pricing } from "@/components/sections/pricing"
import { ConversionPopup } from "@/components/conversion-popup"

export const metadata: Metadata = {
  title: "SEOScribe - AI SEO Content Writer | Generate Ranking Articles in Minutes",
  description: "Create SEO-optimized, long-form articles that rank on Google. SERP research, citations, meta tags, internal links & FAQ schema included. 1 free article/week. No credit card required.",
  keywords: [
    "AI SEO content writer",
    "SEO article generator",
    "AI content writing tool",
    "SEO optimization software",
    "article writer AI",
    "content marketing automation",
    "SERP analysis tool",
    "long-form content generator",
    "meta tag generator",
    "keyword optimization tool",
    "AI writing assistant",
    "content creation platform"
  ],
  authors: [{ name: "SEOScribe" }],
  openGraph: {
    title: "SEOScribe - AI SEO Content Writer That Actually Ranks",
    description: "Generate publication-ready SEO articles with citations, meta tags, and internal links in 20 minutes. Free plan available.",
    type: "website",
    url: "https://seoscribe.com",
    images: [
      {
        url: "https://seoscribe.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SEOScribe - AI SEO Content Writer"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "SEOScribe - AI SEO Content Writer",
    description: "Create SEO-optimized articles that rank on Google in minutes. Free plan available.",
    images: ["https://seoscribe.com/og-image.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  alternates: {
    canonical: "https://seoscribe.com"
  }
}

export default function Page() {
  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "SEOScribe",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "priceValidUntil": "2025-12-31"
            },
            "description": "AI-powered SEO content writing platform that generates ranking articles with SERP research, citations, meta tags, and internal links."
          })
        }}
      />

      <div>
        {/* Conversion Popup */}
        <ConversionPopup delaySeconds={15} showExitIntent={true} />

        {/* Hero Section */}
        <Hero />

        {/* Logos / Social Proof */}
        <Logos />

        {/* Features Overview */}
        <Features />

        {/* Detailed Features Showcase */}
        <FeaturesShowcase />

        {/* Testimonials */}
        <Testimonials />

        {/* Trust & Social Proof */}
        <TrustSection />

        {/* Pricing */}
        <Pricing />

        {/* FAQ Section */}
        <FAQ />
      </div>
    </>
  )
}
