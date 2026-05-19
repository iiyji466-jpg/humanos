"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Flame, Plus, Bot, Trash2, Check, CheckCircle2, Clock, Lightbulb, Save, X, BarChart3 } from "lucide-react"
import { useHabits } from "@/hooks/useHabits"
import { useAI } from "@/hooks/useAI"
import toast from "react-hot-toast"

const COLORS = ["#6366f1","#06b6d4","#10b981","#ec4899","#f59e0b","#8b5cf6"]
const EMOJIS = ["🧘","💻","🚶","📖","💪","🎯","🌿","⭐","🔥","📚","🎵","🌅"]

export default function HabitsPage() {
  const { habits, loading, addHabit, deleteHabit, markDone } = useHabits()
  const { ask, loading: aiLoading } = useAI()
  const [showAdd, setShowAdd] = useState(false)
  const [aiTip, setAiTip] = useState("")
  const [tipFor, setTipFor] = useState<string|null>(null)
  const [form, setForm] = useState({ name:"", emoji:"⭐", time:"08:00", type:"build", trigger:"", color:"#6366f1" })

  const handleAdd = async () => {
    if (!form.name.trim()) { toast.error("أدخل اسم العادة"); return }
    await addHabit({ ...form, streak:0, rate:0, doneToday:false })
    setForm({ name:"", emoji:"⭐", time:"08:00", type:"build", trigger:"", color:"#6366f1" })
    setShowAdd(false)
  }

  const getAiTip = async (h: any) => {
    setTipFor(h.id)
    const t = await ask([{ role:"user", content:`عادة: "${h.name}". سلسلة: ${h.streak}ي. معدل: ${h.rate}٪. المحفز: "${h.trigger||"غير محدد"}". النوع: ${h.type==="build"?"بناء":"كسر"}. أعطني نصيحة عملية مختصرة (٢-٣ جمل).` }])
    if (t) setAiTip(t)
  }

  return (
    <div style={{height:"100%",overflowY:"auto",display:"flex",flexDirection:"column",gap:18,paddingBottom:8}}>
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
        style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,letterSpacing:"-.5px",
            display:"flex",alignItems:"center",gap:9}}>
            <Flame size={22} color="#f59e0b"/> نظام العادات
          </h2>
          <p style={{color:"#8b9cc8",fontSize:13,marginTop:4}}>بناء · كسر · تحليل AI · تتبع دقيق</p>
        </div>
        <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}}
          onClick={()=>setShowAdd(!showAdd)}
          style={{padding:"10px 18px",borderRadius:12,border:"none",cursor:"pointer",
            background:"linear-gradient(135deg,#6366f1,#818cf8)",color:"#fff",fontSize:13.5,fontWeight:600,
            display:"flex",alignItems:"center",gap:7,boxShadow:"0 4px 18px rgba(99,102,241,0.3)",
            fontFamily:"var(--font-arabic)"}}>
          <Plus size={15}/> عادة جديدة
        </motion.button>
      </motion.div>

      {/* Add form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{opacity:0,y:-10,height:0}} animate={{opacity:1,y:0,height:"auto"}}
            exit={{opacity:0,y:-10,height:0}}
            style={{background:"#0f1623",border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:20,padding:"20px 22px",overflow:"hidden"}}>
            <div style={{fontWeight:600,fontSize:14,color:"#f0f4ff",marginBottom:14}}>إضافة عادة جديدة</div>
            <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:10,marginBottom:12}}>
              <select value={form.emoji} onChange={e=>setForm(d=>({...d,emoji:e.target.value}))}
                style={{width:55,background:"#141d2e",border:"1px solid rgba(255,255,255,0.06)",
                  borderRadius:10,padding:"10px 8px",color:"#f0f4ff",fontSize:20,outline:"none"}}>
                {EMOJIS.map(e=><option key={e}>{e}</option>)}
              </select>
              <input value={form.name} onChange={e=>setForm(d=>({...d,name:e.target.value}))}
                placeholder="اسم العادة..." autoFocus
                style={{background:"#141d2e",border:"1px solid rgba(255,255,255,0.06)",
                  borderRadius:11,padding:"10px 14px",color:"#f0f4ff",fontSize:13.5,
                  outline:"none",textAlign:"right",fontFamily:"var(--font-arabic)"}}
                onFocus={e=>e.target.style.borderColor="rgba(99,102,241,0.4)"}
                onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.06)"}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
              <div>
                <label style={{color:"#3d4f72",fontSize:11,display:"block",marginBottom:5}}>الوقت</label>
                <input type="time" value={form.time} onChange={e=>setForm(d=>({...d,time:e.target.value}))}
                  style={{width:"100%",background:"#141d2e",border:"1px solid rgba(255,255,255,0.06)",
                    borderRadius:10,padding:"9px 12px",color:"#f0f4ff",outline:"none",
                    fontFamily:"var(--font-arabic)"}}/>
              </div>
              <div>
                <label style={{color:"#3d4f72",fontSize:11,display:"block",marginBottom:5}}>النوع</label>
                <select value={form.type} onChange={e=>setForm(d=>({...d,type:e.target.value}))}
                  style={{width:"100%",background:"#141d2e",border:"1px solid rgba(255,255,255,0.06)",
                    borderRadius:10,padding:"9px 12px",color:"#f0f4ff",outline:"none",fontFamily:"var(--font-arabic)"}}>
                  <option value="build">🔨 بناء عادة</option>
                  <option value="break">🚫 كسر عادة</option>
                </select>
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <label style={{color:"#3d4f72",fontSize:11,display:"block",marginBottom:5}}>اللون</label>
              <div style={{display:"flex",gap:8}}>
                {COLORS.map(c=>(
                  <button key={c} onClick={()=>setForm(d=>({...d,color:c}))} style={{
                    width:28,height:28,borderRadius:"50%",background:c,border:"none",cursor:"pointer",
                    boxShadow:form.color===c?`0 0 0 3px rgba(255,255,255,0.3)`:""
                  }}/>
                ))}
              </div>
            </div>
            <input value={form.trigger} onChange={e=>setForm(d=>({...d,trigger:e.target.value}))}
              placeholder="محفز الفشل المتوقع... (اختياري)"
              style={{width:"100%",background:"#141d2e",border:"1px solid rgba(255,255,255,0.06)",
                borderRadius:11,padding:"10px 14px",color:"#f0f4ff",fontSize:13,
                outline:"none",textAlign:"right",marginBottom:14,fontFamily:"var(--font-arabic)"}}
              onFocus={e=>e.target.style.borderColor="rgba(99,102,241,0.4)"}
              onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.06)"}/>
            <div style={{display:"flex",gap:8}}>
              <button onClick={handleAdd} style={{
                flex:1,padding:"11px",borderRadius:12,border:"none",cursor:"pointer",
                background:"linear-gradient(135deg,#6366f1,#818cf8)",color:"#fff",
                fontSize:13.5,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:7,
                fontFamily:"var(--font-arabic)"}}>
                <Save size={14}/> حفظ العادة
              </button>
              <button onClick={()=>setShowAdd(false)} style={{
                padding:"11px 16px",borderRadius:12,border:"1px solid rgba(255,255,255,0.06)",
                background:"transparent",color:"#8b9cc8",cursor:"pointer",display:"flex"}}>
                <X size={15}/>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI tip */}
      <AnimatePresence>
        {aiTip && (
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
            style={{background:"rgba(99,102,241,0.05)",border:"1px solid rgba(99,102,241,0.25)",
              borderRadius:16,padding:"14px 18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{color:"#818cf8",fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:6}}>
                <Bot size={14}/> نصيحة AI مخصصة
              </span>
              <button onClick={()=>setAiTip("")} style={{background:"none",border:"none",cursor:"pointer",color:"#3d4f72"}}>
                <X size={14}/>
              </button>
            </div>
            <p style={{color:"#f0f4ff",fontSize:13.5,lineHeight:1.75,whiteSpace:"pre-wrap"}}>{aiTip}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Habits grid */}
      {loading ? (
        <div style={{textAlign:"center",padding:"40px",color:"#3d4f72"}}>
          <div style={{width:32,height:32,borderRadius:"50%",border:"3px solid rgba(99,102,241,0.2)",
            borderTopColor:"#6366f1",animation:"spin 1s linear infinite",margin:"0 auto 12px"}}/>
          <p style={{fontSize:13}}>جارٍ تحميل العادات...</p>
        </div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>
          {habits.map((h,i)=>(
            <motion.div key={h.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
              transition={{delay:i*0.06}} whileHover={{y:-3,boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}
              style={{background:"#0f1623",border:"1px solid rgba(255,255,255,0.06)",
                borderRadius:20,padding:"20px",transition:"border-color 0.25s"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <div style={{width:48,height:48,borderRadius:15,background:`${h.color}16`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>
                  {h.emoji}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{color:"#f0f4ff",fontWeight:600,fontSize:15,
                    overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.name}</div>
                  <div style={{color:"#3d4f72",fontSize:11.5,marginTop:2,display:"flex",alignItems:"center",gap:4}}>
                    <Clock size={10}/>{h.time}
                    <span style={{padding:"1px 7px",borderRadius:99,fontSize:9,fontWeight:600,
                      background:h.type==="build"?"rgba(16,185,129,0.15)":"rgba(239,68,68,0.15)",
                      color:h.type==="build"?"#10b981":"#ef4444"}}>
                      {h.type==="build"?"بناء":"كسر"}
                    </span>
                  </div>
                </div>
                <button onClick={()=>deleteHabit(h.id)} style={{background:"none",border:"none",cursor:"pointer",
                  color:"#3d4f72",padding:4,borderRadius:6,display:"flex",transition:"color 0.2s"}}
                  onMouseEnter={e=>(e.currentTarget.style.color="#ef4444")}
                  onMouseLeave={e=>(e.currentTarget.style.color="#3d4f72")}>
                  <Trash2 size={14}/>
                </button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
                {[{l:"السلسلة",v:`${h.streak} يوم`,c:h.color},{l:"المعدل",v:`${h.rate}٪`,c:h.color}].map((s,j)=>(
                  <div key={j} style={{background:"#141d2e",borderRadius:11,padding:"10px 12px"}}>
                    <div style={{color:"#3d4f72",fontSize:9.5,textTransform:"uppercase",letterSpacing:".05em",marginBottom:3}}>{s.l}</div>
                    <div style={{color:s.c,fontSize:17,fontWeight:700}}>{s.v}</div>
                  </div>
                ))}
              </div>
              <div style={{background:"rgba(255,255,255,0.06)",borderRadius:99,height:5,overflow:"hidden",marginBottom:14}}>
                <motion.div initial={{width:0}} animate={{width:`${h.rate}%`}} transition={{duration:1,ease:"easeOut"}}
                  style={{height:"100%",borderRadius:99,background:`linear-gradient(90deg,${h.color},${h.color}88)`}}/>
              </div>
              {h.trigger&&(
                <div style={{background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.18)",
                  borderRadius:10,padding:"8px 12px",marginBottom:12}}>
                  <div style={{color:"#f59e0b",fontSize:10.5,marginBottom:2,display:"flex",alignItems:"center",gap:4}}>
                    <Lightbulb size={10}/> محفز الفشل
                  </div>
                  <div style={{color:"#8b9cc8",fontSize:12}}>{h.trigger}</div>
                </div>
              )}
              <div style={{display:"flex",gap:7}}>
                <button onClick={()=>markDone(h.id)} style={{
                  flex:1,padding:"10px",borderRadius:11,border:"none",cursor:"pointer",
                  background:h.doneToday?`linear-gradient(135deg,#10b981,#10b981bb)`:`linear-gradient(135deg,${h.color},${h.color}cc)`,
                  color:"#fff",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:6,
                  boxShadow:`0 4px 16px ${h.doneToday?"rgba(16,185,129,0.3)":h.color+"33"}`,fontFamily:"var(--font-arabic)"}}>
                  {h.doneToday?<><CheckCircle2 size={14}/>تم!</>:<><Check size={14}/>أنجزت</>}
                </button>
                <button onClick={()=>getAiTip(h)} disabled={aiLoading&&tipFor===h.id}
                  style={{padding:"10px 13px",borderRadius:11,border:"1px solid rgba(255,255,255,0.06)",
                    background:"transparent",color:"#8b9cc8",cursor:"pointer",display:"flex"}}>
                  {aiLoading&&tipFor===h.id
                    ?<span style={{width:14,height:14,borderRadius:"50%",border:"2px solid rgba(99,102,241,0.3)",borderTopColor:"#6366f1",display:"inline-block",animation:"spin 1s linear infinite"}}/>
                    :<Bot size={14}/>}
                </button>
              </div>
            </motion.div>
          ))}
          {habits.length===0&&!loading&&(
            <div style={{gridColumn:"1/-1",textAlign:"center",padding:"60px 20px",color:"#3d4f72"}}>
              <Flame size={48} strokeWidth={1} style={{margin:"0 auto 12px",opacity:0.3}}/>
              <p style={{fontSize:14}}>لم تضف أي عادة بعد. ابدأ ببناء نظامك!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
