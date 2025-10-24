import "./../styles/globals.css"
import type { Metadata } from "next"
import { ReactNode } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "SEOScribe — Article Writer & AI Writing Tool",
  description: "Long-form SEO articles with citations, images, and on-page SEO.",
  metadataBase: new URL("https://seoscribe.pro")
}
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
