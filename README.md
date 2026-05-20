# 🧠 HumanOS AI — نظام الحياة الذكي

نظام تشغيل حياتك المدعوم بالذكاء الاصطناعي. يجمع بين Claude AI، تتبع العادات، التركيز، التعلم، والتطوير الشخصي في منصة واحدة متكاملة.

## 🚀 النشر على Vercel (خطوات كاملة),

### ١. إعداد Supabase (قاعدة البيانات).
1. اذهب إلى [supabase.com](https://supabase.com) وأنشئ مشروعاً مجانياً
2. من **Settings → Database** انسخ **Connection String**
3. ضعه في `DATABASE_URL` في متغيرات Vercel

### ٢. إعداد Google OAuth
1. اذهب إلى [console.cloud.google.com](https://console.cloud.google.com)
2. أنشئ مشروعاً → **APIs & Services → Credentials → OAuth 2.0**
3. أضف `https://your-domain.vercel.app/api/auth/callback/google` في Authorized redirect URIs
4. انسخ Client ID و Client Secret

### ٣. إعداد Stripe
1. اذهب إلى [stripe.com](https://stripe.com) وأنشئ حساباً
2. أنشئ منتجاً بسعر $5/شهر واحفظ Price ID
3. أضف Webhook endpoint: `https://your-domain.vercel.app/api/stripe/webhook`

### ٤. رفع على GitHub
```bash
git init
git add .
git commit -m "🚀 Initial HumanOS AI"
git remote add origin https://github.com/username/humanos-ai
git push -u origin main
```

### ٥. نشر على Vercel
1. اذهب إلى [vercel.com](https://vercel.com) وربط GitHub
2. اختر المشروع وأضف متغيرات البيئة التالية:

```
DATABASE_URL           = (من Supabase)
NEXTAUTH_URL           = https://your-domain.vercel.app
NEXTAUTH_SECRET        = (نص عشوائي طويل 32+ حرف)
GOOGLE_CLIENT_ID       = (من Google Console)
GOOGLE_CLIENT_SECRET   = (من Google Console)
ANTHROPIC_API_KEY      = sk-ant-...
STRIPE_SECRET_KEY      = sk_live_...
STRIPE_WEBHOOK_SECRET  = whsec_...
STRIPE_PREMIUM_PRICE_ID = price_...
```

3. في **Build Settings** أضف:
   - Build Command: `prisma generate && next build`

4. انقر **Deploy** 🎉

### ٦. إعداد قاعدة البيانات
بعد النشر، شغّل مرة واحدة:
```bash
npx prisma db push
```

## 📁 هيكل المشروع

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── auth/page.tsx         # تسجيل الدخول (Google)
│   ├── onboarding/page.tsx   # إعداد الحساب الأولي
│   ├── dashboard/
│   │   ├── page.tsx          # الرئيسية
│   │   ├── coach/            # المدرب الذكي (Claude AI)
│   │   ├── habits/           # نظام العادات
│   │   ├── focus/            # التركيز + بومودورو
│   │   ├── audio/            # الكتب الصوتية
│   │   ├── learn/            # التعلم + بطاقات
│   │   ├── mind/             # خريطة العقل
│   │   ├── vault/            # خزنة الذاكرة
│   │   ├── clarity/          # الصفاء الذهني
│   │   ├── achieve/          # الإنجازات
│   │   └── settings/         # الإعدادات
│   └── api/
│       ├── ai/               # Claude AI endpoint
│       ├── habits/           # CRUD العادات
│       ├── focus/            # جلسات التركيز
│       ├── memories/         # خزنة الذاكرة
│       ├── stripe/           # الاشتراكات
│       └── user/             # بيانات المستخدم
├── components/
│   ├── layout/Sidebar.tsx    # القائمة الجانبية
│   ├── layout/Topbar.tsx     # الشريط العلوي
│   └── ui/AIChat.tsx         # مكون المحادثة AI
├── hooks/
│   ├── useAI.ts              # hook للتحدث مع Claude
│   └── useHabits.ts          # hook لإدارة العادات
└── lib/
    ├── auth.ts               # NextAuth config
    ├── prisma.ts             # Prisma client
    ├── stripe.ts             # Stripe config
    └── utils.ts              # utilities
```

## 🛠️ تطوير محلي

```bash
npm install
cp .env.local.example .env.local
# عدّل المتغيرات في .env.local
npx prisma db push
npm run dev
```

## ✨ المميزات

- 🤖 **Claude AI** — مدرب ذكي حقيقي يتذكرك ويتكيف معك
- 🔥 **العادات** — بناء وكسر العادات مع تحليل AI
- ⚡ **التركيز** — بومودورو + أصوات محيطية حقيقية
- 🎧 **الكتب الصوتية** — مكتبة منسقة بـ AI
- 📚 **التعلم** — دروس + بطاقات + اختبارات بـ AI
- 🧠 **خريطة العقل** — تحليل سلوكي عميق
- 🗄️ **خزنة الذاكرة** — AI يتذكر ما تخبره
- 🌬️ **الصفاء الذهني** — تنفس + يوميات + دعم عاطفي
- 🏆 **الإنجازات** — نظام ألعاب حقيقي
- 💳 **Stripe** — اشتراكات Premium
- 🔐 **Google OAuth** — تسجيل دخول آمن
