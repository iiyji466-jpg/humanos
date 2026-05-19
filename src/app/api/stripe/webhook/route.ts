import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!
  let event
  try { event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!) }
  catch { return NextResponse.json({ error: "Invalid" }, { status: 400 }) }
  if (event.type === "checkout.session.completed") {
    const s = event.data.object as any
    await prisma.user.update({ where: { id: s.metadata.userId }, data: { plan: "premium", stripeSubId: s.subscription } })
  }
  return NextResponse.json({ received: true })
}
