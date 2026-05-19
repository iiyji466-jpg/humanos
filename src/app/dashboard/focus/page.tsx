"use client"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Play, Pause, RotateCcw, Bot, Zap, Volume2, VolumeX, PenLine } from "lucide-react"
import { useAI } from "@/hooks/useAI"
import toast from "react-hot-toast"

const MODES = [
  {id:"work",label:"عمل عميق",secs:25*60,emoji:"🔥",color:"#6366f1"},
  {id:"short",label:"استراحة",secs:5*60,emoji:"☕",color:"#10b981"},
  {id:"long",label:"راحة طويلة",secs:15*60,emoji:"🌙",color:"#06b6d4"},
]
const SOUNDS = [
  {id:"rain",label:"مطر",emoji:"🌧️"},{id:"ocean",label:"أمواج",emoji:"🌊"},
  {id:"forest",label:"غابة",emoji:"🌿"},{id:"fire",label:"مدفأة",emoji:"🔥"},
  {id:"cafe",label:"مقهى",emoji:"☕"},{id:"space",label:"فضاء",emoji:"🌌"},
]

export default function FocusPage() {
  const { ask, loading } = useAI()
  const [mode, setMode] = useState(MODES[0])
  const [secs, setSecs] = useState(MODES[0].secs)
  const [run, setRun] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [sound, setSound] = useState<string|null>(null)
  const [tip, setTip] = useState("ابدأ جلستك الآن. أغلق كل الإشعارات وركز على مهمة واحدة فقط.")
  const [journal, setJournal] = useState("")
  const intervalRef = useRef<NodeJS.Timeout|null>(null)
  const audioCtxRef = useRef<AudioContext|null>(null)
  const gainRef = useRef<GainNode|null>(null)
  const srcRef = useRef<AudioBufferSourceNode|null>(null)

  useEffect(()=>{
    if(run){
      intervalRef.current=setInterval(()=>{
        setSecs(s=>{
          if(s<=1){setRun(false);setSessions(n=>n+1);toast.success("🎉 أحسنت! جلسة مكتملة");return 0}
          return s-1
        })
      },1000)
    }
    return()=>{if(intervalRef.current)clearInterval(intervalRef.current)}
  },[run])

  const reset=()=>{setRun(false);setSecs(mode.secs)}
  const changeMode=(m:typeof MODES[0])=>{setMode(m);setRun(false);setSecs(m.secs)}

  const playNoise=(type:string)=>{
    try{
      if(!audioCtxRef.current)audioCtxRef.current=new(window.AudioContext||(window as any).webkitAudioContext)()
      const ctx=audioCtxRef.current
      srcRef.current?.stop()
      const g=ctx.createGain();g.gain.value=0.3;g.connect(ctx.destination);gainRef.current=g
      const buf=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate)
      const d=buf.getChannelData(0);let last=0
      for(let i=0;i<d.length;i++){const w=Math.random()*2-1;if(type==="brown"){last=(last+0.02*w)/1.02;d[i]=last*3.5}else d[i]=w*0.3}
      const s=ctx.createBufferSource();s.buffer=buf;s.loop=true;s.connect(g);s.start();srcRef.current=s
    }catch{}
  }
  const toggleSound=(id:string)=>{
    if(sound===id){srcRef.current?.stop();setSound(null)}
    else{playNoise(id);setSound(id)}
  }

  const getTip=async()=>{
    const t=await ask([{role:"user",content:`جلسة ${mode.label}. أنجزت ${sessions} جلسات. أعطني جملة تحفيزية واحدة.`}])
    if(t)setTip(t)
  }

  const mm=String(Math.floor(secs/60)).padStart(2,"0")
  const ss=String(secs%60).padStart(2,"0")
  const pct=(mode.secs-secs)/mode.secs
  const R=108,C=2*Math.PI*R

  return(
    <div style={{height:"100%",overflowY:"auto",display:"flex",flexDirection:"column",
      alignItems:"center",gap:20,paddingBottom:20}}>
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} style={{textAlign:"center",paddingTop:10}}>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,letterSpacing:"-.5px",
          display:"flex",alignItems:"center",gap:9,justifyContent:"center"}}>
          <Zap size={22} color="#6366f1"/> وضع التركيز العميق
        </h2>
        <p style={{color:"#8b9cc8",fontSize:13,marginTop:4}}>
          جلسات اليوم: <span style={{color:"#6366f1",fontWeight:700}}>{sessions}</span>
        </p>
      </motion.div>

      {/* Timer circle */}
      <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:0.1}}
        style={{position:"relative",width:260,height:260,flexShrink:0}}>
        <div style={{position:"absolute",inset:30,borderRadius:"50%",
          background:`radial-gradient(circle,${mode.color}25,transparent 70%)`,filter:"blur(20px)"}}/>
        <svg width="260" height="260" style={{position:"absolute",transform:"rotate(-90deg)"}}>
          <circle cx="130" cy="130" r={R} stroke="rgba(255,255,255,0.05)" strokeWidth="10" fill="none"/>
          <motion.circle cx="130" cy="130" r={R}
            stroke={mode.color} strokeWidth="10" fill="none"
            strokeDasharray={C} strokeDashoffset={C*(1-pct)}
            strokeLinecap="round"
            animate={{strokeDashoffset:C*(1-pct)}}
            transition={{duration:1,ease:"linear"}}
            style={{filter:`drop-shadow(0 0 12px ${mode.color})`}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",
          alignItems:"center",justifyContent:"center"}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:52,fontWeight:800,
            letterSpacing:"-3px",lineHeight:1,color:"#f0f4ff"}}>{mm}:{ss}</div>
          <div style={{color:"#3d4f72",fontSize:11,letterSpacing:".1em",
            textTransform:"uppercase",marginTop:6}}>{mode.emoji} {mode.label}</div>
        </div>
      </motion.div>

      {/* Controls */}
      <div style={{display:"flex",gap:10}}>
        <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>setRun(!run)}
          style={{padding:"13px 30px",borderRadius:13,border:"none",cursor:"pointer",
            background:`linear-gradient(135deg,${mode.color},${mode.color}bb)`,
            color:"#fff",fontSize:15,fontWeight:700,display:"flex",alignItems:"center",gap:8,
            boxShadow:`0 6px 24px ${mode.color}40`,fontFamily:"var(--font-arabic)"}}>
          {run?<><Pause size={17}/>إيقاف</>:<><Play size={17}/>ابدأ</>}
        </motion.button>
        <button onClick={reset} style={{padding:"13px 16px",borderRadius:13,
          background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.06)",
          color:"#8b9cc8",cursor:"pointer",display:"flex"}}>
          <RotateCcw size={17}/>
        </button>
        <button onClick={getTip} disabled={loading} style={{padding:"13px 16px",borderRadius:13,
          background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.06)",
          color:"#8b9cc8",cursor:"pointer",display:"flex"}}>
          <Bot size={17}/>
        </button>
      </div>

      {/* Mode tabs */}
      <div style={{display:"flex",gap:8}}>
        {MODES.map(m=>(
          <button key={m.id} onClick={()=>changeMode(m)} style={{
            padding:"8px 16px",borderRadius:11,cursor:"pointer",
            background:mode.id===m.id?`${m.color}18`:"transparent",
            border:`1px solid ${mode.id===m.id?m.color+"44":"rgba(255,255,255,0.06)"}`,
            color:mode.id===m.id?m.color:"#8b9cc8",fontSize:12.5,
            fontFamily:"var(--font-arabic)",transition:"all 0.2s",
          }}>{m.emoji} {m.label}</button>
        ))}
      </div>

      {/* Sounds */}
      <div style={{background:"#0f1623",border:"1px solid rgba(255,255,255,0.06)",
        borderRadius:18,padding:"16px 18px",width:"100%",maxWidth:500}}>
        <div style={{color:"#8b9cc8",fontSize:12,marginBottom:12,display:"flex",alignItems:"center",gap:5}}>
          <Volume2 size={13}/> الأصوات المحيطية
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
          {SOUNDS.map(s=>(
            <button key={s.id} onClick={()=>toggleSound(s.id)} style={{
              padding:"9px 6px",borderRadius:10,cursor:"pointer",textAlign:"center",
              background:sound===s.id?"rgba(99,102,241,0.15)":"transparent",
              border:`1px solid ${sound===s.id?"rgba(99,102,241,0.35)":"rgba(255,255,255,0.06)"}`,
              color:sound===s.id?"#6366f1":"#8b9cc8",fontSize:11.5,fontFamily:"var(--font-arabic)",
            }}>
              <div style={{fontSize:18,marginBottom:3}}>{s.emoji}</div>{s.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Tip */}
      <div style={{background:"rgba(99,102,241,0.05)",border:"1px solid rgba(99,102,241,0.18)",
        borderRadius:16,padding:"14px 18px",width:"100%",maxWidth:500}}>
        <div style={{color:"#818cf8",fontSize:12,fontWeight:600,marginBottom:5,
          display:"flex",alignItems:"center",gap:5}}>
          <Bot size={13}/> نصيحة المدرب
        </div>
        <p style={{color:"#8b9cc8",fontSize:13,lineHeight:1.65}}>{loading?"يولد نصيحة...":tip}</p>
      </div>

      {/* Journal */}
      <div style={{background:"#0f1623",border:"1px solid rgba(255,255,255,0.06)",
        borderRadius:16,padding:"14px 18px",width:"100%",maxWidth:500}}>
        <div style={{color:"#8b9cc8",fontSize:12,marginBottom:8,display:"flex",alignItems:"center",gap:5}}>
          <PenLine size={13}/> يوميات الجلسة
        </div>
        <textarea value={journal} onChange={e=>setJournal(e.target.value)}
          placeholder="ما الذي تركز عليه في هذه الجلسة؟"
          style={{width:"100%",background:"#141d2e",border:"1px solid rgba(255,255,255,0.06)",
            borderRadius:11,padding:"10px 13px",color:"#f0f4ff",fontSize:13,
            outline:"none",resize:"vertical",minHeight:70,lineHeight:1.65,
            fontFamily:"var(--font-arabic)",textAlign:"right"}}
          onFocus={e=>e.target.style.borderColor="rgba(99,102,241,0.4)"}
          onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.06)"}/>
      </div>
    </div>
  )
}
