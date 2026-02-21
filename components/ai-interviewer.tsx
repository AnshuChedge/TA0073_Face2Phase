"use client"

import { Bot } from "lucide-react"

interface AIInterviewerProps {
  question: string
  isSpeaking: boolean
  questionNumber: number
  totalQuestions: number
}

export function AIInterviewer({ question, isSpeaking, questionNumber, totalQuestions }: AIInterviewerProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="relative">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 ${
            isSpeaking ? "ring-2 ring-primary ring-offset-2 ring-offset-card" : ""
          }`}>
            <Bot className="h-6 w-6 text-primary" />
          </div>
          {isSpeaking && (
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-chart-1" />
          )}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">AI Interviewer</h3>
          <p className="text-xs text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </p>
        </div>
      </div>

      <div className="relative rounded-lg bg-secondary/50 p-4">
        <p className="text-sm leading-relaxed text-foreground">{question}</p>
        {isSpeaking && (
          <div className="mt-3 flex items-center gap-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-3 w-1 animate-pulse rounded-full bg-primary"
                style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
