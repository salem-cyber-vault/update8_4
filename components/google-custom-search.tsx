"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Globe } from "lucide-react"

export function GoogleCustomSearch() {
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    const loadGoogleCSE = () => {
      if (scriptLoadedRef.current) return

      try {
        // Create script element
        const script = document.createElement("script")
        script.src = "https://cse.google.com/cse.js?cx=26754e55fae0a4628"
        script.async = true

        // Add error handling for the script
        script.onerror = () => {
          console.warn("[v0] Google CSE script failed to load")
        }

        script.onload = () => {
          console.log("[v0] Google CSE script loaded successfully")
          scriptLoadedRef.current = true
        }

        document.head.appendChild(script)

        // Add global error handler to catch CSS selector errors
        const originalConsoleError = console.error
        console.error = (...args) => {
          const message = args.join(" ")
          if (message.includes("is not a valid selector") && message.includes("gsc")) {
            // Suppress Google CSE selector errors
            console.warn("[v0] Suppressed Google CSE selector error:", message)
            return
          }
          originalConsoleError.apply(console, args)
        }
      } catch (error) {
        console.error("[v0] Error loading Google CSE:", error)
      }
    }

    loadGoogleCSE()

    return () => {
      // Cleanup: remove script if component unmounts
      const scripts = document.querySelectorAll('script[src*="cse.google.com"]')
      scripts.forEach((script) => script.remove())
    }
  }, [])

  return (
    <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-purple-400 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Enhanced Google Search 🔍
          <Badge variant="outline" className="text-purple-400 border-purple-400">
            Custom Engine
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div ref={searchContainerRef} className="gcse-search-container" style={{ minHeight: "60px" }}>
          <div className="gcse-search" data-enableHistory="false"></div>
        </div>

        <Card className="bg-purple-900/20 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Search className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-purple-400 mb-1">Enhanced Search Experience 🚀</h4>
                <p className="text-sm text-purple-300">
                  This enhanced Google search widget provides refined results with custom filtering and improved
                  relevance for cybersecurity research. Perfect for finding specific technical documentation,
                  vulnerability reports, and security-related content across the web.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-xs text-slate-400 text-center">
          Powered by Google Custom Search Engine • Enhanced for Security Research
        </div>
      </CardContent>
    </Card>
  )
}
