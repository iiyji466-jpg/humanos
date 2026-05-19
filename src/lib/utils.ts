import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
export const C = {
  bg: "#050810", surf: "#090d18", card: "#0f1623", card2: "#141d2e",
  border: "rgba(255,255,255,0.06)", borderA: "rgba(99,102,241,0.35)",
  primary: "#6366f1", pGlow: "rgba(99,102,241,0.2)", pLight: "#818cf8",
  green: "#10b981", amber: "#f59e0b", red: "#ef4444",
  pink: "#ec4899", cyan: "#06b6d4", violet: "#8b5cf6",
  text: "#f0f4ff", sub: "#8b9cc8", muted: "#3d4f72",
}
