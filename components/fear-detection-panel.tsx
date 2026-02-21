"use client"

import { useEffect, useState, useRef } from "react"
import { AlertTriangle, Activity, ShieldAlert, TrendingUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface FearSignal {
  label: string
  category: "facial" | "voice" | "body"
  value: number
}

export function FearDetectionPanel() {
  const [fearScore, setFearScore] = useState(28)
  const [stressTimeline, setStressTimeline] = useState<number[]>([30, 25, 35, 28, 32, 27, 30])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [signals, setSignals] = useState<FearSignal[]>([
    { label: "Wide Eyes", category: "facial", value: 15 },
    { label: "Lip Tightening", category: "facial", value: 22 },
    { label: "Jaw Stiffness", category: "facial", value: 18 },
    { label: "Micro Trembling", category: "facial", value: 10 },
    { label: "Voice Shaking", category: "voice", value: 20 },
    { label: "Pitch Instability", category: "voice", value: 25 },
    { label: "Breathing Irregularity", category: "voice", value: 15 },
    { label: "Shoulder Stiffness", category: "body", value: 30 },
    { label: "Defensive Posture", category: "body", value: 12 },
    { label: "Hand Shaking", category: "body", value: 8 },
  ])

  // Simulate live fear analysis
  useEffect(() => {
    const interval = setInterval(() => {
      setSignals((prev) =>
        prev.map((s) => {
          const change = (Math.random() - 0.45) * 12
          return { ...s, value: Math.max(0, Math.min(100, Math.round(s.value + change))) }
        })
      )

      setFearScore((prev) => {
        const change = (Math.random() - 0.45) * 8
        const newVal = Math.max(0, Math.min(100, Math.round(prev + change)))
        setStressTimeline((t) => [...t.slice(-19), newVal])
        return newVal
      })
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  // Draw stress timeline
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = canvas.offsetWidth * dpr
    canvas.height = canvas.offsetHeight * dpr
    ctx.scale(dpr, dpr)

    const w = canvas.offsetWidth
    const h = canvas.offsetHeight

    ctx.clearRect(0, 0, w, h)

    // Draw threshold line
    ctx.strokeStyle = "rgba(255, 100, 100, 0.3)"
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    const threshY = h - (60 / 100) * h
    ctx.beginPath()
    ctx.moveTo(0, threshY)
    ctx.lineTo(w, threshY)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw timeline
    if (stressTimeline.length < 2) return
    const stepX = w / (stressTimeline.length - 1)

    // Fill gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h)
    grad.addColorStop(0, "rgba(239, 68, 68, 0.3)")
    grad.addColorStop(1, "rgba(239, 68, 68, 0)")
    ctx.beginPath()
    ctx.moveTo(0, h)
    stressTimeline.forEach((val, i) => {
      const x = i * stepX
      const y = h - (val / 100) * h
      if (i === 0) ctx.lineTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.lineTo(w, h)
    ctx.closePath()
    ctx.fillStyle = grad
    ctx.fill()

    // Draw line
    ctx.beginPath()
    stressTimeline.forEach((val, i) => {
      const x = i * stepX
      const y = h - (val / 100) * h
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.strokeStyle = fearScore >= 60 ? "#ef4444" : fearScore >= 40 ? "#f59e0b" : "#22c55e"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw current point
    const lastX = (stressTimeline.length - 1) * stepX
    const lastY = h - (stressTimeline[stressTimeline.length - 1] / 100) * h
    ctx.beginPath()
    ctx.arc(lastX, lastY, 4, 0, Math.PI * 2)
    ctx.fillStyle = fearScore >= 60 ? "#ef4444" : fearScore >= 40 ? "#f59e0b" : "#22c55e"
    ctx.fill()
  }, [stressTimeline, fearScore])

  const getFearLevel = (score: number) => {
    if (score >= 70) return { label: "High Fear", color: "text-red-400", bgColor: "bg-red-500/20" }
    if (score >= 50) return { label: "Elevated", color: "text-orange-400", bgColor: "bg-orange-500/20" }
    if (score >= 30) return { label: "Moderate", color: "text-yellow-400", bgColor: "bg-yellow-500/20" }
    return { label: "Calm", color: "text-emerald-400", bgColor: "bg-emerald-500/20" }
  }

  const level = getFearLevel(fearScore)
  const topSignals = [...signals].sort((a, b) => b.value - a.value).slice(0, 4)

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-red-400" />
          <h3 className="text-sm font-semibold text-foreground">Fear Detection</h3>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${level.color} ${level.bgColor}`}>
          {level.label}
        </span>
      </div>

      {/* Fear Score Circle */}
      <div className="mb-3 flex items-center gap-4">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
          <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="var(--secondary)" strokeWidth="4" />
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke={fearScore >= 60 ? "#ef4444" : fearScore >= 40 ? "#f59e0b" : "#22c55e"}
              strokeWidth="4"
              strokeDasharray={`${(fearScore / 100) * 175.9} 175.9`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <span className="absolute text-lg font-bold text-foreground">{fearScore}</span>
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Fear Score (0-100)</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {fearScore >= 60
              ? "High stress signals detected. Take a deep breath."
              : fearScore >= 40
                ? "Some stress indicators present. Stay composed."
                : "You appear calm and composed. Keep it up."}
          </p>
        </div>
      </div>

      {/* Stress Timeline */}
      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Stress Timeline</span>
          <span className="text-xs text-muted-foreground">Threshold: 60</span>
        </div>
        <canvas ref={canvasRef} className="h-12 w-full rounded-md bg-secondary/30" />
      </div>

      {/* Top Active Signals */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Active Signals</p>
        <div className="space-y-1.5">
          {topSignals.map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                s.value >= 50 ? "bg-red-400" : s.value >= 30 ? "bg-yellow-400" : "bg-emerald-400"
              }`} />
              <span className="flex-1 text-xs text-muted-foreground">{s.label}</span>
              <span className="text-xs font-medium text-foreground">{s.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Warning indicator */}
      {fearScore >= 60 && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2">
          <AlertTriangle className="h-3.5 w-3.5 animate-pulse text-red-400" />
          <span className="text-xs font-medium text-red-400">High fear detected - try controlled breathing</span>
        </div>
      )}
    </div>
  )
}
