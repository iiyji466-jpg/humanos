import Stripe from "stripe"
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})
export const PLANS = {
  free: { name: "مجاني", price: 0, messages: 20, habits: 3 },
  premium: { name: "Premium", price: 5, priceId: process.env.STRIPE_PREMIUM_PRICE_ID, messages: -1, habits: -1 },
}
