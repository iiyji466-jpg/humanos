"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Sidebar from "@/components/layout/Sidebar"
import Topbar from "@/components/layout/Topbar"
import { usePathname } from "next/navigation"

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "الرئيسية",
  "/dashboard/coach": "المدرب الذكي",
  "/dashboard/habits": "العادات",
  "/dashboard/focus": "التركيز",
  "/dashboard/audio": "الكتب الصوتية",
  "/dashboard/learn": "التعلم",
  "/dashboard/mind": "خريطة العقل",
  "/dashboard/vault": "خزنة الذاكرة",
  "/dashboard/clarity": "الصفاء الذهني",
  "/dashboard/achieve": "الإنجازات",
  "/dashboard/settings": "الإعدادات",
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth")
  }, [status])

  useEffect(() => {
    // Calculate score from localStorage habits cache
    try {
      const h = JSON.parse(localStorage.getItem("humanos_habits") || "[]")
      const done = h.filter((x: any) => x.doneToday).length
      const total = h.length || 1
      setScore(Math.min(100, Math.round((done / total) * 50 + (h.reduce((a: number, x: any) => a + x.rate, 0) / total) * 0.3 + 20)))
    } catch {}
  }, [pathname])

  if (status === "loading") return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#050810" }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%",
        border: "3px solid rgba(99,102,241,0.2)", borderTopColor: "#6366f1",
        animation: "spin 1s linear infinite" }}/>
    </div>
  )

  if (!session) return null

  const title = PAGE_TITLES[pathname] || "HumanOS"

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw",
      overflow: "hidden", direction: "rtl", background: "#050810" }}>
      <Sidebar score={score}/>
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
        {/* Ambient orbs */}
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%",
          top: -150, right: -150, opacity: 0.3, pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(circle,rgba(99,102,241,0.2),transparent 70%)", filter: "blur(80px)" }}/>
        <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%",
          bottom: -100, left: -80, opacity: 0.2, pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(circle,rgba(236,72,153,0.15),transparent 70%)", filter: "blur(60px)" }}/>

        <Topbar title={title}/>
        <div style={{ flex: 1, overflow: "hidden", padding: "22px 26px", position: "relative", zIndex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  )
}
