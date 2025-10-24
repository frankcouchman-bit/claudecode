'use client'
import { useEffect, useState } from "react"
import Link from "next/link"
import { captureTokensFromURL, isAuthed, clearTokens } from "@/lib/auth"
import { getProfile, listArticles, createCheckout, openPortal } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  FileText,
  TrendingUp,
  Zap,
  BarChart3,
  Calendar,
  Crown,
  LogOut,
  CreditCard,
  ArrowUpRight
} from "lucide-react"

export default function Page(){
  const [authed,setAuthed]=useState(false)
  const [loading,setLoading]=useState(true)
  const [profile,setProfile]=useState<any>(null)
  const [articles,setArticles]=useState<any[]>([])
  const [err,setErr]=useState<string|null>(null)

  useEffect(()=>{
    captureTokensFromURL()
    const a=isAuthed()
    setAuthed(a)
    if(!a){ setLoading(false) }
  },[])

  useEffect(()=>{
    (async ()=>{
      if(!authed){ return }
      setErr(null)
      try{
        const p=await getProfile()
        setProfile(p)
        const rows=await listArticles()
        setArticles(rows||[])
      }catch(e:any){
        setErr(e?.message||'Failed')
      } finally{
        setLoading(false)
      }
    })()
  },[authed])

  async function upgrade(){
    try{
      const {url}=await createCheckout(
        window.location.origin+'/dashboard?upgrade=success',
        window.location.origin+'/dashboard?upgrade=cancel'
      )
      window.location.href=url
    }catch(e:any){
      alert(e?.message||'Checkout failed')
    }
  }

  async function portal(){
    try{
      const {url}=await openPortal(window.location.origin+'/dashboard')
      window.location.href=url
    }catch(e:any){
      alert(e?.message||'Portal failed')
    }
  }

  if(loading) {
    return (
      <div className="container py-10 space-y-8">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map(i => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if(!authed) {
    return (
      <div className="container py-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 mb-6">
            <LogOut className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome to Your Dashboard</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Sign in to access your articles, analytics, and more.
          </p>
          <Link href="/auth">
            <Button size="lg" className="gradient-btn text-white">
              Sign In
              <ArrowUpRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const isPro = profile?.plan === 'pro'
  const todayGens = profile?.usage?.today?.generations ?? 0
  const monthGens = profile?.usage?.month?.generations ?? 0
  const toolsToday = profile?.tools_today ?? 0
  const toolLimit = profile?.tool_limit_daily ?? 0

  return (
    <div className="container py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your content overview.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={portal}>
            <CreditCard className="mr-2 h-4 w-4" />
            Manage Billing
          </Button>
          {!isPro && (
            <Button onClick={upgrade} className="gradient-btn text-white">
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to Pro
            </Button>
          )}
          <Button variant="ghost" onClick={clearTokens}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {err && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200">
          {err}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Plan Status
            </CardTitle>
            <Crown className={`h-5 w-5 ${isPro ? 'text-yellow-500' : 'text-gray-400'}`} />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold capitalize">{profile?.plan || 'Free'}</div>
              {isPro && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                  PRO
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isPro ? 'Unlimited access' : 'Limited features'}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Articles Created
            </CardTitle>
            <FileText className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div>
            <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>Total articles</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's Generations
            </CardTitle>
            <Zap className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayGens}</div>
            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5 mt-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-1.5 rounded-full transition-all"
                style={{ width: `${isPro ? 100 : Math.min((todayGens / 5) * 100, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Usage
            </CardTitle>
            <BarChart3 className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthGens}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Generations this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Your Articles</CardTitle>
          <CardDescription>
            Manage and track all your generated content
          </CardDescription>
        </CardHeader>
        <CardContent>
          {articles.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No articles yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first article
              </p>
              <Link href="/article-writer">
                <Button className="gradient-btn text-white">
                  Create Article
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Title</th>
                    <th className="text-left p-4 font-semibold">Updated</th>
                    <th className="text-left p-4 font-semibold">Words</th>
                    <th className="text-left p-4 font-semibold">SEO Score</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article:any) => (
                    <tr key={article.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-4 font-medium">{article.title}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {new Date(article.updated_at||article.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4 text-sm">{article.word_count?.toLocaleString() ?? '-'}</td>
                      <td className="p-4">
                        {article.seo_score ? (
                          <Badge variant={article.seo_score >= 80 ? "success" : article.seo_score >= 60 ? "warning" : "destructive"}>
                            {article.seo_score}/100
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="capitalize">
                          {article.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
