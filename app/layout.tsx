import "./../styles/globals.css"
import type { Metadata } from "next"
import { ReactNode } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { QuotaProvider } from "@/contexts/quota-context"
import { ClientQuotaDisplay } from "@/components/client-quota-display"

export const metadata: Metadata = {
  title: "SEOScribe — Article Writer & AI Writing Tool",
  description: "Long-form SEO articles with citations, images, and on-page SEO.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://seoscribe.com")
}
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QuotaProvider>
          <Header />
          <ClientQuotaDisplay />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
        </QuotaProvider>
      </body>
    </html>
  )
}
