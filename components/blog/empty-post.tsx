import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function EmptyPost({ title }: { title: string }) {
  return (
    <div className="container py-16 space-y-8">
      <div className="space-y-3">
        <Badge variant="outline">Blog relaunch</Badge>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">{title}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          We retired the old article while we rebuild the blog with fresher research, stronger citations, and polished visuals. Use the writer to generate a ready-to-publish version now.
        </p>
      </div>

      <Card className="border-2 border-dashed border-purple-200 dark:border-purple-900/60">
        <CardHeader>
          <CardTitle>Generate this guide instantly</CardTitle>
          <CardDescription>
            Enter the topic inside the Article Writer and you’ll get a long-form, SEO-checked draft with FAQs, citations, and internal link prompts tailored to your site.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/article-writer">
            <Button className="gradient-btn text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Open Article Writer
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline">See plan limits</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
