"use client"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Headphones, Play, Pause, BookOpen, Bot, Sparkles, X, Clock, Volume2 } from "lucide-react"
import { useAI } from "@/hooks/useAI"
import { useHabits } from "@/hooks/useHabits"

const BOOKS = [
  { id:"1", title:"عادات ذرية",           author:"جيمس كلير",       cat:"عادات",       dur:"٥.٢س", prog:68, emoji:"⚛️",  color:"#6366f1" },
  { id:"2", title:"قوة العادة",            author:"شارلز دوهيغ",    cat:"علم النفس",   dur:"٦.٨س", prog:23, emoji:"🔄",  color:"#f59e0b" },
  { id:"3", title:"العقل المتحكم",         author:"أندرو هوبرمان",  cat:"علم الأعصاب", dur:"٤.١س", prog:0,  emoji:"🧠",  color:"#06b6d4" },
  { id:"4", title:"عقلية النمو",           author:"كارول دوك",      cat:"علم النفس",   dur:"٥.٧س", prog:89, emoji:"🌱",  color:"#10b981" },
  { id:"5", title:"فن اللامبالاة",         author:"مارك مانسون",    cat:"فلسفة",       dur:"٥.٠س", prog:44, emoji:"😌",  color:"#8b5cf6" },
  { id:"6", title:"تأملات",               author:"ماركوس أوريليوس", cat:"فلسفة رواقية",dur:"٤.٣س", prog:12, emoji:"🏛️", color:"#ec4899" },
  { id:"7", title:"الإرادة",              author:"كيلي ماكغونيغال", cat:"إنتاجية",     dur:"٦.١س", prog:0,  emoji:"💪",  color:"#f59e0b" },
  { id:"8", title:"ذكاء عاطفي",           author:"دانيال غولمان",   cat:"علم النفس",   dur:"٧.٢س", prog:35, emoji:"❤️", color:"#ef4444" },
]
const CATS = ["الكل","عادات","علم النفس","فلسفة","علم الأعصاب","إنتاجية"]

export default function AudioPage() {
  const { ask, loading } = useAI()
  const { habits } = useHabits()
  const [playing, setPlaying] = useState<string|null>(null)
  const [filter, setFilter] = useState("الكل")
  const [rec, setRec] = useState("")
  const [readBook, setReadBook] = useState<typeof BOOKS[0]|null>(null)
  const [readContent, setReadContent] = useState("")
  const [readLoading, setReadLoading] = useState(false)
  const [unlocked, setUnlocked] = useState(false)

  const filtered = filter === "الكل" ? BOOKS : BOOKS.filter(b => b.cat === filter)

  const unlock = () => {
    const u = new SpeechSynthesisUtterance(" ")
    u.volume = 0
    window.speechSynthesis.speak(u)
    setUnlocked(true)
  }

  const togglePlay = (b: typeof BOOKS[0]) => {
    const synth = window.speechSynthesis
    if (playing === b.id) {
      synth.cancel()
      setPlaying(null)
      return
    }
    synth.cancel()
    const text = `كتاب ${b.title}، تأليف ${b.author}. هذا الكتاب في مجال ${b.cat}.`
    const u = new SpeechSynthesisUtterance(text)
    u.lang = "ar-SA"
    u.rate = 0.85
    u.onend = () => setPlaying(null)
    u.onerror = () => setPlaying(null)
    synth.speak(u)
    setPlaying(b.id)
  }

  const getRecommendation = async () => {
    const r = await ask([{ role:"user", content:`بناءً على عاداتي (${habits.map((h:any)=>h.name).join(", ")||"عامة"})، أوصني بكتاب واحد من: ${BOOKS.map(b=>b.title).join(", ")}. قل لماذا هذا الكتاب مناسب لي الآن (جملتان فقط). ابدأ باسم الكتاب.` }])
    if (r) setRec(r)
  }

  const openRead = async (book: typeof BOOKS[0]) => {
    setReadBook(book); setReadContent(""); setReadLoading(true)
    const r = await ask([{ role:"user", content:`ملخص تعليمي لكتاب "${book.title}" بقلم "${book.author}": ١) مقدمة ٢ جمل ٢) ٤ نقاط رئيسية مع أمثلة ٣) تطبيق عملي اليوم. بالعربية منظماً.` }])
    if (r) setReadContent(r)
    setReadLoading(false)
  }

  return (
    <div style={{height:"100%",overflowY:"auto",display:"flex",flexDirection:"column",gap:18,paddingBottom:8}}>
      <AnimatePresence>
        {readBook && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:"fixed",inset:0,zIndex:100,background:"rgba(0,0,0,0.88)",
              backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
            <motion.div initial={{scale:0.95,y:20}} animate={{scale:1,y:0}} exit={{scale:0.95,y:20}}
              style={{width:"100%",maxWidth:640,background:"#0f1623",
                border:"1px solid rgba(255,255,255,0.08)",borderRadius:22,
                display:"flex",flexDirection:"column",maxHeight:"88vh",overflow:"hidden"}}>
              <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)",
                display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{color:"#f0f4ff",fontWeight:700,fontSize:15}}>{readBook.title}</div>
                  <div style={{color:"#3d4f72",fontSize:12}}>{readBook.author}</div>
                </div>
                <button onClick={()=>{setReadBook(null);setReadContent("")}}
                  style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.06)",
                    borderRadius:9,padding:"6px 10px",color:"#8b9cc8",cursor:"pointer",display:"flex"}}>
                  <X size={15}/>
                </button>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"20px"}}>
                {readLoading
                  ? <div style={{textAlign:"center",padding:"40px",color:"#3d4f72"}}>
                      <div style={{width:28,height:28,borderRadius:"50%",border:"3px solid rgba(99,102,241,0.2)",
                        borderTopColor:"#6366f1",animation:"spin 1s linear infinite",margin:"0 auto 12px"}}/>
                      <p style={{fontSize:13}}>AI يولد الملخص...</p>
                    </div>
                  : <p style={{color:"#8b9cc8",fontSize:13.5,lineHeight:1.85,whiteSpace:"pre-wrap"}}>{readContent}</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
        style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,letterSpacing:"-.5px",
            display:"flex",alignItems:"center",gap:9}}>
            <Headphones size={22} color="#10b981"/> مكتبة الكتب الصوتية
          </h2>
          <p style={{color:"#8b9cc8",fontSize:13,marginTop:4}}>AI ينسق لك بناءً على حالتك وأهدافك</p>
        </div>
        <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}}
          onClick={getRecommendation} disabled={loading}
          style={{padding:"10px 18px",borderRadius:12,border:"none",cursor:"pointer",
            background:"linear-gradient(135deg,#10b981,#059669)",color:"#fff",fontSize:13.5,fontWeight:600,
            display:"flex",alignItems:"center",gap:7,boxShadow:"0 4px 18px rgba(16,185,129,0.3)",
            fontFamily:"var(--font-arabic)",opacity:loading?0.7:1}}>
          {loading
            ? <span style={{width:14,height:14,borderRadius:"50%",border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",display:"inline-block",animation:"spin 1s linear infinite"}}/>
            : <Sparkles size={15}/>} توصية AI
        </motion.button>
      </motion.div>

      {!unlocked && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}}
          style={{background:"rgba(16,185,129,0.05)",border:"1px solid rgba(16,185,129,0.2)",
            borderRadius:16,padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{color:"#8b9cc8",fontSize:13}}>فعّل الصوت للاستماع للكتب</span>
          <button onClick={unlock}
            style={{padding:"8px 16px",borderRadius:10,border:"none",cursor:"pointer",
              background:"linear-gradient(135deg,#10b981,#059669)",color:"#fff",fontSize:13,
              display:"flex",alignItems:"center",gap:6,fontFamily:"var(--font-arabic)"}}>
            <Volume2 size={14}/> تفعيل الصوت
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {rec && (
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
            style={{background:"rgba(16,185,129,0.05)",border:"1px solid rgba(16,185,129,0.2)",
              borderRadius:16,padding:"14px 18px"}}>
            <div style={{color:"#10b981",fontWeight:600,fontSize:13,marginBottom:6,display:"flex",alignItems:"center",gap:6}}>
              <Bot size={14}/> توصية AI مخصصة لك
            </div>
            <p style={{color:"#f0f4ff",fontSize:13.5,lineHeight:1.65}}>{rec}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
        {CATS.map(c => (
          <button key={c} onClick={()=>setFilter(c)} style={{
            padding:"7px 16px",borderRadius:99,cursor:"pointer",transition:"all 0.2s",fontSize:12.5,
            background:filter===c?"#6366f1":"transparent",
            border:`1px solid ${filter===c?"#6366f1":"rgba(255,255,255,0.06)"}`,
            color:filter===c?"#fff":"#8b9cc8",fontFamily:"var(--font-arabic)",
          }}>{c}</button>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
        {filtered.map((b,i) => (
          <motion.div key={b.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
            transition={{delay:i*0.05}} whileHover={{y:-3,boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}
            style={{background:"#0f1623",border:"1px solid rgba(255,255,255,0.06)",
              borderRadius:20,padding:"20px",transition:"border-color 0.25s"}}>
            <div style={{display:"flex",gap:14,marginBottom:16,alignItems:"flex-start"}}>
              <div style={{width:58,height:74,borderRadius:12,flexShrink:0,
                background:`linear-gradient(135deg,${b.color},${b.color}66)`,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:30,boxShadow:`0 8px 24px ${b.color}33`}}>
                {b.emoji}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{color:"#f0f4ff",fontWeight:600,fontSize:14.5,lineHeight:1.3,marginBottom:4}}>{b.title}</div>
                <div style={{color:"#3d4f72",fontSize:12,marginBottom:6}}>{b.author}</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  <span style={{padding:"2px 8px",borderRadius:99,fontSize:9.5,fontWeight:600,background:`${b.color}18`,color:b.color}}>{b.cat}</span>
                  <span style={{padding:"2px 8px",borderRadius:99,fontSize:9.5,background:"rgba(255,255,255,0.05)",color:"#3d4f72",display:"flex",alignItems:"center",gap:3}}>
                    <Clock size={9}/>{b.dur}
                  </span>
                </div>
              </div>
            </div>
            {b.prog > 0 && (
              <div style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:11,color:"#3d4f72"}}>
                  <span>التقدم</span><span style={{color:b.color}}>{b.prog}٪</span>
                </div>
                <div style={{background:"rgba(255,255,255,0.06)",borderRadius:99,height:4,overflow:"hidden"}}>
                  <motion.div initial={{width:0}} animate={{width:`${b.prog}%`}} transition={{duration:1,delay:i*0.05}}
                    style={{height:"100%",borderRadius:99,background:`linear-gradient(90deg,${b.color},${b.color}88)`}}/>
                </div>
              </div>
            )}
            {playing === b.id && (
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,
                background:`${b.color}10`,borderRadius:10,padding:"8px 12px"}}>
                <div style={{display:"flex",gap:3,alignItems:"flex-end"}}>
                  {[12,18,10,16,8].map((h,j) => (
                    <div key={j} style={{width:3,borderRadius:99,background:b.color,height:h,
                      animation:`pulse-dot ${0.5+j*0.1}s ease-in-out infinite alternate`}}/>
                  ))}
                </div>
                <span style={{color:b.color,fontSize:12,fontWeight:600}}>جارٍ الاستماع...</span>
              </div>
            )}
            <div style={{display:"flex",gap:7}}>
              <button onClick={()=>togglePlay(b)} style={{
                flex:1,padding:"10px",borderRadius:11,border:"none",cursor:"pointer",
                background:`linear-gradient(135deg,${b.color},${b.color}bb)`,
                color:"#fff",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:6,
                boxShadow:`0 4px 16px ${b.color}33`,fontFamily:"var(--font-arabic)"}}>
                {playing===b.id?<><Pause size={14}/>إيقاف</>:<><Play size={14}/>استمع</>}
              </button>
              <button onClick={()=>openRead(b)} title="وضع القراءة"
                style={{padding:"10px 13px",borderRadius:11,border:"1px solid rgba(255,255,255,0.06)",
                  background:"transparent",color:"#8b9cc8",cursor:"pointer",display:"flex"}}>
                <BookOpen size={14}/>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
