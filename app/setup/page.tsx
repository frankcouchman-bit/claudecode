import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "Setup Required | SEOScribe",
  description: "Complete authentication setup to start using SEOScribe",
}

export default function SetupPage() {
  return (
    <div className="container max-w-4xl py-12">
      <Card className="border-2 border-yellow-500">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-yellow-600" />
            <div>
              <CardTitle className="text-2xl">Authentication Setup Required</CardTitle>
              <CardDescription>
                Your Supabase project needs to be created before users can sign in
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">Current Issue:</h3>
            <p className="text-sm text-red-700 dark:text-red-300">
              The backend is trying to connect to <code className="bg-red-100 dark:bg-red-900 px-1 rounded">https://cmkafqlajemsgxevxfkx.supabase.co</code> but this project doesn't exist.
            </p>
            <p className="text-sm text-red-700 dark:text-red-300 mt-2">
              Error: <code>DNS_PROBE_FINISHED_NXDOMAIN</code>
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">How to Fix (5 minutes):</h3>

            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h4 className="font-semibold">Create Supabase Account</h4>
                  <p className="text-sm text-muted-foreground">Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline inline-flex items-center gap-1">supabase.com <ExternalLink className="h-3 w-3" /></a> and sign up (free)</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h4 className="font-semibold">Create New Project</h4>
                  <p className="text-sm text-muted-foreground">Click "New Project" and give it a name (e.g., "SEOScribe")</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h4 className="font-semibold">Copy Project URL</h4>
                  <p className="text-sm text-muted-foreground">Go to Settings → API → Copy the "Project URL" (looks like: https://xxx.supabase.co)</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <h4 className="font-semibold">Update Cloudflare Worker</h4>
                  <p className="text-sm text-muted-foreground">In your Cloudflare Worker, update these environment variables:</p>
                  <ul className="text-xs space-y-1 mt-2 font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <li>SUPABASE_URL = [your project URL]</li>
                    <li>SUPABASE_ANON_KEY = [from Settings → API → anon public]</li>
                    <li>SUPABASE_SERVICE_KEY = [from Settings → API → service_role secret]</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">5</div>
                <div>
                  <h4 className="font-semibold">Enable Google OAuth (Optional)</h4>
                  <p className="text-sm text-muted-foreground">In Supabase: Authentication → Providers → Enable Google</p>
                  <p className="text-xs text-muted-foreground mt-1">You'll need Google Cloud Console credentials</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold"><CheckCircle2 className="h-4 w-4" /></div>
                <div>
                  <h4 className="font-semibold">Done!</h4>
                  <p className="text-sm text-muted-foreground">Users can now sign in with email magic link (and Google if configured)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Alternative: Email/Password Auth</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              If you want users to create accounts with email and password instead of Supabase OAuth,
              I can add that to your backend. This requires modifying the Cloudflare Worker to add
              /auth/signup and /auth/login endpoints.
            </p>
          </div>

          <div className="flex gap-3">
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full">
                I'll Set Up Later
              </Button>
            </Link>
            <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button className="w-full gradient-btn text-white">
                Create Supabase Project
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
