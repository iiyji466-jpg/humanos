"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Sparkles, Check, Lock, Bot } from "lucide-react"
import { useAI } from "@/hooks/useAI"
import { useHabits } from "@/hooks/useHabits"

const ALL = [
  {id:"a1",title:"أسبوع الانضباط",desc:"٧ أيام متواصلة",emoji:"🔥",color:"#f59e0b",check:(h:any[])=>Math.max(...h.map((x:any)=>x.streak),0)>=7},
  {id:"a2",title:"سيد التركيز",desc:"١٠ جلسات بومودورو",emoji:"⚡",color:"#6366f1",check:()=>false},
  {id:"a3",title:"القارئ المثابر",desc:"٥ كتب مكتملة",emoji:"📚",color:"#10b981",check:()=>false},
  {id:"a4",title:"المتأمل",desc:"٣٠ يوم تأمل",emoji:"🧘",color:"#06b6d4",check:()=>false},
  {id:"a5",title:"محلل السلوك",desc:"تحليل AI ١٠ مرات",emoji:"🔬",color:"#8b5cf6",check:()=>false},
  {id:"a6",title:"بناء الهوية",desc:"٩٠ يوم نظام",emoji:"💎",color:"#ec4899",check:(h:any[])=>Math.max(...h.map((x:any)=>x.streak),0)>=90},
  {id:"a7",title:"البادئ الشجاع",desc:"أضف أول عادة",emoji:"🌱",color:"#10b981",check:(h:any[])=>h.length>=1},
  {id:"a8",title:"منظومة العادات",desc:"٥ عادات نشطة",emoji:"⚙️",color:"#6366f1",check:(h:any[])=>h.length>=5},
]

export default function AchievePage() {
  const { ask, loading } = useAI()
  const { habits } = useHabits()
  const [aiAnalysis, setAiAnalysis] = useState("")

  const achieves = ALL.map(a=>({...a,unlocked:a.check(habits)}))
  const unlocked = achieves.filter(a=>a.unlocked).length

  const analyse = async () => {
    const ul = achieves.filter(a=>a.unlocked).map(a=>a.title).join(", ")
    const locked = achieves.filter(a=>!a.unlocked).map(a=>a.title).join(", ")
    const r = await ask([{role:"user",content:`إنجازاتي المحققة: ${ul||"لا يوجد بعد"}. المتبقية: ${locked}. العادات: ${habits.length}. أخبرني: ماذا حققت؟ كيف أصل لأقرب إنجاز؟`}])
    if(r) setAiAnalysis(r)
  }

  return (
    <div style={{height:"100%",overflowY:"auto",display:"flex",flexDirection:"column",gap:18,paddingBottom:8}}>
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
        style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,letterSpacing:"-.5px",
            display:"flex",alignItems:"center",gap:9}}>
            <Trophy size={22} color="#f59e0b"/> الإنجازات
          </h2>
          <p style={{color:"#8b9cc8",fontSize:13,marginTop:4}}>{unlocked}/{achieves.length} إنجاز محقق</p>
        </div>
        <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}}
          onClick={analyse} disabled={loading}
          style={{padding:"10px 18px",borderRadius:12,border:"none",cursor:"pointer",
            background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"#fff",fontSize:13.5,fontWeight:600,
            display:"flex",alignItems:"center",gap:7,boxShadow:"0 4px 18px rgba(245,158,11,0.3)",
            fontFamily:"var(--font-arabic)",opacity:loading?0.7:1}}>
          {loading
            ?<span style={{width:14,height:14,borderRadius:"50%",border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",display:"inline-block",animation:"spin 1s linear infinite"}}/>
            :<Sparkles size={15}/>} تحليل AI
        </motion.button>
      </motion.div>

      {/* Progress */}
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.05}}
        style={{background:"#0f1623",border:"1px solid rgba(255,255,255,0.06)",borderRadius:18,padding:"18px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
          <span style={{color:"#f0f4ff",fontWeight:600,fontSize:14}}>تقدمك الكلي</span>
          <span style={{color:"#f59e0b",fontWeight:700}}>{Math.round(unlocked/achieves.length*100)}٪</span>
        </div>
        <div style={{background:"rgba(255,255,255,0.06)",borderRadius:99,height:8,overflow:"hidden",marginBottom:12}}>
          <motion.div initial={{width:0}} animate={{width:`${Math.round(unlocked/achieves.length*100)}%`}}
            transition={{duration:1,ease:"easeOut"}}
            style={{height:"100%",borderRadius:99,background:"linear-gradient(90deg,#f59e0b,#d97706)"}}/>
        </div>
        <div style={{display:"flex",gap:10}}>
          {[{l:"محقق",v:unlocked,c:"#10b981"},{l:"متبقي",v:achieves.length-unlocked,c:"#3d4f72"},{l:"المجموع",v:achieves.length,c:"#6366f1"}].map((x,i)=>(
            <div key={i} style={{background:"#141d2e",borderRadius:10,padding:"8px 14px",flex:1}}>
              <div style={{color:"#3d4f72",fontSize:10,marginBottom:2}}>{x.l}</div>
              <div style={{color:x.c,fontWeight:700,fontSize:18}}>{x.v}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {aiAnalysis&&(
        <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
          style={{background:"rgba(245,158,11,0.05)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:16,padding:"14px 18px"}}>
          <div style={{color:"#f59e0b",fontWeight:600,fontSize:13,marginBottom:6,display:"flex",alignItems:"center",gap:6}}>
            <Bot size={14}/> تحليل إنجازاتك
          </div>
          <p style={{color:"#8b9cc8",fontSize:13.5,lineHeight:1.75,whiteSpace:"pre-wrap"}}>{aiAnalysis}</p>
        </motion.div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14}}>
        {achieves.map((a,i)=>(
          <motion.div key={a.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
            transition={{delay:i*0.05}}
            whileHover={{y:-3,boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}
            style={{background:"#0f1623",
              border:`1px solid ${a.unlocked?a.color+"30":"rgba(255,255,255,0.06)"}`,
              borderRadius:20,padding:"22px 18px",textAlign:"center",position:"relative",
              background2:a.unlocked?`${a.color}06`:"#0f1623",transition:"all 0.25s"}}>
            {a.unlocked&&(
              <div style={{position:"absolute",top:10,left:10}}>
                <Check size={15} color={a.color} strokeWidth={2.5}/>
              </div>
            )}
            <div style={{fontSize:40,marginBottom:12,filter:a.unlocked?"none":"grayscale(1) opacity(0.3)",
              transition:"transform 0.3s"}}
              onMouseEnter={e=>(e.currentTarget.style.transform="scale(1.15) rotate(5deg)")}
              onMouseLeave={e=>(e.currentTarget.style.transform="scale(1) rotate(0deg)")}>
              {a.emoji}
            </div>
            <div style={{color:a.unlocked?"#f0f4ff":"#3d4f72",fontWeight:700,fontSize:14.5,marginBottom:5}}>
              {a.title}
            </div>
            <div style={{color:"#3d4f72",fontSize:12,marginBottom:10}}>{a.desc}</div>
            {a.unlocked
              ? <span style={{padding:"3px 12px",borderRadius:99,fontSize:10.5,fontWeight:600,background:`${a.color}20`,color:a.color,display:"inline-flex",alignItems:"center",gap:4}}>
                  <Check size={10}/> مكتمل
                </span>
              : <Lock size={16} color="#3d4f72" style={{margin:"0 auto",opacity:0.5}}/>}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
