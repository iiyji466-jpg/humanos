"use client"
import { useState, useCallback } from "react"

export function useAI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ask = useCallback(async (
    messages: { role: "user" | "assistant"; content: string }[],
    system?: string,
    opts?: { maxTokens?: number }
  ): Promise<string | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, system, maxTokens: opts?.maxTokens || 1000 }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      return data.text
    } catch (e: any) {
      setError(e.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { ask, loading, error }
}
