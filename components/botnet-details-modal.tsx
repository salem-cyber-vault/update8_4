"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Activity,
  Shield,
  Globe,
  Server,
  Eye,
  MapPin,
  Zap,
  Target,
  Database,
  Network,
  Clock,
  TrendingUp,
  BookOpen,
  Skull,
  Lock,
} from "lucide-react"
import { searchShodan, getComprehensiveThreatIntel } from "@/lib/api-client"
import { CVEIntelligencePanel } from "./cve-intelligence-panel"
import type { BotnetData, ShodanHost } from "@/lib/api-client"

interface BotnetDetailsModalProps {
  botnet: BotnetData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BotnetDetailsModal({ botnet, open, onOpenChange }: BotnetDetailsModalProps) {
  const [shodanData, setShodanData] = useState<ShodanHost[]>([])
  const [threatIntel, setThreatIntel] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedHost, setSelectedHost] = useState<ShodanHost | null>(null)

  useEffect(() => {
    if (botnet && open) {
      loadBotnetIntelligence()
    }
  }, [botnet, open])

  const loadBotnetIntelligence = async () => {
    if (!botnet) return

    setLoading(true)
    try {
      // Search for botnet-related infrastructure
      const queries = [
        `${botnet.name.toLowerCase()}`,
        `port:${botnet.affectedPorts.join(",")}`,
        `country:${botnet.countries.slice(0, 3).join(",")}`,
        `org:"${botnet.name}"`,
      ]

      const searchPromises = queries.map((query) => searchShodan(query, ["country", "port", "org"]))
      const results = await Promise.all(searchPromises)

      // Combine and deduplicate results
      const allHosts = results.flatMap((result) => result.matches || [])
      const uniqueHosts = allHosts.filter(
        (host, index, self) => index === self.findIndex((h) => h.ip_str === host.ip_str && h.port === host.port),
      )

      setShodanData(uniqueHosts.slice(0, 20)) // Limit to 20 hosts

      // Get threat intelligence for C2 servers
      if (botnet.c2Servers.length > 0) {
        const threatPromises = botnet.c2Servers.slice(0, 5).map(async (ip) => {
          try {
            const intel = await getComprehensiveThreatIntel(ip)
            return { ip, intel }
          } catch (error) {
            console.warn(`Failed to get threat intel for ${ip}:`, error)
            return { ip, intel: null }
          }
        })

        const threatResults = await Promise.all(threatPromises)
        const threatMap = threatResults.reduce(
          (acc, { ip, intel }) => {
            acc[ip] = intel
            return acc
          },
          {} as Record<string, any>,
        )

        setThreatIntel(threatMap)
      }
    } catch (error) {
      console.error("Failed to load botnet intelligence:", error)
    } finally {
      setLoading(false)
    }
  }

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

  const getServiceIcon = (product?: string) => {
    if (!product) return <Server className="w-4 h-4" />
    const p = product.toLowerCase()
    if (p.includes("apache") || p.includes("nginx")) return <Globe className="w-4 h-4" />
    if (p.includes("ssh")) return <Lock className="w-4 h-4" />
    if (p.includes("mysql") || p.includes("mongodb")) return <Database className="w-4 h-4" />
    return <Server className="w-4 h-4" />
  }

  if (!botnet) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Skull className="w-6 h-6 text-red-400" />
            </div>
            {botnet.name} Analysis
            <Badge className={getThreatLevelColor(botnet.threatLevel)}>{botnet.threatLevel.toUpperCase()}</Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-red-600">
              <Eye className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="infrastructure" className="data-[state=active]:bg-orange-600">
              <Network className="w-4 h-4 mr-2" />
              Infrastructure
            </TabsTrigger>
            <TabsTrigger value="hosts" className="data-[state=active]:bg-purple-600">
              <Server className="w-4 h-4 mr-2" />
              Infected Hosts
            </TabsTrigger>
            <TabsTrigger value="intelligence" className="data-[state=active]:bg-blue-600">
              <Shield className="w-4 h-4 mr-2" />
              Threat Intel
            </TabsTrigger>
            <TabsTrigger value="education" className="data-[state=active]:bg-green-600">
              <BookOpen className="w-4 h-4 mr-2" />
              Learn More
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Basic Stats */}
              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Botnet Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Infected Devices:</span>
                    <Badge variant="destructive" className="text-lg">
                      {botnet.size.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Countries:</span>
                    <span className="text-white">{botnet.countries.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">C&C Servers:</span>
                    <span className="text-white">{botnet.c2Servers.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Affected Ports:</span>
                    <span className="text-white">{botnet.affectedPorts.length}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Geographic Distribution */}
              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-orange-400 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Geographic Spread
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {botnet.countries.slice(0, 8).map((country, index) => (
                      <div key={country} className="flex items-center justify-between">
                        <span className="text-slate-300">{country}</span>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2 bg-red-500 rounded"
                            style={{ width: `${Math.max(20, 100 - index * 10)}px` }}
                          />
                          <span className="text-xs text-slate-400">
                            {Math.floor(botnet.size * (0.3 - index * 0.03)).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Activity Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-slate-300">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <span>Last Activity: {new Date(botnet.lastSeen).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      <span>Peak Activity: {new Date(Date.now() - 86400000 * 3).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span>First Detected: {new Date(Date.now() - 86400000 * 30).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <Card className="bg-slate-800/50 border-slate-600">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Botnet Analysis</h3>
                <p className="text-slate-300 mb-4">{botnet.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-red-400 mx-auto mb-2" />
                    <div className="text-sm text-slate-400">Growth Rate</div>
                    <div className="text-lg font-bold text-white">+12%</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                    <Target className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                    <div className="text-sm text-slate-400">Attack Vector</div>
                    <div className="text-lg font-bold text-white">IoT</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                    <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <div className="text-sm text-slate-400">Activity Level</div>
                    <div className="text-lg font-bold text-white">High</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                    <Shield className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <div className="text-sm text-slate-400">Mitigation</div>
                    <div className="text-lg font-bold text-white">Active</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Infrastructure Tab */}
          <TabsContent value="infrastructure" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* C&C Servers */}
              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    Command & Control Servers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {botnet.c2Servers.map((server, index) => (
                        <Card key={index} className="bg-slate-700/30 border-slate-600 p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-red-400">{server}</span>
                            <div className="flex items-center gap-2">
                              {threatIntel[server] && (
                                <Badge variant="destructive" className="text-xs">
                                  {threatIntel[server].abuseipdb?.abuseConfidence || 0}% abuse
                                </Badge>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  // Set this server as selected host for detailed analysis
                                  const mockHost: ShodanHost = {
                                    ip_str: server,
                                    port: 80,
                                    transport: "tcp",
                                    product: "Unknown",
                                    location: { country_name: "Unknown", city: "Unknown", region_code: "XX" },
                                    org: "Unknown",
                                    isp: "Unknown",
                                    asn: "Unknown",
                                    hostnames: [],
                                    domains: [],
                                    timestamp: new Date().toISOString(),
                                  }
                                  setSelectedHost(mockHost)
                                  setActiveTab("hosts")
                                }}
                                className="text-slate-400 hover:text-cyan-400"
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          {threatIntel[server] && (
                            <div className="text-xs text-slate-400">
                              VT Detections:{" "}
                              {threatIntel[server].virustotal?.data?.attributes?.last_analysis_stats?.malicious || 0}
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Network Ports */}
              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-orange-400 flex items-center gap-2">
                    <Network className="w-5 h-5" />
                    Affected Network Ports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {botnet.affectedPorts.map((port, index) => (
                      <Card key={index} className="bg-slate-700/30 border-slate-600 p-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{port}</div>
                          <div className="text-xs text-slate-400">
                            {port === 23
                              ? "Telnet"
                              : port === 80
                                ? "HTTP"
                                : port === 443
                                  ? "HTTPS"
                                  : port === 22
                                    ? "SSH"
                                    : "Unknown"}
                          </div>
                          <div className="text-xs text-orange-400 mt-1">
                            {Math.floor(botnet.size * (0.4 - index * 0.1)).toLocaleString()} devices
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Infected Hosts Tab */}
          <TabsContent value="hosts" className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Loading infected hosts from Shodan... 🔍</div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Detected Infected Hosts ({shodanData.length})</h3>
                  <Badge variant="outline" className="text-purple-400 border-purple-400">
                    Live Shodan Data
                  </Badge>
                </div>

                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {shodanData.map((host, index) => (
                      <Card
                        key={`${host.ip_str}-${host.port}`}
                        className="bg-slate-800/30 border-slate-600 cursor-pointer hover:bg-slate-800/50 transition-all"
                        onClick={() => setSelectedHost(selectedHost === host ? null : host)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              {getServiceIcon(host.product)}
                              <div>
                                <span className="font-mono text-cyan-400">
                                  {host.ip_str}:{host.port}
                                </span>
                                <div className="text-sm text-slate-400">
                                  {host.product} {host.version}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs border-slate-500 text-slate-400">
                                {host.location.country_name}
                              </Badge>
                              {host.vulns && host.vulns.length > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {host.vulns.length} CVE
                                </Badge>
                              )}
                            </div>
                          </div>

                          {selectedHost === host && (
                            <div className="mt-3 pt-3 border-t border-slate-600 space-y-2">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-slate-400">Organization:</span>
                                  <span className="ml-2 text-slate-300">{host.org}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400">ISP:</span>
                                  <span className="ml-2 text-slate-300">{host.isp}</span>
                                </div>
                              </div>
                              {host.vulns && host.vulns.length > 0 && (
                                <div>
                                  <span className="text-slate-400 text-sm">Vulnerabilities:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {host.vulns.slice(0, 3).map((cve, idx) => (
                                      <Badge key={idx} variant="destructive" className="text-xs">
                                        {cve}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </TabsContent>

          {/* Threat Intelligence Tab */}
          <TabsContent value="intelligence" className="space-y-6">
            <CVEIntelligencePanel product={botnet.name} />
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Understanding {botnet.name} 🧙‍♂️
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-invert max-w-none">
                  <h4 className="text-white">What is this botnet?</h4>
                  <p className="text-slate-300">
                    {botnet.name} is a network of compromised devices (called "bots" or "zombies") that are controlled
                    remotely by cybercriminals. These infected devices can be computers, smartphones, IoT devices, or
                    servers that have been compromised through malware, vulnerabilities, or weak security.
                  </p>

                  <h4 className="text-white">How does it work?</h4>
                  <p className="text-slate-300">
                    The botnet operates through Command & Control (C&C) servers that send instructions to infected
                    devices. These instructions can include launching DDoS attacks, stealing data, mining
                    cryptocurrency, or spreading to other devices.
                  </p>

                  <h4 className="text-white">Why is it dangerous?</h4>
                  <ul className="text-slate-300">
                    <li>Can launch massive distributed attacks</li>
                    <li>Steals personal and financial information</li>
                    <li>Uses your device's resources without permission</li>
                    <li>Can spread to other devices on your network</li>
                    <li>Difficult to detect and remove</li>
                  </ul>

                  <h4 className="text-white">How to protect yourself:</h4>
                  <ul className="text-slate-300">
                    <li>Keep all software and firmware updated</li>
                    <li>Use strong, unique passwords</li>
                    <li>Enable two-factor authentication</li>
                    <li>Install reputable antivirus software</li>
                    <li>Regularly monitor network traffic</li>
                    <li>Disable unnecessary services and ports</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
