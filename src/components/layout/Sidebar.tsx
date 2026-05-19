"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { signOut, useSession } from "next-auth/react"
import {
  Atom, LayoutDashboard, Bot, Flame, Focus, Headphones,
  BookOpen, Brain, Archive, Wind, Trophy, Settings2,
  ChevronLeft, ChevronRight, Sparkles, TrendingUp, LogOut
} from "lucide-react"
import Image from "next/image"

const NAV = [
  { href:"/dashboard",        label:"الرئيسية",        Icon:LayoutDashboard },
  { href:"/dashboard/coach",  label:"المدرب الذكي",     Icon:Bot             },
  { href:"/dashboard/habits", label:"العادات",           Icon:Flame           },
  { href:"/dashboard/focus",  label:"التركيز",           Icon:Focus           },
  { href:"/dashboard/audio",  label:"الكتب الصوتية",    Icon:Headphones      },
  { href:"/dashboard/learn",  label:"التعلم",            Icon:BookOpen        },
  { href:"/dashboard/mind",   label:"خريطة العقل",       Icon:Brain           },
  { href:"/dashboard/vault",  label:"خزنة الذاكرة",      Icon:Archive         },
  { href:"/dashboard/clarity",label:"الصفاء الذهني",     Icon:Wind            },
  { href:"/dashboard/achieve",label:"الإنجازات",         Icon:Trophy          },
  { href:"/dashboard/settings",label:"الإعدادات",        Icon:Settings2       },
]

export default function Sidebar({ score = 0 }: { score?: number }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 228 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{
        height: "100vh", background: "#090d18", flexShrink: 0,
        borderLeft: "1px solid rgba(255,255,255,0.06)",
        display: "flex", flexDirection: "column", overflow: "hidden",
        position: "sticky", top: 0,
      }}>

      {/* Logo row */}
      <div style={{ padding: "18px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: 10 }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ width: 36, height: 36, borderRadius: 12, flexShrink: 0,
            background: "linear-gradient(135deg,#6366f1,#ec4899)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}>
          <Atom size={17} color="#fff" strokeWidth={1.8}/>
        </motion.div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14.5, color: "#f0f4ff" }}>HumanOS</div>
              <div style={{ color: "#3d4f72", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase" }}>نظام الحياة الذكي</div>
            </motion.div>
          )}
        </AnimatePresence>

        <button onClick={() => setCollapsed(!collapsed)}
          style={{ background: "none", border: "none", color: "#3d4f72", cursor: "pointer",
            padding: 4, borderRadius: 8, display: "flex", flexShrink: 0,
            transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#f0f4ff")}
          onMouseLeave={e => (e.currentTarget.style.color = "#3d4f72")}>
          {collapsed ? <ChevronLeft size={15}/> : <ChevronRight size={15}/>}
        </button>
      </div>

      {/* Score chip */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} style={{ padding: "12px" }}>
            <div style={{
              background: "linear-gradient(135deg,rgba(99,102,241,0.1),rgba(236,72,153,0.05))",
              border: "1px solid rgba(99,102,241,0.18)", borderRadius: 14, padding: "12px 14px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ color: "#8b9cc8", fontSize: 11 }}>نقاط اليوم</span>
                <Sparkles size={12} color="#6366f1"/>
              </div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800,
                color: "#f0f4ff", letterSpacing: "-1px", lineHeight: 1 }}>
                {score}<span style={{ color: "#3d4f72", fontSize: 13, fontWeight: 400 }}>/100</span>
              </div>
              <div style={{ margin: "7px 0 5px", background: "rgba(255,255,255,0.06)", borderRadius: 99, height: 3, overflow: "hidden" }}>
                <motion.div animate={{ width: `${score}%` }} transition={{ duration: 1, ease: "easeOut" }}
                  style={{ height: "100%", background: "linear-gradient(90deg,#6366f1,#ec4899)", borderRadius: 99 }}/>
              </div>
              <div style={{ color: "#10b981", fontSize: 10.5, display: "flex", alignItems: "center", gap: 3 }}>
                <TrendingUp size={10}/> يعكس أداءك الفعلي اليوم
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: "4px 8px", display: "flex", flexDirection: "column", gap: 1, overflowY: "auto" }}>
        {NAV.map(({ href, label, Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
          return (
            <Link key={href} href={href}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 12,
                textDecoration: "none", fontSize: 13, fontWeight: active ? 600 : 500,
                color: active ? "#6366f1" : "#8b9cc8",
                background: active ? "rgba(99,102,241,0.1)" : "transparent",
                borderRight: active ? "2px solid #6366f1" : "2px solid transparent",
                transition: "all 0.2s", whiteSpace: "nowrap",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.color = "#f0f4ff"; e.currentTarget.style.background = "rgba(255,255,255,0.04)" } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.color = "#8b9cc8"; e.currentTarget.style.background = "transparent" } }}>
              <Icon size={16} strokeWidth={1.8} style={{ flexShrink: 0 }}/>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: collapsed ? 0 : 9,
        justifyContent: collapsed ? "center" : "flex-start" }}>
        {session?.user?.image ? (
          <Image src={session.user.image} alt="avatar" width={32} height={32}
            style={{ borderRadius: 10, flexShrink: 0 }}/>
        ) : (
          <div style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0,
            background: "linear-gradient(135deg,#6366f1,#ec4899)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 13, fontWeight: 700 }}>
            {session?.user?.name?.charAt(0) || "م"}
          </div>
        )}
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: "#f0f4ff", fontSize: 12.5, fontWeight: 600,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {session?.user?.name || "مستخدم"}
              </div>
              <button onClick={() => signOut({ callbackUrl: "/" })}
                style={{ background: "none", border: "none", cursor: "pointer",
                  color: "#3d4f72", fontSize: 11, display: "flex", alignItems: "center", gap: 3,
                  fontFamily: "var(--font-arabic)", padding: 0, transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
                onMouseLeave={e => (e.currentTarget.style.color = "#3d4f72")}>
                <LogOut size={11}/> تسجيل الخروج
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  )
}
