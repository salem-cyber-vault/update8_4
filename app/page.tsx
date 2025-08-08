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
import { FloatingParticles } from "@/components/floating-particles"
import { FloatingEyes } from "@/components/floating-eyes"
import { EvidenceTimelineNotebook } from "@/components/evidence-timeline-notebook"
import { ExplainThisTooltip } from "@/components/explain-this-tooltip"
import { OnboardingTour, useOnboardingTour } from "@/components/onboarding-tour"
import { Shield, Search, Globe, Bot, BookOpen, Zap, Target, Eye, AlertTriangle, Sparkles } from "lucide-react"

export default function CyberWatchVault() {
  const [activeTab, setActiveTab] = useState("search")
  const [testProduct, setTestProduct] = useState("")
  const [testCVEs, setTestCVEs] = useState("")
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchResults, setSearchResults] = useState(0)
  const { showTour, completeTour, startTour } = useOnboardingTour()

  const handleSearch = (query: string) => {
    setSearchLoading(true)
    // Simulate search
    setTimeout(() => {
      setSearchResults(Math.floor(Math.random() * 10000) + 100)
      setSearchLoading(false)
    }, 2000)
  }

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

  return (
    <div className="min-h-screen bg-gradient-salem relative overflow-hidden">
      {/* Animated Background Elements */}
      <FloatingParticles />
      <FloatingEyes />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gradient-feminine mb-4 animate-gentle-glow">
            Salem Cyber Vault ✨
          </h1>
          <p className="text-xl text-slate-200 mb-6 font-light">Stunning Cyber Forensics & Digital Investigation Platform</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge variant="outline" className="glass-card-feminine text-pink-300 border-pink-300/30 backdrop-blur-md">
              <Shield className="w-4 h-4 mr-2" />
              <ExplainThisTooltip term="CVE">CVE Intelligence</ExplainThisTooltip>
            </Badge>
            <Badge variant="outline" className="glass-card-feminine text-purple-300 border-purple-300/30 backdrop-blur-md">
              <Search className="w-4 h-4 mr-2" />
              <ExplainThisTooltip term="Shodan">Shodan Pro Explorer</ExplainThisTooltip>
            </Badge>
            <Badge variant="outline" className="glass-card-feminine text-blue-300 border-blue-300/30 backdrop-blur-md">
              <Globe className="w-4 h-4 mr-2" />
              Evidence Timeline
            </Badge>
            <Badge variant="outline" className="glass-card-feminine text-indigo-300 border-indigo-300/30 backdrop-blur-md">
              <Bot className="w-4 h-4 mr-2" />
              Case Notebook
            </Badge>
          </div>
        </div>

        {/* Main Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 glass-card-feminine mb-8 border-pink-300/20">
            <TabsTrigger value="search" className="data-[state=active]:bg-pink-500/30 data-[state=active]:text-pink-100 text-slate-300 hover:text-pink-200 transition-all">
              <Search className="w-4 h-4 mr-2" />
              Search
            </TabsTrigger>
            <TabsTrigger value="cve" className="data-[state=active]:bg-purple-500/30 data-[state=active]:text-purple-100 text-slate-300 hover:text-purple-200 transition-all">
              <Shield className="w-4 h-4 mr-2" />
              <ExplainThisTooltip term="CVE">CVE Intel</ExplainThisTooltip>
            </TabsTrigger>
            <TabsTrigger value="threats" className="data-[state=active]:bg-blue-500/30 data-[state=active]:text-blue-100 text-slate-300 hover:text-blue-200 transition-all">
              <Globe className="w-4 h-4 mr-2" />
              Evidence & Timeline
            </TabsTrigger>
            <TabsTrigger value="botnets" className="data-[state=active]:bg-indigo-500/30 data-[state=active]:text-indigo-100 text-slate-300 hover:text-indigo-200 transition-all">
              <Bot className="w-4 h-4 mr-2" />
              <ExplainThisTooltip term="Botnet">Live Threats</ExplainThisTooltip>
            </TabsTrigger>
            <TabsTrigger value="dorking" className="data-[state=active]:bg-teal-500/30 data-[state=active]:text-teal-100 text-slate-300 hover:text-teal-200 transition-all">
              <Eye className="w-4 h-4 mr-2" />
              <ExplainThisTooltip term="Google Dorking">OSINT Explore</ExplainThisTooltip>
            </TabsTrigger>
            <TabsTrigger value="guide" className="data-[state=active]:bg-rose-500/30 data-[state=active]:text-rose-100 text-slate-300 hover:text-rose-200 transition-all">
              <BookOpen className="w-4 h-4 mr-2" />
              Guide
            </TabsTrigger>
          </TabsList>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <SearchInterface onSearch={handleSearch} loading={searchLoading} resultCount={searchResults} />
          </TabsContent>

          {/* CVE Intelligence Tab */}
          <TabsContent value="cve" className="space-y-6">
            {/* Test Controls */}
            <Card className="glass-card-feminine border-purple-300/20">
              <CardHeader>
                <CardTitle className="text-purple-300 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <ExplainThisTooltip term="CVE">CVE Intelligence Testing</ExplainThisTooltip>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-200">Test Product Intelligence:</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., apache, nginx, windows"
                        value={testProduct}
                        onChange={(e) => setTestProduct(e.target.value)}
                        className="glass-card border-purple-300/30 text-white placeholder-slate-400"
                      />
                      <Button onClick={handleTestCVEIntelligence} className="bg-purple-500/70 hover:bg-purple-500/90 backdrop-blur-md">
                        <Zap className="w-4 h-4 mr-2" />
                        Test
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-slate-200">Test Specific CVEs:</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., CVE-2024-1234, CVE-2023-5678"
                        value={testCVEs}
                        onChange={(e) => setTestCVEs(e.target.value)}
                        className="glass-card border-purple-300/30 text-white placeholder-slate-400"
                      />
                      <Button onClick={handleTestSpecificCVEs} className="bg-pink-500/70 hover:bg-pink-500/90 backdrop-blur-md">
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
                    className="glass-card-feminine border-slate-400/30 text-slate-200 hover:text-pink-200"
                  >
                    Apache
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTestProduct("nginx")}
                    className="glass-card-feminine border-slate-400/30 text-slate-200 hover:text-purple-200"
                  >
                    Nginx
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTestProduct("windows")}
                    className="glass-card-feminine border-slate-400/30 text-slate-200 hover:text-blue-200"
                  >
                    Windows
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTestProduct("linux")}
                    className="glass-card-feminine border-slate-400/30 text-slate-200 hover:text-indigo-200"
                  >
                    Linux
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTestCVEs("CVE-2024-1234,CVE-2023-5678")}
                    className="glass-card-feminine border-slate-400/30 text-slate-200 hover:text-teal-200"
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

          {/* Evidence & Timeline Tab */}
          <TabsContent value="threats" className="space-y-6">
            <EvidenceTimelineNotebook />
          </TabsContent>

          {/* Live Threats Tab */}
          <TabsContent value="botnets" className="space-y-6">
            <LiveBotnetTracker />
          </TabsContent>

          {/* OSINT Explore Tab */}
          <TabsContent value="dorking" className="space-y-6">
            <GoogleDorkExplorer />
          </TabsContent>

          {/* Guide Tab */}
          <TabsContent value="guide" className="space-y-6">
            <BeginnerGuide />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-16 text-center text-slate-300">
          <p className="mb-2 text-gradient-feminine font-medium">✨ Salem Cyber Vault - Stunning Cyber Forensics & Digital Investigation Platform</p>
          <p className="text-sm text-slate-400 mb-4">
            Empowering digital forensics professionals and legal teams with beautiful, intuitive cyber intelligence
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={startTour}
            className="glass-card-feminine border-slate-400/30 text-slate-300 hover:text-pink-200"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Take the Tour
          </Button>
        </div>
      </div>

      {/* Onboarding Tour */}
      {showTour && <OnboardingTour onComplete={completeTour} />}
    </div>
  )
}
