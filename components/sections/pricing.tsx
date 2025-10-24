import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
export function Pricing() {
  return (
    <section className="container py-16">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>1 demo article / month</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• 1 demo article (no signup)</li>
              <li>• Basic research</li>
              <li>• Export to Markdown</li>
            </ul>
          </CardContent>
          <CardFooter><Button variant="outline">Try Demo</Button></CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pro — $24/mo</CardTitle>
            <CardDescription>Everything unlocked</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• 15 articles / day</li>
              <li>• All SEO tools</li>
              <li>• Images & citations</li>
            </ul>
          </CardContent>
          <CardFooter><Button>Upgrade</Button></CardFooter>
        </Card>
      </div>
    </section>
  )
}
