"use client"

import { useEffect, useRef, useState } from "react"
import { Video, VideoOff, Shield, AlertTriangle, Activity } from "lucide-react"

interface WebcamFeedProps {
  onStreamReady?: (stream: MediaStream) => void
}

export function WebcamFeed({ onStreamReady }: WebcamFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // AR overlay simulation state
  const [confidenceMeter, setConfidenceMeter] = useState(72)
  const [emotionLabel, setEmotionLabel] = useState("Focused")
  const [stressAlert, setStressAlert] = useState(false)

  useEffect(() => {
    let stream: MediaStream | null = null

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 640, height: 480 },
          audio: true,
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setIsActive(true)
          onStreamReady?.(stream)
        }
      } catch {
        setError("Camera access denied. Please enable camera permissions.")
      }
    }

    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [onStreamReady])

  // Simulate AR overlay data changing
  useEffect(() => {
    if (!isActive) return
    const interval = setInterval(() => {
      const newConf = Math.max(20, Math.min(95, confidenceMeter + (Math.random() - 0.45) * 10))
      setConfidenceMeter(Math.round(newConf))

      const emotions = ["Focused", "Calm", "Engaged", "Slightly Nervous", "Confident", "Thoughtful"]
      setEmotionLabel(emotions[Math.floor(Math.random() * emotions.length)])

      setStressAlert(newConf < 40)
    }, 3000)

    return () => clearInterval(interval)
  }, [isActive, confidenceMeter])

  if (error) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card">
        <VideoOff className="h-10 w-10 text-muted-foreground" />
        <p className="text-center text-sm text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-card">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="h-full w-full object-cover"
        style={{ transform: "scaleX(-1)" }}
      />

      {isActive && (
        <>
          {/* Live indicator */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1 backdrop-blur-sm">
            <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            <span className="text-xs font-medium text-foreground">Live</span>
          </div>

          {/* AR Overlay: Face tracking box simulation */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%]">
            <div className="h-36 w-28 rounded-lg border-2 border-primary/40 md:h-44 md:w-36">
              {/* Corner markers */}
              <div className="absolute -top-0.5 -left-0.5 h-3 w-3 border-t-2 border-l-2 border-primary" />
              <div className="absolute -top-0.5 -right-0.5 h-3 w-3 border-t-2 border-r-2 border-primary" />
              <div className="absolute -bottom-0.5 -left-0.5 h-3 w-3 border-b-2 border-l-2 border-primary" />
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 border-b-2 border-r-2 border-primary" />
            </div>
          </div>

          {/* AR Overlay: Emotion Label */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1 backdrop-blur-sm">
              <Activity className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium text-foreground">{emotionLabel}</span>
            </div>
          </div>

          {/* AR Overlay: Confidence Meter */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-background/80 px-3 py-1.5 backdrop-blur-sm">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <div className="flex flex-col">
              <span className="text-[10px] leading-tight text-muted-foreground">Confidence</span>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${confidenceMeter}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-foreground">{confidenceMeter}%</span>
              </div>
            </div>
          </div>

          {/* AR Overlay: Stress/Fear Alert */}
          {stressAlert && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-red-500/20 px-3 py-1.5 backdrop-blur-sm">
              <AlertTriangle className="h-3.5 w-3.5 animate-pulse text-red-400" />
              <span className="text-xs font-medium text-red-400">Stress Alert</span>
            </div>
          )}
        </>
      )}

      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Video className="h-12 w-12 animate-pulse text-muted-foreground" />
        </div>
      )}
    </div>
  )
}
