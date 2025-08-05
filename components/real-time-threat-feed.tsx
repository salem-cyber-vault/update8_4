"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skull, AlertTriangle, Shield } from "lucide-react"

interface ThreatEvent {
  id: string
  type: "malware" | "phishing" | "breach" | "vulnerability"
  description: string
  severity: "low" | "medium" | "high" | "critical"
  timestamp: Date
  source: string
}

export function RealTimeThreatFeed() {
  const [threats, setThreats] = useState<ThreatEvent[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      const threatTypes: ThreatEvent["type"][] = ["malware", "phishing", "breach", "vulnerability"]
      const severities: ThreatEvent["severity"][] = ["low", "medium", "high", "critical"]
      const sources = ["Dark Web Monitor", "Threat Intel", "CVE Database", "Honeypot Network"]
      const descriptions = [
        "New ransomware variant detected in the wild",
        "Phishing campaign targeting financial institutions",
        "Data breach affecting 50K+ users discovered",
        "Zero-day vulnerability in popular software",
        "Botnet C&C server identified and tracked",
        "Credential stuffing attack on e-commerce sites",
        "APT group using new malware strain",
        "Critical vulnerability in IoT devices",
      ]

      if (Math.random() > 0.7) {
        const newThreat: ThreatEvent = {
          id: Math.random().toString(36).substr(2, 9),
          type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          timestamp: new Date(),
          source: sources[Math.floor(Math.random() * sources.length)],
        }

        setThreats((prev) => [newThreat, ...prev.slice(0, 9)])
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-400 border-red-400"
      case "high":
        return "text-orange-400 border-orange-400"
      case "medium":
        return "text-yellow-400 border-yellow-400"
      case "low":
        return "text-green-400 border-green-400"
      default:
        return "text-slate-400 border-slate-400"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "malware":
        return <Skull className="w-4 h-4 text-red-400" />
      case "phishing":
        return <AlertTriangle className="w-4 h-4 text-orange-400" />
      case "breach":
        return <Shield className="w-4 h-4 text-purple-400" />
      case "vulnerability":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      default:
        return <Shield className="w-4 h-4 text-slate-400" />
    }
  }

  return (
    <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-orange-400 flex items-center gap-2">
          👻 Live Threat Feed
          <Badge variant="outline" className="text-orange-400 border-orange-400 animate-pulse">
            LIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {threats.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              <Skull className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>Monitoring the digital underworld...</p>
            </div>
          ) : (
            threats.map((threat) => (
              <div key={threat.id} className="p-3 bg-slate-900/30 rounded border border-slate-700">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(threat.type)}
                    <Badge variant="outline" className={getSeverityColor(threat.severity)}>
                      {threat.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-400">{threat.timestamp.toLocaleTimeString()}</span>
                </div>
                <p className="text-slate-300 text-sm mb-2">{threat.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Source: {threat.source}</span>
                  <Badge variant="secondary" className="text-xs bg-slate-700">
                    {threat.type.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
