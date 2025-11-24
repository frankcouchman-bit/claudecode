// Strict quota enforcement based on backend logic
import Cookies from 'js-cookie'

export interface QuotaLimits {
  plan: 'free' | 'pro'
  articlesPerDay: number
  articlesPerMonth: number
  toolsPerDay: number
  demoUsed: boolean
  demoUsedAt?: string
  lastArticleGenerated?: string
  todayGenerations: number
  monthGenerations: number
  toolsToday: number
}

const DEMO_LOCKOUT_DAYS = 30
// Updated quotas to match backend worker logic
// Free plan: 1 article per day, up to 31 per month, and 1 tool use per day
const FREE_ARTICLES_PER_DAY = 1
const FREE_ARTICLES_PER_MONTH = 31
const FREE_TOOLS_PER_DAY = 1
// Pro plan: 15 articles per day and 10 tool calls per day
const PRO_ARTICLES_PER_DAY = 15
const PRO_TOOLS_PER_DAY = 10

// Get quota from localStorage
export function getQuota(): QuotaLimits {
  if (typeof window === 'undefined') {
    return getDefaultQuota()
  }

  const stored = localStorage.getItem('seoscribe_quota')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      return { ...getDefaultQuota(), ...parsed }
    } catch {
      return getDefaultQuota()
    }
  }
  return getDefaultQuota()
}

function getDefaultQuota(): QuotaLimits {
  return {
    plan: 'free',
    articlesPerDay: FREE_ARTICLES_PER_DAY,
    articlesPerMonth: FREE_ARTICLES_PER_MONTH,
    toolsPerDay: FREE_TOOLS_PER_DAY,
    demoUsed: false,
    todayGenerations: 0,
    monthGenerations: 0,
    toolsToday: 0
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

  // Free plan - 1 article per day (up to 31 per month)
  if (quota.plan === 'free') {
    if (quota.todayGenerations >= FREE_ARTICLES_PER_DAY) {
      return {
        allowed: false,
        reason: 'Daily limit reached. Upgrade to Pro for 15 articles per day.'
      }
    }
    if (quota.monthGenerations >= FREE_ARTICLES_PER_MONTH) {
      return {
        allowed: false,
        reason: 'Monthly limit reached. Upgrade to Pro for higher limits.'
      }
    }
    return { allowed: true }
  }

  // Pro plan - 15 articles per day
  if (quota.plan === 'pro') {
    if (quota.todayGenerations >= PRO_ARTICLES_PER_DAY) {
      return {
        allowed: false,
        reason: 'Daily limit reached (15 articles). Resets at midnight.'
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

  // Free plan - 1 tool use per day
  if (quota.plan === 'free') {
    if (quota.toolsToday >= FREE_TOOLS_PER_DAY) {
      return {
        allowed: false,
        reason: 'Daily tool limit reached. Upgrade to Pro for 10 uses per day.'
      }
    }
    return { allowed: true }
  }

  // Pro plan - 10 tools per day
  if (quota.plan === 'pro') {
    if (quota.toolsToday >= PRO_TOOLS_PER_DAY) {
      return {
        allowed: false,
        reason: 'Daily tool limit reached (10 uses). Resets at midnight.'
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
    monthGenerations: resetQuota.monthGenerations + 1,
    lastArticleGenerated: now
  }
}

// Record tool usage
export function recordToolUsage(quota: QuotaLimits): QuotaLimits {
  const resetQuota = resetCountersIfNeeded(quota)

  return {
    ...resetQuota,
    toolsToday: resetQuota.toolsToday + 1
  }
}

// Reset counters if day/week has changed
function resetCountersIfNeeded(quota: QuotaLimits): QuotaLimits {
  if (!quota.lastArticleGenerated) return quota

  const lastGen = new Date(quota.lastArticleGenerated)
  const now = new Date()

  let updated = { ...quota }

  // Reset counters if a new day has started
  if (lastGen.toDateString() !== now.toDateString()) {
    updated.todayGenerations = 0
    // Reset tool usage daily for all plans (backend enforces per-day limits)
    updated.toolsToday = 0
  }

  // Reset monthly counters if a new month has started
  if (lastGen.getUTCFullYear() !== now.getUTCFullYear() || lastGen.getUTCMonth() !== now.getUTCMonth()) {
    updated.monthGenerations = 0
  }

  return updated
}

// Update plan
export function updatePlan(quota: QuotaLimits, newPlan: 'free' | 'pro'): QuotaLimits {
  return {
    ...quota,
    plan: newPlan,
    articlesPerDay: newPlan === 'pro' ? PRO_ARTICLES_PER_DAY : FREE_ARTICLES_PER_DAY,
    articlesPerMonth: newPlan === 'pro' ? 0 : FREE_ARTICLES_PER_MONTH,
    toolsPerDay: newPlan === 'pro' ? PRO_TOOLS_PER_DAY : FREE_TOOLS_PER_DAY
  }
}

// Get remaining quota display
export function getRemainingQuota(quota: QuotaLimits): string {
  if (quota.plan === 'free') {
    const remainingToday = FREE_ARTICLES_PER_DAY - quota.todayGenerations
    return `${remainingToday} article${remainingToday !== 1 ? 's' : ''} left today`
  }

  const remaining = PRO_ARTICLES_PER_DAY - quota.todayGenerations
  return `${remaining}/${PRO_ARTICLES_PER_DAY} articles left today`
}
