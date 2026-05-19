import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { name: body.name || session.user.name, gender: body.gender, ageGroup: body.age, goals: body.goals, persona: body.persona, onboarded: true }
  })
  return NextResponse.json(user)
}
