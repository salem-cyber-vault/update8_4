"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, AlertTriangle, Globe, Server, Eye, TrendingUp, Zap } from "lucide-react"
import { getCurrentBotnets, type BotnetData } from "@/lib/api-client"
import { BotnetDetailsModal } from "./botnet-details-modal"

export function LiveBotnetTracker() {
  const [botnets, setBotnets] = useState<BotnetData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBotnetForDetails, setSelectedBotnetForDetails] = useState<BotnetData | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  useEffect(() => {
    const loadBotnetData = async () => {
      try {
        const data = await getCurrentBotnets()
        setBotnets(data)
      } catch (error) {
        console.error("Failed to load botnet data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadBotnetData()
    const interval = setInterval(loadBotnetData, 180000) // Update every 3 minutes
    return () => clearInterval(interval)
  }, [])

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-500 text-white"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-black"
      case "low":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getThreatLevelIcon = (level: string) => {
    switch (level) {
      case "critical":
        return <AlertTriangle className="w-4 h-4" />
      case "high":
        return <TrendingUp className="w-4 h-4" />
      case "medium":
        return <Activity className="w-4 h-4" />
      case "low":
        return <Eye className="w-4 h-4" />
      default:
        return <Server className="w-4 h-4" />
    }
  }

  const totalInfectedDevices = botnets.reduce((sum, botnet) => sum + botnet.size, 0)
  const criticalBotnets = botnets.filter((b) => b.threatLevel === "critical").length
  const activeCountries = [...new Set(botnets.flatMap((b) => b.countries))].length

  return (
    <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-red-400 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Live Botnet Tracker 🕸️
          <Badge variant="outline" className="text-red-400 border-red-400 animate-pulse">
            ACTIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-slate-400">Tracking active botnets... 🕷️</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-800/30 border-slate-600 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <Server className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{totalInfectedDevices.toLocaleString()}</div>
                    <div className="text-sm text-slate-400">Infected Devices</div>
                  </div>
                </div>
              </Card>

              <Card className="bg-slate-800/30 border-slate-600 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{criticalBotnets}</div>
                    <div className="text-sm text-slate-400">Critical Threats</div>
                  </div>
                </div>
              </Card>

              <Card className="bg-slate-800/30 border-slate-600 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Globe className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{activeCountries}</div>
                    <div className="text-sm text-slate-400">Affected Countries</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Botnet List */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Active Botnets 🦇
              </h3>
              <div className="space-y-3">
                {botnets.slice(0, 8).map((botnet, index) => (
                  <Card
                    key={index}
                    className={`bg-slate-800/30 border-slate-600 cursor-pointer transition-all hover:bg-slate-800/50`}
                    onClick={() => {
                      setSelectedBotnetForDetails(botnet)
                      setShowDetailsModal(true)
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getThreatLevelIcon(botnet.threatLevel)}
                          <div>
                            <h4 className="font-semibold text-white">{botnet.name}</h4>
                            <p className="text-sm text-slate-400">{botnet.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge className={getThreatLevelColor(botnet.threatLevel)}>
                            {botnet.threatLevel.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-slate-300 border-slate-500">
                            {botnet.size.toLocaleString()} devices
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Educational Note */}
            <Card className="bg-blue-900/20 border-blue-500/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-400 mb-1">What are Botnets? 🤖</h4>
                    <p className="text-sm text-blue-300">
                      Botnets are networks of infected computers controlled by cybercriminals. These "zombie" devices
                      can be used for attacks, spam, or cryptocurrency mining without their owners knowing. This tracker
                      helps security researchers monitor and combat these threats.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        <BotnetDetailsModal
          botnet={selectedBotnetForDetails}
          open={showDetailsModal}
          onOpenChange={setShowDetailsModal}
        />
      </CardContent>
    </Card>
  )
}
