"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts"
import { TrendingUp, TrendingDown, Globe, Shield, AlertTriangle, Activity, MapPin, Target, Zap } from "lucide-react"

interface ThreatData {
  country: string
  threats: number
  vulnerabilities: number
  severity: "low" | "medium" | "high" | "critical"
  lat: number
  lng: number
}

interface VulnerabilityTrend {
  date: string
  critical: number
  high: number
  medium: number
  low: number
  total: number
}

interface ServiceDistribution {
  service: string
  count: number
  percentage: number
  color: string
}

interface AttackVector {
  vector: string
  incidents: number
  trend: number
  severity: number
}

export function AdvancedAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d")
  const [selectedMetric, setSelectedMetric] = useState("threats")
  const [threatData, setThreatData] = useState<ThreatData[]>([])
  const [vulnerabilityTrends, setVulnerabilityTrends] = useState<VulnerabilityTrend[]>([])
  const [serviceDistribution, setServiceDistribution] = useState<ServiceDistribution[]>([])
  const [attackVectors, setAttackVectors] = useState<AttackVector[]>([])

  // Mock data generation
  useEffect(() => {
    // Generate threat data by country
    const countries = ["US", "CN", "RU", "DE", "GB", "FR", "JP", "BR", "IN", "KR"]
    const mockThreatData: ThreatData[] = countries.map((country) => ({
      country,
      threats: Math.floor(Math.random() * 10000) + 1000,
      vulnerabilities: Math.floor(Math.random() * 500) + 50,
      severity: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as any,
      lat: Math.random() * 180 - 90,
      lng: Math.random() * 360 - 180,
    }))

    // Generate vulnerability trends
    const mockVulnTrends: VulnerabilityTrend[] = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      const critical = Math.floor(Math.random() * 20) + 5
      const high = Math.floor(Math.random() * 50) + 20
      const medium = Math.floor(Math.random() * 100) + 50
      const low = Math.floor(Math.random() * 200) + 100
      return {
        date: date.toISOString().split("T")[0],
        critical,
        high,
        medium,
        low,
        total: critical + high + medium + low,
      }
    })

    // Generate service distribution
    const services = [
      { service: "HTTP/HTTPS", color: "#3b82f6" },
      { service: "SSH", color: "#ef4444" },
      { service: "FTP", color: "#f59e0b" },
      { service: "Telnet", color: "#8b5cf6" },
      { service: "SMTP", color: "#10b981" },
      { service: "DNS", color: "#f97316" },
      { service: "Database", color: "#ec4899" },
      { service: "Other", color: "#6b7280" },
    ]
    const mockServiceDist: ServiceDistribution[] = services.map((s) => {
      const count = Math.floor(Math.random() * 5000) + 500
      return {
        ...s,
        count,
        percentage: Math.random() * 30 + 5,
      }
    })

    // Generate attack vectors
    const vectors = ["Brute Force", "SQL Injection", "XSS", "CSRF", "RCE", "DoS", "Malware", "Phishing"]
    const mockAttackVectors: AttackVector[] = vectors.map((vector) => ({
      vector,
      incidents: Math.floor(Math.random() * 1000) + 100,
      trend: (Math.random() - 0.5) * 50,
      severity: Math.random() * 10,
    }))

    setThreatData(mockThreatData)
    setVulnerabilityTrends(mockVulnTrends)
    setServiceDistribution(mockServiceDist)
    setAttackVectors(mockAttackVectors)
  }, [timeRange])

  const totalThreats = threatData.reduce((sum, item) => sum + item.threats, 0)
  const totalVulns = threatData.reduce((sum, item) => sum + item.vulnerabilities, 0)
  const criticalThreats = threatData.filter((item) => item.severity === "critical").length
  const trendDirection =
    vulnerabilityTrends.length > 1
      ? vulnerabilityTrends[vulnerabilityTrends.length - 1].total -
        vulnerabilityTrends[vulnerabilityTrends.length - 2].total
      : 0

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Threat Intelligence Analytics</h2>
          <p className="text-slate-400">Real-time cybersecurity insights and trend analysis</p>
        </div>
        <div className="flex gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-slate-800/50 border-slate-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-40 bg-slate-800/50 border-slate-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="threats">Threats</SelectItem>
              <SelectItem value="vulnerabilities">Vulnerabilities</SelectItem>
              <SelectItem value="incidents">Incidents</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-400 text-sm font-medium">Total Threats</p>
                <p className="text-3xl font-bold text-white">{totalThreats.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  {trendDirection > 0 ? (
                    <TrendingUp className="w-4 h-4 text-red-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-green-400" />
                  )}
                  <span className={`text-sm ${trendDirection > 0 ? "text-red-400" : "text-green-400"}`}>
                    {Math.abs(trendDirection)}%
                  </span>
                </div>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/20 to-orange-800/10 border-orange-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-400 text-sm font-medium">Vulnerabilities</p>
                <p className="text-3xl font-bold text-white">{totalVulns.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Shield className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-orange-400">Active</span>
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
                <p className="text-purple-400 text-sm font-medium">Critical Alerts</p>
                <p className="text-3xl font-bold text-white">{criticalThreats}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-400">High Priority</span>
                </div>
              </div>
              <Target className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-900/20 to-cyan-800/10 border-cyan-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-400 text-sm font-medium">Countries</p>
                <p className="text-3xl font-bold text-white">{threatData.length}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-cyan-400">Global</span>
                </div>
              </div>
              <MapPin className="w-8 h-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/30">
          <TabsTrigger value="trends">Threat Trends</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="vectors">Attack Vectors</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vulnerability Trends */}
            <Card className="bg-slate-900/40 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Vulnerability Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    critical: { label: "Critical", color: "#ef4444" },
                    high: { label: "High", color: "#f97316" },
                    medium: { label: "Medium", color: "#eab308" },
                    low: { label: "Low", color: "#22c55e" },
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={vulnerabilityTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="critical"
                        stackId="1"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.8}
                      />
                      <Area
                        type="monotone"
                        dataKey="high"
                        stackId="1"
                        stroke="#f97316"
                        fill="#f97316"
                        fillOpacity={0.8}
                      />
                      <Area
                        type="monotone"
                        dataKey="medium"
                        stackId="1"
                        stroke="#eab308"
                        fill="#eab308"
                        fillOpacity={0.8}
                      />
                      <Area
                        type="monotone"
                        dataKey="low"
                        stackId="1"
                        stroke="#22c55e"
                        fill="#22c55e"
                        fillOpacity={0.8}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Total Threats Over Time */}
            <Card className="bg-slate-900/40 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Total Threats Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    total: { label: "Total Threats", color: "#3b82f6" },
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={vulnerabilityTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Threats by Country */}
            <Card className="bg-slate-900/40 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Globe className="w-5 h-5 text-blue-400" />
                  Threats by Country
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    threats: { label: "Threats", color: "#3b82f6" },
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={threatData.slice(0, 8)} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis type="number" stroke="#9ca3af" />
                      <YAxis dataKey="country" type="category" stroke="#9ca3af" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="threats" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Threat Severity Distribution */}
            <Card className="bg-slate-900/40 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  Threat Severity Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["critical", "high", "medium", "low"].map((severity) => {
                    const count = threatData.filter((item) => item.severity === severity).length
                    const percentage = (count / threatData.length) * 100
                    const colors = {
                      critical: "bg-red-500",
                      high: "bg-orange-500",
                      medium: "bg-yellow-500",
                      low: "bg-green-500",
                    }
                    return (
                      <div key={severity} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300 capitalize">{severity}</span>
                          <Badge className={`${colors[severity as keyof typeof colors]} text-white`}>
                            {count} ({percentage.toFixed(1)}%)
                          </Badge>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${colors[severity as keyof typeof colors]}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Service Distribution Pie Chart */}
            <Card className="bg-slate-900/40 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Activity className="w-5 h-5 text-purple-400" />
                  Service Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    count: { label: "Count", color: "#8b5cf6" },
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={serviceDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="count"
                        label={({ service, percentage }) => `${service}: ${percentage.toFixed(1)}%`}
                      >
                        {serviceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Service Counts */}
            <Card className="bg-slate-900/40 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="w-5 h-5 text-cyan-400" />
                  Service Counts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceDistribution.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: service.color }} />
                        <span className="text-white font-medium">{service.service}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">{service.count.toLocaleString()}</div>
                        <div className="text-slate-400 text-sm">{service.percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vectors" className="space-y-6">
          <Card className="bg-slate-900/40 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Zap className="w-5 h-5 text-red-400" />
                Attack Vector Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  incidents: { label: "Incidents", color: "#ef4444" },
                  severity: { label: "Severity", color: "#f97316" },
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={attackVectors}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="incidents" stroke="#9ca3af" />
                    <YAxis dataKey="severity" stroke="#9ca3af" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Scatter dataKey="incidents" fill="#ef4444" />
                  </ScatterChart>
                </ResponsiveContainer>
              </ChartContainer>

              <div className="mt-6 space-y-3">
                {attackVectors.map((vector, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-white font-medium">{vector.vector}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-white font-bold">{vector.incidents}</div>
                        <div className="text-slate-400 text-sm">incidents</div>
                      </div>
                      <div className="flex items-center gap-1">
                        {vector.trend > 0 ? (
                          <TrendingUp className="w-4 h-4 text-red-400" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-green-400" />
                        )}
                        <span className={`text-sm ${vector.trend > 0 ? "text-red-400" : "text-green-400"}`}>
                          {Math.abs(vector.trend).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
