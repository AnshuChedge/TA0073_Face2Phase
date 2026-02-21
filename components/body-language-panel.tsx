"use client"

import { useEffect, useState } from "react"
import { Eye, User, Smile, Hand, Activity, MoveVertical, Scan, Fingerprint } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface Indicator {
  label: string
  icon: typeof Eye
  value: number
  status: string
  color: string
}

export function BodyLanguagePanel() {
  const [indicators, setIndicators] = useState<Indicator[]>([
    { label: "Eye Contact Stability", icon: Eye, value: 72, status: "Good", color: "bg-chart-1" },
    { label: "Face Muscle Tension", icon: Scan, value: 35, status: "Low", color: "bg-chart-1" },
    { label: "Lip Press / Jaw Tight.", icon: Fingerprint, value: 20, status: "Minimal", color: "bg-chart-1" },
    { label: "Eyebrow Movement", icon: Smile, value: 45, status: "Moderate", color: "bg-chart-3" },
    { label: "Blink Rate", icon: Activity, value: 55, status: "Normal", color: "bg-chart-1" },
    { label: "Head Movement", icon: MoveVertical, value: 40, status: "Moderate", color: "bg-chart-3" },
    { label: "Posture Stability", icon: User, value: 82, status: "Excellent", color: "bg-chart-1" },
    { label: "Nervous Gestures", icon: Hand, value: 25, status: "Low", color: "bg-chart-1" },
    { label: "Fidgeting Frequency", icon: Activity, value: 18, status: "Minimal", color: "bg-chart-1" },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setIndicators((prev) =>
        prev.map((ind) => {
          const change = (Math.random() - 0.5) * 10
          const newValue = Math.max(5, Math.min(100, ind.value + change))
          const isInverse = ["Face Muscle Tension", "Lip Press / Jaw Tight.", "Nervous Gestures", "Fidgeting Frequency"].includes(ind.label)
          let status = "Low"
          let color = "bg-chart-5"
          if (isInverse) {
            if (newValue <= 25) { status = "Minimal"; color = "bg-chart-1" }
            else if (newValue <= 45) { status = "Low"; color = "bg-chart-1" }
            else if (newValue <= 65) { status = "Moderate"; color = "bg-chart-3" }
            else { status = "High"; color = "bg-chart-5" }
          } else {
            if (newValue >= 75) { status = "Excellent"; color = "bg-chart-1" }
            else if (newValue >= 55) { status = "Good"; color = "bg-chart-1" }
            else if (newValue >= 35) { status = "Moderate"; color = "bg-chart-3" }
            else { status = "Low"; color = "bg-chart-5" }
          }
          return { ...ind, value: Math.round(newValue), status, color }
        })
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const overallStatus = () => {
    const positiveAvg = indicators
      .filter((i) => !["Face Muscle Tension", "Lip Press / Jaw Tight.", "Nervous Gestures", "Fidgeting Frequency"].includes(i.label))
      .reduce((sum, ind) => sum + ind.value, 0) / 5
    if (positiveAvg >= 70) return { label: "Confident", color: "text-chart-1" }
    if (positiveAvg >= 50) return { label: "Attentive", color: "text-chart-3" }
    if (positiveAvg >= 35) return { label: "Nervous", color: "text-chart-3" }
    return { label: "Distracted", color: "text-chart-5" }
  }

  const status = overallStatus()

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Body Language & Micro-expressions</h3>
        <span className={`rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium ${status.color}`}>
          {status.label}
        </span>
      </div>

      <div className="space-y-2">
        {indicators.map((ind) => (
          <div key={ind.label} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ind.icon className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{ind.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{ind.status}</span>
                <span className="w-7 text-right text-xs font-medium text-foreground">{ind.value}%</span>
              </div>
            </div>
            <Progress value={ind.value} className="h-1" />
          </div>
        ))}
      </div>
    </div>
  )
}
