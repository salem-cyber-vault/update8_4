"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Wifi, WifiOff } from "lucide-react"
import { checkAPIHealth } from "@/lib/api-client"

export function APIStatusIndicator() {
  const [apiStatus, setApiStatus] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)
  const [lastCheck, setLastCheck] = useState<Date | null>(null)

  const checkStatus = async () => {
    setLoading(true)
    try {
      const status = await checkAPIHealth()
      setApiStatus(status)
      setLastCheck(new Date())
    } catch (error) {
      console.error("Failed to check API status:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
    const interval = setInterval(checkStatus, 300000) // Check every 5 minutes
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: boolean) => {
    return status ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />
  }

  const getStatusBadge = (status: boolean) => {
    return (
      <Badge variant={status ? "default" : "destructive"} className={status ? "bg-green-600" : "bg-red-600"}>
        {status ? "Online" : "Offline"}
      </Badge>
    )
  }

  const apis = [
    { key: "shodan", name: "Shodan", description: "Device search and intelligence" },
    { key: "virustotal", name: "VirusTotal", description: "Malware and URL analysis" },
    { key: "abuseipdb", name: "AbuseIPDB", description: "IP reputation and abuse reports" },
    { key: "greynoise", name: "GreyNoise", description: "Internet background noise analysis" },
    { key: "google", name: "Google CSE", description: "Custom search and dorking" },
  ]

  const onlineCount = Object.values(apiStatus).filter(Boolean).length
  const totalCount = apis.length

  return (
    <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center gap-2">
          {onlineCount === totalCount ? (
            <Wifi className="w-5 h-5 text-green-400" />
          ) : onlineCount > 0 ? (
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-400" />
          )}
          API Status Dashboard
          <Badge variant="outline" className="text-cyan-400 border-cyan-400">
            {onlineCount}/{totalCount} Online
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
          <div>
            <h3 className="font-medium text-white">System Status</h3>
            <p className="text-sm text-slate-400">
              {onlineCount === totalCount
                ? "All systems operational"
                : onlineCount > 0
                  ? "Partial service availability"
                  : "Service disruption detected"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {lastCheck && <span className="text-xs text-slate-400">Last check: {lastCheck.toLocaleTimeString()}</span>}
            <Button
              variant="ghost"
              size="sm"
              onClick={checkStatus}
              disabled={loading}
              className="text-slate-400 hover:text-cyan-400"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Individual API Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {apis.map((api) => (
            <div key={api.key} className="p-3 bg-slate-800/30 rounded-lg border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(apiStatus[api.key])}
                  <h4 className="font-medium text-white">{api.name}</h4>
                </div>
                {getStatusBadge(apiStatus[api.key])}
              </div>
              <p className="text-sm text-slate-400">{api.description}</p>
            </div>
          ))}
        </div>

        {/* Configuration Help */}
        {onlineCount < totalCount && (
          <Card className="bg-amber-900/20 border-amber-500/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-400 mb-1">API Configuration Required</h4>
                  <p className="text-sm text-amber-300 mb-2">
                    Some APIs are offline. Check your environment variables in .env.local:
                  </p>
                  <ul className="text-xs text-amber-300 space-y-1">
                    {!apiStatus.shodan && <li>• NEXT_PUBLIC_SHODAN_API_KEY</li>}
                    {!apiStatus.virustotal && <li>• NEXT_PUBLIC_VIRUSTOTAL_API_KEY</li>}
                    {!apiStatus.abuseipdb && <li>• NEXT_PUBLIC_ABUSEIPDB_API_KEY</li>}
                    {!apiStatus.greynoise && <li>• NEXT_PUBLIC_GREYNOISE_API_KEY</li>}
                    {!apiStatus.google && <li>• NEXT_PUBLIC_GOOGLE_API_KEY & NEXT_PUBLIC_GOOGLE_CSE_ID</li>}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}
