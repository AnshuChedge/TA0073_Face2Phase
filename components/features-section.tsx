"use client"

import { Eye, Activity, FileText, Users, Upload, Building2, ShieldAlert, Scan } from "lucide-react"

const features = [
  {
    icon: Scan,
    title: "Micro-Expression Analysis",
    description:
      "Detects facial muscle tension, lip press, jaw tightness, eyebrow movement, and blink rate in real-time using advanced computer vision models.",
  },
  {
    icon: ShieldAlert,
    title: "Fear & Stress Detection",
    description:
      "Multi-factor fear analysis combining facial signals (wide eyes, lip tightening), voice signals (shaking, pitch instability), and body signals (shoulder stiffness, hand shaking) for a real-time Fear Score.",
  },
  {
    icon: Eye,
    title: "Body Language Detection",
    description:
      "Analyzes eye contact stability, posture, head movement, nervous gestures, and fidgeting frequency with live confidence indicators and AR overlays.",
  },
  {
    icon: Activity,
    title: "Speech & Voice Intelligence",
    description:
      "Monitors tone stability, fluency, voice energy, filler words, breathing regularity, and speech speed for comprehensive communication feedback.",
  },
  {
    icon: Users,
    title: "Group Discussion Mode",
    description:
      "Engage with AI virtual participants in real-time discussions. Tracks speaking time share, interruptions, opinion clarity, and leadership traits.",
  },
  {
    icon: Upload,
    title: "Resume-Based Personalization",
    description:
      "Upload your resume for AI-parsed personalized questions based on your skills, projects, experience, and education.",
  },
  {
    icon: Building2,
    title: "Company-Specific Simulation",
    description:
      "Choose product-based or service-based interview styles. Question difficulty, technical depth, and scenario-based questioning adapt accordingly.",
  },
  {
    icon: FileText,
    title: "Comprehensive AI Reports",
    description:
      "Get detailed reports with emotion timelines, stress heat maps, confidence trend graphs, fear trigger moments, strengths, weaknesses, and actionable suggestions.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Advanced AI Analysis for Interview Mastery
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-muted-foreground">
            Powered by computer vision, emotion recognition, and speech intelligence to give you the most comprehensive interview preparation experience.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:bg-card/80"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
