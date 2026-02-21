"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Brain, ArrowLeft, ArrowRight, Users, MessageSquare, Upload, Building2, Zap, Flame, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import type { InterviewMode, Difficulty, CompanyType } from "@/lib/store"

const TOTAL_STEPS = 4

export default function SetupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [mode, setMode] = useState<InterviewMode | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [companyType, setCompanyType] = useState<CompanyType | null>(null)
  const [resumeText, setResumeText] = useState<string | null>(null)
  const [resumeFileName, setResumeFileName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const progress = (step / TOTAL_STEPS) * 100

  const canProceed = () => {
    switch (step) {
      case 1:
        return mode !== null
      case 2:
        return difficulty !== null
      case 3:
        return true // resume is optional
      case 4:
        return companyType !== null
      default:
        return false
    }
  }

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1)
    } else {
      // Navigate to the appropriate practice page
      const params = new URLSearchParams()
      if (mode) params.set("mode", mode)
      if (difficulty) params.set("difficulty", difficulty)
      if (companyType) params.set("company", companyType)
      if (resumeText) params.set("resume", "true")

      // Store resume text in sessionStorage for the practice page
      if (resumeText) {
        sessionStorage.setItem("resumeText", resumeText)
      }

      if (mode === "interview") {
        router.push(`/interview?${params.toString()}`)
      } else {
        router.push(`/group-discussion?${params.toString()}`)
      }
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleFileUpload = useCallback((file: File) => {
    if (file && (file.type === "application/pdf" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.type === "text/plain")) {
      setResumeFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        setResumeText(text)
      }
      reader.readAsText(file)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">Face2Phase</span>
          </Link>
          <span className="text-sm text-muted-foreground">
            Step {step} of {TOTAL_STEPS}
          </span>
        </div>
      </header>

      {/* Progress */}
      <div className="mx-auto w-full max-w-4xl px-4 pt-6">
        <Progress value={progress} className="h-1.5" />
      </div>

      {/* Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Step 1: Mode Selection */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="mb-3 text-3xl font-bold text-foreground">Choose Your Mode</h1>
                <p className="text-muted-foreground">Select how you want to practice today.</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  onClick={() => setMode("interview")}
                  className={`flex flex-col items-center gap-4 rounded-xl border-2 p-8 transition-all ${
                    mode === "interview"
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                    mode === "interview" ? "bg-primary/20" : "bg-secondary"
                  }`}>
                    <MessageSquare className={`h-8 w-8 ${mode === "interview" ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="text-center">
                    <h3 className="mb-1 text-lg font-semibold text-foreground">Interview Mode</h3>
                    <p className="text-sm text-muted-foreground">
                      One-on-one AI interview simulation with video analysis
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setMode("group-discussion")}
                  className={`flex flex-col items-center gap-4 rounded-xl border-2 p-8 transition-all ${
                    mode === "group-discussion"
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                    mode === "group-discussion" ? "bg-primary/20" : "bg-secondary"
                  }`}>
                    <Users className={`h-8 w-8 ${mode === "group-discussion" ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="text-center">
                    <h3 className="mb-1 text-lg font-semibold text-foreground">Group Discussion</h3>
                    <p className="text-sm text-muted-foreground">
                      Participate in AI-driven group discussions with virtual panelists
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Difficulty Selection */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="mb-3 text-3xl font-bold text-foreground">Select Difficulty</h1>
                <p className="text-muted-foreground">Choose the challenge level for your session.</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {([
                  { value: "easy" as Difficulty, icon: Shield, label: "Easy", desc: "Basic & introductory questions", color: "text-chart-1" },
                  { value: "medium" as Difficulty, icon: Zap, label: "Medium", desc: "Conceptual & behavioral", color: "text-chart-3" },
                  { value: "hard" as Difficulty, icon: Flame, label: "Hard", desc: "Technical & situational", color: "text-chart-5" },
                ]).map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDifficulty(d.value)}
                    className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all ${
                      difficulty === d.value
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      difficulty === d.value ? "bg-primary/20" : "bg-secondary"
                    }`}>
                      <d.icon className={`h-6 w-6 ${difficulty === d.value ? "text-primary" : d.color}`} />
                    </div>
                    <h3 className="font-semibold text-foreground">{d.label}</h3>
                    <p className="text-center text-xs text-muted-foreground">{d.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Resume Upload */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="mb-3 text-3xl font-bold text-foreground">Upload Your Resume</h1>
                <p className="text-muted-foreground">Optional: Upload your resume for personalized questions.</p>
              </div>
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDragging(false)
                  const file = e.dataTransfer.files[0]
                  if (file) handleFileUpload(file)
                }}
                className={`flex flex-col items-center gap-4 rounded-xl border-2 border-dashed p-12 transition-all ${
                  isDragging
                    ? "border-primary bg-primary/10"
                    : resumeFileName
                    ? "border-primary/50 bg-primary/5"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                  resumeFileName ? "bg-primary/20" : "bg-secondary"
                }`}>
                  <Upload className={`h-8 w-8 ${resumeFileName ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                {resumeFileName ? (
                  <div className="text-center">
                    <p className="font-semibold text-foreground">{resumeFileName}</p>
                    <p className="text-sm text-primary">Resume uploaded successfully</p>
                    <button
                      onClick={() => {
                        setResumeText(null)
                        setResumeFileName(null)
                      }}
                      className="mt-2 text-sm text-muted-foreground underline hover:text-foreground"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="mb-1 font-semibold text-foreground">Drag & drop your resume here</p>
                    <p className="mb-4 text-sm text-muted-foreground">Supports PDF, DOC, DOCX, TXT files</p>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(file)
                        }}
                      />
                      <span className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80">
                        Browse Files
                      </span>
                    </label>
                  </div>
                )}
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Your resume is only used to generate personalized questions. It is not stored.
              </p>
            </div>
          )}

          {/* Step 4: Company Type */}
          {step === 4 && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="mb-3 text-3xl font-bold text-foreground">Company Type</h1>
                <p className="text-muted-foreground">What type of company are you preparing for?</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  onClick={() => setCompanyType("product")}
                  className={`flex flex-col items-center gap-4 rounded-xl border-2 p-8 transition-all ${
                    companyType === "product"
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                    companyType === "product" ? "bg-primary/20" : "bg-secondary"
                  }`}>
                    <Building2 className={`h-8 w-8 ${companyType === "product" ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="text-center">
                    <h3 className="mb-1 text-lg font-semibold text-foreground">Product-Based</h3>
                    <p className="text-sm text-muted-foreground">
                      Focus on system design, DSA, and product thinking
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setCompanyType("service")}
                  className={`flex flex-col items-center gap-4 rounded-xl border-2 p-8 transition-all ${
                    companyType === "service"
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                    companyType === "service" ? "bg-primary/20" : "bg-secondary"
                  }`}>
                    <Users className={`h-8 w-8 ${companyType === "service" ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="text-center">
                    <h3 className="mb-1 text-lg font-semibold text-foreground">Service-Based</h3>
                    <p className="text-sm text-muted-foreground">
                      Focus on client interaction, project management & communication
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-10 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="gap-2"
            >
              {step === TOTAL_STEPS ? "Start Session" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
