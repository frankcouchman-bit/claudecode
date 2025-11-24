import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Lightbulb, ListChecks, Megaphone, RefreshCw, Target } from "lucide-react"

interface SEOAppendixProps {
  topic: string
}

export function SEOAppendix({ topic }: SEOAppendixProps) {
  return (
    <Card className="border-2 border-green-200 dark:border-green-900/40 bg-gradient-to-br from-white to-green-50/60 dark:from-slate-950 dark:to-green-900/20 mt-12">
      <CardContent className="space-y-6 p-8">
        <div className="flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-green-600" />
          <p className="text-xs uppercase tracking-wide text-green-700 dark:text-green-200">Evergreen SEO Expansion</p>
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Turn this guide into a 5x deeper pillar</h2>
          <p className="text-muted-foreground leading-relaxed">
            Use the following blueprint to stretch your {topic} article into a 3,000–5,000 word authority piece. Each block adds depth, trust signals, and conversion opportunities without fluff.
          </p>
        </div>

        <div className="space-y-5">
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Target className="h-4 w-4 text-green-600" />
              <span>Search intent + topical map</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Start with a problem-first hook, then map the exact questions searchers ask. Add subsections for intent variants (informational, commercial, navigational) and cluster supporting keywords. Include two to three SERP-inspired comparisons and define success criteria readers can measure.
            </p>
          </section>

          <section className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <span>Research narrative</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Add original angles: quote data sources, list evaluation frameworks, and describe the methodology behind your recommendations. Contrast outdated tactics with modern best practices, then layer in short examples or mini case studies that show the before/after impact of applying this guide.
            </p>
          </section>

          <section className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Megaphone className="h-4 w-4 text-blue-500" />
              <span>Distribution + repurposing</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Outline a promotion plan: social snippets, newsletter angles, and community posts. Add an internal linking map pointing to adjacent SEOScribe guides. Provide copy-and-paste CTAs for demos, plus a checklist for turning the post into slides, short videos, and podcast talking points.
            </p>
          </section>

          <section className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <RefreshCw className="h-4 w-4 text-purple-600" />
              <span>Refresh + QA cadence</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Set a 90-day refresh loop. Include a changelog table, highlight what metrics to re-evaluate (CTR, dwell time, conversions), and specify which sections to expand with new data or screenshots. Add an accessibility and factual accuracy checklist so updates stay trustworthy.
            </p>
          </section>

          <section className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ListChecks className="h-4 w-4 text-emerald-600" />
              <span>Conversion accelerators</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Insert comparison tables, buyer-fit quizzes, and downloadable templates. Place CTAs after high-intent sections, and add a mini onboarding path (demo → outline → full article) so readers can lengthen AI drafts to the maximum allowed by their plan without friction.
            </p>
          </section>
        </div>

        <Separator />
        <p className="text-sm text-muted-foreground leading-relaxed">
          Save this appendix as a reusable checklist for every article you publish. Pro users can automate most of it by generating extended outlines (5,000+ words) directly from the dashboard; demo users can still repurpose it to stretch their free drafts responsibly.
        </p>
      </CardContent>
    </Card>
  )
}
