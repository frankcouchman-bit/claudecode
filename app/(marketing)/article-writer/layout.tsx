import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free AI Article Writer | Generate SEO Content in Minutes - SEOScribe",
  description: "Try our AI article generator free. Create SEO-optimized articles with citations, meta tags, internal links & FAQ schema. No credit card required. 1500-3000+ words in 20 minutes.",
  keywords: [
    "free AI article writer",
    "AI article generator",
    "free content writer",
    "AI blog post generator",
    "automatic article writer",
    "SEO content generator free",
    "AI writing tool free trial",
    "blog content generator"
  ],
  openGraph: {
    title: "Free AI Article Writer - Generate SEO Content in Minutes",
    description: "Create complete, SEO-optimized articles with our free AI writer. Includes citations, meta tags, and internal links.",
    type: "website",
    url: "https://seoscribe.com/article-writer"
  },
  alternates: {
    canonical: "https://seoscribe.com/article-writer"
  }
}

export default function ArticleWriterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
