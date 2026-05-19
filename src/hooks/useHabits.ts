"use client"
import { useState, useEffect, useCallback } from "react"
import toast from "react-hot-toast"

export interface Habit {
  id: string; name: string; emoji: string; color: string
  time?: string; type: string; trigger?: string; category?: string
  streak: number; bestStreak: number; rate: number; doneToday: boolean
  lastDone?: string; createdAt: string
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)

  const fetch_ = useCallback(async () => {
    try {
      const r = await fetch("/api/habits")
      const d = await r.json()
      setHabits(Array.isArray(d) ? d : [])
    } catch { toast.error("خطأ في تحميل العادات") }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetch_() }, [fetch_])

  const addHabit = async (data: Partial<Habit>) => {
    const r = await fetch("/api/habits", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
    const h = await r.json()
    setHabits(prev => [...prev, h])
    toast.success("تمت إضافة العادة ✅")
    return h
  }

  const updateHabit = async (id: string, data: Partial<Habit>) => {
    const r = await fetch("/api/habits", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...data }) })
    const h = await r.json()
    setHabits(prev => prev.map(x => x.id === id ? h : x))
    return h
  }

  const deleteHabit = async (id: string) => {
    await fetch("/api/habits", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    setHabits(prev => prev.filter(x => x.id !== id))
    toast.success("تم حذف العادة")
  }

  const markDone = async (id: string) => {
    const habit = habits.find(h => h.id === id)
    if (!habit) return
    const newDone = !habit.doneToday
    const updated = {
      doneToday: newDone,
      streak: newDone ? habit.streak + 1 : Math.max(0, habit.streak - 1),
      rate: Math.min(100, newDone ? Math.round(habit.rate * 0.95 + 5) : Math.max(0, habit.rate - 3)),
      lastDone: newDone ? new Date().toISOString() : habit.lastDone,
    }
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updated } : h))
    await updateHabit(id, updated)
  }

  return { habits, loading, addHabit, updateHabit, deleteHabit, markDone, refresh: fetch_ }
}
