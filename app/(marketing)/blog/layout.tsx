export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      {children}
    </div>
  )
}
