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
        <div
          ref={searchContainerRef}
          className="gcse-search-container"
          style={{ minHeight: "60px", background: "#18181b", color: "#fafafa", borderRadius: "0.5rem", padding: "1rem" }}
        >
            <div className="gcse-search" data-enableHistory="false"></div>
            <style>{`
              /* Google CSE input and button dark mode override */
              #cse-search-box input.gsc-input {
                background: #18181b !important;
                color: #fafafa !important;
                border: 1px solid #6d28d9 !important;
              }
              #cse-search-box input.gsc-input::placeholder {
                color: #a3a3a3 !important;
              }
              #cse-search-box .gsc-search-button {
                background: #6d28d9 !important;
                border: 1px solid #6d28d9 !important;
              }
              #cse-search-box .gsc-search-button input {
                color: #fafafa !important;
              }
              #cse-search-box .gsc-search-box-tools .gsc-search-box .gsc-input-box {
                background: #18181b !important;
              }
            `}</style>
          <style>{`
            .gcse-search input, .gsc-input-box, .gsc-input {
              background: #18181b !important;
              color: #fafafa !important;
              border: 1px solid #6b21a8 !important;
            }
            .gcse-search .gsc-search-button-v2 {
              background: #6b21a8 !important;
              color: #fff !important;
              border-radius: 0.375rem !important;
            }
            .gcse-search .gsc-tabHeader.gsc-tabhInactive {
              background: #18181b !important;
              color: #a3a3a3 !important;
            }
            .gcse-search .gsc-tabHeader.gsc-tabhActive {
              background: #6b21a8 !important;
              color: #fff !important;
            }
            .gcse-search .gsc-webResult.gsc-result,
            .gcse-search .gsc-results .gsc-result,
            .gcse-search .gsc-results,
            .gcse-search .gsc-result {
              background: #18181b !important;
              color: #fafafa !important;
              border-radius: 0.375rem !important;
              border: 1px solid #6b21a8 !important;
              margin-bottom: 1rem !important;
            }
            .gcse-search .gsc-url-top,
            .gcse-search .gs-spelling,
            .gcse-search .gs-snippet,
            .gcse-search .gs-title,
            .gcse-search .gsc-title {
              color: #a3e635 !important;
            }
            .gcse-search .gsc-result .gs-no-results,
            .gcse-search .gsc-result .gs-snippet,
            .gcse-search .gsc-result .gs-title {
              color: #fafafa !important;
            }
            .gcse-search .gsc-result .gs-visibleUrl {
              color: #38bdf8 !important;
            }
            .gcse-search .gsc-result .gs-spelling {
              color: #a3e635 !important;
            }
            .gcse-search .gsc-result .gs-snippet {
              color: #fafafa !important;
            }
            .gcse-search .gsc-result .gs-title a {
              color: #a3e635 !important;
            }
            .gcse-search .gsc-result .gs-no-results {
              background: #18181b !important;
              color: #f87171 !important;
              border-radius: 0.375rem !important;
              border: 1px solid #6b21a8 !important;
              padding: 0.5rem !important;
            }
            .gcse-search .gsc-result .gs-snippet b {
              color: #facc15 !important;
            }
          `}</style>
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
