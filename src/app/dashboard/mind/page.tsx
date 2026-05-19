"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Brain, Sparkles, TrendingUp, Flame, Award, Focus, CheckCircle2, BarChart3, Shield, Moon } from "lucide-react"
import { useAI } from "@/hooks/useAI"
import { useHabits } from "@/hooks/useHabits"

export default function MindPage() {
  const { ask, loading } = useAI()
  const { habits } = useHabits()
  const [analysis, setAnalysis] = useState<any>(null)

  const run = async () => {
    const habitsText = habits.map(h=>`${h.name}(سلسلة:${h.streak},معدل:${h.rate}٪,اليوم:${h.doneToday?"✓":"✗"})`).join(" | ")
    const r = await ask([{ role:"user", content:`حلّل هذه البيانات السلوكية:
${habitsText}
الوقت: ${new Date().getHours()}:00

أجب بـ JSON فقط (بالعربية):
{"strengths":["نقطة 1","نقطة 2","نقطة 3"],"weaknesses":["ضعف 1","ضعف 2","ضعف 3"],"peak":"ساعات الذروة","pattern":"نمط سلوكي واضح","prediction":"توقع الأسبوع القادم","challenge":"تحدي واحد للأسبوع"}` }])
    try { setAnalysis(JSON.parse(r?.replace(/```json|```/g,"").trim()!)) }
    catch { setAnalysis({ strengths:["الانضباط الصباحي"],weaknesses:["وقت المساء"],peak:"٩-١١ صباحاً",pattern:"أداؤك الصباحي أقوى بكثير",prediction:"أسبوع واعد إذا استمررت",challenge:"أنجز ٣ عادات متتالية" }) }
  }

  const avg = habits.length ? Math.round(habits.reduce((a,h)=>a+h.rate,0)/habits.length) : 0
  const best = Math.max(...habits.map(h=>h.streak), 0)
  const done = habits.filter(h=>h.doneToday).length

  return (
    <div style={{height:"100%",overflowY:"auto",display:"flex",flexDirection:"column",gap:18,paddingBottom:8}}>
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
        style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,letterSpacing:"-.5px",
            display:"flex",alignItems:"center",gap:9}}>
            <Brain size={22} color="#8b5cf6"/> الذكاء السلوكي
          </h2>
          <p style={{color:"#8b9cc8",fontSize:13,marginTop:4}}>تحليل عميق لأنماطك بالذكاء الاصطناعي</p>
        </div>
        <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}}
          onClick={run} disabled={loading}
          style={{padding:"10px 18px",borderRadius:12,border:"none",cursor:"pointer",
            background:"linear-gradient(135deg,#8b5cf6,#6366f1)",color:"#fff",fontSize:13.5,fontWeight:600,
            display:"flex",alignItems:"center",gap:7,boxShadow:"0 4px 18px rgba(139,92,246,0.3)",
            fontFamily:"var(--font-arabic)",opacity:loading?0.7:1}}>
          {loading
            ? <span style={{width:14,height:14,borderRadius:"50%",border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",display:"inline-block",animation:"spin 1s linear infinite"}}/>
            : <Sparkles size={15}/>} {analysis?"إعادة التحليل":"تحليل AI عميق"}
        </motion.button>
      </motion.div>

      {/* Live stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:12}}>
        {[
          {l:"معدل الإنجاز",v:`${avg}٪`,Icon:TrendingUp,c:"#10b981"},
          {l:"عادات نشطة",v:`${habits.length}`,Icon:Flame,c:"#f59e0b"},
          {l:"أطول سلسلة",v:`${best}ي`,Icon:Award,c:"#6366f1"},
          {l:"أنجزت اليوم",v:`${done}/${habits.length}`,Icon:CheckCircle2,c:"#8b5cf6"},
        ].map((x,i)=>(
          <motion.div key={i} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
            whileHover={{y:-2}} style={{background:"#0f1623",border:"1px solid rgba(255,255,255,0.06)",
              borderRadius:16,padding:"16px"}}>
            <div style={{width:34,height:34,borderRadius:11,background:`${x.c}15`,
              display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}>
              <x.Icon size={16} color={x.c} strokeWidth={1.8}/>
            </div>
            <div style={{color:"#3d4f72",fontSize:10,textTransform:"uppercase",letterSpacing:".05em",marginBottom:3}}>{x.l}</div>
            <div style={{color:x.c,fontSize:20,fontWeight:700}}>{x.v}</div>
          </motion.div>
        ))}
      </div>

      {/* AI analysis */}
      {analysis && (
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
          style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {[
            {title:"💪 نقاط القوة",items:analysis.strengths,color:"#10b981"},
            {title:"⚠️ نقاط الضعف",items:analysis.weaknesses,color:"#ef4444"},
          ].map((sec,i)=>(
            <div key={i} style={{background:"#0f1623",border:`1px solid ${sec.color}22`,
              borderRadius:18,padding:"16px 18px",background2:`${sec.color}04`}}>
              <div style={{color:sec.color,fontWeight:600,fontSize:13.5,marginBottom:12}}>{sec.title}</div>
              {sec.items?.map((item:string,j:number)=>(
                <div key={j} style={{display:"flex",alignItems:"flex-start",gap:7,marginBottom:8,
                  padding:"7px 10px",background:`${sec.color}08`,borderRadius:9}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:sec.color,flexShrink:0,marginTop:5}}/>
                  <span style={{color:"#8b9cc8",fontSize:12.5,lineHeight:1.5}}>{item}</span>
                </div>
              ))}
            </div>
          ))}
          <div style={{gridColumn:"1/-1",background:"rgba(99,102,241,0.04)",
            border:"1px solid rgba(99,102,241,0.2)",borderRadius:18,padding:"18px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {[
                {l:"⏰ ساعات الذروة",v:analysis.peak,c:"#10b981"},
                {l:"🔍 النمط السلوكي",v:analysis.pattern,c:"#6366f1"},
                {l:"🔮 توقع الأسبوع",v:analysis.prediction,c:"#06b6d4"},
                {l:"🎯 تحدي الأسبوع",v:analysis.challenge,c:"#f59e0b"},
              ].map((x,i)=>(
                <div key={i} style={{background:"#141d2e",borderRadius:12,padding:"12px 14px"}}>
                  <div style={{color:"#3d4f72",fontSize:10.5,marginBottom:4}}>{x.l}</div>
                  <div style={{color:x.c,fontSize:13,fontWeight:500,lineHeight:1.5}}>{x.v}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {!analysis && (
        <div style={{textAlign:"center",padding:"50px 20px",color:"#3d4f72"}}>
          <Brain size={52} strokeWidth={1} style={{margin:"0 auto 14px",opacity:0.25}}/>
          <p style={{fontSize:14}}>اضغط "تحليل AI عميق" للحصول على رؤى مخصصة بالذكاء الاصطناعي</p>
        </div>
      )}

      {/* Habits bar chart */}
      {habits.length > 0 && (
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
          style={{background:"#0f1623",border:"1px solid rgba(255,255,255,0.06)",borderRadius:18,padding:"18px"}}>
          <div style={{color:"#f0f4ff",fontWeight:700,fontSize:14.5,
            display:"flex",alignItems:"center",gap:7,marginBottom:18}}>
            <BarChart3 size={15} color="#06b6d4"/> معدل نجاح العادات
          </div>
          {habits.map((h,i)=>(
            <div key={h.id} style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
              <span style={{fontSize:16,flexShrink:0}}>{h.emoji}</span>
              <div style={{width:100,color:"#8b9cc8",fontSize:12,textAlign:"right",flexShrink:0,
                overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.name}</div>
              <div style={{flex:1,background:"rgba(255,255,255,0.06)",borderRadius:99,height:7,overflow:"hidden"}}>
                <motion.div initial={{width:0}} animate={{width:`${h.rate}%`}} transition={{duration:1,delay:i*0.1}}
                  style={{height:"100%",borderRadius:99,background:`linear-gradient(90deg,${h.color},${h.color}88)`}}/>
              </div>
              <div style={{color:h.color,fontSize:13,fontWeight:700,width:38,flexShrink:0,textAlign:"left"}}>{h.rate}٪</div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
