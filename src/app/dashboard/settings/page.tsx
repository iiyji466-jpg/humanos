"use client"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { motion } from "framer-motion"
import { Settings2, User, Bot, Bell, Shield, Trash2, Save, LogOut, Crown, Check, Atom } from "lucide-react"
import toast from "react-hot-toast"

const PERSONAS = [
  {id:"calm",    label:"المدرب الهادئ",    desc:"دافئ وصبور ومشجع",          emoji:"🌿"},
  {id:"strict",  label:"المرشد الصارم",    desc:"مباشر وصريح ومحفز بقوة",   emoji:"⚡"},
  {id:"friendly",label:"الصديق المساعد",  desc:"مرح وإيجابي ومتعاطف",       emoji:"😊"},
  {id:"thinker", label:"المفكر العميق",    desc:"تحليلي وفلسفي واستراتيجي",  emoji:"🔬"},
]

export default function SettingsPage() {
  const { data: session } = useSession()
  const [persona, setPersona] = useState(() => { try{return localStorage.getItem("humanos_persona")||"calm"}catch{return"calm"} })
  const [notif, setNotif]     = useState(true)
  const [nightProt, setNightProt] = useState(true)
  const [saving, setSaving]   = useState(false)

  const savePref = async () => {
    setSaving(true)
    localStorage.setItem("humanos_persona", persona)
    try {
      await fetch("/api/user/onboard", { method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ persona, name: session?.user?.name }) })
    } catch {}
    setTimeout(()=>setSaving(false), 600)
    toast.success("تم حفظ الإعدادات ✅")
  }

  const clearChat = () => { localStorage.removeItem("humanos_chat"); toast.success("تم مسح المحادثات") }

  const Toggle = ({ value, onChange }: { value:boolean; onChange:()=>void }) => (
    <button onClick={onChange} style={{
      width:44, height:24, borderRadius:99, border:"none", cursor:"pointer",
      background:value?"#6366f1":"#141d2e", position:"relative", transition:"background 0.3s", flexShrink:0,
    }}>
      <div style={{
        position:"absolute", top:3, width:18, height:18, borderRadius:"50%",
        background:"#fff", transition:"all 0.3s",
        right:value?3:"auto", left:value?"auto":3,
      }}/>
    </button>
  )

  const Row = ({ label, sub, children }: any) => (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
      padding:"13px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
      <div>
        <div style={{color:"#f0f4ff",fontSize:13.5,fontWeight:500}}>{label}</div>
        {sub&&<div style={{color:"#3d4f72",fontSize:11.5,marginTop:2}}>{sub}</div>}
      </div>
      {children}
    </div>
  )

  const Section = ({ title, children }: any) => (
    <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
      style={{background:"#0f1623",border:"1px solid rgba(255,255,255,0.06)",borderRadius:18,padding:"18px 20px"}}>
      <div style={{color:"#3d4f72",fontSize:10.5,textTransform:"uppercase",letterSpacing:".08em",marginBottom:2}}>{title}</div>
      {children}
    </motion.div>
  )

  return (
    <div style={{height:"100%",overflowY:"auto",display:"flex",flexDirection:"column",gap:16,paddingBottom:8,maxWidth:580}}>
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,letterSpacing:"-.5px",
          display:"flex",alignItems:"center",gap:9}}>
          <Settings2 size={22} color="#8b9cc8"/> الإعدادات
        </h2>
        <p style={{color:"#8b9cc8",fontSize:13,marginTop:4}}>خصّص تجربة HumanOS الخاصة بك</p>
      </motion.div>

      {/* Profile */}
      <Section title="الملف الشخصي">
        <Row label="الاسم" sub="يستخدمه AI لمخاطبتك">
          <div style={{background:"#141d2e",border:"1px solid rgba(255,255,255,0.06)",
            borderRadius:9,padding:"6px 13px",color:"#8b9cc8",fontSize:13}}>
            {session?.user?.name || "—"}
          </div>
        </Row>
        <Row label="البريد الإلكتروني" sub="حساب Google">
          <div style={{background:"#141d2e",border:"1px solid rgba(255,255,255,0.06)",
            borderRadius:9,padding:"6px 13px",color:"#8b9cc8",fontSize:12.5}}>
            {session?.user?.email || "—"}
          </div>
        </Row>
        <Row label="الباقة" sub="خطتك الحالية">
          <span style={{padding:"4px 12px",borderRadius:99,fontSize:11,fontWeight:600,
            background:"rgba(99,102,241,0.15)",color:"#818cf8",
            display:"inline-flex",alignItems:"center",gap:5}}>
            <Crown size={11}/> مجاني
          </span>
        </Row>
      </Section>

      {/* AI Persona */}
      <Section title="شخصية المدرب الذكي">
        <div style={{paddingTop:10,display:"flex",flexDirection:"column",gap:8}}>
          {PERSONAS.map(p=>(
            <button key={p.id} onClick={()=>setPersona(p.id)} style={{
              padding:"12px 14px",borderRadius:12,cursor:"pointer",textAlign:"right",
              background:persona===p.id?"rgba(99,102,241,0.1)":"transparent",
              border:`1px solid ${persona===p.id?"rgba(99,102,241,0.35)":"rgba(255,255,255,0.06)"}`,
              color:persona===p.id?"#6366f1":"#8b9cc8",
              display:"flex",alignItems:"center",gap:12,transition:"all 0.2s",
              fontFamily:"var(--font-arabic)"}}>
              <span style={{fontSize:20}}>{p.emoji}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:13.5,marginBottom:2}}>{p.label}</div>
                <div style={{fontSize:11.5,opacity:0.7}}>{p.desc}</div>
              </div>
              {persona===p.id&&<Check size={16} color="#6366f1"/>}
            </button>
          ))}
        </div>
      </Section>

      {/* Notifications */}
      <Section title="الإشعارات والحماية">
        <Row label="التنبيهات الذكية" sub="يذكرك بعاداتك في وقتها">
          <Toggle value={notif} onChange={()=>setNotif(!notif)}/>
        </Row>
        <Row label="نظام الحماية الليلية" sub="AI يتدخل عند ساعات الخطر">
          <Toggle value={nightProt} onChange={()=>setNightProt(!nightProt)}/>
        </Row>
      </Section>

      {/* Data */}
      <Section title="البيانات والخصوصية">
        <Row label="مسح تاريخ المحادثات" sub="لا يمكن التراجع">
          <button onClick={clearChat} style={{
            padding:"7px 14px",borderRadius:10,border:"1px solid rgba(239,68,68,0.25)",
            background:"rgba(239,68,68,0.08)",color:"#ef4444",cursor:"pointer",
            fontSize:12,display:"flex",alignItems:"center",gap:5,fontFamily:"var(--font-arabic)"}}>
            <Trash2 size={13}/> مسح
          </button>
        </Row>
      </Section>

      {/* Save */}
      <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}}
        onClick={savePref} disabled={saving}
        style={{padding:"13px",borderRadius:14,border:"none",cursor:"pointer",
          background:"linear-gradient(135deg,#6366f1,#818cf8)",color:"#fff",fontSize:14.5,fontWeight:700,
          display:"flex",alignItems:"center",justifyContent:"center",gap:8,
          boxShadow:"0 6px 24px rgba(99,102,241,0.3)",fontFamily:"var(--font-arabic)"}}>
        {saving?<span style={{width:16,height:16,borderRadius:"50%",border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",display:"inline-block",animation:"spin 1s linear infinite"}}/>:<Save size={16}/>}
        {saving?"جارٍ الحفظ...":"حفظ الإعدادات"}
      </motion.button>

      {/* Info */}
      <div style={{background:"rgba(99,102,241,0.04)",border:"1px solid rgba(99,102,241,0.15)",
        borderRadius:16,padding:"16px 20px"}}>
        <div style={{color:"#818cf8",fontWeight:600,fontSize:13,marginBottom:4,
          display:"flex",alignItems:"center",gap:6}}>
          <Atom size={13}/> HumanOS AI
        </div>
        <div style={{color:"#3d4f72",fontSize:12.5,lineHeight:1.7}}>
          الإصدار ٢.٠ • مدعوم بـ Claude AI من Anthropic<br/>
          بيانات محفوظة بأمان • لا إعلانات • خصوصيتك أولوية
        </div>
      </div>

      {/* Sign out */}
      <button onClick={()=>signOut({callbackUrl:"/"})} style={{
        padding:"12px",borderRadius:13,border:"1px solid rgba(239,68,68,0.2)",
        background:"rgba(239,68,68,0.06)",color:"#ef4444",cursor:"pointer",
        display:"flex",alignItems:"center",justifyContent:"center",gap:7,
        fontSize:13.5,fontWeight:600,fontFamily:"var(--font-arabic)"}}>
        <LogOut size={16}/> تسجيل الخروج
      </button>
    </div>
  )
}
