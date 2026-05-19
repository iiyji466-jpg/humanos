"use client"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import {
  Atom, Bot, Flame, Focus, BookOpen, Brain, Archive, Trophy,
  ArrowRight, Sparkles, Crown, Check, ChevronDown, Star,
  Headphones, Zap, Shield, Rocket, Users, TrendingUp, Play
} from "lucide-react"

const FEATURES = [
  { icon:"🤖", title:"المدرب الذكي", desc:"Claude AI يتذكرك ويتكيف مع أسلوبك ويتطور معك يومياً", color:"#6366f1" },
  { icon:"🔥", title:"ذكاء العادات", desc:"تحليل أنماط السلوك والمحفزات لبناء عادات لا تنكسر", color:"#f59e0b" },
  { icon:"⚡", title:"وضع التركيز", desc:"بومودورو + أصوات محيطية + تشجيع AI في الوقت الفعلي", color:"#06b6d4" },
  { icon:"🎧", title:"مكتبة صوتية", desc:"كتب صوتية ينسقها AI بناءً على حالتك وأهدافك", color:"#10b981" },
  { icon:"📚", title:"نظام التعلم", desc:"دروس AI + بطاقات تذكر + اختبارات تفاعلية مخصصة", color:"#8b5cf6" },
  { icon:"🧠", title:"الذكاء السلوكي", desc:"خريطة عقل تكشف أنماطك وتتوقع تحدياتك القادمة", color:"#ec4899" },
  { icon:"🗄️", title:"خزنة الذاكرة", desc:"AI يتذكر كل شيء — وأنت تتحكم في ذاكرته كاملاً", color:"#f59e0b" },
  { icon:"🏆", title:"نظام الإنجازات", desc:"إنجازات حقيقية تعكس نموك وانضباطك الفعلي لا مجرد نقاط", color:"#10b981" },
]

const TESTIMONIALS = [
  { name:"أحمد المري", role:"مطور برمجيات", text:"بعد شهر، أنجزت أكثر مما أنجزته في ٦ أشهر. المدرب الذكي يعرفني أكثر مني.", avatar:"أ", streak:47 },
  { name:"سارة الحسيني", role:"طالبة دكتوراه", text:"خريطة العقل غيّرت نظرتي لنفسي. اكتشفت أنماطاً كنت أجهلها.", avatar:"س", streak:31 },
  { name:"فيصل العتيبي", role:"رجل أعمال", text:"الكتب الصوتية المنسقة بالـ AI أفضل من أي توصية قرأتها. دقيقة جداً.", avatar:"ف", streak:89 },
]

export default function LandingPage() {
  const router = useRouter()
  const heroRef = useRef(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 400], [0, -80])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const [activeFeature, setActiveFeature] = useState<number|null>(null)
  const [count, setCount] = useState({ users: 0, habits: 0, sessions: 0 })

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => ({
        users: Math.min(c.users + 89, 12400),
        habits: Math.min(c.habits + 234, 89000),
        sessions: Math.min(c.sessions + 156, 340000),
      }))
    }, 20)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{ background:"#050810", color:"#f0f4ff", direction:"rtl", overflowX:"hidden" }}>
      {/* Navbar */}
      <nav style={{
        position:"fixed",top:0,right:0,left:0,zIndex:100,height:64,
        display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"0 40px",
        background:"rgba(5,8,16,0.85)",backdropFilter:"blur(24px)",
        borderBottom:"1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <motion.div animate={{rotate:[0,360]}} transition={{duration:20,repeat:Infinity,ease:"linear"}}
            style={{width:34,height:34,borderRadius:11,
              background:"linear-gradient(135deg,#6366f1,#ec4899)",
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 0 20px rgba(99,102,241,0.3)"}}>
            <Atom size={17} color="#fff"/>
          </motion.div>
          <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16}}>HumanOS AI</span>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <div style={{display:"flex",gap:16,marginLeft:24}}>
            {["المميزات","الأسعار","آراء المستخدمين"].map(l=>(
              <span key={l} style={{color:"#8b9cc8",fontSize:13,cursor:"pointer",transition:"color 0.2s"}}
                onMouseEnter={e=>(e.currentTarget.style.color="#f0f4ff")}
                onMouseLeave={e=>(e.currentTarget.style.color="#8b9cc8")}>{l}</span>
            ))}
          </div>
          <button onClick={()=>router.push("/auth")} style={{
            background:"transparent",border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:10,padding:"8px 16px",color:"#8b9cc8",fontSize:13,
            cursor:"pointer",fontFamily:"var(--font-arabic)",transition:"all 0.2s",
          }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.2)";e.currentTarget.style.color="#f0f4ff"}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";e.currentTarget.style.color="#8b9cc8"}}>
            دخول
          </button>
          <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}}
            onClick={()=>router.push("/auth")}
            style={{
              background:"linear-gradient(135deg,#6366f1,#818cf8)",border:"none",
              borderRadius:10,padding:"9px 18px",color:"#fff",fontSize:13,fontWeight:600,
              cursor:"pointer",fontFamily:"var(--font-arabic)",
              boxShadow:"0 4px 16px rgba(99,102,241,0.3)",display:"flex",alignItems:"center",gap:6,
            }}>
            <Rocket size={14}/> ابدأ مجاناً
          </motion.button>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} style={{minHeight:"100vh",display:"flex",flexDirection:"column",
        alignItems:"center",justifyContent:"center",padding:"80px 20px 60px",
        position:"relative",textAlign:"center",overflow:"hidden"}}>
        {/* Background orbs */}
        <div style={{position:"absolute",width:700,height:700,borderRadius:"50%",top:-200,right:-200,
          background:"radial-gradient(circle,rgba(99,102,241,0.15),transparent 70%)",filter:"blur(80px)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",bottom:-100,left:-100,
          background:"radial-gradient(circle,rgba(236,72,153,0.1),transparent 70%)",filter:"blur(60px)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",width:400,height:400,borderRadius:"50%",top:"30%",left:"60%",
          background:"radial-gradient(circle,rgba(6,182,212,0.08),transparent 70%)",filter:"blur(60px)",pointerEvents:"none"}}/>

        <motion.div style={{y,opacity}} className="flex flex-col items-center">
          {/* Animated orb */}
          <div style={{position:"relative",width:130,height:130,marginBottom:36}}>
            <motion.div animate={{scale:[1,1.1,1],opacity:[0.7,1,0.7]}} transition={{duration:3,repeat:Infinity}}
              style={{position:"absolute",inset:0,borderRadius:"50%",
                background:"linear-gradient(135deg,#6366f1,#ec4899,#06b6d4)",
                boxShadow:"0 0 80px rgba(99,102,241,0.5),0 0 160px rgba(236,72,153,0.2)"}}>
            </motion.div>
            <motion.div animate={{scale:[1.2,2,1.2],opacity:[0.3,0,0.3]}} transition={{duration:3,repeat:Infinity}}
              style={{position:"absolute",inset:-20,borderRadius:"50%",
                border:"1px solid rgba(99,102,241,0.3)"}}>
            </motion.div>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <motion.div animate={{rotate:360}} transition={{duration:20,repeat:Infinity,ease:"linear"}}>
                <Atom size={52} color="#fff" strokeWidth={1.4}/>
              </motion.div>
            </div>
          </div>

          {/* Badge */}
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
            style={{
              display:"inline-flex",alignItems:"center",gap:6,padding:"5px 14px",
              borderRadius:99,marginBottom:20,
              background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.25)",
              color:"#818cf8",fontSize:12,fontWeight:600,
            }}>
            <Sparkles size={12}/> مدعوم بـ Claude AI من Anthropic
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
            style={{
              fontFamily:"'Syne',sans-serif",
              fontSize:"clamp(36px,6vw,68px)",fontWeight:800,
              lineHeight:1.1,letterSpacing:"-2px",marginBottom:20,maxWidth:800,
            }}>
            نظام تشغيل حياتك
            <br/>
            <span style={{
              background:"linear-gradient(135deg,#6366f1,#ec4899,#06b6d4)",
              backgroundSize:"200% 200%",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
              animation:"gradient-shift 4s ease infinite",
            }}>
              المدعوم بالذكاء الاصطناعي
            </span>
          </motion.h1>

          <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.4}}
            style={{color:"#8b9cc8",fontSize:"clamp(14px,2vw,18px)",
              maxWidth:560,lineHeight:1.75,marginBottom:36}}>
            ليس تطبيق إنتاجية عادي. هو نظام ذكاء اصطناعي حي يتعلم منك ويتكيف معك
            ويبني معك نسخة أفضل منك — كل يوم.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.5}}
            style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center",marginBottom:48}}>
            <motion.button whileHover={{scale:1.03,y:-2}} whileTap={{scale:0.97}}
              onClick={()=>router.push("/auth")}
              style={{
                background:"linear-gradient(135deg,#6366f1,#818cf8)",border:"none",
                borderRadius:14,padding:"14px 30px",color:"#fff",fontSize:15,fontWeight:700,
                cursor:"pointer",display:"flex",alignItems:"center",gap:8,
                boxShadow:"0 8px 32px rgba(99,102,241,0.4)",fontFamily:"var(--font-arabic)",
              }}>
              <Rocket size={18}/> ابدأ رحلتك مجاناً
            </motion.button>
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}}
              onClick={()=>router.push("/auth")}
              style={{
                background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:14,padding:"14px 24px",color:"#f0f4ff",fontSize:15,fontWeight:500,
                cursor:"pointer",display:"flex",alignItems:"center",gap:8,
                fontFamily:"var(--font-arabic)",
              }}>
              <Bot size={17}/> تحدث مع المدرب
            </motion.button>
          </motion.div>

          {/* Social proof */}
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.7}}
            style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",justifyContent:"center"}}>
            <div style={{display:"flex"}}>
              {["أ","م","س","ف","ع","خ"].map((l,i)=>(
                <div key={i} style={{
                  width:30,height:30,borderRadius:"50%",marginLeft:i>0?-10:0,
                  background:`linear-gradient(135deg,${["#6366f1","#ec4899","#06b6d4","#10b981","#f59e0b","#8b5cf6"][i]},rgba(0,0,0,0.3))`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  color:"#fff",fontSize:11,fontWeight:700,border:"2px solid #050810",
                }}>{l}</div>
              ))}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:4}}>
              {[1,2,3,4,5].map(i=><Star key={i} size={13} color="#f59e0b" fill="#f59e0b"/>)}
            </div>
            <span style={{color:"#8b9cc8",fontSize:13}}>
              <span style={{color:"#f0f4ff",fontWeight:700}}>{count.users.toLocaleString("ar")}</span>+ مستخدم نشط
            </span>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div animate={{y:[0,8,0]}} transition={{duration:2,repeat:Infinity}}
          style={{position:"absolute",bottom:30,display:"flex",flexDirection:"column",
            alignItems:"center",gap:4,color:"#3d4f72"}}>
          <span style={{fontSize:11}}>اكتشف المزيد</span>
          <ChevronDown size={18}/>
        </motion.div>
      </section>

      {/* Stats */}
      <section style={{padding:"60px 40px",background:"rgba(255,255,255,0.01)",
        borderTop:"1px solid rgba(255,255,255,0.05)",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
        <div style={{maxWidth:900,margin:"0 auto",display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:24,textAlign:"center"}}>
          {[
            {n:count.users.toLocaleString("ar")+"+",l:"مستخدم نشط",icon:<Users size={20}/>},
            {n:count.habits.toLocaleString("ar")+"+",l:"عادة مبنية",icon:<Flame size={20}/>},
            {n:count.sessions.toLocaleString("ar")+"+",l:"جلسة تركيز",icon:<Focus size={20}/>},
            {n:"٩٤٪",l:"معدل الرضا",icon:<Star size={20}/>},
          ].map((s,i)=>(
            <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
              transition={{delay:i*0.1}} viewport={{once:true}}>
              <div style={{color:"#3d4f72",display:"flex",justifyContent:"center",marginBottom:8}}>{s.icon}</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:36,fontWeight:800,
                color:"#f0f4ff",letterSpacing:"-1px"}}>{s.n}</div>
              <div style={{color:"#8b9cc8",fontSize:13,marginTop:4}}>{s.l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{padding:"80px 40px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
            style={{textAlign:"center",marginBottom:52}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"4px 14px",
              borderRadius:99,background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.2)",
              color:"#818cf8",fontSize:12,fontWeight:600,marginBottom:16}}>
              <Sparkles size={11}/> كل ما تحتاجه في نظام واحد
            </div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(28px,4vw,42px)",
              fontWeight:800,letterSpacing:"-1px",marginBottom:12}}>مبني ليكون المنصة الوحيدة</h2>
            <p style={{color:"#8b9cc8",fontSize:15,maxWidth:500,margin:"0 auto"}}>
              لا تحتاج لـ ١٠ تطبيقات مختلفة. كل شيء متكامل ومتصل بذكاء اصطناعي واحد يعرفك.
            </p>
          </motion.div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:16}}>
            {FEATURES.map((f,i)=>(
              <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
                transition={{delay:i*0.05}} viewport={{once:true}}
                onHoverStart={()=>setActiveFeature(i)} onHoverEnd={()=>setActiveFeature(null)}
                style={{
                  background:"#0f1623",border:`1px solid ${activeFeature===i?f.color+"40":"rgba(255,255,255,0.06)"}`,
                  borderRadius:20,padding:"24px 20px",cursor:"pointer",
                  transition:"all 0.3s",
                  boxShadow:activeFeature===i?`0 16px 48px rgba(0,0,0,0.4),0 0 0 1px ${f.color}20`:"none",
                  transform:activeFeature===i?"translateY(-4px)":"none",
                }}>
                <div style={{
                  width:52,height:52,borderRadius:16,marginBottom:16,
                  background:`${f.color}15`,display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:26,transition:"transform 0.3s",
                  transform:activeFeature===i?"scale(1.1) rotate(5deg)":"scale(1)",
                }}>{f.icon}</div>
                <div style={{color:"#f0f4ff",fontWeight:700,fontSize:15.5,marginBottom:7}}>{f.title}</div>
                <div style={{color:"#8b9cc8",fontSize:13,lineHeight:1.65}}>{f.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{padding:"70px 40px",background:"rgba(255,255,255,0.01)",
        borderTop:"1px solid rgba(255,255,255,0.04)"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}
            style={{textAlign:"center",marginBottom:44}}>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:32,fontWeight:800,
              letterSpacing:"-0.5px",marginBottom:10}}>ماذا يقول مستخدمونا</h2>
            <p style={{color:"#8b9cc8",fontSize:14}}>آراء حقيقية من أشخاص غيّروا حياتهم</p>
          </motion.div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16}}>
            {TESTIMONIALS.map((t,i)=>(
              <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
                transition={{delay:i*0.1}} viewport={{once:true}}
                style={{background:"#0f1623",border:"1px solid rgba(255,255,255,0.06)",
                  borderRadius:20,padding:"22px"}}>
                <div style={{display:"flex",gap:2,marginBottom:12}}>
                  {[1,2,3,4,5].map(j=><Star key={j} size={13} color="#f59e0b" fill="#f59e0b"/>)}
                </div>
                <p style={{color:"#8b9cc8",fontSize:13.5,lineHeight:1.75,marginBottom:16}}>"{t.text}"</p>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:36,height:36,borderRadius:11,
                    background:"linear-gradient(135deg,#6366f1,#ec4899)",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    color:"#fff",fontWeight:700,fontSize:14}}>{t.avatar}</div>
                  <div>
                    <div style={{color:"#f0f4ff",fontWeight:600,fontSize:13}}>{t.name}</div>
                    <div style={{color:"#3d4f72",fontSize:11}}>{t.role}</div>
                  </div>
                  <div style={{marginRight:"auto",
                    background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.2)",
                    borderRadius:99,padding:"3px 10px",
                    color:"#f59e0b",fontSize:11,fontWeight:600}}>
                    🔥 {t.streak} يوم
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{padding:"70px 40px"}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          <motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}
            style={{textAlign:"center",marginBottom:44}}>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:32,fontWeight:800,
              letterSpacing:"-0.5px",marginBottom:10}}>بسيط وشفاف</h2>
            <p style={{color:"#8b9cc8",fontSize:14}}>ابدأ مجاناً. طور نفسك بلا حدود مع Premium.</p>
          </motion.div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            {[
              { plan:"مجاني", price:"٠", period:"للأبد", features:[
                "٢٠ رسالة AI يومياً","تتبع ٣ عادات","جلسات تركيز أساسية","خريطة عقل محدودة",
              ], cta:"ابدأ مجاناً", featured:false },
              { plan:"Premium", price:"٥", period:"/شهر", features:[
                "AI غير محدود + ذاكرة كاملة","عادات لا محدودة + تحليل عميق",
                "جميع الكتب الصوتية AI","تعلم + بطاقات + اختبارات",
                "خزنة الذاكرة الكاملة","تحليل سلوكي AI عميق",
                "جميع الإنجازات","دعم أولوية ٢٤/٧",
              ], cta:"ابدأ Premium", featured:true },
            ].map((p,i)=>(
              <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
                transition={{delay:i*0.15}} viewport={{once:true}}
                style={{
                  background:"#0f1623",borderRadius:22,padding:"28px 24px",position:"relative",
                  border:p.featured?"1px solid rgba(99,102,241,0.35)":"1px solid rgba(255,255,255,0.06)",
                  boxShadow:p.featured?"0 0 40px rgba(99,102,241,0.1)":"none",
                }}>
                {p.featured && (
                  <div style={{
                    position:"absolute",top:-13,left:"50%",transform:"translateX(-50%)",
                    background:"linear-gradient(135deg,#6366f1,#818cf8)",
                    borderRadius:99,padding:"4px 16px",
                    color:"#fff",fontSize:11,fontWeight:700,
                    display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap",
                  }}>
                    <Crown size={11}/> الأكثر شعبية
                  </div>
                )}
                <div style={{color:p.featured?"#6366f1":"#8b9cc8",fontWeight:700,fontSize:15,marginBottom:12}}>{p.plan}</div>
                <div style={{marginBottom:20}}>
                  <span style={{fontFamily:"'Syne',sans-serif",fontSize:42,fontWeight:800,color:"#f0f4ff"}}>${p.price}</span>
                  <span style={{color:"#3d4f72",fontSize:13}}>{p.period}</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:22}}>
                  {p.features.map((f,j)=>(
                    <div key={j} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                      <Check size={14} color={p.featured?"#10b981":"#3d4f72"} style={{flexShrink:0,marginTop:1}}/>
                      <span style={{color:"#8b9cc8",fontSize:12.5}}>{f}</span>
                    </div>
                  ))}
                </div>
                <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}}
                  onClick={()=>router.push("/auth")}
                  style={{
                    width:"100%",padding:"12px",borderRadius:12,border:"none",cursor:"pointer",
                    background:p.featured?"linear-gradient(135deg,#6366f1,#818cf8)":"rgba(255,255,255,0.06)",
                    color:p.featured?"#fff":"#8b9cc8",fontSize:13.5,fontWeight:600,
                    boxShadow:p.featured?"0 4px 20px rgba(99,102,241,0.3)":"none",
                    fontFamily:"var(--font-arabic)",display:"flex",alignItems:"center",
                    justifyContent:"center",gap:7,
                  }}>
                  {p.featured&&<Crown size={14}/>} {p.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{padding:"80px 40px",textAlign:"center",position:"relative"}}>
        <div style={{position:"absolute",width:600,height:600,borderRadius:"50%",
          top:"50%",left:"50%",transform:"translate(-50%,-50%)",
          background:"radial-gradient(circle,rgba(99,102,241,0.08),transparent 70%)",
          filter:"blur(60px)",pointerEvents:"none"}}/>
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          style={{position:"relative"}}>
          <div style={{fontSize:52,marginBottom:20}}>🚀</div>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(28px,4vw,44px)",
            fontWeight:800,letterSpacing:"-1px",marginBottom:14}}>ابدأ رحلتك اليوم</h2>
          <p style={{color:"#8b9cc8",fontSize:15,marginBottom:32}}>
            مجاناً. بدون بطاقة ائتمان. في ٣٠ ثانية.
          </p>
          <motion.button whileHover={{scale:1.04,y:-3}} whileTap={{scale:0.97}}
            onClick={()=>router.push("/auth")}
            style={{
              background:"linear-gradient(135deg,#6366f1,#818cf8)",border:"none",
              borderRadius:16,padding:"16px 36px",color:"#fff",fontSize:16,fontWeight:700,
              cursor:"pointer",display:"inline-flex",alignItems:"center",gap:9,
              boxShadow:"0 10px 40px rgba(99,102,241,0.4)",fontFamily:"var(--font-arabic)",
            }}>
            <Rocket size={20}/> ابدأ الآن — مجاناً
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{padding:"30px 40px",borderTop:"1px solid rgba(255,255,255,0.05)",
        display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <Atom size={16} color="#6366f1"/>
          <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14}}>HumanOS AI</span>
        </div>
        <span style={{color:"#3d4f72",fontSize:12}}>© 2026 HumanOS. مدعوم بـ Claude AI</span>
        <div style={{display:"flex",gap:16}}>
          {["الخصوصية","الشروط","التواصل"].map(l=>(
            <span key={l} style={{color:"#3d4f72",fontSize:12,cursor:"pointer",transition:"color 0.2s"}}
              onMouseEnter={e=>(e.currentTarget.style.color="#8b9cc8")}
              onMouseLeave={e=>(e.currentTarget.style.color="#3d4f72")}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  )
}
