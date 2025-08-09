"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, AlertTriangle, Shield, Globe, Clock, MapPin, Zap, Eye } from "lucide-react"
import { getLiveThreatFeed, type LiveThreatEvent } from "@/lib/api-client"

export function LiveThreatFeed() {
  const [threats, setThreats] = useState<LiveThreatEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    const loadThreatFeed = async () => {
      try {
        const data = await getLiveThreatFeed()
        setThreats(data)
      } catch (error) {
        console.error("Failed to load threat feed:", error)
      } finally {
        setLoading(false)
      }
    }

    loadThreatFeed()
    const interval = setInterval(loadThreatFeed, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-400 border-red-400 bg-red-500/10"
      case "high":
        return "text-orange-400 border-orange-400 bg-orange-500/10"
      case "medium":
        return "text-yellow-400 border-yellow-400 bg-yellow-500/10"
      case "low":
        return "text-green-400 border-green-400 bg-green-500/10"
      default:
        return "text-slate-400 border-slate-400 bg-slate-500/10"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "malware":
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      case "botnet":
        return <Activity className="w-4 h-4 text-purple-400" />
      case "phishing":
        return <Shield className="w-4 h-4 text-orange-400" />
      case "vulnerability":
        return <Zap className="w-4 h-4 text-yellow-400" />
      case "breach":
        return <Eye className="w-4 h-4 text-red-400" />
      default:
        return <Globe className="w-4 h-4 text-slate-400" />
    }
  }

  const filteredThreats = filter === "all" ? threats : threats.filter((threat) => threat.type === filter)

  const threatCounts = {
    all: threats.length,
    malware: threats.filter((t) => t.type === "malware").length,
    botnet: threats.filter((t) => t.type === "botnet").length,
    phishing: threats.filter((t) => t.type === "phishing").length,
    vulnerability: threats.filter((t) => t.type === "vulnerability").length,
    breach: threats.filter((t) => t.type === "breach").length,
  }

  return (
    <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-orange-400 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Live Threat Intelligence 👻
          <Badge variant="outline" className="text-orange-400 border-orange-400 animate-pulse">
            STREAMING
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(threatCounts).map(([type, count]) => (
            <Button
              key={type}
              variant={filter === type ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(type)}
              className={`${
                filter === type
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "border-slate-600 text-slate-300 hover:bg-slate-700/50 bg-transparent"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} ({count})
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-slate-400">Loading live threat data... 🕸️</div>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredThreats.length === 0 ? (
              <div className="text-center text-slate-400 py-8">
                <Shield className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>No {filter === "all" ? "" : filter} threats detected</p>
              </div>
            ) : (
              filteredThreats.map((threat) => (
                <Card key={threat.id} className="bg-slate-800/30 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(threat.type)}
                        <div>
                          <h4 className="font-medium text-white">{threat.description}</h4>
                          <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                            <MapPin className="w-3 h-3" />
                            <span>
                              {threat.location.city}, {threat.location.country}
                            </span>
                            <Clock className="w-3 h-3 ml-2" />
                            <span>{threat.timestamp.toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-xs ${getSeverityColor(threat.severity)}`}>
                          {threat.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-slate-500 text-slate-400">
                          {threat.type.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Source:</span>
                        <span className="ml-2 text-slate-300 font-mono">{threat.source}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Target:</span>
                        <span className="ml-2 text-slate-300 font-mono">{threat.target}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Educational Note */}
        <Card className="bg-purple-900/20 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Activity className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-purple-400 mb-1">Understanding Threat Intelligence 🔮</h4>
                <p className="text-sm text-purple-300">
                  This feed shows real-time cyber threats detected across the internet. Each event represents malicious
                  activity like malware infections, botnet communications, or vulnerability exploits. Security teams use
                  this data to protect networks and respond to emerging threats.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
