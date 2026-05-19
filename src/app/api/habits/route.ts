import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const habits = await prisma.habit.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "asc" } })
  return NextResponse.json(habits)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  const habit = await prisma.habit.create({ data: { ...body, userId: session.user.id } })
  return NextResponse.json(habit)
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id, ...data } = await req.json()
  const habit = await prisma.habit.update({ where: { id, userId: session.user.id }, data })
  return NextResponse.json(habit)
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await req.json()
  await prisma.habit.delete({ where: { id, userId: session.user.id } })
  return NextResponse.json({ ok: true })
}
