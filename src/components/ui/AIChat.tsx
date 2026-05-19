"use client"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, Send, Mic, RotateCcw, Sparkles, RefreshCw } from "lucide-react"
import { useAI } from "@/hooks/useAI"

const PERSONAS: Record<string, { label: string; color: string }> = {
  calm:    { label: "المدرب الهادئ",    color: "#10b981" },
  strict:  { label: "المرشد الصارم",    color: "#ef4444" },
  friendly:{ label: "الصديق المساعد",  color: "#f59e0b" },
  thinker: { label: "المفكر العميق",    color: "#8b5cf6" },
}

interface Message { role: "user" | "assistant"; text: string; ts?: number }

interface AIChatProps {
  compact?: boolean
  persona?: string
  systemExtra?: string
  placeholder?: string
  initialMessage?: string
}

export default function AIChat({
  compact = false,
  persona = "calm",
  systemExtra = "",
  placeholder = "اكتب رسالتك...",
  initialMessage = "مرحباً! 🌟 أنا مدربك الذكي. كيف يمكنني مساعدتك اليوم؟",
}: AIChatProps) {
  const { ask, loading } = useAI()
  const [msgs, setMsgs] = useState<Message[]>([{ role: "assistant", text: initialMessage, ts: Date.now() }])
  const [val, setVal] = useState("")
  const [listening, setListening] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const p = PERSONAS[persona] || PERSONAS.calm

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }) }, [msgs, loading])

  const send = async () => {
    if (!val.trim() || loading) return
    const text = val.trim(); setVal("")
    const newMsgs: Message[] = [...msgs, { role: "user", text, ts: Date.now() }]
    setMsgs(newMsgs)
    const apiMsgs = newMsgs.map(m => ({ role: m.role === "assistant" ? "assistant" as const : "user" as const, content: m.text }))
    const reply = await ask(apiMsgs, systemExtra)
    if (reply) setMsgs(m => [...m, { role: "assistant", text: reply, ts: Date.now() }])
  }

  const startVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return
    recognitionRef.current = new SR()
    recognitionRef.current.lang = "ar-SA"
    recognitionRef.current.onresult = (e: any) => { setVal(e.results[0][0].transcript); setListening(false) }
    recognitionRef.current.onerror = () => setListening(false)
    recognitionRef.current.onend = () => setListening(false)
    recognitionRef.current.start(); setListening(true)
  }

  const clearChat = () => setMsgs([{ role: "assistant", text: initialMessage, ts: Date.now() }])

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      background: "#0f1623", border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 20, overflow: "hidden",
      ...(compact ? { width: 288, flexShrink: 0 } : {}),
    }}>
      {/* Header */}
      <div style={{ padding: "13px 15px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ position: "relative" }}>
          <motion.div animate={{ boxShadow: ["0 0 10px rgba(99,102,241,0.3)","0 0 25px rgba(99,102,241,0.5)","0 0 10px rgba(99,102,241,0.3)"] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ width: 36, height: 36, borderRadius: 12,
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bot size={17} color="#fff" strokeWidth={1.8}/>
          </motion.div>
          <span style={{ position: "absolute", bottom: 0, left: 0, width: 9, height: 9,
            borderRadius: "50%", background: "#10b981", border: "2px solid #0f1623" }}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#f0f4ff", fontWeight: 600, fontSize: 13.5 }}>{p.label}</div>
          <div style={{ color: "#10b981", fontSize: 10.5, display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
            <span className="animate-pulse-dot" style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981", display: "inline-block" }}/>
            Claude AI • نشط
          </div>
        </div>
        <button onClick={clearChat} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 8, padding: "5px 10px", color: "#8b9cc8", cursor: "pointer", fontSize: 11,
          display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--font-arabic)" }}>
          <RotateCcw size={11}/> مسح
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 10 }}>
        <AnimatePresence initial={false}>
          {msgs.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", justifyContent: m.role === "user" ? "flex-start" : "flex-end",
                gap: 8, alignItems: "flex-end" }}>
              {m.role === "assistant" && (
                <div style={{ width: 26, height: 26, borderRadius: 9, flexShrink: 0,
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Bot size={13} color="#fff" strokeWidth={2}/>
                </div>
              )}
              <div style={{
                maxWidth: "84%", padding: "10px 14px",
                borderRadius: m.role === "user" ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
                background: m.role === "user"
                  ? "rgba(255,255,255,0.05)"
                  : "linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.06))",
                border: `1px solid ${m.role === "assistant" ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.06)"}`,
                color: "#f0f4ff", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap",
                boxShadow: m.role === "assistant" ? "0 4px 20px rgba(99,102,241,0.1)" : "none",
              }}>{m.text}</div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ display: "flex", justifyContent: "flex-end", gap: 8, alignItems: "flex-end" }}>
            <div style={{ width: 26, height: 26, borderRadius: 9,
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bot size={13} color="#fff" strokeWidth={2}/>
            </div>
            <div style={{ padding: "12px 16px", borderRadius: "16px 16px 4px 16px",
              background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)",
              display: "flex", gap: 5 }}>
              {[0,1,2].map(i => (
                <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#6366f1",
                  display: "block", animation: `dot-bounce 1.2s ${i*0.2}s infinite` }}/>
              ))}
            </div>
          </motion.div>
        )}
        <div ref={endRef}/>
      </div>

      {/* Input */}
      <div style={{ padding: "10px 12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", gap: 7, alignItems: "center",
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 13, padding: "7px 9px" }}>
          <button onClick={startVoice} style={{ background: "none", border: "none", cursor: "pointer",
            color: listening ? "#ef4444" : "#3d4f72", display: "flex", padding: 4, flexShrink: 0,
            transition: "color 0.2s" }}>
            <Mic size={15}/>
          </button>
          <input value={val} onChange={e => setVal(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            placeholder={placeholder} disabled={loading}
            style={{ flex: 1, background: "transparent", border: "none", color: "#f0f4ff",
              fontSize: 13, outline: "none", textAlign: "right", fontFamily: "var(--font-arabic)" }}/>
          <motion.button whileTap={{ scale: 0.9 }} onClick={send}
            disabled={loading || !val.trim()}
            style={{ width: 32, height: 32, borderRadius: 9, flexShrink: 0,
              background: val.trim() ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,0.05)",
              border: "none", cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", transition: "all 0.2s",
              boxShadow: val.trim() ? "0 0 12px rgba(99,102,241,0.3)" : "none" }}>
            {loading
              ? <RefreshCw size={13} color="#8b9cc8" style={{ animation: "spin 1s linear infinite" }}/>
              : <Send size={14} color={val.trim() ? "#fff" : "#3d4f72"} strokeWidth={2}/>}
          </motion.button>
        </div>
        <div style={{ color: "#3d4f72", fontSize: 9.5, textAlign: "center", marginTop: 4 }}>
          مدعوم بـ Claude AI (Anthropic)
        </div>
      </div>
    </div>
  )
}
