"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Atom, Check, ChevronRight, ArrowLeft, Rocket, Brain, Flame, Focus, BookOpen, Heart, Zap, Diamond } from "lucide-react"
import { prisma } from "@/lib/prisma"

const GOALS = [
  {id:"habits",label:"بناء عادات",emoji:"🔥",color:"#f59e0b"},
  {id:"focus",label:"تحسين التركيز",emoji:"⚡",color:"#6366f1"},
  {id:"learn",label:"التعلم المستمر",emoji:"📚",color:"#10b981"},
  {id:"mental",label:"الصحة الذهنية",emoji:"🧘",color:"#8b5cf6"},
  {id:"productivity",label:"الإنتاجية",emoji:"🚀",color:"#06b6d4"},
  {id:"identity",label:"بناء الهوية",emoji:"💎",color:"#ec4899"},
]

const PERSONAS = [
  {id:"calm",label:"المدرب الهادئ",desc:"دافئ وصبور ومشجع",emoji:"🌿"},
  {id:"strict",label:"المرشد الصارم",desc:"مباشر وصريح ومحفز بقوة",emoji:"⚡"},
  {id:"friendly",label:"الصديق المساعد",desc:"مرح وإيجابي ومتعاطف",emoji:"😊"},
  {id:"thinker",label:"المفكر العميق",desc:"تحليلي وفلسفي واستراتيجي",emoji:"🔬"},
]

const STRUGGLES = [
  {id:"procrastination",label:"التسويف"},
  {id:"distraction",label:"التشتت"},
  {id:"sleep",label:"النوم المتأخر"},
  {id:"social",label:"السوشيال ميديا"},
  {id:"motivation",label:"ضعف الدافعية"},
  {id:"overwhelm",label:"الإرهاق"},
]

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    gender: "male", age: "25-34", goals: [] as string[],
    struggles: [] as string[], persona: "calm", name: session?.user?.name || ""
  })
  const [saving, setSaving] = useState(false)

  const steps = [
    {
      title: `مرحباً${data.name ? "، " + data.name : ""} 🌟`,
      sub: "أخبرنا عنك لنخصص تجربتك",
      content: (
        <div className="space-y-5">
          <div>
            <label style={{color:"#8b9cc8",fontSize:12.5,marginBottom:6,display:"block"}}>اسمك</label>
            <input value={data.name} onChange={e=>setData(d=>({...d,name:e.target.value}))}
              placeholder="أدخل اسمك..."
              style={{width:"100%",background:"#0f1623",border:"1px solid rgba(255,255,255,0.08)",
                borderRadius:12,padding:"12px 16px",color:"#f0f4ff",fontSize:14,
                fontFamily:"var(--font-arabic)"}}
              onFocus={e=>e.target.style.borderColor="rgba(99,102,241,0.5)"}
              onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.08)"}/>
          </div>
          <div>
            <label style={{color:"#8b9cc8",fontSize:12.5,marginBottom:8,display:"block"}}>الجنس</label>
            <div className="flex gap-3">
              {[{id:"male",label:"ذكر",emoji:"👨"},{id:"female",label:"أنثى",emoji:"👩"}].map(g=>(
                <button key={g.id} onClick={()=>setData(d=>({...d,gender:g.id}))}
                  style={{
                    flex:1,padding:"13px",borderRadius:13,cursor:"pointer",textAlign:"center",
                    background:data.gender===g.id?"rgba(99,102,241,0.15)":"transparent",
                    border:`1px solid ${data.gender===g.id?"rgba(99,102,241,0.4)":"rgba(255,255,255,0.08)"}`,
                    color:data.gender===g.id?"#6366f1":"#8b9cc8",fontSize:14,
                    transition:"all 0.2s",fontFamily:"var(--font-arabic)",
                  }}>
                  <div style={{fontSize:24,marginBottom:4}}>{g.emoji}</div>{g.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{color:"#8b9cc8",fontSize:12.5,marginBottom:8,display:"block"}}>الفئة العمرية</label>
            <div className="grid grid-cols-4 gap-2">
              {["13-17","18-24","25-34","35+"].map(a=>(
                <button key={a} onClick={()=>setData(d=>({...d,age:a}))}
                  style={{
                    padding:"10px",borderRadius:11,cursor:"pointer",
                    background:data.age===a?"rgba(99,102,241,0.15)":"transparent",
                    border:`1px solid ${data.age===a?"rgba(99,102,241,0.4)":"rgba(255,255,255,0.08)"}`,
                    color:data.age===a?"#6366f1":"#8b9cc8",fontSize:13,
                    fontFamily:"var(--font-arabic)",transition:"all 0.2s",
                  }}>{a}</button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "ما أهدافك؟ 🎯",
      sub: "اختر كل ما يناسبك — يمكنك اختيار أكثر من هدف",
      content: (
        <div className="grid grid-cols-2 gap-3">
          {GOALS.map(g => {
            const sel = data.goals.includes(g.id)
            return (
              <button key={g.id} onClick={()=>setData(d=>({
                ...d, goals: sel?d.goals.filter(x=>x!==g.id):[...d.goals,g.id]
              }))}
                style={{
                  padding:"16px 12px",borderRadius:14,cursor:"pointer",textAlign:"center",
                  background:sel?`${g.color}18`:"transparent",
                  border:`1px solid ${sel?g.color+"50":"rgba(255,255,255,0.08)"}`,
                  color:sel?g.color:"#8b9cc8",transition:"all 0.25s",
                  fontFamily:"var(--font-arabic)",position:"relative",
                }}>
                {sel && <Check size={12} color={g.color} style={{position:"absolute",top:8,left:8}}/>}
                <div style={{fontSize:26,marginBottom:7}}>{g.emoji}</div>
                <div style={{fontSize:13,fontWeight:sel?600:400}}>{g.label}</div>
              </button>
            )
          })}
        </div>
      )
    },
    {
      title: "ما الذي يصعب عليك؟ ⚠️",
      sub: "صدق معنا — AI سيساعدك تحديداً على هذه النقاط",
      content: (
        <div className="flex flex-wrap gap-2">
          {STRUGGLES.map(s => {
            const sel = data.struggles.includes(s.id)
            return (
              <button key={s.id} onClick={()=>setData(d=>({
                ...d, struggles: sel?d.struggles.filter(x=>x!==s.id):[...d.struggles,s.id]
              }))}
                style={{
                  padding:"9px 18px",borderRadius:99,cursor:"pointer",transition:"all 0.2s",
                  background:sel?"rgba(239,68,68,0.15)":"transparent",
                  border:`1px solid ${sel?"rgba(239,68,68,0.4)":"rgba(255,255,255,0.08)"}`,
                  color:sel?"#ef4444":"#8b9cc8",fontSize:13,fontFamily:"var(--font-arabic)",
                }}>{s.label}</button>
            )
          })}
        </div>
      )
    },
    {
      title: "اختر شخصية مدربك 🤖",
      sub: "يمكنك تغييرها لاحقاً من الإعدادات",
      content: (
        <div className="space-y-3">
          {PERSONAS.map(p => (
            <button key={p.id} onClick={()=>setData(d=>({...d,persona:p.id}))}
              style={{
                width:"100%",padding:"14px 16px",borderRadius:13,cursor:"pointer",textAlign:"right",
                background:data.persona===p.id?"rgba(99,102,241,0.12)":"transparent",
                border:`1px solid ${data.persona===p.id?"rgba(99,102,241,0.4)":"rgba(255,255,255,0.08)"}`,
                color:data.persona===p.id?"#6366f1":"#8b9cc8",
                display:"flex",alignItems:"center",gap:12,transition:"all 0.2s",
                fontFamily:"var(--font-arabic)",
              }}>
              <span style={{fontSize:24}}>{p.emoji}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:14,marginBottom:2}}>{p.label}</div>
                <div style={{fontSize:11.5,opacity:0.7}}>{p.desc}</div>
              </div>
              {data.persona===p.id && <Check size={16} color="#6366f1"/>}
            </button>
          ))}
        </div>
      )
    }
  ]

  const cur = steps[step]
  const progress = ((step+1)/steps.length)*100

  const handleFinish = async () => {
    setSaving(true)
    try {
      await fetch("/api/user/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, onboarded: true })
      })
    } catch {}
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5"
      style={{background:"#050810",direction:"rtl"}}>
      <div className="absolute w-96 h-96 rounded-full -top-20 -right-20 opacity-30 pointer-events-none"
        style={{background:"radial-gradient(circle,rgba(99,102,241,0.25),transparent 70%)",filter:"blur(60px)"}}/>

      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
        style={{
          width:"100%",maxWidth:480,background:"#0f1623",
          border:"1px solid rgba(255,255,255,0.06)",borderRadius:24,padding:"32px 28px",
        }}>
        {/* Progress */}
        <div style={{marginBottom:28}}>
          <div className="flex justify-between mb-2" style={{color:"#3d4f72",fontSize:11}}>
            <span>الخطوة {step+1} من {steps.length}</span>
            <span>{Math.round(progress)}٪</span>
          </div>
          <div style={{background:"rgba(255,255,255,0.06)",borderRadius:99,height:4,overflow:"hidden"}}>
            <motion.div animate={{width:`${progress}%`}} transition={{duration:0.4}}
              style={{height:"100%",background:"linear-gradient(90deg,#6366f1,#818cf8)",borderRadius:99}}/>
          </div>
          {/* Step dots */}
          <div className="flex justify-center gap-2 mt-3">
            {steps.map((_,i)=>(
              <div key={i} style={{
                width:i===step?20:6,height:6,borderRadius:99,transition:"all 0.3s",
                background:i<=step?"#6366f1":"rgba(255,255,255,0.1)",
              }}/>
            ))}
          </div>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
          <div style={{width:34,height:34,borderRadius:11,
            background:"linear-gradient(135deg,#6366f1,#ec4899)",
            display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Atom size={16} color="#fff"/>
          </div>
          <span style={{color:"#3d4f72",fontSize:11.5}}>HumanOS</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}
            transition={{duration:0.3}}>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,
              color:"#f0f4ff",marginBottom:5,letterSpacing:"-0.4px"}}>{cur.title}</h2>
            <p style={{color:"#8b9cc8",fontSize:13,marginBottom:24}}>{cur.sub}</p>
            {cur.content}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3 mt-6">
          {step>0 && (
            <button onClick={()=>setStep(s=>s-1)}
              style={{
                flex:1,padding:"12px",borderRadius:12,border:"1px solid rgba(255,255,255,0.08)",
                background:"transparent",color:"#8b9cc8",fontSize:13,cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center",gap:5,
                fontFamily:"var(--font-arabic)",
              }}>
              <ChevronRight size={15}/> السابق
            </button>
          )}
          <motion.button whileHover={{scale:1.01,y:-1}} whileTap={{scale:0.99}}
            onClick={step<steps.length-1 ? ()=>setStep(s=>s+1) : handleFinish}
            disabled={saving}
            style={{
              flex:2,padding:"12px",borderRadius:12,border:"none",cursor:"pointer",
              background:"linear-gradient(135deg,#6366f1,#818cf8)",
              color:"#fff",fontSize:14,fontWeight:600,
              display:"flex",alignItems:"center",justifyContent:"center",gap:7,
              boxShadow:"0 4px 20px rgba(99,102,241,0.3)",
              fontFamily:"var(--font-arabic)",
            }}>
            {saving ? "جارٍ الحفظ..." : step<steps.length-1 ? "التالي ←" : <><Rocket size={16}/> ابدأ رحلتك!</>}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
