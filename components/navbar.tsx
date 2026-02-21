"use client"

import Link from "next/link"
import { Brain } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Brain className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">Face2Phase</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="#features"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Features
          </Link>
          <Button asChild size="sm">
            <Link href="/setup">Start Practice</Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}
