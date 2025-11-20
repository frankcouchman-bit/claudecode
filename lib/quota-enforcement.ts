// Strict quota enforcement based on backend logic
import Cookies from 'js-cookie'

export interface QuotaLimits {
  plan: 'free' | 'pro'
  articlesPerDay: number
  articlesPerWeek: number
  toolsPerDay: number
  // Number of tools the user may use per week (free plan).  For Pro
  // plans this value is not used.  We track weekly tool usage via
  // weekTools in order to enforce the per-week limit on free plans.
  toolsPerWeek?: number
  demoUsed: boolean
  demoUsedAt?: string
  lastArticleGenerated?: string
  todayGenerations: number
  weekGenerations: number
  toolsToday: number
  weekTools?: number
}

const DEMO_LOCKOUT_DAYS = 30
// Quota limits:
// - Demo (unauthenticated) users may generate one article per month (handled by demo lockout) and use one tool per month.
// - Free plan users may generate one article per week and use one tool per week.
// - Pro plan users may generate up to 10 articles per day and use up to 5 tools per day.

const FREE_ARTICLES_PER_WEEK = 1
const FREE_TOOLS_PER_WEEK = 1
const PRO_ARTICLES_PER_DAY = 10
const PRO_TOOLS_PER_DAY = 5

// Get quota from localStorage
export function getQuota(): QuotaLimits {
  if (typeof window === 'undefined') {
    return getDefaultQuota()
  }

  const stored = localStorage.getItem('seoscribe_quota')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return getDefaultQuota()
    }
  }
  return getDefaultQuota()
}

function getDefaultQuota(): QuotaLimits {
  return {
    plan: 'free',
    articlesPerDay: 0,
    articlesPerWeek: FREE_ARTICLES_PER_WEEK,
    toolsPerDay: 0,
    toolsPerWeek: FREE_TOOLS_PER_WEEK,
    demoUsed: false,
    todayGenerations: 0,
    weekGenerations: 0,
    toolsToday: 0,
    weekTools: 0
  }
}

// Save quota to localStorage
export function saveQuota(quota: QuotaLimits) {
  if (typeof window === 'undefined') return
  localStorage.setItem('seoscribe_quota', JSON.stringify(quota))
}

// Check if user can generate article
export function canGenerateArticle(quota: QuotaLimits, isAuthenticated: boolean): { allowed: boolean; reason?: string } {
  // Guest users - check demo lockout
  if (!isAuthenticated) {
    if (quota.demoUsed && quota.demoUsedAt) {
      const usedDate = new Date(quota.demoUsedAt)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - usedDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff < DEMO_LOCKOUT_DAYS) {
        const daysLeft = DEMO_LOCKOUT_DAYS - daysDiff
        return {
          allowed: false,
          reason: `Demo locked. Sign up or wait ${daysLeft} days.`
        }
      }
    }
    return { allowed: true } // First demo use
  }

  // Free plan - 1 article per week
  if (quota.plan === 'free') {
    if (quota.weekGenerations >= FREE_ARTICLES_PER_WEEK) {
      return {
        allowed: false,
        // Update messaging to reflect updated pro plan daily limit
        reason: 'Weekly limit reached. Upgrade to Pro for 10 articles/day.'
      }
    }
    return { allowed: true }
  }

  // Pro plan - 15 articles per day
  if (quota.plan === 'pro') {
    if (quota.todayGenerations >= PRO_ARTICLES_PER_DAY) {
      return {
        allowed: false,
        // Reflect the new daily limit of 10 articles for pro users
        reason: 'Daily limit reached (10 articles). Resets at midnight.'
      }
    }
    return { allowed: true }
  }

  return { allowed: false, reason: 'Unknown plan type' }
}

// Check if user can use tool
export function canUseTool(quota: QuotaLimits, isAuthenticated: boolean): { allowed: boolean; reason?: string } {
  if (!isAuthenticated) {
    return {
      allowed: false,
      reason: 'Sign in to use tools'
    }
  }

  // Free plan: 1 tool use per week
  if (quota.plan === 'free') {
    const used = quota.weekTools || 0
    if (used >= FREE_TOOLS_PER_WEEK) {
      return {
        allowed: false,
        // Encourage upgrade by mentioning the pro daily tool limit of 5 uses
        reason: 'Weekly tool limit reached. Upgrade to Pro for 5 daily uses.'
      }
    }
    return { allowed: true }
  }

  // Pro plan: 5 tools per day
  if (quota.plan === 'pro') {
    if (quota.toolsToday >= PRO_TOOLS_PER_DAY) {
      return {
        allowed: false,
        // Make sure the message clearly states the pro plan daily tool limit
        reason: 'Daily tool limit reached (5 uses). Resets at midnight.'
      }
    }
    return { allowed: true }
  }

  return { allowed: false, reason: 'Unknown plan type' }
}

// Record article generation
export function recordArticleGeneration(quota: QuotaLimits, isAuthenticated: boolean): QuotaLimits {
  const now = new Date().toISOString()

  if (!isAuthenticated) {
    // Guest user - mark demo as used
    return {
      ...quota,
      demoUsed: true,
      demoUsedAt: now
    }
  }

  // Reset counters if needed
  const resetQuota = resetCountersIfNeeded(quota)

  return {
    ...resetQuota,
    todayGenerations: resetQuota.todayGenerations + 1,
    weekGenerations: resetQuota.weekGenerations + 1,
    lastArticleGenerated: now
  }
}

// Record tool usage
export function recordToolUsage(quota: QuotaLimits): QuotaLimits {
  const resetQuota = resetCountersIfNeeded(quota)
  return {
    ...resetQuota,
    toolsToday: resetQuota.toolsToday + 1,
    weekTools: (resetQuota.weekTools || 0) + 1
  }
}

// Reset counters if day/week has changed
function resetCountersIfNeeded(quota: QuotaLimits): QuotaLimits {
  if (!quota.lastArticleGenerated) return quota

  const lastGen = new Date(quota.lastArticleGenerated)
  const now = new Date()

  let updated = { ...quota }

  // Reset daily counters if different day
  if (lastGen.toDateString() !== now.toDateString()) {
    updated.todayGenerations = 0
    updated.toolsToday = 0
  }

  // Reset weekly counters if different week
  const lastWeek = getWeekNumber(lastGen)
  const currentWeek = getWeekNumber(now)
  if (lastWeek !== currentWeek || lastGen.getFullYear() !== now.getFullYear()) {
    updated.weekGenerations = 0
    // Reset weekly tool usage when entering a new week
    updated.weekTools = 0
  }

  return updated
}

// Get week number
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

// Update plan
export function updatePlan(quota: QuotaLimits, newPlan: 'free' | 'pro'): QuotaLimits {
  if (newPlan === 'free') {
    return {
      ...quota,
      plan: 'free',
      articlesPerDay: 0,
      articlesPerWeek: FREE_ARTICLES_PER_WEEK,
      toolsPerDay: 0,
      toolsPerWeek: FREE_TOOLS_PER_WEEK,
      // Reset usage counters to align with the new plan limits
      todayGenerations: 0,
      weekGenerations: 0,
      toolsToday: 0,
      weekTools: 0
    }
  }
  // Pro plan
  return {
    ...quota,
    plan: 'pro',
    articlesPerDay: PRO_ARTICLES_PER_DAY,
    articlesPerWeek: 0,
    toolsPerDay: PRO_TOOLS_PER_DAY,
    toolsPerWeek: 0,
    // Reset usage counters when upgrading
    todayGenerations: 0,
    weekGenerations: 0,
    toolsToday: 0,
    weekTools: 0
  }
}

// Get remaining quota display
export function getRemainingQuota(quota: QuotaLimits): string {
  if (quota.plan === 'free') {
    const remaining = FREE_ARTICLES_PER_WEEK - quota.weekGenerations
    return `${remaining} article${remaining !== 1 ? 's' : ''} left this week`
  }

  const remaining = PRO_ARTICLES_PER_DAY - quota.todayGenerations
  // Provide remaining and total articles per day for pro plan
  return `${remaining}/${PRO_ARTICLES_PER_DAY} articles left today`
}
