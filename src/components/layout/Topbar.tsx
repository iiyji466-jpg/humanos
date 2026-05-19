"use client"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Moon, Zap, Bell, Bot, Sparkles } from "lucide-react"

interface TopbarProps {
  title: string
  focusSessions?: number
  onNightReflect?: () => void
}

export default function Topbar({ title, focusSessions = 0, onNightReflect }: TopbarProps) {
  const { data: session } = useSession()
  const [notifOpen, setNotifOpen] = useState(false)
  const hour = new Date().getHours()
  const isNight = hour >= 20 || hour < 6

  return (
    <header style={{
      height: 56, flexShrink: 0, padding: "0 26px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: "rgba(5,8,16,0.85)", backdropFilter: "blur(24px)",
      borderBottom: "1px solid rgba(255,255,255,0.05)", position: "relative", zIndex: 40,
    }}>
      <div style={{ color: "#8b9cc8", fontSize: 13, fontWeight: 500 }}>{title}</div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Night reflection */}
        {isNight && onNightReflect && (
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={onNightReflect}
            style={{
              background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)",
              borderRadius: 10, padding: "6px 12px", color: "#8b5cf6", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 5, fontSize: 12,
              fontFamily: "var(--font-arabic)",
            }}>
            <Moon size={13}/> تأمل الليل
          </motion.button>
        )}

        {/* Focus sessions badge */}
        {focusSessions > 0 && (
          <div style={{
            background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)",
            borderRadius: 10, padding: "5px 11px",
            display: "flex", alignItems: "center", gap: 5,
          }}>
            <Zap size={12} color="#6366f1"/>
            <span style={{ color: "#6366f1", fontSize: 11.5, fontWeight: 600 }}>{focusSessions} جلسة</span>
          </div>
        )}

        {/* AI status */}
        <div style={{
          background: "#0f1623", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 10, padding: "6px 12px",
          display: "flex", alignItems: "center", gap: 5,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981",
            display: "inline-block", animation: "pulse-dot 2s infinite" }}/>
          <span style={{ color: "#8b9cc8", fontSize: 11.5 }}>Claude AI</span>
        </div>

        {/* Notifications */}
        <button onClick={() => setNotifOpen(!notifOpen)} style={{
          width: 34, height: 34, borderRadius: 10, background: "#0f1623",
          border: "1px solid rgba(255,255,255,0.06)", display: "flex",
          alignItems: "center", justifyContent: "center", cursor: "pointer",
          position: "relative",
        }}>
          <Bell size={15} color="#8b9cc8" strokeWidth={1.8}/>
          <span style={{ position: "absolute", top: 7, right: 7, width: 6, height: 6,
            borderRadius: "50%", background: "#ef4444", border: "1.5px solid #050810" }}/>
        </button>

        {/* Avatar */}
        <div style={{ width: 32, height: 32, borderRadius: 10,
          background: "linear-gradient(135deg,#6366f1,#ec4899)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          {session?.user?.name?.charAt(0) || "م"}
        </div>
      </div>
    </header>
  )
}
