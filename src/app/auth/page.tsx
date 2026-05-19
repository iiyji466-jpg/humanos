"use client"
import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Atom, Eye, EyeOff, LogIn, UserPlus, Send, ChevronRight,
  AlertCircle, CheckCircle2, RefreshCw, Lock, Mail, User,
  Sparkles, ArrowRight, Shield, Zap, Star
} from "lucide-react"

export default function AuthPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [mode, setMode] = useState<"login"|"signup"|"forgot">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => { if (session) router.push("/dashboard") }, [session])

  const handleGoogle = async () => {
    setSocialLoading("google")
    await signIn("google", { callbackUrl: "/dashboard" })
  }

  const handleSubmit = async () => {
    setError(""); setSuccess("")
    if (!email) { setError("أدخل البريد الإلكتروني"); return }
    if (mode !== "forgot" && password.length < 6) { setError("كلمة المرور ٦ أحرف على الأقل"); return }
    if (mode === "signup" && !name) { setError("أدخل اسمك"); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    if (mode === "forgot") { setSuccess("تم إرسال رابط الاستعادة ✅"); setLoading(false); return }
    // For demo — in prod connect to credentials provider
    setError("استخدم تسجيل الدخول بـ Google حالياً")
    setLoading(false)
  }

  const features = [
    { icon: "🤖", text: "مدرب AI يتذكرك" },
    { icon: "🔥", text: "تتبع العادات" },
    { icon: "⚡", text: "جلسات التركيز" },
    { icon: "📚", text: "كتب صوتية ذكية" },
  ]

  return (
    <div className="min-h-screen flex" style={{ background: "#050810", direction: "rtl" }}>
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center relative overflow-hidden p-10"
        style={{ background: "linear-gradient(135deg,#090d18,#0f1623)", borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
        
        {/* Orbs */}
        <div className="absolute w-96 h-96 rounded-full -top-20 -right-20 opacity-40"
          style={{ background: "radial-gradient(circle,rgba(99,102,241,0.3),transparent 70%)", filter: "blur(60px)" }}/>
        <div className="absolute w-72 h-72 rounded-full -bottom-10 -left-10 opacity-30"
          style={{ background: "radial-gradient(circle,rgba(236,72,153,0.2),transparent 70%)", filter: "blur(50px)" }}/>

        {/* Floating feature cards */}
        <div className="relative w-full max-w-sm">
          {[
            { icon:"🔥", title:"٣٤ يوم سلسلة", sub:"المشي المسائي", delay:0, y:-20 },
            { icon:"⚡", title:"نقاط اليوم: ٨٧", sub:"أعلى بـ ١٢ عن أمس", delay:0.3, y:60 },
            { icon:"🧠", title:"تحليل سلوكي", sub:"AI اكتشف نمطاً جديداً", delay:0.6, y:140 },
          ].map((c, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0, y: [c.y, c.y - 6, c.y] }}
              transition={{ delay: c.delay, duration: 0.6, y: { duration: 3+i*0.5, repeat: Infinity, ease:"easeInOut" } }}
              style={{
                position: "absolute", right: i % 2 === 0 ? 0 : "auto", left: i % 2 !== 0 ? 0 : "auto",
                top: c.y, background: "#0f1623", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16, padding: "12px 16px", minWidth: 200,
              }}>
              <div className="flex items-center gap-3">
                <div className="text-2xl">{c.icon}</div>
                <div>
                  <div style={{ color:"#f0f4ff", fontWeight:600, fontSize:13 }}>{c.title}</div>
                  <div style={{ color:"#3d4f72", fontSize:11 }}>{c.sub}</div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Center orb */}
          <div className="flex flex-col items-center" style={{ marginTop: 280 }}>
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }}
              style={{
                width: 100, height: 100, borderRadius: "50%",
                background: "linear-gradient(135deg,#6366f1,#ec4899)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 60px rgba(99,102,241,0.4), 0 0 120px rgba(236,72,153,0.15)",
              }}>
              <Atom size={42} color="#fff" strokeWidth={1.5}/>
            </motion.div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800,
              color:"#f0f4ff", marginTop:20, letterSpacing:"-0.5px" }}>HumanOS AI</div>
            <div style={{ color:"#8b9cc8", fontSize:13, marginTop:6, textAlign:"center" }}>
              نظام تشغيل حياتك المدعوم بالذكاء الاصطناعي
            </div>
            <div className="flex gap-4 mt-6 flex-wrap justify-center">
              {features.map((f,i) => (
                <div key={i} className="flex items-center gap-2" style={{ color:"#3d4f72", fontSize:12 }}>
                  <span>{f.icon}</span><span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Auth form */}
      <div className="flex flex-col items-center justify-center w-full lg:w-[440px] flex-shrink-0 p-8 overflow-y-auto relative">
        <button onClick={() => router.push("/")}
          style={{ position:"absolute", top:20, right:20, background:"none", border:"none",
            color:"#3d4f72", display:"flex", alignItems:"center", gap:4, fontSize:13,
            transition:"color 0.2s", fontFamily:"var(--font-arabic)" }}
          onMouseEnter={e=>(e.currentTarget.style.color="#f0f4ff")}
          onMouseLeave={e=>(e.currentTarget.style.color="#3d4f72")}>
          <ChevronRight size={16}/> الرئيسية
        </button>

        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div style={{ width:42, height:42, borderRadius:13,
              background:"linear-gradient(135deg,#6366f1,#ec4899)",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 0 24px rgba(99,102,241,0.3)" }}>
              <Atom size={20} color="#fff"/>
            </div>
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:17, color:"#f0f4ff" }}>HumanOS</div>
              <div style={{ color:"#3d4f72", fontSize:10, letterSpacing:".1em", textTransform:"uppercase" }}>نظام الحياة الذكي</div>
            </div>
          </div>

          {/* Mode tabs */}
          <div style={{ display:"flex", background:"#0f1623", borderRadius:13, padding:4, marginBottom:28,
            border:"1px solid rgba(255,255,255,0.06)" }}>
            {[{id:"login",label:"تسجيل الدخول"},{id:"signup",label:"حساب جديد"}].map(m=>(
              <button key={m.id} onClick={()=>{setMode(m.id as any);setError("");setSuccess("")}}
                style={{
                  flex:1, padding:"9px", borderRadius:10, border:"none", cursor:"pointer",
                  background:mode===m.id?"#141d2e":"transparent",
                  color:mode===m.id?"#f0f4ff":"#3d4f72",
                  fontSize:13, fontWeight:mode===m.id?600:400, transition:"all 0.2s",
                  fontFamily:"var(--font-arabic)",
                  boxShadow:mode===m.id?"0 2px 8px rgba(0,0,0,0.4)":"none",
                }}>{m.label}</button>
            ))}
          </div>

          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:700,
            color:"#f0f4ff", marginBottom:5, letterSpacing:"-0.5px" }}>
            {mode==="login"?"مرحباً بعودتك 👋":mode==="signup"?"ابدأ رحلتك 🚀":"استعادة كلمة المرور 🔑"}
          </h2>
          <p style={{ color:"#8b9cc8", fontSize:13, marginBottom:24 }}>
            {mode==="login"?"سجّل دخولك للوصول لمدربك الذكي":
             mode==="signup"?"أنشئ حسابك مجاناً — بدون بطاقة ائتمان":
             "سنرسل لك رابط الاستعادة"}
          </p>

          {/* Errors / Success */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)",
                  borderRadius:10, padding:"10px 14px", marginBottom:16,
                  display:"flex", alignItems:"center", gap:7 }}>
                <AlertCircle size={14} color="#ef4444"/>
                <span style={{ color:"#ef4444", fontSize:12.5 }}>{error}</span>
              </motion.div>
            )}
            {success && (
              <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                style={{ background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.25)",
                  borderRadius:10, padding:"10px 14px", marginBottom:16,
                  display:"flex", alignItems:"center", gap:7 }}>
                <CheckCircle2 size={14} color="#10b981"/>
                <span style={{ color:"#10b981", fontSize:12.5 }}>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google login */}
          {mode !== "forgot" && (
            <>
              <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.99 }}
                onClick={handleGoogle} disabled={!!socialLoading}
                style={{
                  width:"100%", padding:"12px 16px", borderRadius:13,
                  background:"#141d2e", border:"1px solid rgba(255,255,255,0.08)",
                  color:"#f0f4ff", fontSize:13.5, fontWeight:500, cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                  fontFamily:"var(--font-arabic)", marginBottom:12, transition:"all 0.2s",
                }}>
                {socialLoading==="google"
                  ? <RefreshCw size={16} style={{animation:"spin 1s linear infinite"}}/>
                  : <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                }
                {socialLoading==="google" ? "جارٍ التوصيل..." : "المتابعة بحساب Google"}
              </motion.button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.06)" }}/>
                <span style={{ color:"#3d4f72", fontSize:11.5 }}>أو بالبريد الإلكتروني</span>
                <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.06)" }}/>
              </div>
            </>
          )}

          {/* Form */}
          <div className="flex flex-col gap-3 mb-5">
            {mode==="signup" && (
              <div style={{ position:"relative" }}>
                <User size={15} color="#3d4f72" style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)" }}/>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="الاسم الكامل"
                  style={{ width:"100%", background:"#0f1623", border:"1px solid rgba(255,255,255,0.06)",
                    borderRadius:12, padding:"11px 42px 11px 14px", color:"#f0f4ff", fontSize:13.5,
                    fontFamily:"var(--font-arabic)", transition:"border-color 0.2s" }}
                  onFocus={e=>e.target.style.borderColor="rgba(99,102,241,0.5)"}
                  onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.06)"}/>
              </div>
            )}
            <div style={{ position:"relative" }}>
              <Mail size={15} color="#3d4f72" style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)" }}/>
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="البريد الإلكتروني"
                style={{ width:"100%", background:"#0f1623", border:"1px solid rgba(255,255,255,0.06)",
                  borderRadius:12, padding:"11px 42px 11px 14px", color:"#f0f4ff", fontSize:13.5,
                  fontFamily:"var(--font-arabic)", transition:"border-color 0.2s" }}
                onFocus={e=>e.target.style.borderColor="rgba(99,102,241,0.5)"}
                onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.06)"}/>
            </div>
            {mode !== "forgot" && (
              <div style={{ position:"relative" }}>
                <Lock size={15} color="#3d4f72" style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)" }}/>
                <input value={password} onChange={e=>setPassword(e.target.value)}
                  type={showPass?"text":"password"} placeholder="كلمة المرور (٦+ أحرف)"
                  onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
                  style={{ width:"100%", background:"#0f1623", border:"1px solid rgba(255,255,255,0.06)",
                    borderRadius:12, padding:"11px 42px", color:"#f0f4ff", fontSize:13.5,
                    fontFamily:"var(--font-arabic)", transition:"border-color 0.2s" }}
                  onFocus={e=>e.target.style.borderColor="rgba(99,102,241,0.5)"}
                  onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.06)"}/>
                <button onClick={()=>setShowPass(!showPass)} style={{
                  position:"absolute", left:14, top:"50%", transform:"translateY(-50%)",
                  background:"none", border:"none", color:"#3d4f72" }}>
                  {showPass?<EyeOff size={15}/>:<Eye size={15}/>}
                </button>
                {mode==="login" && (
                  <button onClick={()=>setMode("forgot")} style={{
                    position:"absolute", left:0, bottom:-22, background:"none", border:"none",
                    color:"#6366f1", fontSize:12, fontFamily:"var(--font-arabic)" }}>
                    نسيت كلمة المرور؟
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Submit */}
          <motion.button whileHover={{ scale:1.01, y:-1 }} whileTap={{ scale:0.99 }}
            onClick={handleSubmit} disabled={loading}
            style={{
              width:"100%", marginTop:mode!=="forgot"?24:0, padding:"13px", borderRadius:13,
              background:"linear-gradient(135deg,#6366f1,#818cf8)", border:"none",
              color:"#fff", fontSize:14.5, fontWeight:700, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              boxShadow:"0 6px 24px rgba(99,102,241,0.3)", fontFamily:"var(--font-arabic)",
            }}>
            {loading ? <><RefreshCw size={16} style={{animation:"spin 1s linear infinite"}}/> جارٍ المعالجة...</>
              : mode==="login" ? <><LogIn size={16}/> تسجيل الدخول</>
              : mode==="signup" ? <><UserPlus size={16}/> إنشاء الحساب</>
              : <><Send size={16}/> إرسال رابط الاستعادة</>}
          </motion.button>

          {mode==="forgot" && (
            <button onClick={()=>setMode("login")} style={{
              background:"none", border:"none", color:"#8b9cc8", fontSize:13,
              marginTop:14, width:"100%", fontFamily:"var(--font-arabic)" }}>
              ← العودة لتسجيل الدخول
            </button>
          )}

          {/* Trust indicators */}
          <div className="flex justify-center gap-5 mt-6 flex-wrap">
            {[{icon:<Shield size={12}/>,t:"آمن ومشفر"},{icon:<Zap size={12}/>,t:"Claude AI"},{icon:<Star size={12}/>,t:"مجاني للبدء"}].map((x,i)=>(
              <div key={i} className="flex items-center gap-1.5" style={{ color:"#3d4f72", fontSize:11.5 }}>
                {x.icon} {x.t}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
