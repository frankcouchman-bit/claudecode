"use client"

import { motion } from "framer-motion"
import { TrendingUp, Eye, BarChart3, ArrowUp } from "lucide-react"

interface SEOMetric {
  label: string
  value: string
  change: string
  icon: React.ElementType
  color: string
}

export function SEOImprovementChart() {
  const metrics: SEOMetric[] = [
    {
      label: "Google Impressions",
      value: "+284%",
      change: "Last 30 days",
      icon: Eye,
      color: "from-blue-500 to-cyan-500"
    },
    {
      label: "Avg. Position",
      value: "#3.2",
      change: "Up from #12.8",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500"
    },
    {
      label: "Click-Through Rate",
      value: "+156%",
      change: "Above industry avg",
      icon: BarChart3,
      color: "from-purple-500 to-pink-500"
    }
  ]

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <div className="glass rounded-2xl p-6 border-2 hover:border-green-300 dark:hover:border-green-700 transition-all">
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${metric.color} mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-4xl font-bold gradient-text">{metric.value}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <ArrowUp className="w-3 h-3 text-green-500" />
                  {metric.change}
                </p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export function RankingProgressBar() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Your Ranking Progress</span>
        <span className="font-semibold text-green-600 dark:text-green-400">Page 1 of Google</span>
      </div>
      <div className="relative h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "85%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
        />
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute right-[15%] top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-gray-900 rounded-full border-4 border-green-500 shadow-lg"
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Position #50</span>
        <span>Position #10</span>
        <span className="font-semibold text-green-600 dark:text-green-400">Position #3</span>
      </div>
    </div>
  )
}

export function TrafficGrowthGraph() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  const heights = [20, 35, 45, 60, 75, 90]

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div>
        <h3 className="font-semibold text-lg mb-1">Organic Traffic Growth</h3>
        <p className="text-sm text-muted-foreground">After implementing SEOScribe content</p>
      </div>
      <div className="flex items-end justify-between h-48 gap-2">
        {months.map((month, index) => (
          <div key={month} className="flex-1 flex flex-col items-center gap-2">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: `${heights[index]}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="w-full bg-gradient-to-t from-purple-600 to-pink-600 rounded-t-lg relative group"
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {Math.round((heights[index] / 100) * 5000)} visits
                </div>
              </div>
            </motion.div>
            <span className="text-xs text-muted-foreground">{month}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-4 border-t">
        <div>
          <p className="text-2xl font-bold gradient-text">+284%</p>
          <p className="text-xs text-muted-foreground">Total growth</p>
        </div>
        <div>
          <p className="text-2xl font-bold">4.5K</p>
          <p className="text-xs text-muted-foreground">Monthly visitors</p>
        </div>
      </div>
    </div>
  )
}
