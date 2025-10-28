// Helper to convert backend article JSON to HTML
export function articleToHTML(article: any): string {
  if (!article) return ''

  let html = ''

  // Add title
  if (article.title) {
    html += `<h1>${escapeHTML(article.title)}</h1>\n\n`
  }

  // Add meta description as lead paragraph
  if (article.meta?.description) {
    html += `<p class="lead"><strong>${escapeHTML(article.meta.description)}</strong></p>\n\n`
  }

  // Add hero image
  if (article.image?.image_url) {
    html += `<img src="${escapeHTML(article.image.image_url)}" alt="${escapeHTML(article.title || 'Article image')}" class="hero-image" />\n\n`
  }

  // Add sections
  if (Array.isArray(article.sections)) {
    article.sections.forEach((section: any) => {
      if (section.heading) {
        html += `<h2>${escapeHTML(section.heading)}</h2>\n\n`
      }
      if (Array.isArray(section.paragraphs)) {
        section.paragraphs.forEach((para: string) => {
          html += `<p>${escapeHTML(para)}</p>\n\n`
        })
      }
    })
  }

  // Add FAQs section
  if (Array.isArray(article.faqs) && article.faqs.length > 0) {
    html += `<h2>Frequently Asked Questions</h2>\n\n`
    article.faqs.forEach((faq: any) => {
      if (faq.q) html += `<h3>${escapeHTML(faq.q)}</h3>\n`
      if (faq.a) html += `<p>${escapeHTML(faq.a)}</p>\n\n`
    })
  }

  // Add citations
  if (Array.isArray(article.citations) && article.citations.length > 0) {
    html += `<h2>Sources</h2>\n<ol>\n`
    article.citations.forEach((cite: any) => {
      html += `<li><a href="${escapeHTML(cite.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(cite.title || cite.url)}</a></li>\n`
    })
    html += `</ol>\n\n`
  }

  return html
}

function escapeHTML(str: string): string {
  if (typeof str !== 'string') return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Helper to extract data for ArticlePreview compatibility
export function normalizeArticleResult(result: any): any {
  if (!result) return null

  return {
    ...result,
    html: articleToHTML(result),
    meta_title: result.meta?.title || result.title,
    meta_description: result.meta?.description || '',
    keywords: result.seo_keywords || [],
    meta_keywords: result.seo_keywords || [],
    image_url: result.image?.image_url || result.image?.image_b64 || null,
    social_posts: formatSocialPosts(result.social_media_posts),
    readability_score: result.readability?.score || result.readability?.flesch_reading_ease || null,
    seo_score: result.seo_score?.overall || result.seo_score || null
  }
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
