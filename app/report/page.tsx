"use client"

import { Suspense, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import {
  Brain,
  MessageSquare,
  Eye,
  Mic,
  BarChart3,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Download,
  RotateCcw,
  ShieldAlert,
  Smile,
  AlertTriangle,
  Flame,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts"

function generateScores(mode: string, difficulty: string) {
  const base = difficulty === "hard" ? 55 : difficulty === "medium" ? 65 : 75
  const jitter = () => Math.round((Math.random() - 0.3) * 20)

  return {
    communication: Math.min(100, Math.max(30, base + jitter())),
    confidence: Math.min(100, Math.max(30, base + jitter())),
    technicalQuality: Math.min(100, Math.max(30, base + jitter())),
    bodyLanguage: Math.min(100, Math.max(30, base + jitter())),
    eyeContact: Math.min(100, Math.max(30, base + jitter())),
    fluency: Math.min(100, Math.max(30, base + jitter())),
    clarity: Math.min(100, Math.max(30, base + jitter())),
    facialEmotionStability: Math.min(100, Math.max(30, base + jitter())),
    fearStress: Math.min(70, Math.max(5, 100 - base + jitter())),
    ...(mode === "group-discussion"
      ? {
          speakingTime: Math.min(100, Math.max(30, base + jitter())),
          interruptions: Math.max(0, Math.round(Math.random() * 4)),
        }
      : {}),
  }
}

function generateTimeline(length: number, base: number, volatility: number) {
  const data = []
  let value = base
  for (let i = 0; i < length; i++) {
    value = Math.max(5, Math.min(100, value + (Math.random() - 0.5) * volatility))
    data.push({ time: `${i}m`, value: Math.round(value) })
  }
  return data
}

function ScoreCard({
  label,
  value,
  icon: Icon,
  color,
  inverse,
}: {
  label: string
  value: number
  icon: typeof MessageSquare
  color: string
  inverse?: boolean
}) {
  const getGrade = (v: number) => {
    if (inverse) {
      if (v <= 20) return "Excellent"
      if (v <= 40) return "Good"
      if (v <= 60) return "Moderate"
      return "High"
    }
    if (v >= 85) return "Excellent"
    if (v >= 70) return "Good"
    if (v >= 55) return "Average"
    return "Needs Work"
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
            <Icon className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
        <span className="text-2xl font-bold text-foreground">{value}{inverse ? "" : "%"}</span>
      </div>
      <Progress value={inverse ? 100 - value : value} className="mb-2 h-2" />
      <p className="text-xs text-muted-foreground">{getGrade(value)}</p>
    </div>
  )
}

// Stress heatmap component
function StressHeatMap({ data }: { data: number[][] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, w, h)

    const rows = data.length
    const cols = data[0].length
    const cellW = w / cols
    const cellH = h / rows

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const val = data[r][c]
        const intensity = val / 100
        const red = Math.round(220 * intensity + 30)
        const green = Math.round(200 * (1 - intensity) + 20)
        const blue = Math.round(60 * (1 - intensity) + 30)
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`
        ctx.beginPath()
        ctx.roundRect(c * cellW + 1, r * cellH + 1, cellW - 2, cellH - 2, 3)
        ctx.fill()
      }
    }
  }, [data])

  return <canvas ref={canvasRef} className="h-32 w-full rounded-lg" />
}

function ReportContent() {
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") || "interview"
  const difficulty = searchParams.get("difficulty") || "medium"

  const scores = generateScores(mode, difficulty)

  const overallScore = Math.round(
    (scores.communication +
      scores.confidence +
      scores.technicalQuality +
      scores.bodyLanguage +
      scores.fluency +
      scores.clarity +
      scores.facialEmotionStability +
      (100 - scores.fearStress)) /
      8
  )

  const radarData = [
    { subject: "Communication", value: scores.communication },
    { subject: "Confidence", value: scores.confidence },
    { subject: "Technical", value: scores.technicalQuality },
    { subject: "Body Language", value: scores.bodyLanguage },
    { subject: "Emotion Stability", value: scores.facialEmotionStability },
    { subject: "Fluency", value: scores.fluency },
    { subject: "Clarity", value: scores.clarity },
    { subject: "Composure", value: 100 - scores.fearStress },
  ]

  const barData = [
    { name: "Communication", score: scores.communication },
    { name: "Confidence", score: scores.confidence },
    { name: "Technical", score: scores.technicalQuality },
    { name: "Body Lang.", score: scores.bodyLanguage },
    { name: "Emotion Stab.", score: scores.facialEmotionStability },
    { name: "Fluency", score: scores.fluency },
    { name: "Eye Contact", score: scores.eyeContact },
    { name: "Composure", score: 100 - scores.fearStress },
  ]

  const barColors = [
    "var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)",
    "var(--chart-5)", "var(--chart-1)", "var(--chart-2)", "var(--chart-3)",
  ]

  // Generate timeline data
  const emotionTimeline = [
    { time: "0m", confidence: 60, nervousness: 45, fear: 30, engagement: 55 },
    { time: "1m", confidence: 55, nervousness: 50, fear: 35, engagement: 50 },
    { time: "2m", confidence: 62, nervousness: 40, fear: 25, engagement: 60 },
    { time: "3m", confidence: 68, nervousness: 35, fear: 20, engagement: 65 },
    { time: "4m", confidence: 65, nervousness: 38, fear: 28, engagement: 62 },
    { time: "5m", confidence: 72, nervousness: 30, fear: 18, engagement: 70 },
    { time: "6m", confidence: 70, nervousness: 32, fear: 22, engagement: 68 },
    { time: "7m", confidence: 75, nervousness: 28, fear: 15, engagement: 72 },
    { time: "8m", confidence: 73, nervousness: 30, fear: 20, engagement: 70 },
    { time: "9m", confidence: 78, nervousness: 25, fear: 12, engagement: 75 },
  ]

  const confidenceTrend = generateTimeline(15, scores.confidence, 15)

  const stressHeatData: number[][] = []
  for (let r = 0; r < 5; r++) {
    const row: number[] = []
    for (let c = 0; c < 12; c++) {
      row.push(Math.round(Math.max(5, Math.min(95, scores.fearStress + (Math.random() - 0.5) * 40))))
    }
    stressHeatData.push(row)
  }

  // Fear trigger moments
  const fearTriggers = [
    { time: "1:23", trigger: "Technical question about system design", fearLevel: 65 },
    { time: "3:45", trigger: "Follow-up question on weak area", fearLevel: 72 },
    { time: "5:12", trigger: "Behavioral question about conflict", fearLevel: 58 },
    { time: "7:30", trigger: "Unexpected scenario-based question", fearLevel: 68 },
  ]

  const strengths: string[] = []
  const weaknesses: string[] = []
  const suggestions: string[] = []

  if (scores.communication >= 70) strengths.push("Strong verbal communication skills")
  else weaknesses.push("Verbal communication needs refinement")
  if (scores.confidence >= 70) strengths.push("Projects confidence in responses")
  else weaknesses.push("Could appear more confident")
  if (scores.technicalQuality >= 70) strengths.push("Solid technical answer quality")
  else weaknesses.push("Technical answers lack depth")
  if (scores.bodyLanguage >= 70) strengths.push("Positive body language throughout")
  else weaknesses.push("Body language could be more open")
  if (scores.facialEmotionStability >= 70) strengths.push("Stable facial expressions and composure")
  else weaknesses.push("Facial expressions show inconsistency under pressure")
  if (scores.fearStress <= 30) strengths.push("Excellent stress management and composure")
  else weaknesses.push("Shows visible signs of fear/stress during challenging questions")
  if (scores.fluency >= 70) strengths.push("Fluent speech with minimal pauses")
  else weaknesses.push("Speech has noticeable hesitations")
  if (scores.clarity >= 70) strengths.push("Clear and structured responses")
  else weaknesses.push("Responses could be more structured")

  if (scores.communication < 70) suggestions.push("Practice articulating your thoughts using the STAR method (Situation, Task, Action, Result)")
  if (scores.confidence < 70) suggestions.push("Record yourself answering questions and review your posture and tone. Practice power poses before interviews.")
  if (scores.fearStress > 30) suggestions.push("Practice deep breathing exercises (4-7-8 method) before and during interviews to manage fear signals.")
  if (scores.facialEmotionStability < 70) suggestions.push("Work on maintaining neutral-to-positive facial expressions. Practice in front of a mirror to notice micro-expressions.")
  if (scores.bodyLanguage < 70) suggestions.push("Maintain eye contact with the camera, sit up straight, and use deliberate hand gestures.")
  if (scores.fluency < 70) suggestions.push("Reduce filler words by pausing instead of saying um or uh. Practice with a timer.")
  if (scores.technicalQuality < 70) suggestions.push("Review core concepts in your domain. Practice explaining complex topics in simple terms.")

  if (suggestions.length === 0) {
    suggestions.push("Keep practicing regularly to maintain your excellent performance.")
    suggestions.push("Challenge yourself with harder difficulty levels to continue growing.")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <Brain className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Face2Phase</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <Link href="/setup">
                <RotateCcw className="h-3.5 w-3.5" />
                Practice Again
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Hero Score */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Performance Report</h1>
          <p className="mb-8 text-muted-foreground">
            {mode === "interview" ? "Interview" : "Group Discussion"} Session
            {" - "}
            <span className="capitalize">{difficulty}</span> Difficulty
          </p>

          <div className="mx-auto mb-8 flex h-40 w-40 flex-col items-center justify-center rounded-full border-4 border-primary bg-primary/10">
            <span className="text-4xl font-bold text-foreground">{overallScore}</span>
            <span className="text-sm text-primary">Overall Score</span>
          </div>
        </div>

        {/* Score Cards Grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ScoreCard label="Communication" value={scores.communication} icon={MessageSquare} color="bg-chart-1" />
          <ScoreCard label="Confidence" value={scores.confidence} icon={Mic} color="bg-chart-2" />
          <ScoreCard label="Technical Quality" value={scores.technicalQuality} icon={BarChart3} color="bg-chart-3" />
          <ScoreCard label="Body Language" value={scores.bodyLanguage} icon={Eye} color="bg-chart-4" />
          <ScoreCard label="Facial Emotion Stability" value={scores.facialEmotionStability} icon={Smile} color="bg-chart-5" />
          <ScoreCard label="Fear / Stress" value={scores.fearStress} icon={ShieldAlert} color="bg-red-500" inverse />
          <ScoreCard label="Eye Contact" value={scores.eyeContact} icon={Eye} color="bg-chart-1" />
          <ScoreCard label="Fluency" value={scores.fluency} icon={Mic} color="bg-chart-2" />
        </div>

        {/* Charts Row 1 */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Radar Chart */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Skills Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="var(--primary)"
                  fill="var(--primary)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Score Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
                <YAxis dataKey="name" type="category" width={90} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--foreground)",
                  }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {barData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2: Emotion Timeline + Confidence Trend */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Emotion Timeline */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Emotion Timeline</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={emotionTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="time" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--foreground)",
                  }}
                />
                <Line type="monotone" dataKey="confidence" stroke="#22c55e" strokeWidth={2} dot={false} name="Confidence" />
                <Line type="monotone" dataKey="nervousness" stroke="#f59e0b" strokeWidth={2} dot={false} name="Nervousness" />
                <Line type="monotone" dataKey="fear" stroke="#ef4444" strokeWidth={2} dot={false} name="Fear" />
                <Line type="monotone" dataKey="engagement" stroke="var(--primary)" strokeWidth={2} dot={false} name="Engagement" />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-3 flex flex-wrap justify-center gap-4">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Confidence</span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="h-2 w-2 rounded-full bg-yellow-500" /> Nervousness</span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="h-2 w-2 rounded-full bg-red-500" /> Fear</span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="h-2 w-2 rounded-full bg-primary" /> Engagement</span>
            </div>
          </div>

          {/* Confidence Trend */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Confidence Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={confidenceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="time" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--foreground)",
                  }}
                />
                <defs>
                  <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} fill="url(#confGrad)" name="Confidence" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stress Heat Map + Fear Trigger Moments */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Stress Heat Map */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-2 text-sm font-semibold text-foreground">Stress Heat Map</h3>
            <p className="mb-4 text-xs text-muted-foreground">
              Stress intensity across session timeline (rows: signal categories, cols: time intervals)
            </p>
            <StressHeatMap data={stressHeatData} />
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>Start</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="h-2.5 w-2.5 rounded-sm bg-emerald-600" />
                  <span>Low</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2.5 w-2.5 rounded-sm bg-yellow-500" />
                  <span>Med</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2.5 w-2.5 rounded-sm bg-red-500" />
                  <span>High</span>
                </div>
              </div>
              <span>End</span>
            </div>
          </div>

          {/* Fear Trigger Moments */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <Flame className="h-4 w-4 text-red-400" />
              <h3 className="text-sm font-semibold text-foreground">Fear Trigger Moments</h3>
            </div>
            <div className="space-y-3">
              {fearTriggers.map((trigger, i) => (
                <div key={i} className="rounded-lg border border-border bg-secondary/30 p-3">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="font-mono text-xs font-medium text-primary">{trigger.time}</span>
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className={`h-3 w-3 ${trigger.fearLevel >= 65 ? "text-red-400" : "text-yellow-400"}`} />
                      <span className={`text-xs font-medium ${trigger.fearLevel >= 65 ? "text-red-400" : "text-yellow-400"}`}>
                        Fear: {trigger.fearLevel}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-foreground">{trigger.trigger}</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full transition-all ${trigger.fearLevel >= 65 ? "bg-red-500" : "bg-yellow-500"}`}
                      style={{ width: `${trigger.fearLevel}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              <h3 className="text-sm font-semibold text-foreground">Strengths</h3>
            </div>
            <ul className="space-y-3">
              {strengths.map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <span className="text-sm text-foreground">{s}</span>
                </li>
              ))}
              {strengths.length === 0 && (
                <li className="text-sm text-muted-foreground">Keep practicing to develop your strengths.</li>
              )}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-400" />
              <h3 className="text-sm font-semibold text-foreground">Areas for Improvement</h3>
            </div>
            <ul className="space-y-3">
              {weaknesses.map((w) => (
                <li key={w} className="flex items-start gap-2">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                  <span className="text-sm text-foreground">{w}</span>
                </li>
              ))}
              {weaknesses.length === 0 && (
                <li className="text-sm text-muted-foreground">Outstanding performance across all areas!</li>
              )}
            </ul>
          </div>
        </div>

        {/* Improvement Suggestions */}
        <div className="mb-8 rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Improvement Suggestions</h3>
          <div className="space-y-4">
            {suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-secondary/50 p-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                  {i + 1}
                </div>
                <p className="text-sm leading-relaxed text-foreground">{s}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center justify-center gap-4 py-8 sm:flex-row">
          <Button asChild size="lg" className="gap-2">
            <Link href="/setup">
              Practice Again
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="gap-2" onClick={() => window.print()}>
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>
      </main>
    </div>
  )
}

export default function ReportPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-muted-foreground">Generating your report...</div>
        </div>
      }
    >
      <ReportContent />
    </Suspense>
  )
}
