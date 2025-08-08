"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Shield, 
  Globe, 
  Eye,
  Zap,
  Clock,
  Database,
  Wifi,
  Server
} from "lucide-react"

interface LiveDataEntry {
  id: string
  timestamp: Date
  type: 'threat' | 'scan' | 'vulnerability' | 'network' | 'system'
  title: string
  value: string
  trend: 'up' | 'down' | 'stable'
  severity: 'low' | 'medium' | 'high' | 'critical'
  source: string
}

interface SystemMetric {
  name: string
  value: number
  max: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  icon: React.ReactNode
}

export function LivingLedger() {
  const [liveData, setLiveData] = useState<LiveDataEntry[]>([])
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([
    {
      name: "Active Scans",
      value: 127,
      max: 200,
      unit: "scans",
      trend: "up",
      icon: <Eye className="w-4 h-4" />
    },
    {
      name: "Threat Score",
      value: 23,
      max: 100,
      unit: "%",
      trend: "down",
      icon: <Shield className="w-4 h-4" />
    },
    {
      name: "CVE Monitoring",
      value: 1247,
      max: 2000,
      unit: "CVEs",
      trend: "stable",
      icon: <Database className="w-4 h-4" />
    },
    {
      name: "Network Health",
      value: 94,
      max: 100,
      unit: "%",
      trend: "stable",
      icon: <Wifi className="w-4 h-4" />
    }
  ])

  // Simulate real-time data updates
  useEffect(() => {
    const generateLiveEntry = (): LiveDataEntry => {
      const types: LiveDataEntry['type'][] = ['threat', 'scan', 'vulnerability', 'network', 'system']
      const severities: LiveDataEntry['severity'][] = ['low', 'medium', 'high', 'critical']
      const trends: LiveDataEntry['trend'][] = ['up', 'down', 'stable']
      
      const samples = [
        { title: "New IP scan completed", value: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`, source: "Shodan API" },
        { title: "CVE detected in system", value: `CVE-2024-${Math.floor(Math.random() * 9999)}`, source: "CVE Database" },
        { title: "Suspicious port activity", value: `Port ${Math.floor(Math.random() * 65535)}`, source: "Network Monitor" },
        { title: "Threat intelligence update", value: `${Math.floor(Math.random() * 50)} new IOCs`, source: "Threat Feed" },
        { title: "Security score updated", value: `${Math.floor(Math.random() * 100)}%`, source: "Security Engine" },
        { title: "Vulnerability scan", value: `${Math.floor(Math.random() * 20)} findings`, source: "Vuln Scanner" },
        { title: "Botnet activity detected", value: `${Math.floor(Math.random() * 10)} nodes`, source: "Botnet Tracker" },
        { title: "OSINT data collected", value: `${Math.floor(Math.random() * 100)} records`, source: "OSINT Engine" }
      ]

      const sample = samples[Math.floor(Math.random() * samples.length)]
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        type: types[Math.floor(Math.random() * types.length)],
        title: sample.title,
        value: sample.value,
        trend: trends[Math.floor(Math.random() * trends.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        source: sample.source
      }
    }

    const updateMetrics = () => {
      setSystemMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, Math.min(metric.max, metric.value + (Math.random() - 0.5) * 5)),
        trend: Math.random() > 0.6 ? (Math.random() > 0.5 ? 'up' : 'down') : metric.trend
      })))
    }

    // Initial data
    const initialData = Array.from({ length: 8 }, generateLiveEntry)
    setLiveData(initialData)

    // Set up intervals for live updates
    const dataInterval = setInterval(() => {
      const newEntry = generateLiveEntry()
      setLiveData(prev => [newEntry, ...prev.slice(0, 49)]) // Keep last 50 entries
    }, 3000 + Math.random() * 2000) // Random interval between 3-5 seconds

    const metricsInterval = setInterval(updateMetrics, 5000)

    return () => {
      clearInterval(dataInterval)
      clearInterval(metricsInterval)
    }
  }, [])

  const getSeverityColor = (severity: LiveDataEntry['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-400 border-red-400/30 bg-red-500/10'
      case 'high': return 'text-orange-400 border-orange-400/30 bg-orange-500/10'
      case 'medium': return 'text-yellow-400 border-yellow-400/30 bg-yellow-500/10'
      case 'low': return 'text-green-400 border-green-400/30 bg-green-500/10'
    }
  }

  const getTypeIcon = (type: LiveDataEntry['type']) => {
    switch (type) {
      case 'threat': return <AlertTriangle className="w-4 h-4" />
      case 'scan': return <Eye className="w-4 h-4" />
      case 'vulnerability': return <Shield className="w-4 h-4" />
      case 'network': return <Globe className="w-4 h-4" />
      case 'system': return <Server className="w-4 h-4" />
    }
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-400" />
      case 'down': return <TrendingDown className="w-3 h-3 text-red-400" />
      case 'stable': return <Activity className="w-3 h-3 text-blue-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* System Metrics */}
      <Card className="glass-card-feminine border-pink-300/20">
        <CardHeader>
          <CardTitle className="text-pink-300 flex items-center gap-2">
            <Zap className="w-5 h-5 animate-soft-pulse" />
            Living System Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemMetrics.map((metric) => (
              <div key={metric.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {metric.icon}
                    <span className="text-sm text-slate-300">{metric.name}</span>
                  </div>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">{Math.round(metric.value)} {metric.unit}</span>
                    <span className="text-slate-500">{metric.max} max</span>
                  </div>
                  <Progress 
                    value={(metric.value / metric.max) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Data Feed */}
      <Card className="glass-card-feminine border-purple-300/20">
        <CardHeader>
          <CardTitle className="text-purple-300 flex items-center gap-2">
            <Activity className="w-5 h-5 animate-soft-pulse" />
            Live Intelligence Feed
            <Badge variant="outline" className="glass-card-feminine border-green-400/30 text-green-400 ml-auto">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-soft-pulse"></div>
              LIVE
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <div className="space-y-3">
              {liveData.map((entry) => (
                <div
                  key={entry.id}
                  className="glass-card p-3 border border-slate-600/30 hover:border-pink-300/30 transition-all duration-300 animate-float-gentle"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-slate-400 mt-1">
                        {getTypeIcon(entry.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-slate-200 truncate">
                            {entry.title}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getSeverityColor(entry.severity)}`}
                          >
                            {entry.severity}
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-400 mb-1">{entry.value}</div>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {entry.timestamp.toLocaleTimeString()}
                          </span>
                          <span>{entry.source}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-2">
                      {getTrendIcon(entry.trend)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}