import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const today = new Date(); today.setHours(0,0,0,0)
  const sessions = await prisma.focusSession.findMany({
    where: { userId: session.user.id, createdAt: { gte: today } }
  })
  return NextResponse.json(sessions)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  const fs = await prisma.focusSession.create({ data: { ...body, userId: session.user.id } })
  return NextResponse.json(fs)
}
