"use client"

import { ArrowRight, Brain, Mic, Video, BarChart3, ShieldAlert, Scan } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 py-24">
      {/* Background glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
        <div className="mb-6 flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5">
          <Brain className="h-4 w-4 text-primary" />
          <span className="text-sm text-muted-foreground">AI-Powered Interview Practice</span>
        </div>

        <h1 className="mb-6 text-balance text-5xl font-bold leading-tight tracking-tight md:text-7xl">
          Master Your Next
          <br />
          <span className="text-primary">Interview</span>
        </h1>

        <p className="mb-10 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
          Real-time body language analysis, facial micro-expression detection, fear and stress monitoring, and speech intelligence. Get AR-enhanced feedback and comprehensive performance reports.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="gap-2 px-8 text-base">
            <Link href="/setup">
              Start Practice
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2 px-8 text-base">
            <Link href="#features">
              Explore Features
            </Link>
          </Button>
        </div>
      </div>

      {/* Feature pills */}
      <div className="relative z-10 mt-20 grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[
          { icon: Scan, label: "Micro-Expressions", desc: "Facial muscle analysis" },
          { icon: ShieldAlert, label: "Fear Detection", desc: "Real-time stress score" },
          { icon: Video, label: "AR Overlays", desc: "Live body tracking" },
          { icon: Mic, label: "Voice Intelligence", desc: "Tone & emotion analysis" },
          { icon: Brain, label: "AI Interviewer", desc: "Adaptive questions" },
          { icon: BarChart3, label: "Deep Reports", desc: "Heatmaps & timelines" },
        ].map((feature) => (
          <div
            key={feature.label}
            className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-colors hover:border-primary/30 hover:bg-card"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <feature.icon className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">{feature.label}</span>
            <span className="text-xs text-muted-foreground">{feature.desc}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
