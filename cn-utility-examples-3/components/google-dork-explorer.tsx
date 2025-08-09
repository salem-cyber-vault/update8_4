"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ExternalLink, AlertTriangle, Info, Shield, BookOpen, Zap } from "lucide-react"
import { performGoogleDork, type GoogleDorkResult } from "@/lib/api-client"

export function GoogleDorkExplorer() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<GoogleDorkResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showPresets, setShowPresets] = useState(true)

  const presetDorks = [
    {
      name: "Directory Listings",
      query: 'intitle:"index of" "parent directory"',
      description: "Find exposed directory listings",
      risk: "medium" as const,
      category: "Information Disclosure",
    },
    {
      name: "Login Pages",
      query: 'intitle:"login" OR intitle:"admin" OR intitle:"administrator"',
      description: "Discover admin and login interfaces",
      risk: "high" as const,
      category: "Access Points",
    },
    {
      name: "Configuration Files",
      query: "filetype:conf OR filetype:config OR filetype:cfg",
      description: "Find configuration files",
      risk: "high" as const,
      category: "Sensitive Files",
    },
    {
      name: "Database Files",
      query: "filetype:sql OR filetype:db OR filetype:mdb",
      description: "Locate database files",
      risk: "high" as const,
      category: "Data Exposure",
    },
    {
      name: "Webcam Interfaces",
      query: 'inurl:"view/index.shtml" OR inurl:"ViewerFrame?Mode="',
      description: "Find web-accessible cameras",
      risk: "medium" as const,
      category: "IoT Devices",
    },
    {
      name: "Server Status Pages",
      query: 'intitle:"server status" OR intitle:"apache status"',
      description: "Server monitoring pages",
      risk: "low" as const,
      category: "System Information",
    },
  ]

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const dorkResults = await performGoogleDork(searchQuery)
      setResults(dorkResults)
      setShowPresets(false)
    } catch (error) {
      console.error("Google dork failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "text-red-400 border-red-400"
      case "medium":
        return "text-yellow-400 border-yellow-400"
      case "low":
        return "text-green-400 border-green-400"
      default:
        return "text-blue-400 border-blue-400"
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "high":
        return <AlertTriangle className="w-4 h-4" />
      case "medium":
        return <Shield className="w-4 h-4" />
      case "low":
        return <Info className="w-4 h-4" />
      default:
        return <Search className="w-4 h-4" />
    }
  }

  return (
    <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-purple-400 flex items-center gap-2">
          <Search className="w-5 h-5" />
          Google Dork Explorer 🔍
          <Badge variant="outline" className="text-purple-400 border-purple-400">
            Advanced Search
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Interface */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter Google dork query (e.g., intitle:admin login)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            <Button
              onClick={() => handleSearch()}
              disabled={loading || !query.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPresets(!showPresets)}
              className="text-slate-400 hover:text-white"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              {showPresets ? "Hide" : "Show"} Preset Dorks
            </Button>
          </div>
        </div>

        {/* Preset Dorks */}
        {showPresets && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Popular Dorks 🧙‍♂️
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {presetDorks.map((dork, index) => (
                <Card
                  key={index}
                  className="bg-slate-800/30 border-slate-600 cursor-pointer hover:bg-slate-800/50 transition-all"
                  onClick={() => {
                    setQuery(dork.query)
                    handleSearch(dork.query)
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{dork.name}</h4>
                      <Badge variant="outline" className={`text-xs ${getRiskColor(dork.risk)}`}>
                        {dork.risk.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{dork.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs border-slate-500 text-slate-400">
                        {dork.category}
                      </Badge>
                      <code className="text-xs text-purple-400 bg-slate-700/50 px-2 py-1 rounded">
                        {dork.query.length > 30 ? dork.query.substring(0, 30) + "..." : dork.query}
                      </code>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {results.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Search className="w-5 h-5 text-cyan-400" />
              Search Results ({results.length})
            </h3>
            <div className="space-y-3">
              {results.map((result, index) => (
                <Card key={index} className="bg-slate-800/30 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-white mb-1 flex items-center gap-2">
                          {getRiskIcon(result.riskLevel)}
                          {result.title}
                        </h4>
                        <p className="text-sm text-slate-300 mb-2">{result.snippet}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{result.displayLink}</span>
                          <Badge variant="outline" className="text-xs border-slate-500">
                            {result.category}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Badge variant="outline" className={`text-xs ${getRiskColor(result.riskLevel)}`}>
                          {result.riskLevel.toUpperCase()}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(result.link, "_blank")}
                          className="text-slate-400 hover:text-cyan-400"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Educational Note */}
        <Card className="bg-amber-900/20 border-amber-500/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-400 mb-1">What are Google Dorks? 🎃</h4>
                <p className="text-sm text-amber-300">
                  Google dorks are advanced search queries that help find specific information using Google's search
                  operators. Security researchers use them to discover exposed files, vulnerable systems, and
                  misconfigurations. Always use this knowledge responsibly and ethically!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
