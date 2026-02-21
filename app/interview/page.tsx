"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Brain, Clock, SkipForward, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { WebcamFeed } from "@/components/webcam-feed"
import { BodyLanguagePanel } from "@/components/body-language-panel"
import { SpeechAnalysisPanel } from "@/components/speech-analysis-panel"
import { FearDetectionPanel } from "@/components/fear-detection-panel"
import { EmotionDetectionPanel } from "@/components/emotion-detection-panel"
import { AIInterviewer } from "@/components/ai-interviewer"
import { getQuestions } from "@/lib/store"
import type { Difficulty, CompanyType } from "@/lib/store"
import Link from "next/link"

function InterviewContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const difficulty = (searchParams.get("difficulty") || "medium") as Difficulty
  const companyType = (searchParams.get("company") || "product") as CompanyType
  const hasResume = searchParams.get("resume") === "true"

  const [resumeText, setResumeText] = useState<string | null>(null)
  const [questions, setQuestions] = useState<string[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(true)
  const [timer, setTimer] = useState(120)
  const [isRecording, setIsRecording] = useState(false)
  const [isSessionDone, setIsSessionDone] = useState(false)
  const [activeTab, setActiveTab] = useState<"body" | "fear" | "emotion">("body")

  useEffect(() => {
    let rt: string | null = null
    if (hasResume) {
      rt = sessionStorage.getItem("resumeText")
      setResumeText(rt)
    }
    const q = getQuestions(difficulty, companyType, rt)
    setQuestions(q)
  }, [difficulty, companyType, hasResume])

  useEffect(() => {
    if (questions.length === 0 || isSessionDone) return
    setIsSpeaking(true)
    setIsRecording(false)
    const speakTimeout = setTimeout(() => {
      setIsSpeaking(false)
      setIsRecording(true)
      setTimer(120)
    }, 3000)
    return () => clearTimeout(speakTimeout)
  }, [currentQ, questions.length, isSessionDone])

  useEffect(() => {
    if (!isRecording || isSessionDone) return
    if (timer <= 0) {
      handleNextQuestion()
      return
    }
    const t = setInterval(() => setTimer((p) => p - 1), 1000)
    return () => clearInterval(t)
  }, [isRecording, timer, isSessionDone])

  const handleNextQuestion = useCallback(() => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((p) => p + 1)
    } else {
      setIsSessionDone(true)
    }
  }, [currentQ, questions.length])

  const handleEndSession = () => {
    const params = new URLSearchParams()
    params.set("mode", "interview")
    params.set("difficulty", difficulty)
    params.set("company", companyType)
    params.set("questions", String(questions.length))
    params.set("answered", String(currentQ + 1))
    router.push(`/report?${params.toString()}`)
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, "0")}`
  }

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading interview...</div>
      </div>
    )
  }

  if (isSessionDone) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
            <Brain className="h-10 w-10 text-primary" />
          </div>
          <h1 className="mb-3 text-3xl font-bold text-foreground">Interview Complete</h1>
          <p className="mb-8 text-muted-foreground">
            You answered {questions.length} questions. Let us generate your feedback report.
          </p>
          <Button onClick={handleEndSession} size="lg" className="gap-2">
            View Feedback Report
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <Brain className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Face2Phase</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className={`text-sm font-mono font-medium ${timer <= 30 ? "text-red-400" : "text-foreground"}`}>
                {formatTime(timer)}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Q{currentQ + 1}/{questions.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handleNextQuestion}>
              <SkipForward className="h-3.5 w-3.5" />
              Skip
            </Button>
            <Button variant="destructive" size="sm" className="gap-1.5" onClick={handleEndSession}>
              <Square className="h-3.5 w-3.5" />
              End
            </Button>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-2">
        <Progress value={((currentQ + 1) / questions.length) * 100} className="h-1" />
      </div>

      {/* Main content - three column layout */}
      <main className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-4 px-4 py-4 lg:flex-row">
        {/* Left: Webcam + AI Interviewer */}
        <div className="flex flex-1 flex-col gap-4">
          <AIInterviewer
            question={questions[currentQ]}
            isSpeaking={isSpeaking}
            questionNumber={currentQ + 1}
            totalQuestions={questions.length}
          />

          <div className="relative">
            <WebcamFeed />
            {isRecording && (
              <div className="absolute bottom-12 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-background/90 px-4 py-2 backdrop-blur-sm">
                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
                <span className="text-xs font-medium text-foreground">Recording your answer...</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Tabbed analysis panels */}
        <div className="flex w-full flex-col gap-3 lg:w-[340px]">
          {/* Tab switcher */}
          <div className="flex gap-1 rounded-lg bg-secondary p-1">
            {([
              { key: "body", label: "Body" },
              { key: "fear", label: "Fear" },
              { key: "emotion", label: "Emotion" },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Conditional panels */}
          {activeTab === "body" && <BodyLanguagePanel />}
          {activeTab === "fear" && <FearDetectionPanel />}
          {activeTab === "emotion" && <EmotionDetectionPanel />}

          <SpeechAnalysisPanel />

          {/* Quick tips */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-2 text-sm font-semibold text-foreground">Quick Tips</h3>
            <ul className="space-y-1.5">
              {[
                "Maintain steady eye contact with the camera",
                "Keep relaxed shoulders and open posture",
                "Breathe deeply to manage stress signals",
                "Avoid filler words - pause instead",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function InterviewPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    }>
      <InterviewContent />
    </Suspense>
  )
}
