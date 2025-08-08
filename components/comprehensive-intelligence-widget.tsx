"use client"

import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Search, 
  Shield, 
  Globe, 
  Mail, 
  FileHash, 
  Link2, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  Download,
  Share2,
  RefreshCw,
  Zap,
  Target,
  MapPin,
  Server,
  Database,
  Lock,
  Wifi,
  Bug,
  TrendingUp
} from 'lucide-react'
import { 
  ComprehensiveIntelligenceResult, 
  comprehensiveIntelligence,
  analyzeIP,
  analyzeDomain,
  analyzeEmail,
  analyzeHash,
  analyzeURL
} from '@/lib/comprehensive-intelligence'
import { DemoIntelligenceResults } from '@/components/demo-intelligence-results'

interface ComprehensiveIntelligenceWidgetProps {
  className?: string
  defaultTarget?: string
  defaultType?: 'ip' | 'domain' | 'email' | 'hash' | 'url'
}

export function ComprehensiveIntelligenceWidget({ 
  className, 
  defaultTarget = '',
  defaultType = 'ip'
}: ComprehensiveIntelligenceWidgetProps) {
  const [target, setTarget] = useState(defaultTarget)
  const [targetType, setTargetType] = useState<'ip' | 'domain' | 'email' | 'hash' | 'url'>(defaultType)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ComprehensiveIntelligenceResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [demoMode, setDemoMode] = useState(true) // Enable demo mode by default

  const handleAnalyze = useCallback(async () => {
    if (!target.trim()) return
    
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      if (demoMode) {
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Set a flag to show demo results
        setResult({ demoMode: true, target: target.trim(), type: targetType } as any)
      } else {
        let analysisResult: ComprehensiveIntelligenceResult
        
        switch (targetType) {
          case 'ip':
            analysisResult = await analyzeIP(target.trim())
            break
          case 'domain':
            analysisResult = await analyzeDomain(target.trim())
            break
          case 'email':
            analysisResult = await analyzeEmail(target.trim())
            break
          case 'hash':
            analysisResult = await analyzeHash(target.trim())
            break
          case 'url':
            analysisResult = await analyzeURL(target.trim())
            break
          default:
            throw new Error('Invalid target type')
        }
        
        setResult(analysisResult)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
      // Show demo results on error
      setResult({ demoMode: true, target: target.trim(), type: targetType } as any)
    } finally {
      setLoading(false)
    }
  }, [target, targetType, demoMode])

  const getRiskBadgeVariant = (score: number) => {
    if (score >= 70) return 'destructive'
    if (score >= 40) return 'secondary'
    return 'default'
  }

  const getRiskLabel = (score: number) => {
    if (score >= 70) return 'HIGH RISK'
    if (score >= 40) return 'MEDIUM RISK'
    return 'LOW RISK'
  }

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-4 h-4 text-red-500" />
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case 'medium': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'low': return <AlertTriangle className="w-4 h-4 text-blue-500" />
      default: return <CheckCircle className="w-4 h-4 text-green-500" />
    }
  }

  const exportResults = () => {
    if (!result) return
    
    const exportData = {
      target: result.target,
      type: result.type,
      timestamp: result.timestamp,
      riskScore: result.riskScore,
      summary: result.summary,
      alerts: result.alerts,
      sources: Object.keys(result.sources).filter(key => !result.sources[key].error)
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cyber-intel-${result.target}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const shareResults = async () => {
    if (!result) return
    
    const shareText = `🔍 Cyber Intelligence Analysis\n\nTarget: ${result.target}\nType: ${result.type.toUpperCase()}\nRisk Score: ${result.riskScore}/100\n\n${result.summary}\n\nAnalyzed via Salem Cyber Vault`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cyber Intelligence Analysis',
          text: shareText
        })
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard?.writeText(shareText)
      }
    } else {
      navigator.clipboard?.writeText(shareText)
    }
  }

  const quickTargets = [
    { label: '8.8.8.8', type: 'ip' as const, value: '8.8.8.8' },
    { label: 'google.com', type: 'domain' as const, value: 'google.com' },
    { label: 'test@example.com', type: 'email' as const, value: 'test@example.com' },
    { label: 'Sample Hash', type: 'hash' as const, value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' }
  ]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-cyan-900/30 border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <div className="relative">
              <Target className="w-8 h-8 text-cyan-400" />
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-lg animate-pulse"></div>
            </div>
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Comprehensive Intelligence Analysis
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Target Type</label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white"
              >
                <option value="ip">IP Address</option>
                <option value="domain">Domain</option>
                <option value="email">Email</option>
                <option value="hash">File Hash</option>
                <option value="url">URL</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-slate-300">Target</label>
              <Input
                type="text"
                placeholder={`Enter ${targetType}...`}
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Action</label>
              <Button 
                onClick={handleAnalyze} 
                disabled={loading || !target.trim()}
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
              >
                {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                {loading ? 'Analyzing...' : 'Analyze'}
              </Button>
            </div>
          </div>

          {/* Demo Mode Toggle */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={demoMode}
                onChange={(e) => setDemoMode(e.target.checked)}
                className="rounded"
              />
              Demo Mode (Show sample results with realistic data)
            </label>
          </div>

          {/* Quick Targets */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Quick Targets:</label>
            <div className="flex gap-2 flex-wrap">
              {quickTargets.map((quick) => (
                <Button
                  key={quick.value}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTargetType(quick.type)
                    setTarget(quick.value)
                  }}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  {quick.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert className="border-red-500 bg-red-500/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-400">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {(result as any).demoMode ? (
            <DemoIntelligenceResults 
              target={(result as any).target} 
              targetType={(result as any).type} 
            />
          ) : (
            <div className="space-y-6">
              {/* Summary Card */}
              <Card className="bg-slate-900/40 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  Analysis Summary
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={exportResults}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" onClick={shareResults}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Target</label>
                  <div className="text-lg font-mono text-white bg-slate-800 px-3 py-2 rounded">
                    {result.target}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Risk Score</label>
                  <div className="space-y-2">
                    <Progress value={result.riskScore} className="h-3" />
                    <Badge variant={getRiskBadgeVariant(result.riskScore)} className="w-full justify-center">
                      {result.riskScore}/100 - {getRiskLabel(result.riskScore)}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Analysis Time</label>
                  <div className="text-sm text-slate-300 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {new Date(result.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>

              <Separator className="my-4 bg-slate-700" />

              <div className="space-y-2">
                <label className="text-sm text-slate-400">Summary</label>
                <p className="text-white">{result.summary}</p>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          {result.alerts.length > 0 && (
            <Card className="bg-slate-900/40 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  Security Alerts ({result.alerts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {result.alerts.map((alert, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded">
                        {getAlertIcon(alert.severity)}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {alert.source}
                            </Badge>
                            <Badge 
                              variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {alert.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-white">{alert.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Detailed Results */}
          <Card className="bg-slate-900/40 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-400" />
                Intelligence Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-6 bg-slate-800">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="reputation">Reputation</TabsTrigger>
                  <TabsTrigger value="technical">Technical</TabsTrigger>
                  <TabsTrigger value="geolocation">Location</TabsTrigger>
                  <TabsTrigger value="threats">Threats</TabsTrigger>
                  <TabsTrigger value="sources">Raw Data</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-slate-800/50 rounded">
                      <Server className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                      <div className="text-2xl font-bold text-white">
                        {Object.keys(result.sources).filter(key => !result.sources[key].error).length}
                      </div>
                      <div className="text-xs text-slate-400">Active Sources</div>
                    </div>
                    <div className="text-center p-4 bg-slate-800/50 rounded">
                      <Shield className="w-8 h-8 mx-auto mb-2 text-green-400" />
                      <div className="text-2xl font-bold text-white">
                        {result.alerts.filter(a => a.severity === 'info').length}
                      </div>
                      <div className="text-xs text-slate-400">Info Alerts</div>
                    </div>
                    <div className="text-center p-4 bg-slate-800/50 rounded">
                      <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                      <div className="text-2xl font-bold text-white">
                        {result.alerts.filter(a => a.severity === 'medium' || a.severity === 'high').length}
                      </div>
                      <div className="text-xs text-slate-400">Warnings</div>
                    </div>
                    <div className="text-center p-4 bg-slate-800/50 rounded">
                      <XCircle className="w-8 h-8 mx-auto mb-2 text-red-400" />
                      <div className="text-2xl font-bold text-white">
                        {result.alerts.filter(a => a.severity === 'critical').length}
                      </div>
                      <div className="text-xs text-slate-400">Critical Issues</div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reputation" className="space-y-4">
                  {result.enrichment.reputation ? (
                    <div className="space-y-4">
                      {result.enrichment.reputation.virusTotal && (
                        <div className="p-4 bg-slate-800/50 rounded">
                          <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            VirusTotal Analysis
                          </h3>
                          <div className="grid grid-cols-4 gap-4 text-center">
                            <div>
                              <div className="text-lg font-bold text-red-400">
                                {result.enrichment.reputation.virusTotal.malicious}
                              </div>
                              <div className="text-xs text-slate-400">Malicious</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-orange-400">
                                {result.enrichment.reputation.virusTotal.suspicious}
                              </div>
                              <div className="text-xs text-slate-400">Suspicious</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-green-400">
                                {result.enrichment.reputation.virusTotal.clean}
                              </div>
                              <div className="text-xs text-slate-400">Clean</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-slate-400">
                                {result.enrichment.reputation.virusTotal.undetected}
                              </div>
                              <div className="text-xs text-slate-400">Undetected</div>
                            </div>
                          </div>
                        </div>
                      )}
                      {result.enrichment.reputation.abuseIPDB && (
                        <div className="p-4 bg-slate-800/50 rounded">
                          <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            AbuseIPDB Report
                          </h3>
                          <div className="text-sm space-y-1">
                            <div>Abuse Confidence: <span className="text-orange-400 font-semibold">
                              {result.enrichment.reputation.abuseIPDB.abuseConfidence}%
                            </span></div>
                            <div>Total Reports: <span className="text-white">
                              {result.enrichment.reputation.abuseIPDB.totalReports}
                            </span></div>
                            <div>Usage Type: <span className="text-cyan-400">
                              {result.enrichment.reputation.abuseIPDB.usageType}
                            </span></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      No reputation data available
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="technical" className="space-y-4">
                  {result.enrichment.technicalData ? (
                    <div className="space-y-4">
                      {result.enrichment.technicalData.shodan && (
                        <div className="p-4 bg-slate-800/50 rounded">
                          <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                            <Search className="w-4 h-4" />
                            Shodan Data
                          </h3>
                          <ScrollArea className="h-32">
                            <pre className="text-xs text-slate-300 whitespace-pre-wrap">
                              {JSON.stringify(result.enrichment.technicalData.shodan, null, 2)}
                            </pre>
                          </ScrollArea>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      No technical data available
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="geolocation" className="space-y-4">
                  {result.enrichment.geolocation ? (
                    <div className="p-4 bg-slate-800/50 rounded">
                      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Geographic Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Country:</span>
                          <span className="text-white ml-2">{result.enrichment.geolocation.country}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Region:</span>
                          <span className="text-white ml-2">{result.enrichment.geolocation.region}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">City:</span>
                          <span className="text-white ml-2">{result.enrichment.geolocation.city}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">ISP:</span>
                          <span className="text-white ml-2">{result.enrichment.geolocation.isp}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Organization:</span>
                          <span className="text-white ml-2">{result.enrichment.geolocation.org}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">ASN:</span>
                          <span className="text-white ml-2">{result.enrichment.geolocation.asn}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      No geolocation data available
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="threats" className="space-y-4">
                  {result.enrichment.threatIntel ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-800/50 rounded">
                        <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                          <Bug className="w-4 h-4" />
                          Threat Intelligence
                        </h3>
                        <ScrollArea className="h-32">
                          <pre className="text-xs text-slate-300 whitespace-pre-wrap">
                            {JSON.stringify(result.enrichment.threatIntel, null, 2)}
                          </pre>
                        </ScrollArea>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      No threat intelligence data available
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="sources" className="space-y-4">
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {Object.entries(result.sources).map(([source, data]) => (
                        <div key={source} className="p-4 bg-slate-800/50 rounded">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-white capitalize">{source}</h3>
                            {data.error ? (
                              <Badge variant="destructive" className="text-xs">Error</Badge>
                            ) : (
                              <Badge variant="default" className="text-xs">Success</Badge>
                            )}
                          </div>
                          <ScrollArea className="h-32">
                            <pre className="text-xs text-slate-300 whitespace-pre-wrap">
                              {JSON.stringify(data, null, 2)}
                            </pre>
                          </ScrollArea>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
            </div>
          )}
        </div>
      )}
    </div>
  )
}