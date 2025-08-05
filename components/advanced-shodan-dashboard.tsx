"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  AlertTriangle,
  Shield,
  Globe,
  Search,
  Zap,
  Server,
  Eye,
  TrendingUp,
  Target,
  Wifi,
  Database,
} from "lucide-react"
import {
  getShodanAPIInfo,
  getShodanSearchFacets,
  createShodanAlert,
  getShodanAlerts,
  searchShodanQueries,
  getShodanQueryTags,
  getShodanPorts,
  getShodanProtocols,
  type ShodanAlert,
} from "@/lib/advanced-shodan-client"

export function AdvancedShodanDashboard() {
  const [apiInfo, setApiInfo] = useState<any>(null)
  const [alerts, setAlerts] = useState<ShodanAlert[]>([])
  const [popularQueries, setPopularQueries] = useState<any[]>([])
  const [queryTags, setQueryTags] = useState<any[]>([])
  const [facets, setFacets] = useState<string[]>([])
  const [ports, setPorts] = useState<number[]>([])
  const [protocols, setProtocols] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  // Alert creation state
  const [newAlertName, setNewAlertName] = useState("")
  const [newAlertQuery, setNewAlertQuery] = useState("")

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [apiData, alertsData, queriesData, tagsData, facetsData, portsData, protocolsData] = await Promise.all([
        getShodanAPIInfo(),
        getShodanAlerts(),
        searchShodanQueries("", 1),
        getShodanQueryTags(20),
        getShodanSearchFacets(),
        getShodanPorts(),
        getShodanProtocols(),
      ])

      setApiInfo(apiData)
      setAlerts(alertsData)
      setPopularQueries(queriesData.matches.slice(0, 10))
      setQueryTags(tagsData)
      setFacets(facetsData)
      setPorts(portsData.slice(0, 20))
      setProtocols(protocolsData)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAlert = async () => {
    if (!newAlertName || !newAlertQuery) return

    try {
      const alert = await createShodanAlert(newAlertName, { query: newAlertQuery })
      if (alert) {
        setAlerts([...alerts, alert])
        setNewAlertName("")
        setNewAlertQuery("")
      }
    } catch (error) {
      console.error("Failed to create alert:", error)
    }
  }

  if (loading) {
    return (
      <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl p-8">
        <div className="flex items-center justify-center">
          <div className="text-slate-400">Loading advanced Shodan features... 🔍</div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* API Status Overview */}
      <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Shodan API Status 🎃
            <Badge variant="outline" className="text-green-400 border-green-400">
              {apiInfo?.plan?.toUpperCase() || "CONNECTED"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-slate-800/30 border-slate-600 p-4">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-2xl font-bold text-white">{apiInfo?.query_credits || 0}</div>
                  <div className="text-sm text-slate-400">Query Credits</div>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800/30 border-slate-600 p-4">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-orange-400" />
                <div>
                  <div className="text-2xl font-bold text-white">{apiInfo?.scan_credits || 0}</div>
                  <div className="text-sm text-slate-400">Scan Credits</div>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800/30 border-slate-600 p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <div>
                  <div className="text-2xl font-bold text-white">{alerts.length}</div>
                  <div className="text-sm text-slate-400">Active Alerts</div>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800/30 border-slate-600 p-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-2xl font-bold text-white">{ports.length}+</div>
                  <div className="text-sm text-slate-400">Scan Ports</div>
                </div>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Features Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 bg-slate-800/30 border-slate-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-600">
            <Eye className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="alerts" className="data-[state=active]:bg-red-600">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="queries" className="data-[state=active]:bg-purple-600">
            <Search className="w-4 h-4 mr-2" />
            Queries
          </TabsTrigger>
          <TabsTrigger value="scanning" className="data-[state=active]:bg-orange-600">
            <Target className="w-4 h-4 mr-2" />
            Scanning
          </TabsTrigger>
          <TabsTrigger value="tools" className="data-[state=active]:bg-green-600">
            <Zap className="w-4 h-4 mr-2" />
            Tools
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Search Facets */}
            <Card className="bg-slate-800/30 border-slate-600">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Available Search Facets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {facets.slice(0, 15).map((facet) => (
                    <Badge key={facet} variant="outline" className="text-blue-400 border-blue-400/30">
                      {facet}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Ports */}
            <Card className="bg-slate-800/30 border-slate-600">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  Scannable Ports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {ports.map((port) => (
                    <Badge key={port} variant="outline" className="text-green-400 border-green-400/30">
                      {port}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Protocols */}
          <Card className="bg-slate-800/30 border-slate-600">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Wifi className="w-5 h-5" />
                Supported Protocols
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(protocols)
                  .slice(0, 12)
                  .map(([key, value]) => (
                    <div key={key} className="p-3 bg-slate-700/30 rounded-lg">
                      <div className="font-mono text-purple-400 text-sm">{key}</div>
                      <div className="text-slate-300 text-xs">{value}</div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          {/* Create New Alert */}
          <Card className="bg-slate-800/30 border-slate-600">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Create Network Alert
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Alert name (e.g., 'My Network Monitoring')"
                  value={newAlertName}
                  onChange={(e) => setNewAlertName(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
                <Input
                  placeholder="Search query (e.g., 'net:192.168.1.0/24')"
                  value={newAlertQuery}
                  onChange={(e) => setNewAlertQuery(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
              <Button
                onClick={handleCreateAlert}
                disabled={!newAlertName || !newAlertQuery}
                className="bg-red-600 hover:bg-red-700"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Create Alert
              </Button>
            </CardContent>
          </Card>

          {/* Active Alerts */}
          <Card className="bg-slate-800/30 border-slate-600">
            <CardHeader>
              <CardTitle className="text-orange-400 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Active Alerts ({alerts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>No active alerts. Create one above to monitor your network!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <Card key={alert.id} className="bg-slate-700/30 border-slate-600 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-white">{alert.name}</h4>
                          <p className="text-sm text-slate-400">
                            Created: {new Date(alert.created).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-green-400 border-green-400">
                            {alert.size} results
                          </Badge>
                          <Badge variant="outline" className="text-slate-400 border-slate-500">
                            {alert.id.substring(0, 8)}...
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Queries Tab */}
        <TabsContent value="queries" className="space-y-6">
          {/* Popular Query Tags */}
          <Card className="bg-slate-800/30 border-slate-600">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Popular Query Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {queryTags.map((tag) => (
                  <Badge
                    key={tag.value}
                    variant="outline"
                    className="text-purple-400 border-purple-400/30 cursor-pointer hover:bg-purple-400/10"
                  >
                    {tag.value} ({tag.count})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Popular Queries */}
          <Card className="bg-slate-800/30 border-slate-600">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <Search className="w-5 h-5" />
                Community Queries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {popularQueries.map((query, index) => (
                  <Card key={index} className="bg-slate-700/30 border-slate-600 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-white">{query.title}</h4>
                      <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                        {query.votes} votes
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{query.description}</p>
                    <div className="flex items-center justify-between">
                      <code className="text-xs bg-slate-600/50 px-2 py-1 rounded text-cyan-400">{query.query}</code>
                      <div className="flex gap-1">
                        {query.tags?.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs border-slate-500 text-slate-400">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scanning Tab */}
        <TabsContent value="scanning" className="space-y-6">
          <Card className="bg-slate-800/30 border-slate-600">
            <CardHeader>
              <CardTitle className="text-orange-400 flex items-center gap-2">
                <Target className="w-5 h-5" />
                On-Demand Scanning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-slate-400 py-8">
                <Target className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>On-demand scanning features coming soon!</p>
                <p className="text-sm">Request scans of specific IPs and networks</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tools Tab */}
        <TabsContent value="tools" className="space-y-6">
          <Card className="bg-slate-800/30 border-slate-600">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Utility Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-slate-400 py-8">
                <Zap className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>DNS resolution, HTTP headers, and more tools coming soon!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
