// Strict quota enforcement based on backend logic
import Cookies from 'js-cookie'

export interface QuotaLimits {
  plan: 'free' | 'pro'
  articlesPerDay: number
  articlesPerMonth: number
  articlesPerWeek?: number
  toolsPerDay: number
  demoUsed: boolean
  demoUsedAt?: string
  lastArticleGenerated?: string
  todayGenerations: number
  monthGenerations: number
  weekGenerations?: number
  lastWeekKey?: string
  toolsToday: number
}

const DEMO_LOCKOUT_DAYS = 30
// Updated quotas to mirror the requested limits in the frontend
// Free plan: 1 article per week (UI-enforced), up to 4 per month (UI soft cap), and 1 tool use per day
const FREE_ARTICLES_PER_DAY = 1
const FREE_ARTICLES_PER_WEEK = 1
const FREE_ARTICLES_PER_MONTH = 4
const FREE_TOOLS_PER_DAY = 1
// Pro plan: 5 articles per day and 10 tool calls per day
const PRO_ARTICLES_PER_DAY = 5
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
  const currentWeekKey = getWeekKey(new Date())
  return {
    plan: 'free',
    articlesPerDay: FREE_ARTICLES_PER_DAY,
    articlesPerMonth: FREE_ARTICLES_PER_MONTH,
    articlesPerWeek: FREE_ARTICLES_PER_WEEK,
    toolsPerDay: FREE_TOOLS_PER_DAY,
    demoUsed: false,
    todayGenerations: 0,
    monthGenerations: 0,
    weekGenerations: 0,
    lastWeekKey: currentWeekKey,
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
  const normalizedQuota = resetCountersIfNeeded(quota)

  // Guest users - check demo lockout
  if (!isAuthenticated) {
    if (normalizedQuota.demoUsed && normalizedQuota.demoUsedAt) {
      const usedDate = new Date(normalizedQuota.demoUsedAt)
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
  if (normalizedQuota.plan === 'free') {
    const weekKey = getWeekKey(new Date())
    const alreadyThisWeek = (normalizedQuota.lastWeekKey === weekKey ? normalizedQuota.weekGenerations || 0 : 0) >= FREE_ARTICLES_PER_WEEK
    if (alreadyThisWeek) {
      return {
        allowed: false,
        reason: 'Weekly limit reached. Upgrade to Pro for 5 articles per day.'
      }
    }
    if (normalizedQuota.monthGenerations >= FREE_ARTICLES_PER_MONTH) {
      return {
        allowed: false,
        reason: 'Monthly limit reached. Upgrade to Pro for higher limits.'
      }
    }
    return { allowed: true }
  }

  // Pro plan - 15 articles per day
  if (normalizedQuota.plan === 'pro') {
    if (normalizedQuota.todayGenerations >= PRO_ARTICLES_PER_DAY) {
      return {
        allowed: false,
        reason: 'Daily limit reached (5 articles). Resets at midnight.'
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
  const currentWeekKey = getWeekKey(new Date())
  const priorWeekCount = resetQuota.lastWeekKey === currentWeekKey ? resetQuota.weekGenerations || 0 : 0

  return {
    ...resetQuota,
    todayGenerations: resetQuota.todayGenerations + 1,
    monthGenerations: resetQuota.monthGenerations + 1,
    weekGenerations: priorWeekCount + 1,
    lastWeekKey: currentWeekKey,
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
  if (!quota.lastArticleGenerated) {
    return {
      ...quota,
      lastWeekKey: quota.lastWeekKey || getWeekKey(new Date()),
      weekGenerations: quota.weekGenerations ?? 0,
    }
  }

  const lastGen = new Date(quota.lastArticleGenerated)
  const now = new Date()

  let updated = { ...quota }

  // Reset counters if a new day has started
  if (lastGen.toDateString() !== now.toDateString()) {
    updated.todayGenerations = 0
    // Reset tool usage daily for all plans (backend enforces per-day limits)
    updated.toolsToday = 0
  }

  // Reset weekly counters if we are in a new week
  const lastWeekKey = quota.lastWeekKey || getWeekKey(lastGen)
  const currentWeekKey = getWeekKey(now)
  if (lastWeekKey !== currentWeekKey) {
    updated.weekGenerations = 0
    updated.lastWeekKey = currentWeekKey
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
    articlesPerWeek: newPlan === 'pro' ? 0 : FREE_ARTICLES_PER_WEEK,
    toolsPerDay: newPlan === 'pro' ? PRO_TOOLS_PER_DAY : FREE_TOOLS_PER_DAY
  }
}

// Get remaining quota display
export function getRemainingQuota(quota: QuotaLimits): string {
  if (quota.plan === 'free') {
    const weekKey = getWeekKey(new Date())
    const usedThisWeek = quota.lastWeekKey === weekKey ? quota.weekGenerations || 0 : 0
    const remainingWeek = FREE_ARTICLES_PER_WEEK - usedThisWeek
    return `${remainingWeek} of ${FREE_ARTICLES_PER_WEEK} drafts left this week`
  }

  const remaining = PRO_ARTICLES_PER_DAY - quota.todayGenerations
  return `${remaining}/${PRO_ARTICLES_PER_DAY} articles left today`
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
