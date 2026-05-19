"use client"
import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Wind, Play, Pause, Send, Save, Moon, Sun, PenLine, Heart } from "lucide-react"
import { useAI } from "@/hooks/useAI"
import toast from "react-hot-toast"

const PROMPTS = ["ما الذي تعلمته اليوم؟","ما الذي شتّت انتباهك؟","ما الذي يجب أن يتحسن غداً؟","ما الذي تفخر به اليوم؟","كيف كان مستوى طاقتك؟"]

export default function ClarityPage() {
  const { ask, loading } = useAI()
  const [phase, setPhase] = useState("idle")
  const [breathCount, setBreathCount] = useState(0)
  const [journal, setJournal] = useState(()=>{ try{return localStorage.getItem("clarity_journal")||""}catch{return""} })
  const [reflection, setReflection] = useState(()=>{ try{return localStorage.getItem("night_reflection")||""}catch{return""} })
  const [prompt, setPrompt] = useState("")
  const [aiRes, setAiRes] = useState("")
  const timerRef = useRef<NodeJS.Timeout|null>(null)
  const hour = new Date().getHours()
  const isNight = hour >= 20

  const startBreath = () => {
    const phases = ["استنشق...","احبس...","أخرج...","احبس..."]
    let idx=0, count=0
    setPhase(phases[0]); setBreathCount(0)
    timerRef.current = setInterval(()=>{
      idx=(idx+1)%4
      if(idx===0) count++
      if(count>=4){clearInterval(timerRef.current!);setPhase("idle");return}
      setPhase(phases[idx]); setBreathCount(count)
    },4000)
  }
  const stopBreath = () => { if(timerRef.current)clearInterval(timerRef.current); setPhase("idle") }
  useEffect(()=>()=>{if(timerRef.current)clearInterval(timerRef.current)},[])

  const getAI = async () => {
    const r = await ask([{role:"user",content:`${prompt}\nسياق يومياتي: "${journal.slice(0,200)}"`}],"أنت مرشد للصحة الذهنية. دعم عاطفي دافئ بالعربية.")
    if(r) setAiRes(r)
  }

  return (
    <div style={{height:"100%",overflowY:"auto",display:"flex",flexDirection:"column",gap:18,paddingBottom:8}}>
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,letterSpacing:"-.5px",
          display:"flex",alignItems:"center",gap:9}}>
          <Wind size={22} color="#06b6d4"/> الصفاء الذهني
        </h2>
        <p style={{color:"#8b9cc8",fontSize:13,marginTop:4}}>تأمل · تنفس · كتابة حرة · دعم عاطفي AI</p>
      </motion.div>

      {/* Breathing */}
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.05}}
        style={{background:"#0f1623",border:"1px solid rgba(255,255,255,0.06)",borderRadius:18,padding:"24px",textAlign:"center"}}>
        <div style={{color:"#f0f4ff",fontWeight:600,fontSize:14.5,marginBottom:20}}>🧘 تمرين التنفس ٤-٤-٤-٤</div>
        <div style={{position:"relative",width:150,height:150,margin:"0 auto 20px"}}>
          <motion.div animate={phase!=="idle"?{scale:[1,1.35,1],opacity:[0.5,1,0.5]}:{}}
            transition={{duration:4,repeat:Infinity}}
            style={{position:"absolute",inset:0,borderRadius:"50%",
              background:"radial-gradient(circle,rgba(6,182,212,0.25),transparent 70%)"}}>
          </motion.div>
          <div style={{position:"absolute",inset:10,borderRadius:"50%",
            background:"rgba(6,182,212,0.06)",
            border:`2px solid ${phase!=="idle"?"#06b6d4":"rgba(255,255,255,0.06)"}`,
            display:"flex",alignItems:"center",justifyContent:"center",
            flexDirection:"column",transition:"border-color 0.5s"}}>
            <div style={{color:phase!=="idle"?"#06b6d4":"#3d4f72",fontSize:14,fontWeight:600,marginBottom:4}}>
              {phase==="idle"?"ابدأ":phase}
            </div>
            {breathCount>0&&<div style={{color:"#3d4f72",fontSize:11}}>دورة {breathCount}/4</div>}
          </div>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <button onClick={phase==="idle"?startBreath:stopBreath} style={{
            padding:"11px 24px",borderRadius:12,border:"none",cursor:"pointer",
            background:phase==="idle"?"linear-gradient(135deg,#06b6d4,#0891b2)":"rgba(255,255,255,0.05)",
            color:"#fff",fontSize:13.5,fontWeight:600,
            display:"flex",alignItems:"center",gap:7,fontFamily:"var(--font-arabic)",
            boxShadow:phase==="idle"?"0 4px 18px rgba(6,182,212,0.3)":"none"}}>
            {phase==="idle"?<><Play size={15}/>ابدأ</>:<><Pause size={15}/>إيقاف</>}
          </button>
        </div>
      </motion.div>

      {/* AI support */}
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
        style={{background:"rgba(99,102,241,0.04)",border:"1px solid rgba(99,102,241,0.18)",borderRadius:18,padding:"18px 20px"}}>
        <div style={{color:"#818cf8",fontWeight:600,fontSize:13.5,marginBottom:12,
          display:"flex",alignItems:"center",gap:6}}>
          <Heart size={14}/> الدعم العاطفي AI
        </div>
        <div style={{display:"flex",gap:7,marginBottom:10,flexWrap:"wrap"}}>
          {["أشعر بالإرهاق","أريد تحفيزاً","أحتاج وضوحاً","شيء يقلقني"].map(p=>(
            <button key={p} onClick={()=>setPrompt(p)} style={{
              padding:"6px 12px",borderRadius:99,cursor:"pointer",fontSize:12,
              background:prompt===p?"rgba(99,102,241,0.15)":"transparent",
              border:`1px solid ${prompt===p?"rgba(99,102,241,0.4)":"rgba(255,255,255,0.06)"}`,
              color:prompt===p?"#6366f1":"#3d4f72",fontFamily:"var(--font-arabic)"}}>
              {p}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          <input value={prompt} onChange={e=>setPrompt(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&getAI()}
            placeholder="كيف تشعر؟ أو ما الذي يشغل بالك؟"
            style={{flex:1,background:"#0f1623",border:"1px solid rgba(255,255,255,0.06)",
              borderRadius:11,padding:"9px 13px",color:"#f0f4ff",fontSize:13,
              outline:"none",textAlign:"right",fontFamily:"var(--font-arabic)"}}
            onFocus={e=>e.target.style.borderColor="rgba(99,102,241,0.4)"}
            onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.06)"}/>
          <button onClick={getAI} disabled={loading||!prompt.trim()} style={{
            padding:"9px 14px",borderRadius:11,border:"none",cursor:"pointer",
            background:"linear-gradient(135deg,#6366f1,#818cf8)",color:"#fff",display:"flex",
            opacity:loading||!prompt.trim()?0.6:1}}>
            {loading?<span style={{width:14,height:14,borderRadius:"50%",border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",display:"inline-block",animation:"spin 1s linear infinite"}}/>:<Send size={14}/>}
          </button>
        </div>
        {aiRes&&<p style={{color:"#8b9cc8",fontSize:13.5,lineHeight:1.75,marginTop:12,whiteSpace:"pre-wrap"}}>{aiRes}</p>}
      </motion.div>

      {/* Reflection */}
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.15}}
        style={{background:"#0f1623",border:"1px solid rgba(255,255,255,0.06)",borderRadius:18,padding:"18px 20px"}}>
        <div style={{color:"#f0f4ff",fontWeight:600,fontSize:14,marginBottom:12,
          display:"flex",alignItems:"center",gap:7}}>
          {isNight?<Moon size={15} color="#8b5cf6"/>:<Sun size={15} color="#f59e0b"/>}
          {isNight?"تأمل الليل 🌙":"تأمل اليوم ☀️"}
        </div>
        <div style={{display:"flex",gap:7,marginBottom:12,flexWrap:"wrap"}}>
          {PROMPTS.map((p,i)=>(
            <button key={i} onClick={()=>setReflection(r=>r+"\n"+p+"\n")} style={{
              padding:"5px 11px",borderRadius:99,cursor:"pointer",fontSize:11.5,
              background:"transparent",border:"1px solid rgba(255,255,255,0.06)",
              color:"#3d4f72",fontFamily:"var(--font-arabic)",transition:"all 0.2s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="#6366f1";e.currentTarget.style.color="#6366f1"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.06)";e.currentTarget.style.color="#3d4f72"}}>
              + {p}
            </button>
          ))}
        </div>
        <textarea value={reflection} onChange={e=>setReflection(e.target.value)}
          placeholder="اكتب تأملاتك بحرية..."
          style={{width:"100%",background:"#141d2e",border:"1px solid rgba(255,255,255,0.06)",
            borderRadius:11,padding:"12px 14px",color:"#f0f4ff",fontSize:13,
            outline:"none",resize:"vertical",minHeight:100,lineHeight:1.75,
            fontFamily:"var(--font-arabic)",textAlign:"right"}}
          onFocus={e=>e.target.style.borderColor="rgba(99,102,241,0.4)"}
          onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.06)"}/>
        <button onClick={()=>{localStorage.setItem("night_reflection",reflection);toast.success("تم حفظ التأمل ✅")}}
          style={{marginTop:10,padding:"8px 16px",borderRadius:10,border:"1px solid rgba(255,255,255,0.06)",
            background:"transparent",color:"#8b9cc8",cursor:"pointer",fontSize:12,
            display:"flex",alignItems:"center",gap:5,fontFamily:"var(--font-arabic)"}}>
          <Save size={13}/> حفظ التأمل
        </button>
      </motion.div>

      {/* Journal */}
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
        style={{background:"#0f1623",border:"1px solid rgba(255,255,255,0.06)",borderRadius:18,padding:"18px 20px"}}>
        <div style={{color:"#f0f4ff",fontWeight:600,fontSize:14,marginBottom:12,
          display:"flex",alignItems:"center",gap:7}}>
          <PenLine size={15} color="#10b981"/> اليوميات الحرة
        </div>
        <textarea value={journal} onChange={e=>setJournal(e.target.value)}
          placeholder="اكتب أي شيء يخطر ببالك. هذا فضاءك الخاص..."
          style={{width:"100%",background:"#141d2e",border:"1px solid rgba(255,255,255,0.06)",
            borderRadius:11,padding:"12px 14px",color:"#f0f4ff",fontSize:13.5,
            outline:"none",resize:"vertical",minHeight:140,lineHeight:1.8,
            fontFamily:"var(--font-arabic)",textAlign:"right"}}
          onFocus={e=>e.target.style.borderColor="rgba(16,185,129,0.4)"}
          onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.06)"}/>
        <button onClick={()=>{localStorage.setItem("clarity_journal",journal);toast.success("تم حفظ اليوميات ✅")}}
          style={{marginTop:10,padding:"10px 18px",borderRadius:11,border:"none",cursor:"pointer",
            background:"linear-gradient(135deg,#10b981,#059669)",color:"#fff",fontSize:13,fontWeight:600,
            display:"flex",alignItems:"center",gap:6,boxShadow:"0 4px 16px rgba(16,185,129,0.25)",
            fontFamily:"var(--font-arabic)"}}>
          <Save size={13}/> حفظ اليوميات
        </button>
      </motion.div>
    </div>
  )
}
