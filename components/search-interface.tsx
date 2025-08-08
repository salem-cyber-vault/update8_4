"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Zap, Globe, Eye } from "lucide-react"

interface SearchInterfaceProps {
  onSearch: (query: string) => void
  loading: boolean
  resultCount: number
}

export function SearchInterface({ onSearch, loading, resultCount }: SearchInterfaceProps) {
  const [query, setQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      onSearch(query.trim())
    }
  }, [query, onSearch])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const quickSearches = [
    { label: "Webcams", query: "webcam", icon: "📹" },
    { label: "SSH Servers", query: "port:22", icon: "🔐" },
    { label: "Web Servers", query: "port:80,443", icon: "🌐" },
    { label: "Databases", query: "mysql mongodb", icon: "🗄️" },
    { label: "IoT Devices", query: "iot", icon: "📱" },
    { label: "Industrial", query: "scada", icon: "🏭" },
  ]

  return (
    <div className="space-y-6">
      {/* Main Search */}
      <Card className="glass-card-feminine border-pink-300/20 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <Search className="w-8 h-8 text-pink-300 animate-gentle-glow" />
            <div className="absolute inset-0 bg-pink-300/20 rounded-full blur-lg animate-soft-pulse"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gradient-feminine">Universal Intelligence Scanner</h2>
            <p className="text-slate-300">Discover cyber intelligence with elegance and precision</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-pink-300 transition-colors" />
            <Input
              placeholder="Enter IP, domain, email, hash, or keywords... (intelligent type detection)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-12 h-14 glass-card border-pink-300/30 text-white placeholder-slate-400 focus:border-pink-400/50 focus:ring-pink-400/20 text-lg"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            size="lg"
            className="h-14 px-8 bg-gradient-to-r from-pink-500/80 to-purple-500/80 hover:from-pink-400/90 hover:to-purple-400/90 text-white font-medium backdrop-blur-md border border-pink-300/20"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Explore
              </>
            )}
          </Button>
        </div>

        {/* Quick Searches */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-200 flex items-center gap-2">
            <Eye className="w-4 h-4 text-pink-300" />
            Quick Intelligence Searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {quickSearches.map((item) => (
              <Button
                key={item.query}
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery(item.query)
                  onSearch(item.query)
                }}
                className="glass-card-feminine border-slate-400/30 text-slate-200 hover:bg-pink-500/20 hover:text-pink-200 hover:border-pink-400/50 transition-all animate-float-gentle"
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        {resultCount > 0 && (
          <div className="mt-6 pt-6 border-t border-pink-300/20">
            <div className="flex items-center gap-2 text-slate-200">
              <Globe className="w-4 h-4 text-pink-300" />
              <span>
                Found{" "}
                <Badge variant="secondary" className="glass-card-feminine bg-pink-500/20 text-pink-300 border-pink-300/30">
                  {resultCount.toLocaleString()}
                </Badge>{" "}
                results
              </span>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
