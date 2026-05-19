"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Sparkles, Layers, Target, SkipBack, SkipForward, Check } from "lucide-react"
import { useAI } from "@/hooks/useAI"

const PATHS = [
  { title:"التفكير المنظومي",   prog:68, lessons:12, color:"#6366f1", emoji:"🔮" },
  { title:"علم النفس السلوكي", prog:43, lessons:8,  color:"#10b981", emoji:"🧬" },
  { title:"الفلسفة الرواقية",   prog:89, lessons:15, color:"#f59e0b", emoji:"🏛️" },
  { title:"علم الإقناع",        prog:20, lessons:10, color:"#ec4899", emoji:"🎯" },
]

export default function LearnPage() {
  const { ask, loading } = useAI()
  const [topic, setTopic] = useState("")
  const [tab, setTab] = useState<"lesson"|"cards"|"quiz">("lesson")
  const [lesson, setLesson] = useState<any>(null)
  const [cardIdx, setCardIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [quizAns, setQuizAns] = useState<number|null>(null)

  const generate = async () => {
    if (!topic.trim()) return
    setLesson(null)
    const r = await ask([{ role:"user", content:`علمني عن: "${topic}". أجب بـ JSON فقط:
{"intro":"مقدمة 3 جمل","points":[{"title":"...","body":"شرح 2 جمل"}],"action":"تطبيق عملي اليوم","cards":[{"q":"سؤال؟","a":"جواب"}],"quiz":{"q":"سؤال اختبار؟","options":["...","...","...","..."],"correct":0}}
٤ نقاط، ٣ بطاقات، اختبار واحد. بالعربية.` }])
    try {
      const clean = r?.replace(/```json|```/g,"").trim()
      const d = JSON.parse(clean!)
      setLesson(d); setCardIdx(0); setFlipped(false); setQuizAns(null)
    } catch { setLesson({ intro:r, points:[], action:"", cards:[], quiz:null }) }
  }

  return (
    <div style={{height:"100%",overflowY:"auto",display:"flex",flexDirection:"column",gap:18,paddingBottom:8}}>
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,letterSpacing:"-.5px",
          display:"flex",alignItems:"center",gap:9}}>
          <BookOpen size={22} color="#818cf8"/> نظام التعلم
        </h2>
        <p style={{color:"#8b9cc8",fontSize:13,marginTop:4}}>دروس AI + بطاقات تذكر + اختبارات تفاعلية</p>
      </motion.div>

      {/* Generator */}
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.05}}
        style={{background:"rgba(99,102,241,0.04)",border:"1px solid rgba(99,102,241,0.18)",
          borderRadius:18,padding:"18px 20px"}}>
        <div style={{color:"#818cf8",fontWeight:600,fontSize:14,marginBottom:12,
          display:"flex",alignItems:"center",gap:7}}>
          <Sparkles size={15}/> ولّد درساً بالذكاء الاصطناعي
        </div>
        <div style={{display:"flex",gap:8}}>
          <input value={topic} onChange={e=>setTopic(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&generate()}
            placeholder="مثال: التفكير النقدي، علم الأعصاب، إدارة الوقت، الرواقية..."
            style={{flex:1,background:"#0f1623",border:"1px solid rgba(255,255,255,0.06)",
              borderRadius:11,padding:"10px 14px",color:"#f0f4ff",fontSize:13.5,
              outline:"none",textAlign:"right",fontFamily:"var(--font-arabic)"}}
            onFocus={e=>e.target.style.borderColor="rgba(99,102,241,0.4)"}
            onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.06)"}/>
          <button onClick={generate} disabled={loading||!topic.trim()}
            style={{padding:"10px 18px",borderRadius:11,border:"none",cursor:"pointer",flexShrink:0,
              background:"linear-gradient(135deg,#6366f1,#818cf8)",color:"#fff",fontSize:13.5,fontWeight:600,
              display:"flex",alignItems:"center",gap:7,boxShadow:"0 4px 18px rgba(99,102,241,0.3)",
              fontFamily:"var(--font-arabic)",opacity:loading||!topic.trim()?0.6:1}}>
            {loading
              ? <span style={{width:14,height:14,borderRadius:"50%",border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",display:"inline-block",animation:"spin 1s linear infinite"}}/>
              : <BookOpen size={14}/>} توليد
          </button>
        </div>
      </motion.div>

      {/* Lesson tabs */}
      <AnimatePresence>
        {lesson && (
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
            style={{background:"#0f1623",border:"1px solid rgba(255,255,255,0.06)",borderRadius:18,overflow:"hidden"}}>
            {/* Tab bar */}
            <div style={{display:"flex",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
              {[
                {id:"lesson",label:"الدرس",icon:<BookOpen size={13}/>},
                {id:"cards",label:`بطاقات (${lesson.cards?.length||0})`,icon:<Layers size={13}/>},
                {id:"quiz",label:"اختبار",icon:<Target size={13}/>},
              ].map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id as any)} style={{
                  flex:1,padding:"12px",border:"none",cursor:"pointer",fontSize:12.5,
                  background:tab===t.id?"rgba(99,102,241,0.1)":"transparent",
                  color:tab===t.id?"#6366f1":"#8b9cc8",fontWeight:tab===t.id?600:400,
                  display:"flex",alignItems:"center",justifyContent:"center",gap:5,
                  borderBottom:tab===t.id?"2px solid #6366f1":"2px solid transparent",
                  transition:"all 0.2s",fontFamily:"var(--font-arabic)"}}>
                  {t.icon}{t.label}
                </button>
              ))}
            </div>
            <div style={{padding:"22px"}}>
              {tab==="lesson"&&(
                <div>
                  <div style={{color:"#818cf8",fontWeight:700,fontSize:16,marginBottom:12}}>📖 {topic}</div>
                  <p style={{color:"#8b9cc8",fontSize:13.5,lineHeight:1.8,marginBottom:18}}>{lesson.intro}</p>
                  {lesson.points?.map((p:any,i:number)=>(
                    <div key={i} style={{background:"#141d2e",borderRadius:13,padding:"13px 16px",marginBottom:10}}>
                      <div style={{color:"#f0f4ff",fontWeight:600,fontSize:13.5,marginBottom:5,display:"flex",gap:8}}>
                        <span style={{width:22,height:22,borderRadius:7,background:"rgba(99,102,241,0.2)",
                          display:"flex",alignItems:"center",justifyContent:"center",
                          color:"#6366f1",fontSize:11,fontWeight:700,flexShrink:0}}>{i+1}</span>
                        {p.title}
                      </div>
                      <p style={{color:"#8b9cc8",fontSize:13,lineHeight:1.7}}>{p.body}</p>
                    </div>
                  ))}
                  {lesson.action&&(
                    <div style={{background:"rgba(16,185,129,0.07)",border:"1px solid rgba(16,185,129,0.2)",
                      borderRadius:12,padding:"13px 16px",marginTop:6}}>
                      <div style={{color:"#10b981",fontWeight:600,fontSize:12.5,marginBottom:5,
                        display:"flex",alignItems:"center",gap:5}}>
                        <Target size={13}/> طبّق اليوم
                      </div>
                      <p style={{color:"#f0f4ff",fontSize:13.5,lineHeight:1.7}}>{lesson.action}</p>
                    </div>
                  )}
                </div>
              )}
              {tab==="cards"&&lesson.cards?.length>0&&(
                <div style={{textAlign:"center"}}>
                  <div style={{color:"#3d4f72",fontSize:12,marginBottom:16}}>
                    بطاقة {cardIdx+1} من {lesson.cards.length}
                  </div>
                  <motion.div onClick={()=>setFlipped(!flipped)} whileTap={{scale:0.98}}
                    style={{background:flipped?"rgba(99,102,241,0.1)":"#141d2e",
                      border:`1px solid ${flipped?"rgba(99,102,241,0.35)":"rgba(255,255,255,0.06)"}`,
                      borderRadius:18,padding:"40px 24px",cursor:"pointer",
                      minHeight:160,display:"flex",alignItems:"center",
                      justifyContent:"center",textAlign:"center",marginBottom:18,transition:"all 0.3s"}}>
                    <div>
                      <div style={{color:"#3d4f72",fontSize:10.5,marginBottom:10,
                        textTransform:"uppercase",letterSpacing:".06em"}}>
                        {flipped?"الجواب":"السؤال"} — اضغط للقلب
                      </div>
                      <div style={{color:"#f0f4ff",fontSize:15,lineHeight:1.7,fontWeight:flipped?600:400}}>
                        {flipped?lesson.cards[cardIdx].a:lesson.cards[cardIdx].q}
                      </div>
                    </div>
                  </motion.div>
                  <div style={{display:"flex",gap:10,justifyContent:"center"}}>
                    <button onClick={()=>{setCardIdx(i=>Math.max(0,i-1));setFlipped(false)}}
                      disabled={cardIdx===0}
                      style={{padding:"9px 16px",borderRadius:10,border:"1px solid rgba(255,255,255,0.06)",
                        background:"transparent",color:"#8b9cc8",cursor:"pointer",display:"flex",alignItems:"center"}}>
                      <SkipBack size={15}/>
                    </button>
                    <button onClick={()=>setFlipped(!flipped)}
                      style={{padding:"9px 20px",borderRadius:10,border:"none",cursor:"pointer",
                        background:"linear-gradient(135deg,#6366f1,#818cf8)",color:"#fff",
                        fontSize:13,fontFamily:"var(--font-arabic)"}}>
                      {flipped?"إخفاء":"اكشف الجواب"}
                    </button>
                    <button onClick={()=>{setCardIdx(i=>Math.min(lesson.cards.length-1,i+1));setFlipped(false)}}
                      disabled={cardIdx===lesson.cards.length-1}
                      style={{padding:"9px 16px",borderRadius:10,border:"1px solid rgba(255,255,255,0.06)",
                        background:"transparent",color:"#8b9cc8",cursor:"pointer",display:"flex",alignItems:"center"}}>
                      <SkipForward size={15}/>
                    </button>
                  </div>
                </div>
              )}
              {tab==="quiz"&&lesson.quiz&&(
                <div>
                  <div style={{color:"#f0f4ff",fontWeight:600,fontSize:15,marginBottom:16,lineHeight:1.5}}>
                    {lesson.quiz.q}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {lesson.quiz.options?.map((opt:string,i:number)=>{
                      const answered=quizAns!==null
                      const correct=i===lesson.quiz.correct
                      const chosen=quizAns===i
                      return(
                        <button key={i} onClick={()=>!answered&&setQuizAns(i)} style={{
                          padding:"13px 16px",borderRadius:12,cursor:answered?"default":"pointer",
                          textAlign:"right",transition:"all 0.2s",fontSize:13.5,
                          background:!answered?"transparent":correct?"rgba(16,185,129,0.12)":chosen?"rgba(239,68,68,0.12)":"transparent",
                          border:`1px solid ${!answered?"rgba(255,255,255,0.06)":correct?"rgba(16,185,129,0.4)":chosen?"rgba(239,68,68,0.4)":"rgba(255,255,255,0.06)"}`,
                          color:!answered?"#8b9cc8":correct?"#10b981":chosen?"#ef4444":"#3d4f72",
                          display:"flex",alignItems:"center",gap:10,fontFamily:"var(--font-arabic)"}}>
                          <span style={{width:24,height:24,borderRadius:8,flexShrink:0,fontSize:11,fontWeight:700,
                            background:!answered?"rgba(255,255,255,0.05)":correct?"rgba(16,185,129,0.2)":chosen?"rgba(239,68,68,0.2)":"rgba(255,255,255,0.05)",
                            display:"flex",alignItems:"center",justifyContent:"center",
                            color:!answered?"#3d4f72":correct?"#10b981":chosen?"#ef4444":"#3d4f72"}}>
                            {["أ","ب","ج","د"][i]}
                          </span>
                          {opt}
                          {answered&&correct&&<Check size={15} color="#10b981" style={{marginRight:"auto"}}/>}
                        </button>
                      )
                    })}
                  </div>
                  {quizAns!==null&&(
                    <div style={{marginTop:14,padding:"12px 16px",borderRadius:12,
                      background:quizAns===lesson.quiz.correct?"rgba(16,185,129,0.08)":"rgba(239,68,68,0.08)",
                      border:`1px solid ${quizAns===lesson.quiz.correct?"rgba(16,185,129,0.25)":"rgba(239,68,68,0.25)"}`}}>
                      <div style={{color:quizAns===lesson.quiz.correct?"#10b981":"#ef4444",fontWeight:600,fontSize:14}}>
                        {quizAns===lesson.quiz.correct?"✅ إجابة صحيحة!":"❌ إجابة خاطئة"}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preset paths */}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <div style={{color:"#3d4f72",fontSize:12,marginBottom:2}}>مساراتك الحالية</div>
        {PATHS.map((p,i)=>(
          <motion.div key={i} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
            whileHover={{y:-2}} style={{background:"#0f1623",border:"1px solid rgba(255,255,255,0.06)",
              borderRadius:16,padding:"16px 18px",transition:"border-color 0.25s"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
              <div style={{width:42,height:42,borderRadius:13,background:`${p.color}18`,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{p.emoji}</div>
              <div style={{flex:1}}>
                <div style={{color:"#f0f4ff",fontWeight:600,fontSize:14}}>{p.title}</div>
                <div style={{color:"#3d4f72",fontSize:11.5}}>{p.lessons} درس</div>
              </div>
              <div style={{color:p.color,fontSize:20,fontWeight:700}}>{p.prog}٪</div>
            </div>
            <div style={{background:"rgba(255,255,255,0.06)",borderRadius:99,height:5,overflow:"hidden",marginBottom:10}}>
              <motion.div initial={{width:0}} animate={{width:`${p.prog}%`}} transition={{duration:1,delay:i*0.1}}
                style={{height:"100%",borderRadius:99,background:`linear-gradient(90deg,${p.color},${p.color}88)`}}/>
            </div>
            <button onClick={()=>setTopic(p.title)} style={{
              padding:"6px 14px",borderRadius:9,border:"1px solid rgba(255,255,255,0.06)",
              background:"transparent",color:"#8b9cc8",cursor:"pointer",fontSize:12,
              display:"flex",alignItems:"center",gap:5,fontFamily:"var(--font-arabic)"}}>
              <Sparkles size={11}/> ولّد درس عن {p.title}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
