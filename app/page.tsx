"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchInterface } from "@/components/search-interface"
import { ComprehensiveCVEIntelligencePanel } from "@/components/comprehensive-cve-intelligence-panel"
import { ThreatWorldMap } from "@/components/threat-world-map"
import { LiveBotnetTracker } from "@/components/live-botnet-tracker"
import { GoogleDorkExplorer } from "@/components/google-dork-explorer"
import { BeginnerGuide } from "@/components/beginner-guide"
import { DomainIntelligenceDashboard } from "@/components/domain-intelligence-dashboard"
import { FloatingParticles } from "@/components/floating-particles"
import { FloatingEyes } from "@/components/floating-eyes"
import { AdvancedAnalyticsDashboard } from "@/components/advanced-analytics-dashboard"
import { ForensicInvestigationWorkspace } from "@/components/forensic-investigation-workspace"
import { DatabasePoweredInvestigationTracker } from "@/components/database-powered-investigation-tracker"
import { RealTimeThreatIntelligenceHub } from "@/components/real-time-threat-intelligence-hub"
import { Shield, Search, Globe, Bot, Zap, Target, Eye, AlertTriangle, Database, Activity } from "lucide-react"

export default function CyberWatchVault() {
  const [activeTab, setActiveTab] = useState("search")
  const [testProduct, setTestProduct] = useState("")
  const [testCVEs, setTestCVEs] = useState("")
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchResultCount, setSearchResultCount] = useState(0)

  const handleTestCVEIntelligence = () => {
    if (testProduct.trim()) {
      // This would trigger the CVE intelligence panel with the test product
      console.log(`Testing CVE intelligence for product: ${testProduct}`)
    }
  }

  const handleTestSpecificCVEs = () => {
    if (testCVEs.trim()) {
      const cveList = testCVEs
        .split(",")
        .map((cve) => cve.trim())
        .filter(Boolean)
      console.log(`Testing specific CVEs: ${cveList.join(", ")}`)
    }
  }

  const handleSearch = async (query: string) => {
    console.log("[v0] Starting search with query:", query)
    setSearchLoading(true)
    try {
      // TODO: Implement actual search logic here
      // For now, simulate a search with mock results
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const mockResultCount = Math.floor(Math.random() * 10000) + 100
      setSearchResultCount(mockResultCount)
      console.log("[v0] Search completed with", mockResultCount, "results")
    } catch (error) {
      console.error("[v0] Search error:", error)
      setSearchResultCount(0)
    } finally {
      setSearchLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <FloatingParticles />
      <FloatingEyes />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-red-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Salem Cyber vault 🦇
          </h1>
          <p className="text-xl text-slate-300 mb-6">Comprehensive Cybersecurity Intelligence Platform</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge variant="outline" className="text-red-400 border-red-400">
              <Shield className="w-4 h-4 mr-2" />
              CVE Intelligence
            </Badge>
            <Badge variant="outline" className="text-cyan-400 border-cyan-400">
              <Search className="w-4 h-4 mr-2" />
              Shodan Integration
            </Badge>
            <Badge variant="outline" className="text-indigo-400 border-indigo-400">
              <Database className="w-4 h-4 mr-2" />
              Domain Intelligence
            </Badge>
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              <Globe className="w-4 h-4 mr-2" />
              Threat Mapping
            </Badge>
            <Badge variant="outline" className="text-orange-400 border-orange-400">
              <Bot className="w-4 h-4 mr-2" />
              Botnet Tracking
            </Badge>
            <Badge variant="outline" className="text-green-400 border-green-400">
              <Activity className="w-4 h-4 mr-2" />
              Real-time Intel
            </Badge>
          </div>
        </div>

        {/* Main Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-9 bg-slate-800/30 border-slate-700 mb-8">
            <TabsTrigger value="search" className="data-[state=active]:bg-cyan-600">
              <Search className="w-4 h-4 mr-2" />
              Search
            </TabsTrigger>
            <TabsTrigger value="cve" className="data-[state=active]:bg-red-600">
              <Shield className="w-4 h-4 mr-2" />
              CVE Intel
            </TabsTrigger>
            <TabsTrigger value="domain" className="data-[state=active]:bg-indigo-600">
              <Database className="w-4 h-4 mr-2" />
              Domain Intel
            </TabsTrigger>
            <TabsTrigger value="threats" className="data-[state=active]:bg-purple-600">
              <Globe className="w-4 h-4 mr-2" />
              Threat Map
            </TabsTrigger>
            <TabsTrigger value="botnets" className="data-[state=active]:bg-orange-600">
              <Bot className="w-4 h-4 mr-2" />
              Botnets
            </TabsTrigger>
            <TabsTrigger value="dorking" className="data-[state=active]:bg-green-600">
              <Eye className="w-4 h-4 mr-2" />
              Dorking
            </TabsTrigger>
            <TabsTrigger value="forensics" className="data-[state=active]:bg-pink-600">
              <Target className="w-4 h-4 mr-2" />
              Forensics
            </TabsTrigger>
            <TabsTrigger value="tracking" className="data-[state=active]:bg-teal-600">
              <Database className="w-4 h-4 mr-2" />
              Tracking
            </TabsTrigger>
            <TabsTrigger value="intel-hub" className="data-[state=active]:bg-emerald-600">
              <Activity className="w-4 h-4 mr-2" />
              Intel Hub
            </TabsTrigger>
          </TabsList>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <SearchInterface onSearch={handleSearch} loading={searchLoading} resultCount={searchResultCount} />
            <AdvancedAnalyticsDashboard />
          </TabsContent>

          {/* CVE Intelligence Tab */}
          <TabsContent value="cve" className="space-y-6">
            {/* Test Controls */}
            <Card className="bg-slate-800/30 border-slate-600">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  CVE Intelligence Testing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Test Product Intelligence:</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., apache, nginx, windows"
                        value={testProduct}
                        onChange={(e) => setTestProduct(e.target.value)}
                        className="bg-slate-700/30 border-slate-600 text-white"
                      />
                      <Button onClick={handleTestCVEIntelligence} className="bg-red-600 hover:bg-red-700">
                        <Zap className="w-4 h-4 mr-2" />
                        Test
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Test Specific CVEs:</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., CVE-2024-1234, CVE-2023-5678"
                        value={testCVEs}
                        onChange={(e) => setTestCVEs(e.target.value)}
                        className="bg-slate-700/30 border-slate-600 text-white"
                      />
                      <Button onClick={handleTestSpecificCVEs} className="bg-orange-600 hover:bg-orange-700">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Test
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTestProduct("apache")}
                    className="border-slate-600 text-slate-300"
                  >
                    Apache
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTestProduct("nginx")}
                    className="border-slate-600 text-slate-300"
                  >
                    Nginx
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTestProduct("windows")}
                    className="border-slate-600 text-slate-300"
                  >
                    Windows
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTestProduct("linux")}
                    className="border-slate-600 text-slate-300"
                  >
                    Linux
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTestCVEs("CVE-2024-1234,CVE-2023-5678")}
                    className="border-slate-600 text-slate-300"
                  >
                    Sample CVEs
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* CVE Intelligence Panel */}
            <ComprehensiveCVEIntelligencePanel
              product={testProduct || "apache"}
              cveIds={
                testCVEs
                  ? testCVEs
                      .split(",")
                      .map((cve) => cve.trim())
                      .filter(Boolean)
                  : undefined
              }
            />
          </TabsContent>

          {/* Domain Intelligence Tab */}
          <TabsContent value="domain" className="space-y-6">
            <DomainIntelligenceDashboard />
          </TabsContent>

          {/* Threat Map Tab */}
          <TabsContent value="threats" className="space-y-6">
            <ThreatWorldMap />
          </TabsContent>

          {/* Botnets Tab */}
          <TabsContent value="botnets" className="space-y-6">
            <LiveBotnetTracker />
          </TabsContent>

          {/* Google Dorking Tab */}
          <TabsContent value="dorking" className="space-y-6">
            <GoogleDorkExplorer />
          </TabsContent>

          {/* Forensics Tab */}
          <TabsContent value="forensics" className="space-y-6">
            <ForensicInvestigationWorkspace />
          </TabsContent>

          {/* Tracking Tab */}
          <TabsContent value="tracking" className="space-y-6">
            <DatabasePoweredInvestigationTracker />
          </TabsContent>

          {/* Intel Hub Tab */}
          <TabsContent value="intel-hub" className="space-y-6">
            <RealTimeThreatIntelligenceHub />
          </TabsContent>

          {/* Guide Tab */}
          <TabsContent value="guide" className="space-y-6">
            <BeginnerGuide />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-16 text-center text-slate-400">
          <p className="mb-2">🦇 CyberWatch Vault - Comprehensive Cybersecurity Intelligence Platform</p>
          <p className="text-sm">
            Powered by CVEDB, Shodan, VirusTotal, AbuseIPDB, GreyNoise & Google Custom Search APIs
          </p>
        </div>
      </div>
    </div>
  )
}
