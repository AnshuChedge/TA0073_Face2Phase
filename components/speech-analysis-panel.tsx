"use client"

import { useEffect, useState } from "react"
import { Mic, Activity, Gauge, AlertTriangle, Volume2, Wind, Waves } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface SpeechMetric {
  label: string
  icon: typeof Mic
  value: number
  unit: string
}

export function SpeechAnalysisPanel() {
  const [metrics, setMetrics] = useState<SpeechMetric[]>([
    { label: "Confidence", icon: Mic, value: 68, unit: "%" },
    { label: "Fluency", icon: Activity, value: 74, unit: "%" },
    { label: "Tone Stability", icon: Waves, value: 70, unit: "%" },
    { label: "Voice Energy", icon: Volume2, value: 62, unit: "%" },
    { label: "Speech Speed", icon: Gauge, value: 135, unit: "wpm" },
    { label: "Breathing Reg.", icon: Wind, value: 78, unit: "%" },
    { label: "Filler Words", icon: AlertTriangle, value: 3, unit: "count" },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => {
          if (m.label === "Filler Words") {
            const change = Math.random() > 0.7 ? 1 : 0
            return { ...m, value: Math.min(15, m.value + change) }
          }
          if (m.label === "Speech Speed") {
            const change = (Math.random() - 0.5) * 20
            return { ...m, value: Math.max(80, Math.min(200, Math.round(m.value + change))) }
          }
          const change = (Math.random() - 0.5) * 8
          return { ...m, value: Math.max(20, Math.min(100, Math.round(m.value + change))) }
        })
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const toneLabel = () => {
    const confidence = metrics[0].value
    if (confidence >= 70) return "Assertive"
    if (confidence >= 50) return "Steady"
    return "Hesitant"
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Speech & Voice Intelligence</h3>
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-primary">
          {toneLabel()}
        </span>
      </div>

      <div className="space-y-2">
        {metrics.map((m) => (
          <div key={m.label} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <m.icon className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{m.label}</span>
              </div>
              <span className="text-xs font-medium text-foreground">
                {m.value}
                {m.unit === "%" ? "%" : m.unit === "wpm" ? " wpm" : ""}
              </span>
            </div>
            {m.unit === "%" && <Progress value={m.value} className="h-1" />}
            {m.unit === "wpm" && (
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-chart-2 transition-all"
                  style={{ width: `${Math.min(100, (m.value / 200) * 100)}%` }}
                />
              </div>
            )}
            {m.unit === "count" && (
              <div className="flex gap-0.5">
                {Array.from({ length: Math.min(10, m.value) }).map((_, i) => (
                  <div key={i} className="h-1 w-2 rounded-full bg-chart-3" />
                ))}
                {Array.from({ length: Math.max(0, 10 - m.value) }).map((_, i) => (
                  <div key={i} className="h-1 w-2 rounded-full bg-secondary" />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
