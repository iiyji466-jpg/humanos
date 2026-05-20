"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  Atom, Bot, Flame, Target, BookOpen, Brain, Database, Trophy,
  Rocket, Sparkles, Crown, Check, ChevronDown, Star,
  Headphones, Zap, Users, TrendingUp, Wind, Gift,
  MessageCircle, BarChart3, Layers
} from "lucide-react"

const FEATURES = [
  { Icon: Bot,        title:"المدرب الذكي",   desc:"Claude AI يتذكرك ويتكيف مع أسلوبك ويتطور معك يومياً",       color:"#6366f1" },
  { Icon: Flame,      title:"ذكاء العادات",    desc:"تحليل أنماط السلوك والمحفزات لبناء عادات لا تنكسر",         color:"#f59e0b" },
  { Icon: Zap,        title:"وضع التركيز",     desc:"بومودورو + أصوات محيطية + تشجيع AI في الوقت الفعلي",        color:"#06b6d4" },
  { Icon: Headphones, title:"مكتبة صوتية",     desc:"كتب صوتية ينسقها AI بناءً على حالتك وأهدافك الشخصية",      color:"#10b981" },
  { Icon: BookOpen,   title:"نظام التعلم",     desc:"دروس AI + بطاقات تذكر + اختبارات تفاعلية مخصصة لك",        color:"#8b5cf6" },
  { Icon: BarChart3,  title:"الذكاء السلوكي",  desc:"خريطة عقل تكشف أنماطك وتتوقع تحدياتك القادمة",            color:"#ec4899" },
  { Icon: Database,   title:"خزنة الذاكرة",    desc:"AI يتذكر كل شيء — وأنت تتحكم في ذاكرته كاملاً",           color:"#06b6d4" },
  { Icon: Wind,       title:"الصفاء الذهني",   desc:"تنفس + يوميات + دعم عاطفي ذكي في أوقات الضغط والتوتر",    color:"#10b981" },
  { Icon: Trophy,     title:"نظام الإنجازات",  desc:"إنجازات حقيقية تعكس نموك وانضباطك الفعلي لا مجرد نقاط",   color:"#f59e0b" },
]

const TESTIMONIALS = [
  { name:"أحمد المري",    role:"مطور برمجيات",  text:"بعد شهر أنجزت أكثر مما أنجزته في ٦ أشهر. المدرب الذكي يعرفني أكثر مني.",  avatar:"أ", streak:47, color:"#6366f1" },
  { name:"سارة الحسيني", role:"طالبة دكتوراه", text:"خريطة العقل غيّرت نظرتي لنفسي. اكتشفت أنماطاً كنت أجهلها تماماً.",          avatar:"س", streak:31, color:"#ec4899" },
  { name:"فيصل العتيبي", role:"رجل أعمال",     text:"الكتب الصوتية المنسقة بالـ AI أفضل من أي توصية قرأتها. دقيقة جداً.",         avatar:"ف", streak:89, color:"#10b981" },
]

const AVATARS = [
  {l:"أ",c:"#6366f1"},{l:"م",c:"#ec4899"},{l:"س",c:"#06b6d4"},
  {l:"ف",c:"#10b981"},{l:"ع",c:"#f59e0b"},{l:"خ",c:"#8b5cf6"},
]

export default function LandingPage() {
  const router = useRouter()
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY,[0,400],[0,-60])
  const heroOp = useTransform(scrollY,[0,300],[1,0])
  const [hovered,setHovered] = useState<number|null>(null)
  const [count,setCount] = useState({users:0,habits:0,sessions:0})

  useEffect(()=>{
    const t = setInterval(()=>{
      setCount(c=>({
        users:    Math.min(c.users+120,12400),
        habits:   Math.min(c.habits+600,89000),
        sessions: Math.min(c.sessions+2000,340000),
      }))
    },16)
    return ()=>clearInterval(t)
  },[])

  const card = (border="rgba(255,255,255,0.07)") => ({
    background:"#0b1120", border:`1px solid ${border}`, borderRadius:22,
  } as React.CSSProperties)

  return (
    <div style={{background:"#050810",color:"#eef2ff",direction:"rtl",overflowX:"hidden",fontFamily:"Cairo,sans-serif"}}>

      {/* NAVBAR */}
      <nav style={{position:"fixed",top:0,right:0,left:0,zIndex:200,height:62,
        display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 32px",
        background:"rgba(5,8,16,0.85)",backdropFilter:"blur(20px)",
        borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:34,height:34,borderRadius:11,
            background:"linear-gradient(135deg,#6366f1,#a78bfa)",
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:"0 0 18px rgba(99,102,241,0.45)"}}>
            <Atom size={17} color="#fff" strokeWidth={1.8}/>
          </div>
          <span style={{fontWeight:800,fontSize:16,letterSpacing:"-.3px"}}>HumanOS AI</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:24}}>
          {["المميزات","الأسعار","آراء المستخدمين"].map(l=>(
            <span key={l} style={{color:"#7a8cb0",fontSize:13,cursor:"pointer",transition:"color .2s"}}
              onMouseEnter={e=>(e.currentTarget.style.color="#eef2ff")}
              onMouseLeave={e=>(e.currentTarget.style.color="#7a8cb0")}>{l}</span>
          ))}
          <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}}
            onClick={()=>router.push("/auth")}
            style={{background:"linear-gradient(135deg,#6366f1,#818cf8)",border:"none",
              borderRadius:11,padding:"8px 18px",color:"#fff",fontSize:13,fontWeight:700,
              cursor:"pointer",display:"flex",alignItems:"center",gap:6,
              boxShadow:"0 4px 18px rgba(99,102,241,0.35)"}}>
            <Rocket size={13}/> ابدأ مجاناً
          </motion.button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",
        alignItems:"center",justifyContent:"center",
        padding:"100px 20px 70px",position:"relative",textAlign:"center",overflow:"hidden"}}>
        {[
          {w:700,h:700,top:-180,left:"50%",tx:"-50%",c:"rgba(99,102,241,0.14)"},
          {w:450,h:450,btm:-60, right:-100,         c:"rgba(236,72,153,0.09)"},
          {w:350,h:350,top:200, left:"65%",         c:"rgba(6,182,212,0.07)"},
        ].map((g,i)=>(
          <div key={i} style={{position:"absolute",width:g.w,height:g.h,borderRadius:"50%",
            top:(g as any).top,bottom:(g as any).btm,right:(g as any).right,left:(g as any).left,
            transform:(g as any).tx?`translateX(${(g as any).tx})`:"none",
            background:`radial-gradient(circle,${g.c},transparent 70%)`,
            filter:"blur(90px)",pointerEvents:"none"}}/>
        ))}

        <motion.div style={{y:heroY,opacity:heroOp}} className="flex flex-col items-center">
          <div style={{position:"relative",width:120,height:120,marginBottom:34}}>
            <motion.div animate={{scale:[1,1.12,1],opacity:[0.65,1,0.65]}}
              transition={{duration:3.5,repeat:Infinity,ease:"easeInOut"}}
              style={{position:"absolute",inset:0,borderRadius:"50%",
                background:"linear-gradient(135deg,#6366f1,#ec4899,#06b6d4)",
                boxShadow:"0 0 80px rgba(99,102,241,0.5),0 0 140px rgba(236,72,153,0.2)"}}/>
            <motion.div animate={{scale:[1.2,2.4,1.2],opacity:[0.25,0,0.25]}}
              transition={{duration:3.5,repeat:Infinity}}
              style={{position:"absolute",inset:-24,borderRadius:"50%",
                border:"1px solid rgba(99,102,241,0.25)"}}/>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <motion.div animate={{rotate:360}} transition={{duration:22,repeat:Infinity,ease:"linear"}}>
                <Atom size={48} color="#fff" strokeWidth={1.3}/>
              </motion.div>
            </div>
          </div>

          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:.15}}
            style={{display:"inline-flex",alignItems:"center",gap:7,padding:"5px 15px",
              borderRadius:99,marginBottom:22,
              background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.22)",
              color:"#a5b4fc",fontSize:12.5,fontWeight:600}}>
            <Sparkles size={12}/> مدعوم بـ Claude AI من Anthropic
          </motion.div>

          <motion.h1 initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.25}}
            style={{fontSize:"clamp(34px,6.5vw,66px)",fontWeight:900,
              lineHeight:1.12,letterSpacing:"-1.5px",marginBottom:18,maxWidth:760}}>
            نظام تشغيل حياتك
            <br/>
            <span style={{background:"linear-gradient(120deg,#818cf8,#ec4899,#06b6d4,#818cf8)",
              backgroundSize:"300% 100%",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
              animation:"gradShift 5s linear infinite"}}>
              المدعوم بالذكاء الاصطناعي
            </span>
          </motion.h1>

          <motion.p initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.35}}
            style={{color:"#7a8cb0",fontSize:"clamp(14px,2vw,17px)",
              maxWidth:530,lineHeight:1.85,marginBottom:38}}>
            ليس تطبيق إنتاجية عادي. هو نظام ذكاء اصطناعي حي يتعلم منك
            ويتكيف معك ويبني معك نسخة أفضل منك — كل يوم.
          </motion.p>

          <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.45}}
            style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center",marginBottom:46}}>
            <motion.button whileHover={{scale:1.04,y:-2}} whileTap={{scale:0.97}}
              onClick={()=>router.push("/auth")}
              style={{background:"linear-gradient(135deg,#6366f1,#818cf8)",border:"none",
                borderRadius:14,padding:"14px 30px",color:"#fff",fontSize:15,fontWeight:700,
                cursor:"pointer",display:"flex",alignItems:"center",gap:8,
                boxShadow:"0 8px 30px rgba(99,102,241,0.42)"}}>
              <Rocket size={17}/> ابدأ رحلتك مجاناً
            </motion.button>
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}}
              onClick={()=>router.push("/auth")}
              style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:14,padding:"14px 24px",color:"#eef2ff",fontSize:15,fontWeight:600,
                cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
              <MessageCircle size={16}/> تحدث مع المدرب
            </motion.button>
          </motion.div>

          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.6}}
            style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap",justifyContent:"center"}}>
            <div style={{display:"flex"}}>
              {AVATARS.map((a,i)=>(
                <div key={i} style={{width:30,height:30,borderRadius:"50%",
                  marginLeft:i>0?-9:0,zIndex:6-i,
                  background:`linear-gradient(135deg,${a.c},rgba(0,0,0,.4))`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  color:"#fff",fontSize:11,fontWeight:700,
                  border:"2px solid #050810"}}>{a.l}</div>
              ))}
            </div>
            <div style={{display:"flex",gap:2}}>
              {[1,2,3,4,5].map(i=><Star key={i} size={13} color="#f59e0b" fill="#f59e0b"/>)}
            </div>
            <span style={{color:"#7a8cb0",fontSize:13}}>
              <strong style={{color:"#eef2ff"}}>{count.users.toLocaleString("ar")}</strong>+ مستخدم نشط
            </span>
          </motion.div>
        </motion.div>

        <motion.div animate={{y:[0,8,0]}} transition={{duration:2,repeat:Infinity}}
          style={{position:"absolute",bottom:28,display:"flex",flexDirection:"column",
            alignItems:"center",gap:4,color:"#3d4f72",cursor:"pointer"}}>
          <span style={{fontSize:11}}>اكتشف المزيد</span>
          <ChevronDown size={17}/>
        </motion.div>
      </section>

      {/* STATS */}
      <section style={{padding:"52px 32px",
        borderTop:"1px solid rgba(255,255,255,0.05)",
        borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
        <div style={{maxWidth:880,margin:"0 auto",
          display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",
          ...card("rgba(255,255,255,0.07)"),overflow:"hidden"}}>
          {[
            {Icon:Users,      val:count.users.toLocaleString("ar")+"+",    lbl:"مستخدم نشط",  c:"#6366f1"},
            {Icon:Flame,      val:count.habits.toLocaleString("ar")+"+",   lbl:"عادة مبنية",  c:"#f59e0b"},
            {Icon:Target,     val:count.sessions.toLocaleString("ar")+"+", lbl:"جلسة تركيز",  c:"#06b6d4"},
            {Icon:TrendingUp, val:"٩٤٪",                                   lbl:"معدل الرضا",  c:"#10b981"},
          ].map((s,i)=>(
            <motion.div key={i} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}}
              transition={{delay:i*0.08}} viewport={{once:true}}
              style={{padding:"28px 20px",textAlign:"center",
                borderLeft:i>0?"1px solid rgba(255,255,255,0.06)":"none"}}>
              <div style={{width:40,height:40,borderRadius:12,margin:"0 auto 12px",
                background:`${s.c}15`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <s.Icon size={18} color={s.c} strokeWidth={1.8}/>
              </div>
              <div style={{fontSize:30,fontWeight:900,letterSpacing:"-1px",color:"#eef2ff",marginBottom:4}}>{s.val}</div>
              <div style={{color:"#4a5a7a",fontSize:12.5}}>{s.lbl}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{padding:"80px 32px"}}>
        <div style={{maxWidth:1060,margin:"0 auto"}}>
          <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}}
            viewport={{once:true}} style={{textAlign:"center",marginBottom:52}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"4px 15px",
              borderRadius:99,marginBottom:16,
              background:"rgba(99,102,241,0.09)",border:"1px solid rgba(99,102,241,0.2)",
              color:"#a5b4fc",fontSize:12,fontWeight:600}}>
              <Layers size={11}/> كل ما تحتاجه في نظام واحد
            </div>
            <h2 style={{fontSize:"clamp(26px,4vw,42px)",fontWeight:900,letterSpacing:"-1px",marginBottom:12}}>
              مبني ليكون المنصة الوحيدة
            </h2>
            <p style={{color:"#7a8cb0",fontSize:15,maxWidth:480,margin:"0 auto",lineHeight:1.8}}>
              لا تحتاج لـ ١٠ تطبيقات مختلفة. كل شيء متكامل ومتصل بذكاء اصطناعي واحد يعرفك.
            </p>
          </motion.div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14}}>
            {FEATURES.map((f,i)=>(
              <motion.div key={i} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}}
                transition={{delay:i*0.04}} viewport={{once:true}}
                onHoverStart={()=>setHovered(i)} onHoverEnd={()=>setHovered(null)}
                style={{...card(hovered===i?`${f.color}50`:"rgba(255,255,255,0.06)"),
                  padding:"22px 20px",cursor:"pointer",transition:"all .28s",
                  boxShadow:hovered===i?`0 18px 50px rgba(0,0,0,0.4),0 0 0 1px ${f.color}18`:"none",
                  transform:hovered===i?"translateY(-5px)":"none"}}>
                <div style={{width:50,height:50,borderRadius:15,marginBottom:15,
                  background:`${f.color}14`,display:"flex",alignItems:"center",justifyContent:"center",
                  transition:"transform .28s",
                  transform:hovered===i?"scale(1.12) rotate(4deg)":"scale(1)"}}>
                  <f.Icon size={22} color={f.color} strokeWidth={1.7}/>
                </div>
                <div style={{color:"#eef2ff",fontWeight:700,fontSize:15,marginBottom:7}}>{f.title}</div>
                <div style={{color:"#7a8cb0",fontSize:13,lineHeight:1.7}}>{f.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{padding:"70px 32px",
        borderTop:"1px solid rgba(255,255,255,0.05)",
        borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}
            style={{textAlign:"center",marginBottom:44}}>
            <h2 style={{fontSize:30,fontWeight:900,letterSpacing:"-.5px",marginBottom:8}}>ماذا يقول مستخدمونا</h2>
            <p style={{color:"#7a8cb0",fontSize:14}}>آراء حقيقية من أشخاص غيّروا حياتهم</p>
          </motion.div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(256px,1fr))",gap:14}}>
            {TESTIMONIALS.map((t,i)=>(
              <motion.div key={i} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}}
                transition={{delay:i*0.1}} viewport={{once:true}}
                style={{...card(),padding:"22px"}}>
                <div style={{display:"flex",gap:2,marginBottom:14}}>
                  {[1,2,3,4,5].map(j=><Star key={j} size={13} color="#f59e0b" fill="#f59e0b"/>)}
                </div>
                <p style={{color:"#7a8cb0",fontSize:13.5,lineHeight:1.8,marginBottom:18}}>"{t.text}"</p>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:38,height:38,borderRadius:12,flexShrink:0,
                    background:`linear-gradient(135deg,${t.color},rgba(0,0,0,.5))`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    color:"#fff",fontWeight:800,fontSize:15}}>{t.avatar}</div>
                  <div>
                    <div style={{color:"#eef2ff",fontWeight:700,fontSize:13.5}}>{t.name}</div>
                    <div style={{color:"#3d4f72",fontSize:11.5}}>{t.role}</div>
                  </div>
                  <div style={{marginRight:"auto",background:"rgba(245,158,11,0.1)",
                    border:"1px solid rgba(245,158,11,0.22)",borderRadius:99,padding:"3px 10px",
                    display:"flex",alignItems:"center",gap:5,color:"#f59e0b",fontSize:11,fontWeight:700}}>
                    <Flame size={11} fill="#f59e0b" color="#f59e0b"/> {t.streak} يوم
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{padding:"80px 32px"}}>
        <div style={{maxWidth:720,margin:"0 auto"}}>
          <motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}
            style={{textAlign:"center",marginBottom:48}}>
            <h2 style={{fontSize:30,fontWeight:900,letterSpacing:"-.5px",marginBottom:8}}>بسيط وشفاف تماماً</h2>
            <p style={{color:"#7a8cb0",fontSize:14}}>ابدأ مجاناً. طور نفسك بلا حدود مع Premium.</p>
          </motion.div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            {[
              { plan:"مجاني", Icon:Gift, price:"0", period:"للأبد", featured:false,
                features:["٢٠ رسالة AI يومياً","تتبع ٣ عادات","جلسات تركيز أساسية","خريطة عقل محدودة"] },
              { plan:"Premium", Icon:Crown, price:"5", period:"/شهر", featured:true,
                features:["AI غير محدود + ذاكرة كاملة","عادات لا محدودة + تحليل عميق","جميع الكتب الصوتية AI","تعلم + بطاقات + اختبارات","خزنة الذاكرة الكاملة","تحليل سلوكي AI عميق","جميع الإنجازات","دعم أولوية ٢٤/٧"] },
            ].map((p,i)=>(
              <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
                transition={{delay:i*0.15}} viewport={{once:true}}
                style={{...card(p.featured?"rgba(99,102,241,0.35)":"rgba(255,255,255,0.06)"),
                  padding:"28px 22px",position:"relative",
                  boxShadow:p.featured?"0 0 50px rgba(99,102,241,0.12)":"none"}}>
                {p.featured&&(
                  <div style={{position:"absolute",top:-13,left:"50%",transform:"translateX(-50%)",
                    background:"linear-gradient(135deg,#6366f1,#818cf8)",
                    borderRadius:99,padding:"4px 16px",color:"#fff",fontSize:11,fontWeight:700,
                    display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap"}}>
                    <Crown size={11}/> الأكثر شعبية
                  </div>
                )}
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:14}}>
                  <p.Icon size={15} color={p.featured?"#818cf8":"#7a8cb0"}/>
                  <span style={{color:p.featured?"#818cf8":"#7a8cb0",fontWeight:700,fontSize:14}}>{p.plan}</span>
                </div>
                <div style={{marginBottom:20}}>
                  <span style={{fontSize:42,fontWeight:900,letterSpacing:"-1px",color:"#eef2ff"}}>${p.price}</span>
                  <span style={{color:"#3d4f72",fontSize:13}}>{p.period}</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:22}}>
                  {p.features.map((f,j)=>(
                    <div key={j} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                      <Check size={14} color={p.featured?"#10b981":"#3d4f72"} style={{flexShrink:0,marginTop:2}}/>
                      <span style={{color:"#7a8cb0",fontSize:12.5,lineHeight:1.6}}>{f}</span>
                    </div>
                  ))}
                </div>
                <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}}
                  onClick={()=>router.push("/auth")}
                  style={{width:"100%",padding:"12px 0",borderRadius:12,border:"none",cursor:"pointer",
                    background:p.featured?"linear-gradient(135deg,#6366f1,#818cf8)":"rgba(255,255,255,0.06)",
                    color:p.featured?"#fff":"#7a8cb0",fontSize:13.5,fontWeight:700,
                    boxShadow:p.featured?"0 4px 22px rgba(99,102,241,0.35)":"none",
                    display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
                  {p.featured?<Crown size={14}/>:<Gift size={14}/>}
                  {p.featured?"ابدأ Premium":"ابدأ مجاناً"}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{padding:"80px 32px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",width:600,height:600,borderRadius:"50%",
          top:"50%",left:"50%",transform:"translate(-50%,-50%)",
          background:"radial-gradient(circle,rgba(99,102,241,0.07),transparent 70%)",
          filter:"blur(80px)",pointerEvents:"none"}}/>
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
          viewport={{once:true}} style={{position:"relative"}}>
          <div style={{width:72,height:72,borderRadius:22,margin:"0 auto 24px",
            background:"linear-gradient(135deg,#6366f1,#a78bfa)",
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:"0 0 40px rgba(99,102,241,0.4)"}}>
            <Rocket size={32} color="#fff"/>
          </div>
          <h2 style={{fontSize:"clamp(26px,4vw,44px)",fontWeight:900,letterSpacing:"-1px",marginBottom:14}}>
            ابدأ رحلتك اليوم
          </h2>
          <p style={{color:"#7a8cb0",fontSize:15,marginBottom:34,lineHeight:1.7}}>
            مجاناً. بدون بطاقة ائتمان. في ٣٠ ثانية فقط.
          </p>
          <motion.button whileHover={{scale:1.04,y:-3}} whileTap={{scale:0.97}}
            onClick={()=>router.push("/auth")}
            style={{background:"linear-gradient(135deg,#6366f1,#818cf8)",border:"none",
              borderRadius:16,padding:"16px 38px",color:"#fff",fontSize:16,fontWeight:700,
              cursor:"pointer",display:"inline-flex",alignItems:"center",gap:9,
              boxShadow:"0 12px 44px rgba(99,102,241,0.45)"}}>
            <Rocket size={19}/> ابدأ الآن — مجاناً
          </motion.button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer style={{padding:"26px 32px",borderTop:"1px solid rgba(255,255,255,0.05)",
        display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <Atom size={15} color="#6366f1"/>
          <span style={{fontWeight:800,fontSize:14}}>HumanOS AI</span>
        </div>
        <span style={{color:"#3d4f72",fontSize:12}}>© 2026 HumanOS — مدعوم بـ Claude AI</span>
        <div style={{display:"flex",gap:18}}>
          {["الخصوصية","الشروط","التواصل"].map(l=>(
            <span key={l} style={{color:"#3d4f72",fontSize:12,cursor:"pointer",transition:"color .2s"}}
              onMouseEnter={e=>(e.currentTarget.style.color="#7a8cb0")}
              onMouseLeave={e=>(e.currentTarget.style.color="#3d4f72")}>{l}</span>
          ))}
        </div>
      </footer>

      <style>{`
        @keyframes gradShift {
          0%   { background-position: 0%   50% }
          50%  { background-position: 100% 50% }
          100% { background-position: 0%   50% }
        }
      `}</style>
    </div>
  )
}
