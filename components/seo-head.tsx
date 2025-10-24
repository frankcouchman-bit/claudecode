import { Metadata } from 'next'

interface SEOProps {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  canonicalUrl?: string
  type?: 'website' | 'article'
  schema?: object
}

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  ogImage = '/og.png',
  canonicalUrl,
  type = 'website',
}: SEOProps): Metadata {
  const siteName = 'SEOScribe'
  const fullTitle = `${title} | ${siteName}`

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: siteName }],
    openGraph: {
      type,
      title: fullTitle,
      description,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(canonicalUrl && { url: canonicalUrl }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    alternates: {
      ...(canonicalUrl && { canonical: canonicalUrl }),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export function generateJSONLD(type: 'Product' | 'FAQPage' | 'Organization', data: any) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://seoscribe.com'

  const schemas: Record<string, any> = {
    Organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'SEOScribe',
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      description: 'AI-powered SEO content writing platform',
      sameAs: [
        'https://twitter.com/seoscribe',
        'https://linkedin.com/company/seoscribe',
      ],
    },
    Product: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: data.name,
      applicationCategory: 'BusinessApplication',
      offers: {
        '@type': 'Offer',
        price: data.price || '24',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '1250',
      },
      description: data.description,
    },
    FAQPage: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: data.questions.map((q: any) => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: q.answer,
        },
      })),
    },
  }

  return schemas[type]
}
