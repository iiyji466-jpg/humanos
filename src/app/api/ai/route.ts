import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const PERSONAS: Record<string, string> = {
  calm:     "أنت مدرب حياة هادئ ودافئ وصبور. لغتك لطيفة ومشجعة دائماً.",
  strict:   "أنت مرشد صارم ومباشر. تتحدث بوضوح وصراحة بلا مجاملة زائدة.",
  friendly: "أنت صديق مساعد مرح وإيجابي. أسلوبك خفيف وحيوي.",
  thinker:  "أنت مفكر عميق وتحليلي. تطرح أسئلة فلسفية واستراتيجية.",
}

export async function POST(req: NextRequest) {
  try {
    // 1. التحقق من الجلسة
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. استخراج userId بأمان
    const userId = (session.user as { id?: string }).id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 3. قراءة body الطلب
    const { messages, system } = await req.json()

    // 4. جلب بيانات المستخدم من قاعدة البيانات
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        memories: { take: 5, orderBy: { pinned: "desc" } },
        habits: true,
      },
    })

    // 5. بناء system prompt
    const personaText = PERSONAS[user?.persona ?? "calm"]
    const memoriesText = user?.memories.map((m) => m.content).join(" | ") ?? ""
    const habitsText =
      user?.habits.map((h) => `${h.name}(${h.streak}ي،${h.rate}٪)`).join(", ") ?? ""

    const systemPrompt = `${personaText}
أنت المدرب الذكي في منصة HumanOS — نظام تطوير الذات المدعوم بالذكاء الاصطناعي.
المستخدم: ${user?.name ?? "صديقي"}.
ذاكرة مهمة: ${memoriesText}
عاداته: ${habitsText}
${system ?? ""}
قواعد: أجب بالعربية. كن مختصراً (3-5 جمل). نصائح عملية قابلة للتطبيق فوراً.`

    // 6. استدعاء Claude API
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    })

    // 7. استخراج النص من الرد
    const text =
      response.content[0].type === "text" ? response.content[0].text : ""

    return NextResponse.json({ text })

  } catch (error) {
    console.error("AI route error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}