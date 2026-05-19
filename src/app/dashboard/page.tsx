"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Zap, Flame, Focus, Award, Target, BarChart3, Sun,
  CheckCircle2, Circle, Trash2, Plus, Sparkles, Bot, TrendingUp, ArrowUpRight } from "lucide-react"
import AIChat from "@/components/ui/AIChat"
import { useHabits } from "@/hooks/useHabits"
import { useAI } from "@/hooks/useAI"

const WEEK = ["إث","ثل","أر","خم","جم","سب","أح"]
const MOODS = [
  { id:"great", label:"ممتاز", emoji:"😄", color:"#10b981" },
  { id:"good",  label:"جيد",   emoji:"🙂", color:"#06b6d4" },
  { id:"okay",  label:"عادي",  emoji:"😐", color:"#f59e0b" },
  { id:"low",   label:"متعب",  emoji:"😔", color:"#6366f1" },
  { id:"bad",   label:"سيء",   emoji:"😞", color:"#ef4444" },
]

export default function DashboardPage() {
  const { data: session } = useSession()
  const { habits, markDone } = useHabits()
  const { ask, loading: aiLoading } = useAI()
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("humanos_tasks") || "[]") } catch { return [
      { id:1, text:"مراجعة أهداف الأسبوع", done:false, p:"high" },
      { id:2, text:"التأمل ١٥ دقيقة",       done:false, p:"med"  },
    ]}
  })
  const [newTask, setNewTask] = useState("")
  const [mood, setMood] = useState("")
  const [briefing, setBriefing] = useState("")
  const [weekData] = useState([72,58,88,45,81,66,0].map((v,i) => i === new Date().getDay() ? 0 : v))

  useEffect(() => { localStorage.setItem("humanos_tasks", JSON.stringify(tasks)) }, [tasks])
  useEffect(() => { if (habits.length) localStorage.setItem("humanos_habits", JSON.stringify(habits)) }, [habits])

  const toggleTask = (id: number) => setTasks((t: any[]) => t.map((x: any) => x.id === id ? {...x, done:!x.done} : x))
  const removeTask = (id: number) => setTasks((t: any[]) => t.filter((x: any) => x.id !== id))
  const addTask = () => {
    if (!newTask.trim()) return
    setTasks((t: any[]) => [...t, { id:Date.now(), text:newTask, done:false, p:"med" }])
    setNewTask("")
  }

  const genBriefing = async () => {
    const b = await ask([{ role:"user", content:`أنشئ تقريراً صباحياً مخصصاً. العادات: ${habits.map(h=>`${h.name}(${h.streak}ي)`).join(",")}. المزاج: ${mood||"غير محدد"}. أعطني: تحية + أهم ٣ أشياء + كلمة تحفيزية. قصير ومؤثر.` }])
    if (b) setBriefing(b)
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "☀️ صباح الخير" : hour < 17 ? "🌤️ مساء النور" : "🌙 مساء الخير"
  const doneTasks = tasks.filter((t: any) => t.done).length
  const doneHabits = habits.filter(h => h.doneToday).length
  const score = Math.min(100, Math.round((doneHabits / Math.max(habits.length,1)) * 50 + (habits.reduce((a,h) => a+h.rate,0)/Math.max(habits.length,1)) * 0.3 + 20))

  const StatCard = ({ label, value, sub, color, Icon, delay=0 }: any) => (
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay}}
      whileHover={{y:-3,boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}
      style={{ flex:1, minWidth:130, background:"#0f1623",
        border:"1px solid rgba(255,255,255,0.06)", borderRadius:18, padding:"18px 16px",
        transition:"border-color 0.25s", cursor:"default" }}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
        <div style={{width:38,height:38,borderRadius:12,background:`${color}18`,
          display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Icon size={18} color={color} strokeWidth={1.8}/>
        </div>
        <span style={{color:"#10b981",fontSize:11,fontWeight:600,
          display:"flex",alignItems:"center",gap:2}}>
          <ArrowUpRight size={10}/>+12٪
        </span>
      </div>
      <div style={{color:"#3d4f72",fontSize:10.5,textTransform:"uppercase",
        letterSpacing:".06em",marginBottom:4}}>{label}</div>
      <div style={{color:"#f0f4ff",fontSize:22,fontWeight:700,letterSpacing:"-.5px",lineHeight:1}}>{value}</div>
      {sub && <div style={{color,fontSize:11.5,marginTop:4,fontWeight:500}}>{sub}</div>}
    </motion.div>
  )

  return (
    <div style={{display:"flex",gap:18,height:"100%",overflow:"hidden"}}>
      {/* Main scroll area */}
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",
        gap:16,paddingBottom:8}}>

        {/* Greeting */}
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}>
          <div style={{color:"#3d4f72",fontSize:12,marginBottom:4}}>
            {new Date().toLocaleDateString("ar",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
          </div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,
            letterSpacing:"-1px",lineHeight:1.2,marginBottom:6}}>
            {greeting}، {session?.user?.name?.split(" ")[0] || "صديقي"} 👋
          </h1>
          <p style={{color:"#8b9cc8",fontSize:13.5}}>
            أنجزت <span style={{color:"#f0f4ff",fontWeight:600}}>{doneTasks}/{tasks.length}</span> مهام
            {" · "}
            <span style={{color:"#f0f4ff",fontWeight:600}}>{doneHabits}/{habits.length}</span> عادات اليوم
          </p>
        </motion.div>

        {/* Mood */}
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.05}}
          style={{background:"#0f1623",border:"1px solid rgba(255,255,255,0.06)",
            borderRadius:18,padding:"14px 16px"}}>
          <div style={{color:"#8b9cc8",fontSize:11.5,marginBottom:10,
            display:"flex",alignItems:"center",gap:5}}>
            كيف حالك الآن؟
          </div>
          <div style={{display:"flex",gap:6}}>
            {MOODS.map(m => (
              <button key={m.id} onClick={() => setMood(m.id)}
                style={{
                  flex:1,padding:"8px 4px",borderRadius:11,cursor:"pointer",textAlign:"center",
                  background:mood===m.id?`${m.color}18`:"transparent",
                  border:`1px solid ${mood===m.id?m.color+"55":"rgba(255,255,255,0.06)"}`,
                  transition:"all 0.2s",
                }}>
                <div style={{fontSize:18,marginBottom:2}}>{m.emoji}</div>
                <div style={{color:mood===m.id?m.color:"#3d4f72",fontSize:10,fontWeight:mood===m.id?600:400}}>{m.label}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <StatCard label="نقاط اليوم" value={score} sub="يعكس أداءك الفعلي" color="#6366f1" Icon={Zap} delay={0.1}/>
          <StatCard label="العادات" value={`${doneHabits}/${habits.length}`} sub={`${Math.round(doneHabits/Math.max(habits.length,1)*100)}٪`} color="#10b981" Icon={Flame} delay={0.15}/>
          <StatCard label="أفضل سلسلة" value={`${Math.max(...habits.map(h=>h.streak),0)}ي`} sub="استمر!" color="#f59e0b" Icon={Award} delay={0.2}/>
        </div>

        {/* AI Briefing */}
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.25}}
          style={{background:"rgba(99,102,241,0.04)",border:"1px solid rgba(99,102,241,0.18)",
            borderRadius:18,padding:"16px 18px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:briefing?12:0}}>
            <div style={{color:"#818cf8",fontWeight:600,fontSize:13.5,
              display:"flex",alignItems:"center",gap:7}}>
              <Sun size={15}/> التقرير الصباحي AI
            </div>
            <button onClick={genBriefing} disabled={aiLoading}
              style={{background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.2)",
                borderRadius:9,padding:"6px 12px",color:"#818cf8",cursor:"pointer",
                display:"flex",alignItems:"center",gap:5,fontSize:11.5,
                fontFamily:"var(--font-arabic)"}}>
              {aiLoading
                ? <span style={{width:12,height:12,borderRadius:"50%",border:"2px solid rgba(99,102,241,0.3)",borderTopColor:"#6366f1",display:"inline-block",animation:"spin 1s linear infinite"}}/>
                : <Sparkles size={12}/>}
              {briefing?"تحديث":"توليد"}
            </button>
          </div>
          {briefing
            ? <p style={{color:"#8b9cc8",fontSize:13,lineHeight:1.75,whiteSpace:"pre-wrap"}}>{briefing}</p>
            : <p style={{color:"#3d4f72",fontSize:12.5}}>اضغط "توليد" للحصول على تقريرك الصباحي المخصص بـ AI</p>}
        </motion.div>

        {/* Tasks */}
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
          style={{background:"#0f1623",border:"1px solid rgba(255,255,255,0.06)",borderRadius:18,padding:"18px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{color:"#f0f4ff",fontWeight:700,fontSize:14.5,
              display:"flex",alignItems:"center",gap:7}}>
              <Target size={15} color="#6366f1"/> مهام اليوم
            </div>
          </div>
          <div style={{display:"flex",gap:7,marginBottom:12}}>
            <input value={newTask} onChange={e=>setNewTask(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&addTask()}
              placeholder="أضف مهمة جديدة..."
              style={{flex:1,background:"#141d2e",border:"1px solid rgba(255,255,255,0.06)",
                borderRadius:11,padding:"9px 13px",color:"#f0f4ff",fontSize:13,
                outline:"none",textAlign:"right",fontFamily:"var(--font-arabic)"}}
              onFocus={e=>e.target.style.borderColor="rgba(99,102,241,0.4)"}
              onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.06)"}/>
            <button onClick={addTask}
              style={{padding:"9px 14px",borderRadius:11,
                background:"linear-gradient(135deg,#6366f1,#818cf8)",
                border:"none",color:"#fff",cursor:"pointer",flexShrink:0,
                display:"flex",alignItems:"center"}}>
              <Plus size={15}/>
            </button>
          </div>
          {tasks.map((t: any, i: number) => (
            <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",
              borderBottom:i<tasks.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
              <div onClick={()=>toggleTask(t.id)} style={{cursor:"pointer",flexShrink:0}}>
                {t.done
                  ? <CheckCircle2 size={20} color="#10b981" strokeWidth={1.8}/>
                  : <Circle size={20} color="#3d4f72" strokeWidth={1.5}/>}
              </div>
              <span onClick={()=>toggleTask(t.id)} style={{flex:1,color:t.done?"#3d4f72":"#f0f4ff",
                fontSize:13.5,textDecoration:t.done?"line-through":"none",cursor:"pointer"}}>
                {t.text}
              </span>
              <span style={{
                display:"inline-flex",alignItems:"center",padding:"2px 9px",
                borderRadius:99,fontSize:10,fontWeight:600,
                background:t.p==="high"?"rgba(239,68,68,0.12)":t.p==="med"?"rgba(245,158,11,0.12)":"rgba(16,185,129,0.12)",
                color:t.p==="high"?"#ef4444":t.p==="med"?"#f59e0b":"#10b981",
              }}>{t.p==="high"?"عالي":t.p==="med"?"متوسط":"عادي"}</span>
              <button onClick={()=>removeTask(t.id)} style={{background:"none",border:"none",
                cursor:"pointer",color:"#3d4f72",padding:3,borderRadius:5,
                display:"flex",transition:"color 0.2s"}}
                onMouseEnter={e=>(e.currentTarget.style.color="#ef4444")}
                onMouseLeave={e=>(e.currentTarget.style.color="#3d4f72")}>
                <Trash2 size={13}/>
              </button>
            </div>
          ))}
          {tasks.length===0&&<p style={{color:"#3d4f72",fontSize:13,textAlign:"center",padding:"16px 0"}}>لا توجد مهام. أضف أولى مهامك!</p>}
        </motion.div>

        {/* Habits summary */}
        {habits.length > 0 && (
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.35}}
            style={{background:"#0f1623",border:"1px solid rgba(255,255,255,0.06)",borderRadius:18,padding:"18px"}}>
            <div style={{color:"#f0f4ff",fontWeight:700,fontSize:14.5,
              display:"flex",alignItems:"center",gap:7,marginBottom:14}}>
              <Flame size={15} color="#f59e0b"/> العادات اليوم
            </div>
            {habits.map((h,i)=>(
              <div key={h.id} style={{display:"flex",alignItems:"center",gap:11,padding:"9px 0",
                borderBottom:i<habits.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
                <span style={{fontSize:18,flexShrink:0}}>{h.emoji}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{color:"#f0f4ff",fontSize:13,fontWeight:500}}>{h.name}</span>
                    <span style={{color:h.color,fontSize:12,fontWeight:700}}>{h.rate}٪</span>
                  </div>
                  <div style={{background:"rgba(255,255,255,0.06)",borderRadius:99,height:4,overflow:"hidden"}}>
                    <div style={{width:`${h.rate}%`,height:"100%",borderRadius:99,
                      background:`linear-gradient(90deg,${h.color},${h.color}88)`,
                      transition:"width 1s ease"}}/>
                  </div>
                </div>
                <button onClick={()=>markDone(h.id)} style={{
                  background:"none",border:"none",cursor:"pointer",flexShrink:0}}>
                  {h.doneToday
                    ? <CheckCircle2 size={20} color="#10b981" strokeWidth={2}/>
                    : <Circle size={20} color="#3d4f72" strokeWidth={1.5}/>}
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {/* Week chart */}
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.4}}
          style={{background:"#0f1623",border:"1px solid rgba(255,255,255,0.06)",borderRadius:18,padding:"18px"}}>
          <div style={{color:"#f0f4ff",fontWeight:700,fontSize:14.5,
            display:"flex",alignItems:"center",gap:7,marginBottom:16}}>
            <BarChart3 size={15} color="#06b6d4"/> أداء الأسبوع
          </div>
          <div style={{display:"flex",alignItems:"flex-end",gap:8,height:90}}>
            {weekData.map((v,i)=>{
              const isToday = i === new Date().getDay()
              const val = isToday ? score : v
              return (
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",
                  alignItems:"center",gap:5,height:"100%",justifyContent:"flex-end"}}>
                  <motion.div initial={{height:0}} animate={{height:`${Math.max(val,5)}%`}}
                    transition={{delay:i*0.05,duration:0.6,ease:"easeOut"}}
                    style={{
                      width:"100%",borderRadius:"5px 5px 0 0",
                      background:isToday?"linear-gradient(180deg,#6366f1,#6366f188)":"rgba(99,102,241,0.2)",
                      boxShadow:isToday?"0 -4px 16px rgba(99,102,241,0.3)":"none",
                    }}/>
                  <span style={{color:isToday?"#6366f1":"#3d4f72",fontSize:10,fontWeight:isToday?700:400}}>
                    {WEEK[i]}
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Right: AI Panel */}
      <div style={{width:282,flexShrink:0,height:"100%",overflow:"hidden"}}>
        <AIChat compact persona="calm" initialMessage={`مرحباً ${session?.user?.name?.split(" ")[0]||""}! 🌟 أنا مدربك الذكي. كيف يمكنني مساعدتك اليوم؟`}/>
      </div>
    </div>
  )
}
