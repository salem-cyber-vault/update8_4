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
      <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <Search className="w-8 h-8 text-cyan-400" />
            <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-lg animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Intelligence Scanner</h2>
            <p className="text-slate-400">Discover devices and services across the digital landscape</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
            <Input
              placeholder="Enter search query (e.g., apache, nginx, port:80, country:US)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-12 h-14 bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-cyan-500/50 focus:ring-cyan-500/20 text-lg"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            size="lg"
            className="h-14 px-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Search
              </>
            )}
          </Button>
        </div>

        {/* Quick Searches */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Quick Searches
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
                className="bg-slate-800/30 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:border-cyan-500/50 transition-all"
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        {resultCount > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <div className="flex items-center gap-2 text-slate-300">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>
                Found{" "}
                <Badge variant="secondary" className="bg-cyan-600/20 text-cyan-400">
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
