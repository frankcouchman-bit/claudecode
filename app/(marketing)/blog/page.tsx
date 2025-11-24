import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"

export default function BlogIndexPage() {
  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <div className="container py-16 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm border text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>SEOScribe Blog</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">We’re rebuilding our blog experience</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            The previous articles were removed so we can relaunch with fresh, research-backed guides that match the quality of the generator. Check back soon for long-form, citation-rich content.
          </p>
        </div>

        <Card className="border-2 border-dashed border-purple-200 dark:border-purple-900/60">
          <CardHeader>
            <CardTitle>New articles are on the way</CardTitle>
            <CardDescription>
              We’re curating competitive analyses, SERP deconstructions, and interlinking maps. In the meantime, generate and export full drafts directly from the writer.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Badge variant="outline">No posts published yet</Badge>
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">Relaunching soon</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
