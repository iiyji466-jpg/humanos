import type { Metadata } from "next"
import { IBM_Plex_Sans_Arabic } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Toaster } from "react-hot-toast"

const ibm = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300","400","500","600","700"],
  variable: "--font-arabic",
})

export const metadata: Metadata = {
  title: "HumanOS AI — نظام الحياة الذكي",
  description: "نظام تشغيل حياتك المدعوم بالذكاء الاصطناعي. بناء العادات، التركيز، التعلم، والنمو الشخصي.",
  keywords: ["ذكاء اصطناعي", "عادات", "إنتاجية", "تطوير ذات", "AI coach"],
  openGraph: {
    title: "HumanOS AI",
    description: "نظام تشغيل حياتك المدعوم بالذكاء الاصطناعي",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      </head>
      <body className={`${ibm.variable} font-arabic antialiased`}>
        <Providers>
          {children}
          <Toaster position="bottom-right" toastOptions={{
            style: { background:"#0f1623", color:"#f0f4ff", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"12px", fontSize:"13px" }
          }}/>
        </Providers>
      </body>
    </html>
  )
}
