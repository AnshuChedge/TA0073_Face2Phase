"use client"

import { useEffect, useState } from "react"
import { Smile, Frown, Meh, Zap, Shield, Heart, Focus } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface Emotion {
  label: string
  icon: typeof Smile
  value: number
  color: string
}

export function EmotionDetectionPanel() {
  const [emotions, setEmotions] = useState<Emotion[]>([
    { label: "Confidence", icon: Shield, value: 65, color: "bg-emerald-500" },
    { label: "Nervousness", icon: Zap, value: 30, color: "bg-yellow-500" },
    { label: "Fear", icon: Frown, value: 15, color: "bg-red-500" },
    { label: "Anxiety", icon: Meh, value: 25, color: "bg-orange-500" },
    { label: "Stress", icon: Zap, value: 20, color: "bg-red-400" },
    { label: "Calmness", icon: Heart, value: 70, color: "bg-blue-500" },
    { label: "Engagement", icon: Focus, value: 75, color: "bg-primary" },
  ])

  const [dominantEmotion, setDominantEmotion] = useState("Engagement")

  useEffect(() => {
    const interval = setInterval(() => {
      setEmotions((prev) => {
        const updated = prev.map((e) => {
          const change = (Math.random() - 0.5) * 10
          return { ...e, value: Math.max(0, Math.min(100, Math.round(e.value + change))) }
        })
        // Find dominant emotion
        const dominant = updated.reduce((max, e) => (e.value > max.value ? e : max), updated[0])
        setDominantEmotion(dominant.label)
        return updated
      })
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Emotional State</h3>
        <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">
          {dominantEmotion}
        </span>
      </div>

      <div className="space-y-2">
        {emotions.map((e) => (
          <div key={e.label} className="flex items-center gap-2">
            <e.icon className="h-3 w-3 shrink-0 text-muted-foreground" />
            <span className="w-20 shrink-0 text-xs text-muted-foreground">{e.label}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full rounded-full transition-all duration-500 ${e.color}`}
                style={{ width: `${e.value}%` }}
              />
            </div>
            <span className="w-8 text-right text-xs font-medium text-foreground">{e.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
