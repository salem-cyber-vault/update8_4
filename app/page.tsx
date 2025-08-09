"use client"

import { useState, useCallback } from "react"
import { FloatingEyes } from "@/components/floating-eyes"
import { BeginnerGuide } from "@/components/beginner-guide"
import { ThreatWorldMap } from "@/components/threat-world-map"
import { LiveBotnetTracker } from "@/components/live-botnet-tracker"
import { GoogleDorkExplorer } from "@/components/google-dork-explorer"
import { LiveThreatFeed } from "@/components/live-threat-feed"
import { SearchInterface } from "@/components/search-interface"
import { EnhancedHostCard } from "@/components/enhanced-host-card"
import { AdvancedShodanDashboard } from "@/components/advanced-shodan-dashboard"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Shield, Globe, Activity, Search, TrendingUp, AlertTriangle, Zap, Settings } from "lucide-react"
import { searchShodan, getComprehensiveThreatIntel } from "@/lib/api-client"
import type { ShodanHost } from "@/lib/api-client"

export default function CyberWatchVault() {
  const [searchResults, setSearchResults] = useState<ShodanHost[]>([])
  const [threatIntelData, setThreatIntelData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [currentQuery, setCurrentQuery] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  const handleSearch = useCallback(async (query: string) => {
    setLoading(true)
    setError(null)
    setCurrentQuery(query)

    try {
      const shodanResults = await searchShodan(query)
      const hosts = shodanResults?.matches || []
      setSearchResults(hosts)
      setTotalResults(shodanResults?.total || 0)

      // Get threat intelligence for unique IPs
      const uniqueIPs = [...new Set(hosts.map((host: any) => host.ip_str))].slice(0, 10)

      if (uniqueIPs.length > 0) {
        const threatIntelPromises = uniqueIPs.map(async (ip) => {
          try {
            const intel = await getComprehensiveThreatIntel(ip)
            return { ip, intel }
          } catch (error) {
            console.warn(`Failed to get threat intel for ${ip}:`, error)
            return { ip, intel: null }
          }
        })

        const threatIntelResults = await Promise.all(threatIntelPromises)
        const threatIntelMap = threatIntelResults.reduce(
          (acc, { ip, intel }) => {
            acc[ip] = intel
            return acc
          },
          {} as Record<string, any>,
        )

        setThreatIntelData(threatIntelMap)
      }

      setActiveTab("search-results")
    } catch (error) {
      console.error("Search failed:", error)
      setError(error instanceof Error ? error.message : "Search failed. Please check your API keys.")
      setSearchResults([])
      setTotalResults(0)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Floating Eyes Background */}
      <FloatingEyes />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/50 bg-slate-900/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div className="absolute inset-0 bg-cyan-400/20 rounded-xl blur-lg animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Cyber Watch Vault
                </h1>
                <p className="text-slate-400">Advanced Internet Intelligence Platform 🎃</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                <Activity className="w-3 h-3 mr-1" />
                Live Data
              </Badge>
              <Badge variant="outline" className="border-green-500/30 text-green-400">
                <Shield className="w-3 h-3 mr-1" />
                Enhanced APIs
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Beginner Guide */}
        <BeginnerGuide />

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-7 bg-slate-800/30 border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-600">
              <Globe className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="search" className="data-[state=active]:bg-blue-600">
              <Search className="w-4 h-4 mr-2" />
              Search
            </TabsTrigger>
            <TabsTrigger value="threats" className="data-[state=active]:bg-red-600">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Threats
            </TabsTrigger>
            <TabsTrigger value="botnets" className="data-[state=active]:bg-purple-600">
              <Activity className="w-4 h-4 mr-2" />
              Botnets
            </TabsTrigger>
            <TabsTrigger value="dorks" className="data-[state=active]:bg-orange-600">
              <Zap className="w-4 h-4 mr-2" />
              Dorks
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-green-600">
              <Settings className="w-4 h-4 mr-2" />
              Advanced
            </TabsTrigger>
            <TabsTrigger value="search-results" className="data-[state=active]:bg-indigo-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              Results
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ThreatWorldMap />
              <LiveThreatFeed />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <Globe className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">2.1M+</div>
                    <div className="text-sm text-slate-400">Devices Monitored</div>
                  </div>
                </div>
              </Card>

              <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">847</div>
                    <div className="text-sm text-slate-400">Active Threats</div>
                  </div>
                </div>
              </Card>

              <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Activity className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">23</div>
                    <div className="text-sm text-slate-400">Active Botnets</div>
                  </div>
                </div>
              </Card>

              <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Shield className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">195</div>
                    <div className="text-sm text-slate-400">Countries Covered</div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-8">
            <SearchInterface onSearch={handleSearch} loading={loading} resultCount={totalResults} />
          </TabsContent>

          {/* Threats Tab */}
          <TabsContent value="threats" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ThreatWorldMap />
              <LiveThreatFeed />
            </div>
          </TabsContent>

          {/* Botnets Tab */}
          <TabsContent value="botnets" className="space-y-8">
            <LiveBotnetTracker />
          </TabsContent>

          {/* Google Dorks Tab */}
          <TabsContent value="dorks" className="space-y-8">
            <GoogleDorkExplorer />
          </TabsContent>

          {/* Advanced Shodan Tab */}
          <TabsContent value="advanced" className="space-y-8">
            <AdvancedShodanDashboard />
          </TabsContent>

          {/* Search Results Tab */}
          <TabsContent value="search-results" className="space-y-8">
            {error && (
              <Card className="bg-red-900/20 border-red-500/30 p-6">
                <div className="flex items-center gap-3 text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  <div>
                    <h3 className="font-medium">Search Error</h3>
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                </div>
              </Card>
            )}

            {searchResults.length > 0 && !loading && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Shield className="w-6 h-6 text-cyan-400" />
                    Search Results
                    <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                      {currentQuery}
                    </Badge>
                  </h2>

                  <div className="text-sm text-slate-400">
                    Showing {searchResults.length} of {totalResults.toLocaleString()} results
                  </div>
                </div>

                <div className="grid gap-6">
                  {searchResults.map((host, index) => (
                    <EnhancedHostCard
                      key={`${host.ip_str}-${host.port}-${index}`}
                      host={host}
                      threatIntel={threatIntelData[host.ip_str]}
                    />
                  ))}
                </div>
              </div>
            )}

            {searchResults.length === 0 && !loading && currentQuery && (
              <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl p-12">
                <div className="text-center">
                  <Eye className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">No Results Found</h3>
                  <p className="text-slate-400">
                    No devices or services found for "{currentQuery}". Try a different search query.
                  </p>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
