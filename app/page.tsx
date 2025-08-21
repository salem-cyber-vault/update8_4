"use client"
import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComprehensiveCVEIntelligencePanel } from "@/components/comprehensive-cve-intelligence-panel"
import { ThreatWorldMap } from "@/components/threat-world-map"
import { LiveBotnetTracker } from "@/components/live-botnet-tracker"
import { GoogleDorkExplorer } from "@/components/google-dork-explorer"
import { BeginnerGuide } from "@/components/beginner-guide"
import { DomainIntelligenceDashboard } from "@/components/domain-intelligence-dashboard"
import { FloatingParticles } from "@/components/floating-particles"
import { FloatingEyes } from "@/components/floating-eyes"
import { AdvancedAnalyticsDashboard } from "@/components/advanced-analytics-dashboard"
import { PhoneIntelligencePanel } from "@/components/phone-intelligence-panel"
import { DomainResearchPanel } from "@/components/domain-research-panel"
import { ArchiveExplorerPanel } from "@/components/archive-explorer-panel"
import { ForensicInvestigationWorkspace } from "@/components/forensic-investigation-workspace"
import { DatabasePoweredInvestigationTracker } from "@/components/database-powered-investigation-tracker"
import { RealTimeThreatIntelligenceHub } from "@/components/real-time-threat-intelligence-hub"
import { Shield, Globe, Bot, Zap, Target, Eye, AlertTriangle, Database, Activity } from "lucide-react"

export default function CyberWatchVault() {
  const [activeTab, setActiveTab] = useState("cve")
  const [testProduct, setTestProduct] = useState("")
  const [testCVEs, setTestCVEs] = useState("")

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

  // Example progress value (replace with real progress logic if needed)
  const progress = 70;
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-indigo-950 text-white overflow-hidden">
      {/* Mysterious animated background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <FloatingParticles />
        <FloatingEyes />
        <div className="absolute inset-0 bg-gradient-radial from-black/80 via-indigo-950/60 to-transparent" style={{mixBlendMode: 'multiply'}} />
        <div className="absolute inset-0 bg-noise opacity-20" />
      </div>
      {/* Main content */}
      <div className="z-10 relative flex flex-col items-center justify-center py-16 px-4 w-full max-w-2xl backdrop-blur-xl bg-black/60 rounded-2xl shadow-2xl border border-indigo-900">
        <h1 className="text-5xl md:text-7xl font-black mb-4 text-center tracking-tight text-indigo-200 drop-shadow-[0_2px_16px_rgba(80,0,120,0.7)]">Salem Cyber Vault</h1>
        <div className="w-full mb-6">
          <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-right text-xs text-indigo-300 mt-1">Progress: {progress}%</div>
        </div>
        <p className="text-lg md:text-2xl mb-8 text-center max-w-xl text-indigo-300/80 italic">Where cyber mysteries unfold. Explore real-time threat feeds, CVE intelligence, botnet tracking, and more in a vault of secrets.</p>
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Button className="bg-indigo-900/80 hover:bg-indigo-700 text-indigo-200 shadow-lg" onClick={() => setActiveTab("cve")}>CVE Intelligence</Button>
          <Button className="bg-purple-900/80 hover:bg-purple-700 text-purple-200 shadow-lg" onClick={() => setActiveTab("threats")}>Threat World Map</Button>
          <Button className="bg-black/80 hover:bg-gray-800 text-gray-200 shadow-lg" onClick={() => setActiveTab("botnet")}>Botnet Tracker</Button>
          <Button className="bg-gray-900/80 hover:bg-gray-700 text-gray-200 shadow-lg" onClick={() => setActiveTab("analytics")}>Analytics</Button>
          <Button className="bg-indigo-950/80 hover:bg-indigo-800 text-indigo-300 shadow-lg" onClick={() => setActiveTab("investigations")}>Investigations</Button>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex gap-2 justify-center mb-4">
            <TabsTrigger value="cve" className="bg-indigo-950/60 text-indigo-200">CVE Intelligence</TabsTrigger>
            <TabsTrigger value="threats" className="bg-purple-950/60 text-purple-200">Threat Map</TabsTrigger>
            <TabsTrigger value="botnet" className="bg-black/60 text-gray-200">Botnet Tracker</TabsTrigger>
            <TabsTrigger value="analytics" className="bg-gray-900/60 text-gray-200">Analytics</TabsTrigger>
            <TabsTrigger value="investigations" className="bg-indigo-950/60 text-indigo-300">Investigations</TabsTrigger>
          </TabsList>
          <TabsContent value="cve"><ComprehensiveCVEIntelligencePanel /></TabsContent>
          <TabsContent value="threats"><ThreatWorldMap /></TabsContent>
          <TabsContent value="botnet"><LiveBotnetTracker /></TabsContent>
          <TabsContent value="analytics">
            <div className="space-y-8">
              <AdvancedAnalyticsDashboard />
              {/* Google Dork Explorer */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-orange-300 mb-2 flex items-center gap-2"><Eye className="w-6 h-6 text-orange-400" /> Google Dork Explorer</h2>
                <GoogleDorkExplorer />
              </div>
              {/* Phone Intelligence Panel */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-pink-300 mb-2 flex items-center gap-2"><AlertTriangle className="w-6 h-6 text-pink-400" /> Phone Intelligence</h2>
                <PhoneIntelligencePanel />
              </div>
              {/* Domain Research Panel */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-green-300 mb-2 flex items-center gap-2"><Globe className="w-6 h-6 text-green-400" /> Domain Research</h2>
                <DomainResearchPanel />
              </div>
              {/* Archive Explorer Panel */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-yellow-300 mb-2 flex items-center gap-2"><Database className="w-6 h-6 text-yellow-400" /> Archive & Cached Data Explorer</h2>
                <ArchiveExplorerPanel />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="investigations"><ForensicInvestigationWorkspace /></TabsContent>
        </Tabs>
        <BeginnerGuide />
      </div>
    </main>
  )
}
