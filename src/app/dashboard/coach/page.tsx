"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Bot } from "lucide-react"
import AIChat from "@/components/ui/AIChat"
import { useHabits } from "@/hooks/useHabits"
const PERSONAS = [
  {id:"calm",label:"🌿 الهادئ"},{id:"strict",label:"⚡ الصارم"},
  {id:"friendly",label:"😊 الصديق"},{id:"thinker",label:"🔬 المفكر"},
]
export default function CoachPage() {
  const [persona, setPersona] = useState("calm")
  const { habits } = useHabits()
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14,height:"100%",overflow:"hidden"}}>
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
        style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
        <div>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,letterSpacing:"-.5px",display:"flex",alignItems:"center",gap:9}}>
            <Bot size={22} color="#6366f1"/> المدرب الذكي
          </h2>
          <p style={{color:"#8b9cc8",fontSize:13,marginTop:4}}>Claude AI يتذكر ويتكيف ويتطور معك</p>
        </div>
        <div style={{display:"flex",gap:6}}>
          {PERSONAS.map(p=>(
            <button key={p.id} onClick={()=>setPersona(p.id)} style={{
              padding:"7px 12px",borderRadius:10,cursor:"pointer",fontSize:12,
              background:persona===p.id?"rgba(99,102,241,0.15)":"transparent",
              border:`1px solid ${persona===p.id?"rgba(99,102,241,0.4)":"rgba(255,255,255,0.06)"}`,
              color:persona===p.id?"#6366f1":"#8b9cc8",fontFamily:"var(--font-arabic)",transition:"all 0.2s",
            }}>{p.label}</button>
          ))}
        </div>
      </motion.div>
      <div style={{flex:1,overflow:"hidden"}}>
        <AIChat persona={persona} systemExtra={`عاداته: ${habits.map(h=>`${h.name}(${h.streak}ي)`).join(", ")}`}
          initialMessage="أهلاً! أنا مدربك الذكي 🤖 بماذا تريد البدء اليوم؟"/>
      </div>
    </div>
  )
}
