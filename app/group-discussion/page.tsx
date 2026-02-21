"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Brain, Clock, Square, MessageCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WebcamFeed } from "@/components/webcam-feed"
import { BodyLanguagePanel } from "@/components/body-language-panel"
import { SpeechAnalysisPanel } from "@/components/speech-analysis-panel"
import { FearDetectionPanel } from "@/components/fear-detection-panel"
import { EmotionDetectionPanel } from "@/components/emotion-detection-panel"
import { getGDTopics } from "@/lib/store"
import type { Difficulty } from "@/lib/store"
import Link from "next/link"

const AI_PARTICIPANTS = [
  { name: "Priya", color: "bg-chart-1" },
  { name: "Alex", color: "bg-chart-2" },
  { name: "Jordan", color: "bg-chart-3" },
  { name: "Mei", color: "bg-chart-4" },
]

interface ChatMessage {
  speaker: string
  isAI: boolean
  text: string
  timestamp: number
}

function GroupDiscussionContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const difficulty = (searchParams.get("difficulty") || "medium") as Difficulty

  const topics = getGDTopics(difficulty)
  const topic = topics[0]

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [timer, setTimer] = useState(600)
  const [isSessionDone, setIsSessionDone] = useState(false)
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null)
  const [userSpeakingTime, setUserSpeakingTime] = useState(0)
  const [isUserSpeaking, setIsUserSpeaking] = useState(false)
  const [interruptionCount, setInterruptionCount] = useState(0)
  const [activeTab, setActiveTab] = useState<"body" | "fear" | "emotion">("body")

  useEffect(() => {
    if (isSessionDone) return

    const scheduleNext = () => {
      const delay = 5000 + Math.random() * 8000
      return setTimeout(() => {
        const participant = AI_PARTICIPANTS[Math.floor(Math.random() * AI_PARTICIPANTS.length)]
        const perspective = topic.perspectives[Math.floor(Math.random() * topic.perspectives.length)]

        const variations = [
          perspective,
          `I think ${perspective.toLowerCase()}`,
          `Building on that point, ${perspective.toLowerCase()}`,
          `I respectfully disagree. ${perspective}`,
          `That is an interesting take. However, ${perspective.toLowerCase()}`,
        ]

        const text = variations[Math.floor(Math.random() * variations.length)]

        setCurrentSpeaker(participant.name)
        setMessages((prev) => [
          ...prev,
          { speaker: participant.name, isAI: true, text, timestamp: Date.now() },
        ])

        if (isUserSpeaking) {
          setInterruptionCount((p) => p + 1)
        }

        setTimeout(() => setCurrentSpeaker(null), 3000)
        timerRef = scheduleNext()
      }, delay)
    }

    let timerRef = scheduleNext()
    return () => clearTimeout(timerRef)
  }, [isSessionDone, isUserSpeaking, topic.perspectives])

  useEffect(() => {
    if (isSessionDone) return
    if (timer <= 0) {
      setIsSessionDone(true)
      return
    }
    const t = setInterval(() => setTimer((p) => p - 1), 1000)
    return () => clearInterval(t)
  }, [timer, isSessionDone])

  useEffect(() => {
    if (!isUserSpeaking || isSessionDone) return
    const t = setInterval(() => setUserSpeakingTime((p) => p + 1), 1000)
    return () => clearInterval(t)
  }, [isUserSpeaking, isSessionDone])

  const handleUserSpeak = useCallback(() => {
    if (isUserSpeaking) {
      setIsUserSpeaking(false)
      setMessages((prev) => [
        ...prev,
        { speaker: "You", isAI: false, text: "Shared your perspective on the topic.", timestamp: Date.now() },
      ])
    } else {
      setIsUserSpeaking(true)
    }
  }, [isUserSpeaking])

  const handleEndSession = () => {
    const params = new URLSearchParams()
    params.set("mode", "group-discussion")
    params.set("difficulty", difficulty)
    params.set("speakingTime", String(userSpeakingTime))
    params.set("interruptions", String(interruptionCount))
    params.set("messages", String(messages.length))
    router.push(`/report?${params.toString()}`)
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, "0")}`
  }

  if (isSessionDone) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
            <Brain className="h-10 w-10 text-primary" />
          </div>
          <h1 className="mb-3 text-3xl font-bold text-foreground">Discussion Complete</h1>
          <p className="mb-8 text-muted-foreground">
            You spoke for {formatTime(userSpeakingTime)} with {messages.filter((m) => !m.isAI).length} contributions.
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
              <span className={`text-sm font-mono font-medium ${timer <= 60 ? "text-red-400" : "text-foreground"}`}>
                {formatTime(timer)}
              </span>
            </div>
          </div>

          <Button variant="destructive" size="sm" className="gap-1.5" onClick={handleEndSession}>
            <Square className="h-3.5 w-3.5" />
            End
          </Button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-4 px-4 py-4 lg:flex-row">
        {/* Left: Discussion panel */}
        <div className="flex flex-1 flex-col gap-4">
          {/* Topic */}
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
            <h2 className="mb-1 text-xs font-medium text-primary">Discussion Topic</h2>
            <p className="text-sm font-semibold leading-relaxed text-foreground">{topic.topic}</p>
          </div>

          {/* Participants */}
          <div className="flex items-center gap-3">
            {AI_PARTICIPANTS.map((p) => (
              <div key={p.name} className="flex items-center gap-1.5">
                <div className={`relative flex h-8 w-8 items-center justify-center rounded-full ${p.color}`}>
                  <User className="h-4 w-4 text-foreground" />
                  {currentSpeaker === p.name && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-chart-1" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{p.name}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5">
              <div className={`relative flex h-8 w-8 items-center justify-center rounded-full bg-primary ${
                isUserSpeaking ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
              }`}>
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xs text-foreground font-medium">You</span>
            </div>
          </div>

          {/* Chat messages */}
          <div className="flex-1 space-y-3 overflow-y-auto rounded-xl border border-border bg-card p-4" style={{ maxHeight: "400px" }}>
            {messages.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                The discussion will start shortly. AI participants will begin sharing their views...
              </p>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.isAI ? "" : "flex-row-reverse"}`}>
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  msg.isAI
                    ? AI_PARTICIPANTS.find((p) => p.name === msg.speaker)?.color || "bg-secondary"
                    : "bg-primary"
                }`}>
                  <User className={`h-3.5 w-3.5 ${msg.isAI ? "text-foreground" : "text-primary-foreground"}`} />
                </div>
                <div className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  msg.isAI ? "bg-secondary" : "bg-primary/20"
                }`}>
                  <p className="mb-0.5 text-xs font-medium text-primary">{msg.speaker}</p>
                  <p className="text-sm text-foreground">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Speak button */}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleUserSpeak}
              className={`flex-1 gap-2 ${isUserSpeaking ? "bg-red-500 hover:bg-red-500/90 text-foreground" : ""}`}
              size="lg"
            >
              <MessageCircle className="h-4 w-4" />
              {isUserSpeaking ? "Stop Speaking" : "Hold to Speak"}
            </Button>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Speaking time</p>
              <p className="font-mono text-sm font-medium text-foreground">{formatTime(userSpeakingTime)}</p>
            </div>
          </div>
        </div>

        {/* Right: Analysis + Webcam */}
        <div className="flex w-full flex-col gap-3 lg:w-[340px]">
          <WebcamFeed />

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

          {activeTab === "body" && <BodyLanguagePanel />}
          {activeTab === "fear" && <FearDetectionPanel />}
          {activeTab === "emotion" && <EmotionDetectionPanel />}

          <SpeechAnalysisPanel />
        </div>
      </main>
    </div>
  )
}

export default function GroupDiscussionPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    }>
      <GroupDiscussionContent />
    </Suspense>
  )
}
