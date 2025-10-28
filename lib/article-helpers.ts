// Helper to convert backend article JSON to HTML
export function articleToHTML(article: any): string {
  if (!article) return ''

  let html = ''

  // Add title
  if (article.title) {
    html += `<h1>${article.title}</h1>\n\n`
  }

  // Add meta description as lead paragraph
  if (article.meta?.description) {
    html += `<p class="lead text-lg text-muted-foreground"><strong>${article.meta.description}</strong></p>\n\n`
  }

  // Add sections
  if (Array.isArray(article.sections)) {
    article.sections.forEach((section: any) => {
      if (section.heading) {
        html += `<h2>${section.heading}</h2>\n\n`
      }
      if (Array.isArray(section.paragraphs)) {
        section.paragraphs.forEach((para: string) => {
          html += `<p>${para}</p>\n\n`
        })
      }
    })
  }

  return html
}

// Helper to extract data for ArticlePreview compatibility
export function normalizeArticleResult(result: any): any {
  if (!result) return null

  console.log('Normalizing article result:', result)

  return {
    ...result,
    html: articleToHTML(result),
    markdown: articleToMarkdown(result),
    meta_title: result.meta?.title || result.title,
    meta_description: result.meta?.description || '',
    keywords: result.seo_keywords || [],
    meta_keywords: result.seo_keywords || [],
    image_url: result.image?.image_url || result.image?.image_b64 || null,
    citations: result.citations || [],
    faqs: formatFAQs(result.faqs),
    social_posts: formatSocialPosts(result.social_media_posts),
    readability_score: result.readability?.score || result.readability?.flesch_reading_ease || null,
    seo_score: result.seo_score?.overall || result.seo_score || null,
    word_count: result.word_count || 0
  }
}

function formatFAQs(faqs: any): any[] {
  if (!Array.isArray(faqs)) return []

  return faqs.map(faq => ({
    question: faq.q || faq.question || '',
    answer: faq.a || faq.answer || ''
  })).filter(faq => faq.question && faq.answer)
}

function formatSocialPosts(socialMedia: any): any[] {
  if (!socialMedia || typeof socialMedia !== 'object') return []

  const platforms = ['linkedin', 'twitter', 'facebook', 'instagram', 'reddit', 'tiktok', 'pinterest', 'youtube', 'tumblr']
  return platforms
    .map(platform => ({
      platform,
      content: socialMedia[platform] || ''
    }))
    .filter(post => post.content)
}

function articleToMarkdown(article: any): string {
  if (!article) return ''

  let md = ''

  if (article.title) {
    md += `# ${article.title}\n\n`
  }

  if (article.meta?.description) {
    md += `${article.meta.description}\n\n`
  }

  if (Array.isArray(article.sections)) {
    article.sections.forEach((section: any) => {
      if (section.heading) {
        md += `## ${section.heading}\n\n`
      }
      if (Array.isArray(section.paragraphs)) {
        section.paragraphs.forEach((para: string) => {
          md += `${para}\n\n`
        })
      }
    })
  }

  if (Array.isArray(article.faqs) && article.faqs.length > 0) {
    md += `## FAQs\n\n`
    article.faqs.forEach((faq: any) => {
      if (faq.q) md += `### ${faq.q}\n\n`
      if (faq.a) md += `${faq.a}\n\n`
    })
  }

  if (Array.isArray(article.citations) && article.citations.length > 0) {
    md += `## Sources\n\n`
    article.citations.forEach((cite: any, i: number) => {
      md += `${i + 1}. [${cite.title || cite.url}](${cite.url})\n`
    })
  }

  return md
}
