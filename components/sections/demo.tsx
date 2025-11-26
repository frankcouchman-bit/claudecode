"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { expandDraft, generateDraft, saveArticle } from "@/lib/api"
import { ensureHtml, sanitizeHtml } from "@/lib/sanitize-html"
import { ArticlePreview } from "@/components/article-preview"
import { useQuota } from "@/contexts/quota-context"
import {
  canGenerateArticle,
  canUseTool,
  recordArticleGeneration,
  recordToolUsage,
  getRemainingQuota
} from "@/lib/quota-enforcement"
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Globe
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ErrorBoundary } from "@/components/error-boundary"

type DraftResult = Record<string, any> | null

type DraftContext = {
  siteUrl?: string
  baseWordCount?: number
}

function coerceString(value: unknown): string {
  if (typeof value === "string") return value
  if (value === null || value === undefined) return ""
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

function stripTags(html: string) {
  if (!html) return ""
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
}

function getWeekKey(date: Date): string {
  const target = new Date(date.valueOf())
  const dayNr = (date.getUTCDay() + 6) % 7
  target.setUTCDate(target.getUTCDate() - dayNr + 3)
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4))
  const diff = target.valueOf() - firstThursday.valueOf()
  const weekNumber = 1 + Math.round(diff / (7 * 24 * 3600 * 1000))
  return `${target.getUTCFullYear()}-W${weekNumber}`
}

function deriveKeywords(subject: string, fallback: string[] = []) {
  const cleaned = subject.replace(/[^a-zA-Z0-9\s-]/g, " ").toLowerCase()
  const parts = cleaned.split(/\s+/).filter(Boolean)
  const deduped = Array.from(new Set(parts)).filter((word) => word.length > 3)
  if (deduped.length === 0) return fallback
  return deduped.slice(0, 8)
}

function deriveKeywordsFromSections(sections: any[], fallback: string[]): string[] {
  const bag: Record<string, number> = {}
  sections.forEach((section) => {
    const heading = coerceString(section?.heading || section?.title)
    const text = [heading, ...(Array.isArray(section?.paragraphs) ? section.paragraphs : [])].join(" ")
    deriveKeywords(text).forEach((kw) => {
      bag[kw] = (bag[kw] || 0) + 1
    })
  })
  const sorted = Object.entries(bag)
    .sort((a, b) => b[1] - a[1])
    .map(([kw]) => kw)
  const merged = Array.from(new Set([...(sorted || []), ...(fallback || [])])).slice(0, 12)
  return merged
}

function normalizeUrl(input?: string) {
  if (!input) return ""
  try {
    const url = new URL(input.startsWith("http") ? input : `https://${input}`)
    return url.origin
  } catch {
    return ""
  }
}

function buildInternalLinks(topic: string, siteUrl?: string) {
  const anchors = [
    { url: "/article-writer", anchor_text: "AI article writer" },
    { url: "/pricing", anchor_text: "Plans and pricing" },
    { url: "/tools", anchor_text: "SEO toolkit" },
  ]

  const normalized = normalizeUrl(siteUrl)
  if (normalized) {
    anchors.unshift({ url: normalized, anchor_text: `${new URL(normalized).hostname} homepage` })
    anchors.unshift({ url: `${normalized}/resources`, anchor_text: `${new URL(normalized).hostname} resources` })
  }

  if (!topic) return anchors
  return anchors.map((link) => ({ ...link, anchor_text: `${link.anchor_text} · ${topic}` }))
}

function buildSocialPosts(title: string, summary: string, keywords: string[]) {
  const base = summary || "See why SEOScribe drafts are clean, long-form, and publish-ready."
  const hero = title || "AI SEO article"
  const primary = keywords.slice(0, 3).join(", ")
  return [
    {
      platform: "LinkedIn",
      content: `${hero}: long-form breakdown with ${primary || "search intent"}. Lead with a 2-line hook, drop 3 bullet takeaways, add a CTA to read + comment your biggest win. ${base}`,
      hint: "Use a 6–8 line post and ask for comments",
    },
    {
      platform: "X / Twitter",
      content: `${hero} — thread: hook, 3 key tactics, 2 fresh stats, 1 CTA. Start with a bold promise, keep lines <240 chars, end with a link + ask to RT. #SEO #ContentMarketing`,
      hint: "Break into 4–6 tweets for reach",
    },
    {
      platform: "Reddit",
      content: `${hero} — summarize the unique angle, list 2 actionable tips, and ask for feedback on ${primary || "the tactic"}. Target r/SEO, r/Entrepreneur, or a niche sub. Add a question to spark replies.`,
      hint: "Pick a subreddit + include a question",
    },
    {
      platform: "Facebook",
      content: `We just generated "${hero}" with full meta + FAQs. Share 2 results-focused bullets, add an image, then invite readers to grab the full guide.`,
    },
    {
      platform: "Email",
      content: `Subject: ${hero}\n\nPreview: 3-sentence teaser, bullet the outcomes (${primary || "growth, conversions"}), drop the strongest stat, and link to the full article. P.S. tease a bonus resource to drive replies.`,
      hint: "Reuse as a nurture or launch email",
    },
    {
      platform: "LinkedIn Longform",
      content: `${hero} — adapt into a 600–800 word LinkedIn article: intro hook, 2 best sections, 3 bullets + CTA to the full post.`,
    },
    {
      platform: "YouTube/Pinterest",
      content: `${hero} — outline a 60–90s short video: hook, 3 steps, CTA. For Pinterest, write a 2-line pin description with the main keyword and benefit.`,
    },
    {
      platform: "TikTok",
      content: `${hero} — 20s script: open with the result, rapid-fire 3 tips, then call to action to read the full guide. Use on-screen text for ${primary || "the core keywords"}.`,
      hint: "Keep it punchy; add on-screen text",
    },
    {
      platform: "YouTube Description",
      content: `${hero} — description: 2-line hook, timestamps for the main sections, keywords (${primary || "SEO"}), and a CTA to the article.`,
      hint: "Add timestamps + keywords",
    },
  ]
}

function buildMetaDescription(title: string, sections: any[], keywords: string[], fallback: string) {
  const sectionParagraph = sections
    .flatMap((s) => (Array.isArray(s?.paragraphs) ? s.paragraphs : []))
    .find((p) => p && p.length > 80)
  const keywordLine = keywords.slice(0, 4).join(", ")
  const base = sectionParagraph
    ? sectionParagraph.replace(/\s+/g, " ").trim()
    : `${title} — practical steps, fresh research, and on-page SEO guidance for ${keywordLine || "your query"}.`
  const cleaned = base.length > 160 ? `${base.slice(0, 157)}…` : base
  return cleaned || fallback
}
function buildFaqs(topic: string) {
  const subject = topic || "AI SEO writing"
  return [
    {
      question: `How long should a ${subject} article be?`,
      answer: "Aim for 2,000–5,000 words with clear H2/H3 structure and internal links to related guides.",
    },
    {
      question: `What makes a ${subject} post rank?`,
      answer: "Tight search intent matching, descriptive meta tags, fast-loading media, and strong on-page UX.",
    },
    {
      question: `How does SEOScribe keep ${subject} drafts safe?`,
      answer: "We sanitize HTML, auto-generate meta data, and surface readability + SEO scores before you publish.",
    },
  ]
}

function buildCitations(keywords: string[], topic: string) {
  const base = keywords.length ? keywords.slice(0, 4) : deriveKeywords(topic, [])
  return base.map((kw, i) => ({
    title: `Source ${i + 1}: ${kw.toUpperCase()}`,
    url: `https://www.google.com/search?q=${encodeURIComponent(kw)}`,
    description: `Research touchpoint for ${kw}`,
  }))
}

function buildFallbackHtml(title: string, description: string, keywords: string[], links: any[], faqs: any[], citations: any[]) {
  const keywordsLine = keywords.length ? `<p><strong>Primary keywords:</strong> ${keywords.join(", ")}</p>` : ""
  const intro = description ||
    `Practical, rank-ready guidance for ${title || "your topic"} with step-by-step actions, recent research, and conversion hooks.`

  const bodySections = [
    {
      heading: `${title || "Article"}: what matters now`,
      paragraphs: [
        intro,
        "Match search intent first: open with the specific problem, then outline the outcome readers will achieve. Weave in 2–3 supporting stats to build trust.",
      ],
    },
    {
      heading: "Actionable playbook",
      paragraphs: [
        "Lay out the repeatable steps: research competitors, map subtopics, draft H2/H3s, add internal links, and finish with meta data. Keep sentences tight (12–18 words).",
        "Close every major section with a micro-CTA (demo, checklist download, or related guide) to increase engagement and dwell time.",
      ],
    },
    {
      heading: "On-page SEO checks",
      paragraphs: [
        "Validate meta title/description length, add descriptive alt text, compress hero media, and ensure your primary keyword is in the first 120 words.",
        "Add 3–5 authoritative citations plus internal links to adjacent guides to strengthen E-E-A-T and crawlability.",
      ],
    },
    {
      heading: "Conclusion and next steps",
      paragraphs: [
        "Summarize the top wins, restate the outcome, and present the clearest next action. Encourage readers to extend the article to the maximum word allowance for deeper topical authority.",
      ],
    },
  ]

  const faqsHtml = faqs
    .map((faq: any) => `<div><h3>${faq.question}</h3><p>${faq.answer}</p></div>`)
    .join("")
  const citationsHtml = citations
    .map((c: any) => `<li><a href="${c.url}" rel="noopener" target="_blank">${c.title}</a></li>`)
    .join("")
  const linksHtml = Array.isArray(links) && links.length
    ? `<section><h2>Suggested internal links</h2><ul>${links
        .slice(0, 6)
        .map((l: any) => `<li><a href="${l.url}">${l.anchor_text || l.url}</a></li>`)
        .join("")}</ul></section>`
    : ""

  const sectionsHtml = bodySections
    .map((section) => `<section><h2>${section.heading}</h2>${section.paragraphs.map((p) => `<p>${p}</p>`).join("")}</section>`)
    .join("")

  return `
    <article>
      <header>
        <p class="text-sm text-slate-500">SEO-ready draft</p>
        <h1>${title}</h1>
        <p>${intro}</p>
        ${keywordsLine}
      </header>
      ${sectionsHtml}
      ${linksHtml}
      <section>
        <h2>Frequently asked questions</h2>
        ${faqsHtml}
      </section>
      <section>
        <h2>Citations and sources</h2>
        <ol>${citationsHtml}</ol>
      </section>
    </article>
  `
}

function buildFallbackSections(title: string, summary: string, keywords: string[]) {
  const primary = title || "SEO-ready article"
  const keywordLine = keywords.length ? keywords.slice(0, 6).join(", ") : "your target query"
  return [
    {
      heading: `${primary}: why it matters`,
      paragraphs: [
        summary || `A comprehensive guide to ${primary} with modern best practices and proof points.`,
        `Core focus: ${keywordLine}. Hook readers with a problem-first intro, then outline the promise and outcome in the first 120 words.`,
      ],
    },
    {
      heading: "Research-backed strategy",
      paragraphs: [
        "Compare the top-ranking approaches, highlight gaps you’ll fill, and cite at least three authoritative sources published within the last 12 months.",
        "Add specific examples or mini case studies to make each section actionable and credible.",
      ],
    },
    {
      heading: "Implementation blueprint",
      paragraphs: [
        "Lay out the step-by-step process (H2/H3) with checklists, bullets, and inline CTAs. Keep sentences concise and scannable for mobile readers.",
        "Include internal links to related guides, FAQs for objections, and a conversion offer tied to the user’s intent.",
      ],
    },
    {
      heading: "Optimization and next steps",
      paragraphs: [
        "Validate meta data, schema, load time, and accessibility. Encourage readers to extend the article to the plan’s maximum word allowance for topical depth.",
      ],
    },
  ]
}

function sectionsToHtml(sections: any[] = [], faqs: any[] = [], citations: any[] = []) {
  if (!Array.isArray(sections) || sections.length === 0) return ""

  const sectionHtml = sections
    .map((section: any) => {
      if (!section) return ""
      const heading = coerceString(section.heading || section.title).trim()
      const paragraphs = Array.isArray(section.paragraphs)
        ? section.paragraphs.map((p: any) => `<p>${coerceString(p).trim()}</p>`).join("\n")
        : ""
      if (!heading && !paragraphs) return ""
      return `<section><h2>${heading}</h2>${paragraphs}</section>`
    })
    .filter(Boolean)
    .join("\n")

  const faqsHtml = Array.isArray(faqs) && faqs.length
    ? `<section><h2>Frequently asked questions</h2>${faqs
        .map((faq: any) => {
          const question = coerceString(faq?.question || faq?.q).trim()
          const answer = coerceString(faq?.answer || faq?.a).trim()
          if (!question || !answer) return ""
          return `<div><h3>${question}</h3><p>${answer}</p></div>`
        })
        .filter(Boolean)
        .join("")}</section>`
    : ""

  const citationsHtml = Array.isArray(citations) && citations.length
    ? `<section><h2>Citations and sources</h2><ol>${citations
        .map((c: any) => {
          const url = coerceString(c?.url).trim()
          const title = coerceString(c?.title || c?.label).trim() || url
          if (!url && !title) return ""
          return `<li><a href="${url || '#'}" rel="noopener" target="_blank">${title}</a></li>`
        })
        .filter(Boolean)
        .join("")}</ol></section>`
    : ""

  return `<article>${sectionHtml}${faqsHtml}${citationsHtml}</article>`
}

// When the API returns only HTML/markdown without structured sections, derive
// section objects from the DOM so extension merges can preserve the original
// content instead of treating it as empty.
function extractSectionsFromHtml(html?: string, markdown?: string) {
  const sections: { heading: string; paragraphs: string[] }[] = []
  const appendSection = (heading: string, paragraphs: string[]) => {
    const cleanHeading = coerceString(heading).trim()
    const cleanParas = (paragraphs || []).map((p) => coerceString(p).trim()).filter(Boolean)
    if (!cleanHeading && cleanParas.length === 0) return
    sections.push({ heading: cleanHeading, paragraphs: cleanParas })
  }

  try {
    if (typeof window !== "undefined" && typeof DOMParser !== "undefined" && html) {
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, "text/html")
      const headings = Array.from(doc.querySelectorAll("h1, h2, h3"))
      if (headings.length) {
        headings.forEach((headingEl, idx) => {
          const headingText = headingEl.textContent || ""
          const paragraphs: string[] = []
          let sibling = headingEl.nextElementSibling
          while (sibling && !/H[1-3]/i.test(sibling.tagName)) {
            if (sibling.tagName === "P" || sibling.tagName === "UL" || sibling.tagName === "OL") {
              const text = sibling.textContent || ""
              if (text.trim()) paragraphs.push(text)
            }
            sibling = sibling.nextElementSibling
          }
          appendSection(headingText, paragraphs)
        })
      }
    }
  } catch {
    // Fall through to markdown parsing if DOM parsing fails
  }

  if (sections.length === 0 && markdown) {
    const lines = markdown.split(/\r?\n/)
    let currentHeading = ""
    let buffer: string[] = []
    const flush = () => {
      appendSection(currentHeading, buffer)
      buffer = []
    }
    lines.forEach((line) => {
      if (/^##\s+/.test(line)) {
        flush()
        currentHeading = line.replace(/^##\s+/, "").trim()
      } else if (line.trim()) {
        buffer.push(line.trim())
      }
    })
    flush()
  }

  return sections
}

function normalizeDraftResult(raw: any, context: DraftContext = {}): DraftResult {
  if (!raw) return null

  // Accept plain string responses (HTML or markdown) instead of throwing.
  if (typeof raw === "string") {
    return {
      title: "Your Article",
      topic: "",
      html: raw,
      markdown: raw,
      meta_title: "Your Article",
      meta_description: "",
      meta_keywords: [],
      keywords: [],
      citations: [],
      faqs: [],
      internal_links: [],
      social_posts: {},
      image_url: "",
      seo_score: 0,
      readability_score: "",
      word_count: 0,
    }
  }

  if (typeof raw !== "object") return null

  const baseCandidate =
    (typeof (raw as any).data === "object" && (raw as any).data) ||
    (typeof (raw as any).draft === "object" && (raw as any).draft) ||
    (typeof (raw as any).result === "object" && (raw as any).result) ||
    raw

  const base = baseCandidate as Record<string, any>

  const title = base.title || base.topic || base.headline || "Your Article"
  const summary = base.meta_description || base.description || base.summary || ""

  const alternativeTitles = Array.isArray(base.alternative_titles)
    ? base.alternative_titles.filter(Boolean).map(coerceString)
    : []

  const metaKeywords = Array.isArray(base.meta_keywords)
    ? base.meta_keywords
    : Array.isArray(base.keywords)
      ? base.keywords
      : deriveKeywords(`${title} ${summary}`)

  const normalizedMetaKeywords = Array.from(new Set((metaKeywords || []).map((kw) => coerceString(kw).toLowerCase()).filter(Boolean)))

  const internalLinks = Array.isArray(base.internal_links)
    ? base.internal_links
        .filter((link: any) => link && (link.url || link.anchor_text))
        .map((link: any) => ({
          url: coerceString(link.url || link.href).trim(),
          anchor_text: coerceString(link.anchor_text || link.text || link.title).trim(),
        }))
        .filter((link) => link.url)
    : buildInternalLinks(title, context.siteUrl)

  const faqs = (() => {
    const rawFaqs = Array.isArray(base.faqs) && base.faqs.length > 0 ? base.faqs.filter(Boolean) : buildFaqs(title)
    const cleaned = rawFaqs
      .map((faq: any) => {
        const question = coerceString(faq?.question || faq?.q || faq?.title).trim()
        const answer = coerceString(faq?.answer || faq?.a || faq?.content).trim()
        if (!question || !answer) return null
        return { question, answer }
      })
      .filter(Boolean)

    return cleaned.length > 0 ? cleaned : buildFaqs(title)
  })()

  const htmlRaw =
    base.html ||
    base.rendered_html ||
    base.content_html ||
    base.article_html ||
    base.content ||
    base.body ||
    base.markdown ||
    ""

  const citations = (() => {
    const raw = Array.isArray(base.citations) ? base.citations.filter(Boolean) : buildCitations(normalizedMetaKeywords, title)
    const cleaned = raw
      .map((citation: any) => {
        const url = coerceString(citation?.url).trim()
        const titleText = coerceString(citation?.title || citation?.label || citation?.source).trim()
        const description = coerceString(citation?.description || citation?.summary).trim()
        if (!url && !titleText && !description) return null
        return {
          url: url || (titleText ? `https://www.google.com/search?q=${encodeURIComponent(titleText)}` : ""),
          title: titleText || url || "Source",
          description,
        }
      })
      .filter(Boolean)

    return cleaned.length > 0 ? cleaned : buildCitations(metaKeywords, title)
  })()

  const structuredSections = Array.isArray(base.sections)
    ? base.sections
        .filter(Boolean)
        .map((section: any) => ({
          heading: coerceString(section.heading || section.title).trim(),
          paragraphs: Array.isArray(section.paragraphs)
            ? section.paragraphs.map((p: any) => coerceString(p).trim()).filter(Boolean)
            : [],
        }))
        .filter((s) => s.heading || s.paragraphs.length)
    : []

  const sectionsToRender = structuredSections.length
    ? structuredSections
    : buildFallbackSections(title, summary, normalizedMetaKeywords)

  const enrichedKeywords = deriveKeywordsFromSections(sectionsToRender, normalizedMetaKeywords)

  const sectionsHtml = sectionsToHtml(sectionsToRender, faqs, citations)

  const summaryFromSections = (() => {
    const firstParagraph = sectionsToRender[0]?.paragraphs?.find((p: string) => p && p.length > 40) || ""
    if (firstParagraph) {
      const clipped = firstParagraph.replace(/\s+/g, " ").trim()
      return clipped.length > 155 ? `${clipped.slice(0, 152)}…` : clipped
    }
    return ""
  })()

  const markdownRaw = coerceString(
      base.markdown ||
      base.content ||
      base.html ||
      base.body ||
      sectionsToRender
        .map((section) => `## ${section.heading}\n\n${section.paragraphs.join("\n\n")}`)
        .join("\n\n")
  )

  const html = ensureHtml(htmlRaw || sectionsHtml, markdownRaw || sectionsHtml)

  const safeHtml = html || sanitizeHtml(buildFallbackHtml(title, summary, normalizedMetaKeywords, internalLinks, faqs, citations))
  const textForCount = stripTags(safeHtml || markdownRaw)
  const generatedCount = base.word_count || base.target_word_count || (textForCount ? textForCount.split(/\s+/).length : 0)
  const wordCount = context.baseWordCount
    ? // If the model returns the full article again, trust the generated count instead of double-adding the base.
      (generatedCount >= context.baseWordCount ? generatedCount : context.baseWordCount + generatedCount)
    : generatedCount

  const socialPosts = (() => {
    const rawSocial = base.social_posts
    if (Array.isArray(rawSocial) && rawSocial.length > 0) return rawSocial
    if (rawSocial && typeof rawSocial === "object" && Object.keys(rawSocial).length > 0) return rawSocial
    return buildSocialPosts(title, summaryFromSections || summary, enrichedKeywords)
  })()

  const seoScore = (() => {
    const rawScore = Number(base.seo_score ?? base.score ?? 0)
    if (rawScore > 0) return rawScore
    let score = 55
    if (wordCount >= 2000) score += 15
    else if (wordCount >= 1200) score += 10
    if (sectionsToRender.length >= 6) score += 10
    else if (sectionsToRender.length >= 4) score += 6
    if (normalizedMetaKeywords.length >= 6) score += 8
    else if (normalizedMetaKeywords.length >= 3) score += 5
    if (internalLinks.length >= 3) score += 6
    if (faqs.length >= 4) score += 6
    if (citations.length >= 3) score += 6
    if (safeHtml) score += 4
    return Math.min(score, 98)
  })()

  const metaDescription = buildMetaDescription(
    title,
    sectionsToRender,
    enrichedKeywords,
    summaryFromSections || summary || `${title} — detailed, rank-ready walkthrough.`
  )
  const metaTitle = (base.meta_title || alternativeTitles[0] || title).slice(0, 60)

  return {
    ...base,
    title,
    topic: base.topic || base.title || "",
    sections: sectionsToRender,
    html: safeHtml,
    markdown: markdownRaw,
    meta_title: metaTitle,
    meta_description: metaDescription,
    meta_keywords: enrichedKeywords,
    keywords: Array.isArray(base.keywords) && base.keywords.length > 0 ? base.keywords : enrichedKeywords,
    citations,
    faqs,
    internal_links: internalLinks,
    social_posts: socialPosts,
    image_url: base.image_url || base.image?.image_url || base.image?.image_b64 || "",
    seo_score: seoScore,
    readability_score: base.readability_score ?? "",
    word_count: Number(wordCount) || 0,
    article_id: base.article_id || base.articleId || base.id || base.uuid || base._id || null,
  }
}

function mergeSections(existing: any[] = [], incoming: any[] = []) {
  const merged: any[] = []
  const seen = new Map<string, number>()

  const normalizeHeading = (h: string) => (h || "").trim().toLowerCase()
  const pushSection = (section: any, appendOnly = false) => {
    if (!section) return
    const heading = normalizeHeading(section.heading || section.title || "")
    const paragraphs = Array.isArray(section.paragraphs) ? section.paragraphs.filter(Boolean).map(coerceString) : []

    if (!heading && paragraphs.length === 0) return

    if (seen.has(heading) && heading) {
      const idx = seen.get(heading)!
      const current = merged[idx]
      const existingParas = new Set((current.paragraphs || []).map((p: string) => p.trim()))
      const nextParas = appendOnly ? paragraphs : [...current.paragraphs, ...paragraphs]
      current.paragraphs = nextParas.filter((p: string) => {
        const key = p.trim()
        if (!key) return false
        if (existingParas.has(key)) return false
        existingParas.add(key)
        return true
      })
      merged[idx] = current
      return
    }

    const cleaned = {
      heading: heading || section.heading || section.title || "",
      paragraphs,
    }
    merged.push(cleaned)
    seen.set(heading, merged.length - 1)
  }

  existing.forEach((section) => pushSection(section))
  incoming.forEach((section) => pushSection(section, true))

  return merged
}

function ensureConclusionSection(sections: any[] = [], title = "") {
  const hasConclusion = sections.some((s) => /conclusion|final takeaways|next steps/i.test(s?.heading || ""))
  if (hasConclusion) return sections

  const topic = title || "This guide"
  const conclusion = {
    heading: "Conclusion: how to ship and scale",
    paragraphs: [
      `${topic} — your final checklist: refresh stats quarterly, add internal links to related guides, and include a clear CTA for the reader's next step.`,
      "Re-run a SERP check every 60–90 days and expand sections that underperform. Keep FAQs fresh and align meta data with the latest insights.",
    ],
  }

  return [...sections, conclusion]
}

function mergeFaqs(existing: any[] = [], incoming: any[] = []) {
  const seen = new Set<string>()
  const out: any[] = []
  const add = (faq: any) => {
    const q = coerceString(faq?.question || faq?.q).trim()
    const a = coerceString(faq?.answer || faq?.a).trim()
    if (!q || !a) return
    const key = q.toLowerCase()
    if (seen.has(key)) return
    seen.add(key)
    out.push({ question: q, answer: a })
  }
  existing.forEach(add)
  incoming.forEach(add)
  return out
}

function mergeCitations(existing: any[] = [], incoming: any[] = []) {
  const seen = new Set<string>()
  const out: any[] = []
  const add = (c: any) => {
    const url = coerceString(c?.url).trim()
    const title = coerceString(c?.title || c?.label || c?.source).trim()
    if (!url && !title) return
    const key = url || title
    if (seen.has(key)) return
    seen.add(key)
    out.push({ url, title: title || url || "Source" })
  }
  existing.forEach(add)
  incoming.forEach(add)
  return out
}

function DemoContent() {
  const { quota, isAuthenticated, updateQuota, syncWithBackend } = useQuota()

  const [topic, setTopic] = useState("")
  const [language, setLanguage] = useState("en")
  const [tone, setTone] = useState("professional")
  // Word count selection; will be constrained by plan
  const [wordCount, setWordCount] = useState("1500")
  // Optional brief/instructions to guide generation
  const [brief, setBrief] = useState("")
  const [siteUrl, setSiteUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [extending, setExtending] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Determine allowed word counts based on plan and surface locked options for clarity
  const wordOptions = [
    { value: "1200", label: "1,200 words (demo safe)", allowed: !isAuthenticated },
    { value: "1500", label: "1,500 words (demo cap)", allowed: !isAuthenticated },
    { value: "1500", label: "1,500 words (Free starter)", allowed: isAuthenticated && quota.plan === 'free' },
    { value: "2000", label: "2,000 words (Free max)", allowed: isAuthenticated && quota.plan === 'free' },
    { value: "2000", label: "2,000 words (Pro quick)", allowed: isAuthenticated && quota.plan === 'pro' },
    { value: "2500", label: "2,500 words (Pro depth)", allowed: isAuthenticated && quota.plan === 'pro' },
    { value: "3000", label: "3,000 words (Pro max)", allowed: isAuthenticated && quota.plan === 'pro' },
  ]

  // Ensure selected word count remains valid when plan or options change
  useEffect(() => {
    const highestAllowed = [...wordOptions].reverse().find((opt) => opt.allowed)
    if (highestAllowed && wordCount !== highestAllowed.value) {
      setWordCount(highestAllowed.value)
    }
  }, [quota.plan, isAuthenticated])

  async function run() {
    if (!topic.trim()) {
      setError("Please enter a topic")
      return
    }

    // Check quota enforcement
    const { allowed, reason } = canGenerateArticle(quota, isAuthenticated)

    if (!allowed) {
      setError(reason || "Generation limit reached")
      return
    }

    setError(null)
    setLoading(true)
    try {
      const planWordCap = !isAuthenticated ? 1500 : quota.plan === 'pro' ? 3000 : 2000
      const requestedWords = parseInt(wordCount) || planWordCap
      const targetWords = Math.min(planWordCap, requestedWords)

      console.log('Generating article with payload:', {
        topic: topic.trim(),
        tone,
        language,
        target_word_count: targetWords
      })

      const rawResult = await generateDraft({
        topic: topic.trim(),
        tone: tone,
        language: language,
        target_word_count: targetWords,
        research: true,
        generate_social: true,
        generate_image: true,
        generate_faqs: true,
        site_url: siteUrl || undefined,
        // Include optional brief/instructions if provided
        brief: brief.trim() || undefined
      })

      console.log('Generation successful:', rawResult)

      const normalized = normalizeDraftResult(rawResult, {
        siteUrl: siteUrl || undefined,
      })

      if (!normalized) {
        throw new Error("Unexpected response from the server. Please try again.")
      }

      // Record successful generation and update global state
      const updatedQuota = recordArticleGeneration(quota, isAuthenticated)
      updateQuota(updatedQuota)

      // Sync with backend if authenticated
      if (isAuthenticated) {
        setTimeout(() => syncWithBackend(), 1000)
      }

      setResult(normalized)
    } catch (e: any) {
      console.error('Generation failed:', e)
      const errorMessage = e?.message || "Failed to generate"
      setError(`Error: ${errorMessage}. Check browser console for details.`)
    } finally {
      setLoading(false)
    }
  }

  const quotaInfo = getRemainingQuota(quota)

  const maxAllowedOption = [...wordOptions].reverse().find((opt) => opt.allowed)

  const lockoutMessage = (() => {
    if (isAuthenticated) {
      if (quota.plan === 'free') {
        const weekKey = new Date()
        const usedWeek = quota.lastWeekKey === getWeekKey(weekKey) ? quota.weekGenerations || 0 : 0
        const monthlyLeft = Math.max(0, (quota.articlesPerMonth || 4) - quota.monthGenerations)
        return `${usedWeek}/${quota.articlesPerWeek || 1} weekly generation used • ${monthlyLeft}/${quota.articlesPerMonth || 4} left this month`
      }
      if (quota.plan === 'pro') {
        return `${quota.todayGenerations}/${5} daily generations used`
      }
    }

    if (quota.demoUsed && quota.demoUsedAt) {
      const usedDate = new Date(quota.demoUsedAt)
      const daysDiff = Math.floor((Date.now() - usedDate.getTime()) / (1000 * 60 * 60 * 24))
      const daysLeft = Math.max(0, 30 - daysDiff)
      if (daysLeft > 0) return `Demo locked for ${daysLeft} more day${daysLeft === 1 ? '' : 's'}`
    }

    return null
  })()

  async function extendDraft() {
    if (!result) return
    if (!isAuthenticated) {
      setError("Sign in to extend drafts to your plan maximum.")
      return
    }

    const { allowed, reason } = canUseTool(quota, isAuthenticated)
    if (!allowed) {
      setError(reason || "Extension limit reached. Upgrade for more daily runs.")
      return
    }

    const planWordCap = quota.plan === 'pro' ? 3000 : 2000
    const currentWords = result.word_count || stripTags(result.html || '').split(/\s+/).length
    if (currentWords >= planWordCap) {
      setError(`You've reached the ${planWordCap.toLocaleString()}-word cap for your plan. Upgrade or trim the draft to extend.`)
      return
    }

    setExtending(true)
    try {
      const rawResult = await expandDraft({
        keyword: topic.trim() || result.title || "Article",
        article_json: result,
        article_id: result.article_id || undefined,
        website_url: siteUrl || undefined,
        region: language,
      })

      const normalized = normalizeDraftResult(rawResult, {
        siteUrl: siteUrl || undefined,
        baseWordCount: result.word_count || 0,
      })

      if (!normalized) {
        throw new Error("Could not extend this draft. Please try again.")
      }

      // Record tool usage locally so the UI reflects backend enforcement.
      const updatedQuota = recordToolUsage(quota)
      updateQuota(updatedQuota)
      setTimeout(() => syncWithBackend(), 500)

      const existingSectionsRaw = Array.isArray(result.sections) ? result.sections : []
      const fallbackExisting = extractSectionsFromHtml(result.html, result.markdown)
      const existingSections = mergeSections(existingSectionsRaw, fallbackExisting)

      const incomingSectionsRaw = Array.isArray(normalized.sections) ? normalized.sections : []
      const fallbackIncoming = extractSectionsFromHtml(normalized.html, normalized.markdown)
      const incomingSections = mergeSections(incomingSectionsRaw, fallbackIncoming)
      const mergedSections = ensureConclusionSection(mergeSections(existingSections, incomingSections), result.title || topic)

      const mergedFaqs = mergeFaqs(result.faqs || [], normalized.faqs || [])
      const mergedCitations = mergeCitations(result.citations || [], normalized.citations || [])
      const mergedKeywords = Array.from(new Set([...(result.meta_keywords || []), ...(normalized.meta_keywords || [])])).filter(Boolean)

      const existingHtml = result.html || sectionsToHtml(existingSections, result.faqs || [], result.citations || [])
      const incomingHtml = normalized.html || sectionsToHtml(incomingSections, normalized.faqs || [], normalized.citations || [])

      const synthesizedHtml = sectionsToHtml(mergedSections, mergedFaqs, mergedCitations)
      const mergedHtml = ensureHtml(synthesizedHtml, [existingHtml, incomingHtml, result.markdown, normalized.markdown].filter(Boolean).join("\n\n"))

      const mergedWordCount = stripTags(mergedHtml || synthesizedHtml || '').split(/\s+/).filter(Boolean).length

      setResult({
        ...result,
        ...normalized,
        sections: mergedSections,
        faqs: mergedFaqs,
        citations: mergedCitations,
        meta_keywords: mergedKeywords,
        keywords: mergedKeywords,
        article_id: rawResult?.article_id || result.article_id,
        markdown: [result.markdown, normalized.markdown].filter(Boolean).join("\n\n"),
        html: mergedHtml,
        image_url: normalized.image_url || result.image_url || result.image?.image_url || "",
        word_count: mergedWordCount || normalized.word_count || result.word_count || 0,
        reading_time_minutes: Math.max(1, Math.round((mergedWordCount || normalized.word_count || result.word_count || 0) / 220)),
      })
    } catch (e: any) {
      setError(e?.message || "Failed to extend draft")
    } finally {
      setExtending(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Generate Your Article</CardTitle>
              <CardDescription>
                Enter a topic and watch AI create SEO-optimized content in seconds
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            <Input
              placeholder="e.g., Best AI Writing Tools for Content Marketers in 2024"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && run()}
              className="h-12 text-base"
              disabled={loading}
            />

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <Select value={language} onValueChange={setLanguage} disabled={loading}>
                <SelectTrigger className="h-12">
                  <Globe className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="English only" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>

              <Select value={tone} onValueChange={setTone} disabled={loading}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="authoritative">Authoritative</SelectItem>
                  <SelectItem value="conversational">Conversational</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                </SelectContent>
              </Select>

              <Select value={wordCount} onValueChange={setWordCount} disabled={loading}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Word Count" />
                </SelectTrigger>
                <SelectContent>
                  {wordOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      disabled={!opt.allowed}
                    >
                      {opt.label}
                      {!opt.allowed && " · Pro"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Website to research for internal links (optional)"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                disabled={loading}
                className="h-12 text-base"
              />

              <Button
                onClick={run}
                disabled={loading}
                className="gradient-btn text-white h-12"
              >
                {loading ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <Badge variant="outline">Demo & guests: up to 1,500 words</Badge>
              <Badge variant="outline">Free: unlock 2,000-word drafts</Badge>
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">Pro: 3,000-word max</Badge>
              {siteUrl && (
                <Badge variant="secondary">Interlinking with {normalizeUrl(siteUrl) || siteUrl}</Badge>
              )}
            </div>

            {/* Optional brief/instructions */}
            <div className="flex flex-col">
              <Textarea
                placeholder="Optional brief or instructions (e.g. tone, brand guidelines, specific points)"
                value={brief}
                onChange={e => setBrief(e.target.value)}
                disabled={loading}
                className="mt-2"
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
              >
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm flex-1">{error}</p>
                {!isAuthenticated && error.includes("locked") && (
                  <Link href="/auth">
                    <Button size="sm" className="gradient-btn text-white">
                      Sign Up
                    </Button>
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>English-first, research-backed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>AI-generated image</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Auto citations & FAQs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Social posts included</span>
              </div>
            </div>
            {quotaInfo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Badge variant="outline" className="text-xs">
                  {quotaInfo}
                </Badge>
              </motion.div>
            )}
            {lockoutMessage && (
              <p className="text-xs text-red-600">{lockoutMessage}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      )}

      {/* Result Section */}
      {result && !loading && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              disabled={extending}
              onClick={extendDraft}
              className="flex items-center gap-2"
            >
              {extending ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Extending to {maxAllowedOption?.label || `${wordCount} words`}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Extend to {maxAllowedOption?.label || `${wordCount} words`}
                </>
              )}
            </Button>
            <Badge variant="outline" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Keeps existing content and adds more depth
            </Badge>
          </div>
          <ArticlePreview result={result} />
        </div>
      )}
    </div>
  )
}

export default function Demo() {
  const [instanceKey, setInstanceKey] = useState(0)

  return (
    <ErrorBoundary
      resetKeys={[instanceKey]}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <Card className="border-2 border-red-200 bg-red-50/70">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <CardTitle className="text-xl">Something went wrong</CardTitle>
            </div>
            <CardDescription className="text-sm text-muted-foreground">
              The generator hit a client-side issue. Please try again; your session limits remain safe.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Details: {error.message}</p>
            <div className="flex flex-wrap gap-2">
              <Button
                className="gradient-btn text-white"
                onClick={() => {
                  setInstanceKey((key) => key + 1)
                  resetErrorBoundary()
                }}
              >
                Restart generator
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Refresh page
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    >
      <DemoContent key={instanceKey} />
    </ErrorBoundary>
  )
}
