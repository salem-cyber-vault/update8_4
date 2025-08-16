"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import {
  Activity,
  AlertTriangle,
  Shield,
  Eye,
  Bell,
  Pause,
  Play,
  RefreshCw,
  TrendingUp,
  MapPin,
  Clock,
  Target,
  Wifi,
  WifiOff,
} from "lucide-react"

interface ThreatAlert {
  id: string
  title: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  source: string
  timestamp: string
  location?: {
    country: string
    city: string
    lat: number
    lng: number
  }
  indicators: string[]
  status: "new" | "investigating" | "resolved"
  metadata: Record<string, any>
}

interface ThreatFeed {
  id: string
  source: string
  title: string
  description: string
  timestamp: string
  severity: "info" | "warning" | "critical"
  tags: string[]
  url?: string
}

interface LiveMetrics {
  totalThreats: number
  activeCampaigns: number
  blockedAttacks: number
  compromisedHosts: number
  threatTrend: number
  topThreatTypes: Array<{ type: string; count: number }>
  geographicDistribution: Array<{ country: string; threats: number }>
}

interface MonitoringSource {
  id: string
  name: string
  type: "api" | "feed" | "sensor"
  status: "active" | "inactive" | "error"
  enabled: boolean
  lastUpdate: string
  threatCount: number
}

export function RealTimeThreatIntelligenceHub() {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [alerts, setAlerts] = useState<ThreatAlert[]>([])
  const [threatFeeds, setThreatFeeds] = useState<ThreatFeed[]>([])
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics>({
    totalThreats: 0,
    activeCampaigns: 0,
    blockedAttacks: 0,
    compromisedHosts: 0,
    threatTrend: 0,
    topThreatTypes: [],
    geographicDistribution: [],
  })
  const [monitoringSources, setMonitoringSources] = useState<MonitoringSource[]>([])
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all")
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30) // seconds

  // Initialize monitoring sources
  useEffect(() => {
    const sources: MonitoringSource[] = [
      {
        id: "shodan",
        name: "Shodan Intelligence",
        type: "api",
        status: "active",
        enabled: true,
        lastUpdate: new Date().toISOString(),
        threatCount: 1247,
      },
      {
        id: "virustotal",
        name: "VirusTotal Feed",
        type: "api",
        status: "active",
        enabled: true,
        lastUpdate: new Date().toISOString(),
        threatCount: 892,
      },
      {
        id: "abuseipdb",
        name: "AbuseIPDB",
        type: "api",
        status: "active",
        enabled: true,
        lastUpdate: new Date().toISOString(),
        threatCount: 634,
      },
      {
        id: "greynoise",
        name: "GreyNoise",
        type: "api",
        status: "active",
        enabled: true,
        lastUpdate: new Date().toISOString(),
        threatCount: 445,
      },
      {
        id: "cve-feed",
        name: "CVE Intelligence",
        type: "feed",
        status: "active",
        enabled: true,
        lastUpdate: new Date().toISOString(),
        threatCount: 156,
      },
      {
        id: "honeypot",
        name: "Honeypot Sensors",
        type: "sensor",
        status: "active",
        enabled: true,
        lastUpdate: new Date().toISOString(),
        threatCount: 78,
      },
    ]
    setMonitoringSources(sources)
  }, [])

  // Generate mock threat data
  const generateMockThreat = useCallback((): ThreatAlert => {
    const severities: ThreatAlert["severity"][] = ["low", "medium", "high", "critical"]
    const sources = ["Shodan", "VirusTotal", "AbuseIPDB", "GreyNoise", "CVE Feed", "Honeypot"]
    const threatTypes = ["Malware", "Botnet", "Phishing", "DDoS", "Vulnerability", "Brute Force", "Data Breach"]
    const countries = ["US", "CN", "RU", "DE", "GB", "FR", "JP", "BR", "IN", "KR"]
    const cities = [
      "New York",
      "Beijing",
      "Moscow",
      "Berlin",
      "London",
      "Paris",
      "Tokyo",
      "São Paulo",
      "Mumbai",
      "Seoul",
    ]

    const severity = severities[Math.floor(Math.random() * severities.length)]
    const source = sources[Math.floor(Math.random() * sources.length)]
    const threatType = threatTypes[Math.floor(Math.random() * threatTypes.length)]
    const country = countries[Math.floor(Math.random() * countries.length)]
    const city = cities[Math.floor(Math.random() * cities.length)]

    return {
      id: `threat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: `${threatType} Activity Detected`,
      description: `Suspicious ${threatType.toLowerCase()} activity detected from ${country}. Multiple indicators suggest active campaign targeting infrastructure.`,
      severity,
      source,
      timestamp: new Date().toISOString(),
      location: {
        country,
        city,
        lat: Math.random() * 180 - 90,
        lng: Math.random() * 360 - 180,
      },
      indicators: [
        `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        `malicious-domain-${Math.random().toString(36).substr(2, 8)}.com`,
        `CVE-2024-${Math.floor(Math.random() * 9999)
          .toString()
          .padStart(4, "0")}`,
      ],
      status: "new",
      metadata: {
        confidence: Math.floor(Math.random() * 40) + 60,
        impactScore: Math.floor(Math.random() * 10) + 1,
        campaignId: `campaign-${Math.random().toString(36).substr(2, 6)}`,
      },
    }
  }, [])

  const generateMockFeed = useCallback((): ThreatFeed => {
    const sources = ["MITRE ATT&CK", "NIST NVD", "Threat Intel", "Security Blog", "Research Paper"]
    const severities: ThreatFeed["severity"][] = ["info", "warning", "critical"]
    const tags = ["APT", "Ransomware", "Zero-day", "IoT", "Mobile", "Cloud", "AI/ML", "Supply Chain"]

    return {
      id: `feed-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      source: sources[Math.floor(Math.random() * sources.length)],
      title: `New Threat Intelligence: ${tags[Math.floor(Math.random() * tags.length)]} Campaign`,
      description: `Latest intelligence report on emerging threats and attack patterns. Analysis includes TTPs, IOCs, and mitigation strategies.`,
      timestamp: new Date().toISOString(),
      severity: severities[Math.floor(Math.random() * severities.length)],
      tags: tags.slice(0, Math.floor(Math.random() * 3) + 1),
      url: `https://threat-intel.example.com/report-${Math.random().toString(36).substr(2, 8)}`,
    }
  }, [])

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh || !isMonitoring) return

    const interval = setInterval(() => {
      // Generate new threats and feeds
      if (Math.random() > 0.7) {
        const newThreat = generateMockThreat()
        setAlerts((prev) => [newThreat, ...prev.slice(0, 49)]) // Keep last 50 alerts

        // Show toast for critical threats
        if (newThreat.severity === "critical") {
          toast({
            title: "Critical Threat Detected",
            description: newThreat.title,
            variant: "destructive",
          })
        }
      }

      if (Math.random() > 0.8) {
        const newFeed = generateMockFeed()
        setThreatFeeds((prev) => [newFeed, ...prev.slice(0, 29)]) // Keep last 30 feeds
      }

      // Update metrics
      setLiveMetrics((prev) => ({
        ...prev,
        totalThreats: prev.totalThreats + Math.floor(Math.random() * 5),
        activeCampaigns: Math.floor(Math.random() * 20) + 15,
        blockedAttacks: prev.blockedAttacks + Math.floor(Math.random() * 10),
        compromisedHosts: Math.floor(Math.random() * 50) + 25,
        threatTrend: (Math.random() - 0.5) * 20,
      }))

      // Update source metrics
      setMonitoringSources((prev) =>
        prev.map((source) => ({
          ...source,
          lastUpdate: new Date().toISOString(),
          threatCount: source.threatCount + Math.floor(Math.random() * 3),
        })),
      )
    }, refreshInterval * 1000)

    return () => clearInterval(interval)
  }, [autoRefresh, isMonitoring, refreshInterval, generateMockThreat, generateMockFeed])

  const startMonitoring = () => {
    setIsMonitoring(true)
    toast({
      title: "Monitoring Started",
      description: "Real-time threat intelligence monitoring is now active",
    })
  }

  const stopMonitoring = () => {
    setIsMonitoring(false)
    toast({
      title: "Monitoring Stopped",
      description: "Real-time threat intelligence monitoring has been paused",
    })
  }

  const toggleSource = (sourceId: string) => {
    setMonitoringSources((prev) =>
      prev.map((source) => (source.id === sourceId ? { ...source, enabled: !source.enabled } : source)),
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-400 bg-red-900/20 border-red-500"
      case "high":
        return "text-orange-400 bg-orange-900/20 border-orange-500"
      case "medium":
        return "text-yellow-400 bg-yellow-900/20 border-yellow-500"
      case "low":
        return "text-blue-400 bg-blue-900/20 border-blue-500"
      case "warning":
        return "text-orange-400 bg-orange-900/20 border-orange-500"
      case "info":
        return "text-blue-400 bg-blue-900/20 border-blue-500"
      default:
        return "text-slate-400 bg-slate-900/20 border-slate-500"
    }
  }

  const filteredAlerts =
    selectedSeverity === "all" ? alerts : alerts.filter((alert) => alert.severity === selectedSeverity)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Real-time Threat Intelligence Hub</h2>
          <p className="text-slate-400">Live threat monitoring and intelligence aggregation platform</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-300">Auto Refresh</span>
            <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
          </div>
          <Select
            value={refreshInterval.toString()}
            onValueChange={(value) => setRefreshInterval(Number.parseInt(value))}
          >
            <SelectTrigger className="w-24 bg-slate-800 border-slate-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10s</SelectItem>
              <SelectItem value="30">30s</SelectItem>
              <SelectItem value="60">1m</SelectItem>
              <SelectItem value="300">5m</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            className={isMonitoring ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
          >
            {isMonitoring ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Stop Monitoring
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Monitoring
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <Card
        className={`border-2 ${isMonitoring ? "bg-green-900/20 border-green-500" : "bg-slate-900/20 border-slate-600"}`}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {isMonitoring ? (
                  <Wifi className="w-5 h-5 text-green-400" />
                ) : (
                  <WifiOff className="w-5 h-5 text-slate-400" />
                )}
                <span className={`font-medium ${isMonitoring ? "text-green-400" : "text-slate-400"}`}>
                  {isMonitoring ? "MONITORING ACTIVE" : "MONITORING INACTIVE"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-300 text-sm">
                  {monitoringSources.filter((s) => s.enabled).length} sources active
                </span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-lg font-bold text-white">{alerts.length}</div>
                <div className="text-xs text-slate-400">Active Alerts</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">{threatFeeds.length}</div>
                <div className="text-xs text-slate-400">Intel Feeds</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">{liveMetrics.totalThreats}</div>
                <div className="text-xs text-slate-400">Total Threats</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-400 text-sm font-medium">Active Campaigns</p>
                <p className="text-3xl font-bold text-white">{liveMetrics.activeCampaigns}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-400">High Activity</span>
                </div>
              </div>
              <Target className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/20 to-orange-800/10 border-orange-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-400 text-sm font-medium">Blocked Attacks</p>
                <p className="text-3xl font-bold text-white">{liveMetrics.blockedAttacks}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Shield className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-orange-400">Protected</span>
                </div>
              </div>
              <Shield className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm font-medium">Compromised Hosts</p>
                <p className="text-3xl font-bold text-white">{liveMetrics.compromisedHosts}</p>
                <div className="flex items-center gap-1 mt-2">
                  <AlertTriangle className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-400">Monitoring</span>
                </div>
              </div>
              <AlertTriangle className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-900/20 to-cyan-800/10 border-cyan-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-400 text-sm font-medium">Threat Trend</p>
                <p className="text-3xl font-bold text-white">
                  {liveMetrics.threatTrend > 0 ? "+" : ""}
                  {liveMetrics.threatTrend.toFixed(1)}%
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-cyan-400">24h Change</span>
                </div>
              </div>
              <Activity className="w-8 h-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="alerts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/30">
          <TabsTrigger value="alerts">Live Alerts</TabsTrigger>
          <TabsTrigger value="feeds">Intel Feeds</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Live Threat Alerts ({filteredAlerts.length})</h3>
            <div className="flex items-center gap-4">
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="w-32 bg-slate-800 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="border-slate-600 bg-transparent">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          <ScrollArea className="h-96">
            <div className="space-y-3">
              {filteredAlerts.map((alert) => (
                <Card
                  key={alert.id}
                  className="bg-slate-900/40 border-slate-700/50 hover:border-slate-600 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <AlertTriangle
                          className={`w-5 h-5 ${
                            alert.severity === "critical"
                              ? "text-red-400"
                              : alert.severity === "high"
                                ? "text-orange-400"
                                : alert.severity === "medium"
                                  ? "text-yellow-400"
                                  : "text-blue-400"
                          }`}
                        />
                        <div>
                          <h4 className="font-semibold text-white">{alert.title}</h4>
                          <p className="text-slate-400 text-sm">{alert.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(alert.severity)}>{alert.severity.toUpperCase()}</Badge>
                        <Badge variant="outline" className="text-slate-300">
                          {alert.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Source:</span>
                        <div className="text-white font-medium">{alert.source}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Location:</span>
                        <div className="text-white font-medium">
                          {alert.location ? `${alert.location.city}, ${alert.location.country}` : "Unknown"}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Indicators:</span>
                        <div className="text-white font-medium">{alert.indicators.length} IOCs</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Confidence:</span>
                        <div className="text-white font-medium">{alert.metadata.confidence}%</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-700">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-slate-600 text-xs bg-transparent">
                          <Eye className="w-3 h-3 mr-1" />
                          Investigate
                        </Button>
                        <Button size="sm" variant="outline" className="border-slate-600 text-xs bg-transparent">
                          <Bell className="w-3 h-3 mr-1" />
                          Alert
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="feeds" className="space-y-6">
          <h3 className="text-xl font-semibold text-white">Threat Intelligence Feeds ({threatFeeds.length})</h3>

          <ScrollArea className="h-96">
            <div className="space-y-3">
              {threatFeeds.map((feed) => (
                <Card key={feed.id} className="bg-slate-900/40 border-slate-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white">{feed.title}</h4>
                          <Badge className={getSeverityColor(feed.severity)}>{feed.severity.toUpperCase()}</Badge>
                        </div>
                        <p className="text-slate-400 text-sm mb-2">{feed.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Source: {feed.source}</span>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs text-slate-500">{new Date(feed.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {feed.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      {feed.url && (
                        <Button size="sm" variant="outline" className="border-slate-600 text-xs bg-transparent">
                          View Report
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <h3 className="text-xl font-semibold text-white">Monitoring Sources</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monitoringSources.map((source) => (
              <Card key={source.id} className="bg-slate-900/40 border-slate-700/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          source.status === "active"
                            ? "bg-green-400"
                            : source.status === "error"
                              ? "bg-red-400"
                              : "bg-slate-400"
                        }`}
                      />
                      <h4 className="font-semibold text-white">{source.name}</h4>
                    </div>
                    <Switch checked={source.enabled} onCheckedChange={() => toggleSource(source.id)} />
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type:</span>
                      <Badge variant="outline" className="text-xs">
                        {source.type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <span
                        className={`font-medium ${
                          source.status === "active"
                            ? "text-green-400"
                            : source.status === "error"
                              ? "text-red-400"
                              : "text-slate-400"
                        }`}
                      >
                        {source.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Threats:</span>
                      <span className="text-white font-medium">{source.threatCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Last Update:</span>
                      <span className="text-white text-xs">{new Date(source.lastUpdate).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <h3 className="text-xl font-semibold text-white">Threat Analytics</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900/40 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Threat Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Malware", "Botnet", "Phishing", "DDoS", "Vulnerability"].map((type, i) => {
                    const percentage = Math.floor(Math.random() * 30) + 10
                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">{type}</span>
                          <span className="text-white">{percentage}%</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/40 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["United States", "China", "Russia", "Germany", "United Kingdom"].map((country, i) => {
                    const count = Math.floor(Math.random() * 500) + 100
                    return (
                      <div key={country} className="flex items-center justify-between p-2 bg-slate-800/30 rounded">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-cyan-400" />
                          <span className="text-white text-sm">{country}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {count} threats
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
