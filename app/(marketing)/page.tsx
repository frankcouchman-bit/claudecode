import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Hero } from "@/components/sections/hero"
import { Logos } from "@/components/sections/logos"
import { Features } from "@/components/sections/features"
import { Pricing } from "@/components/sections/pricing"
export default function Page() {
  return (
    <div>
      <Hero />
      <Logos />
      <Features />
      <div className="container py-16">
        <div className="flex justify-center gap-4">
          <Link href="/pricing"><Button size="lg">See Pricing</Button></Link>
          <Link href="/article-writer"><Button variant="outline" size="lg">Try Demo</Button></Link>
        </div>
      </div>
      <Pricing />
    </div>
  )
}
