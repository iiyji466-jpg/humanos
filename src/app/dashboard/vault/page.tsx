"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Archive, Save, Trash2, Bookmark, Send, Search, X, Bot } from "lucide-react"
import { useAI } from "@/hooks/useAI"
import toast from "react-hot-toast"

const TYPES = [
  {id:"goal",label:"هدف",emoji:"🎯",color:"#6366f1"},
  {id:"insight",label:"رؤية",emoji:"💡",color:"#06b6d4"},
  {id:"habit",label:"عادة",emoji:"🔥",color:"#10b981"},
  {id:"note",label:"ملاحظة",emoji:"📝",color:"#f59e0b"},
  {id:"quote",label:"اقتباس",emoji:"✨",color:"#8b5cf6"},
]

interface Memory { id:string; content:string; type:string; pinned:boolean; createdAt:string }

export default function VaultPage() {
  const { ask, loading } = useAI()
  const [memories, setMemories] = useState<Memory[]>([])
  const [memLoading, setMemLoading] = useState(true)
  const [newMem, setNewMem] = useState("")
  const [memType, setMemType] = useState("insight")
  const [search, setSearch] = useState("")
  const [query, setQuery] = useState("")
  const [aiRes, setAiRes] = useState("")

  useEffect(()=>{
    fetch("/api/memories").then(r=>r.json()).then(d=>{ if(Array.isArray(d))setMemories(d) }).finally(()=>setMemLoading(false))
  },[])

  const add = async () => {
    if (!newMem.trim()) return
    const r = await fetch("/api/memories",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:newMem,type:memType,pinned:false})})
    const m = await r.json()
    setMemories(prev=>[m,...prev]); setNewMem(""); toast.success("تمت الإضافة ✅")
  }

  const del = async (id:string) => {
    await fetch("/api/memories",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})})
    setMemories(prev=>prev.filter(m=>m.id!==id)); toast.success("تم الحذف")
  }

  const queryAI = async () => {
    if (!query.trim()) return
    const r = await ask([{role:"user",content:`بناءً على ذاكرتي: ${memories.map(m=>m.content).join(" | ")}. أجب: ${query}`}])
    if (r) setAiRes(r)
  }

  const filtered = memories.filter(m=>!search||m.content.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0))

  return (
    <div style={{height:"100%",overflowY:"auto",display:"flex",flexDirection:"column",gap:18,paddingBottom:8}}>
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,letterSpacing:"-.5px",
          display:"flex",alignItems:"center",gap:9}}>
          <Archive size={22} color="#f59e0b"/> خزنة الذاكرة
        </h2>
        <p style={{color:"#8b9cc8",fontSize:13,marginTop:4}}>ذاكرة AI تحت سيطرتك الكاملة — {memories.length} ذكرى</p>
      </motion.div>

      {/* Add memory */}
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.05}}
        style={{background:"#0f1623",border:"1px solid rgba(255,255,255,0.06)",borderRadius:18,padding:"18px 20px"}}>
        <div style={{color:"#f0f4ff",fontWeight:600,fontSize:14,marginBottom:12}}>إضافة ذكرى جديدة</div>
        <div style={{display:"flex",gap:7,marginBottom:10,flexWrap:"wrap"}}>
          {TYPES.map(t=>(
            <button key={t.id} onClick={()=>setMemType(t.id)} style={{
              padding:"5px 12px",borderRadius:99,cursor:"pointer",fontSize:12,
              background:memType===t.id?`${t.color}20`:"transparent",
              border:`1px solid ${memType===t.id?t.color+"55":"rgba(255,255,255,0.06)"}`,
              color:memType===t.id?t.color:"#3d4f72",fontFamily:"var(--font-arabic)"}}>
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          <textarea value={newMem} onChange={e=>setNewMem(e.target.value)}
            placeholder="أضف ذكرى، رؤية، هدف، أو ملاحظة تريد AI أن يتذكرها عنك..."
            style={{flex:1,background:"#141d2e",border:"1px solid rgba(255,255,255,0.06)",
              borderRadius:11,padding:"10px 13px",color:"#f0f4ff",fontSize:13,
              outline:"none",resize:"none",height:72,lineHeight:1.65,
              fontFamily:"var(--font-arabic)",textAlign:"right"}}
            onFocus={e=>e.target.style.borderColor="rgba(99,102,241,0.4)"}
            onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.06)"}/>
          <button onClick={add} style={{padding:"10px 16px",borderRadius:11,border:"none",cursor:"pointer",
            background:"linear-gradient(135deg,#6366f1,#818cf8)",color:"#fff",
            alignSelf:"flex-end",display:"flex",alignItems:"center",boxShadow:"0 4px 16px rgba(99,102,241,0.3)"}}>
            <Save size={14}/>
          </button>
        </div>
      </motion.div>

      {/* AI query */}
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
        style={{background:"rgba(99,102,241,0.04)",border:"1px solid rgba(99,102,241,0.18)",
          borderRadius:18,padding:"16px 20px"}}>
        <div style={{color:"#818cf8",fontWeight:600,fontSize:13.5,marginBottom:10,
          display:"flex",alignItems:"center",gap:6}}>
          <Bot size={14}/> اسأل AI عن ذاكرتك
        </div>
        <div style={{display:"flex",gap:8}}>
          <input value={query} onChange={e=>setQuery(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&queryAI()}
            placeholder="مثال: ما أهدافي؟ ما أبرز رؤاي؟ ماذا يقول AI عني؟"
            style={{flex:1,background:"#0f1623",border:"1px solid rgba(255,255,255,0.06)",
              borderRadius:11,padding:"9px 13px",color:"#f0f4ff",fontSize:13,
              outline:"none",textAlign:"right",fontFamily:"var(--font-arabic)"}}
            onFocus={e=>e.target.style.borderColor="rgba(99,102,241,0.4)"}
            onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.06)"}/>
          <button onClick={queryAI} disabled={loading||!query.trim()} style={{
            padding:"9px 14px",borderRadius:11,border:"none",cursor:"pointer",
            background:"linear-gradient(135deg,#6366f1,#818cf8)",color:"#fff",display:"flex",
            opacity:loading||!query.trim()?0.6:1}}>
            {loading?<span style={{width:14,height:14,borderRadius:"50%",border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",display:"inline-block",animation:"spin 1s linear infinite"}}/>:<Send size={14}/>}
          </button>
        </div>
        {aiRes&&<p style={{color:"#8b9cc8",fontSize:13,lineHeight:1.7,marginTop:10,whiteSpace:"pre-wrap"}}>{aiRes}</p>}
      </motion.div>

      {/* Search */}
      <div style={{position:"relative"}}>
        <Search size={14} color="#3d4f72" style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)"}}/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث في الذاكرة..."
          style={{width:"100%",background:"#0f1623",border:"1px solid rgba(255,255,255,0.06)",
            borderRadius:12,padding:"9px 40px 9px 14px",color:"#f0f4ff",fontSize:13,
            outline:"none",textAlign:"right",fontFamily:"var(--font-arabic)"}}
          onFocus={e=>e.target.style.borderColor="rgba(99,102,241,0.4)"}
          onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.06)"}/>
      </div>

      {/* Memory list */}
      <AnimatePresence>
        {filtered.map((m,i)=>{
          const t=TYPES.find(t=>t.id===m.type)||TYPES[1]
          return(
            <motion.div key={m.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
              exit={{opacity:0,x:-20}} transition={{delay:i*0.04}}
              whileHover={{y:-2}} style={{background:"#0f1623",
                border:`1px solid ${m.pinned?t.color+"30":"rgba(255,255,255,0.06)"}`,
                borderRadius:16,padding:"14px 16px",transition:"all 0.25s"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:7,flexWrap:"wrap"}}>
                    <span style={{padding:"2px 9px",borderRadius:99,fontSize:10,fontWeight:600,
                      background:`${t.color}18`,color:t.color}}>
                      {t.emoji} {t.label}
                    </span>
                    {m.pinned&&<span style={{padding:"2px 7px",borderRadius:99,fontSize:10,fontWeight:600,
                      background:"rgba(245,158,11,0.15)",color:"#f59e0b"}}>📌</span>}
                    <span style={{color:"#3d4f72",fontSize:10.5,marginRight:"auto"}}>
                      {new Date(m.createdAt).toLocaleDateString("ar")}
                    </span>
                  </div>
                  <p style={{color:"#f0f4ff",fontSize:13.5,lineHeight:1.7}}>{m.content}</p>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:4,flexShrink:0}}>
                  <button onClick={()=>del(m.id)} style={{background:"none",border:"none",cursor:"pointer",
                    color:"#3d4f72",padding:4,borderRadius:5,display:"flex",transition:"color 0.2s"}}
                    onMouseEnter={e=>(e.currentTarget.style.color="#ef4444")}
                    onMouseLeave={e=>(e.currentTarget.style.color="#3d4f72")}>
                    <Trash2 size={14}/>
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
      {!memLoading&&filtered.length===0&&(
        <div style={{textAlign:"center",padding:"50px",color:"#3d4f72"}}>
          <Archive size={48} strokeWidth={1} style={{margin:"0 auto 12px",opacity:0.25}}/>
          <p style={{fontSize:14}}>لا توجد ذكريات بعد. أضف أولى ذكرياتك!</p>
        </div>
      )}
    </div>
  )
}
