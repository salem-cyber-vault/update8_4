"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Globe, 
  Server, 
  Eye, 
  MapPin,
  Clock,
  Database,
  Zap
} from 'lucide-react'

interface DemoIntelligenceResultsProps {
  target: string
  targetType: 'ip' | 'domain' | 'email' | 'hash' | 'url'
}

export function DemoIntelligenceResults({ target, targetType }: DemoIntelligenceResultsProps) {
  // Generate realistic demo data based on target
  const generateDemoData = () => {
    const isGoogleDNS = target === '8.8.8.8'
    const isGoogleDomain = target === 'google.com'
    
    const baseRiskScore = isGoogleDNS || isGoogleDomain ? 5 : Math.floor(Math.random() * 40) + 10
    
    return {
      target,
      type: targetType,
      timestamp: new Date().toISOString(),
      riskScore: baseRiskScore,
      summary: isGoogleDNS 
        ? "✅ LOW RISK - Well-known Google Public DNS server with excellent reputation"
        : isGoogleDomain
        ? "✅ LOW RISK - Legitimate Google domain with strong security posture"
        : `⚠️ MEDIUM RISK - Analysis completed with ${Math.floor(Math.random() * 3) + 1} security concerns`,
      alerts: isGoogleDNS ? [] : [
        {
          severity: 'info' as const,
          source: 'SecurityTrails',
          message: 'Historical DNS records available'
        },
        ...(baseRiskScore > 30 ? [{
          severity: 'medium' as const,
          source: 'VirusTotal',
          message: 'Detected in 1 security vendor blacklist'
        }] : [])
      ],
      sources: {
        shodan: { 
          success: true, 
          data: {
            ip: target,
            org: isGoogleDNS ? 'Google LLC' : 'Example Corp',
            isp: isGoogleDNS ? 'Google LLC' : 'Example ISP',
            country: 'US',
            ports: isGoogleDNS ? [53, 443] : [80, 443, 22]
          }
        },
        virustotal: { 
          success: true,
          data: {
            malicious: 0,
            suspicious: baseRiskScore > 30 ? 1 : 0,
            harmless: 67,
            undetected: 8
          }
        },
        abuseipdb: { 
          success: true,
          data: {
            abuseConfidence: Math.max(0, baseRiskScore - 10),
            totalReports: baseRiskScore > 20 ? Math.floor(Math.random() * 5) : 0,
            usageType: isGoogleDNS ? 'Content Delivery Network' : 'Data Center/Web Hosting/Transit'
          }
        },
        greynoise: {
          success: true,
          data: {
            noise: false,
            riot: isGoogleDNS,
            classification: 'benign',
            name: isGoogleDNS ? 'Google Public DNS' : 'Unknown'
          }
        },
        securitytrails: {
          success: true,
          data: {
            subdomains: isGoogleDomain ? ['mail', 'www', 'docs', 'drive', 'maps'] : ['www', 'api'],
            records: Math.floor(Math.random() * 50) + 10
          }
        },
        bgpview: {
          success: true,
          data: {
            asn: isGoogleDNS ? 15169 : Math.floor(Math.random() * 50000) + 1000,
            asn_name: isGoogleDNS ? 'GOOGLE' : 'EXAMPLE-AS',
            prefix: isGoogleDNS ? '8.8.8.0/24' : '192.168.1.0/24'
          }
        }
      }
    }
  }

  const demoData = generateDemoData()

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

  const successfulSources = Object.keys(demoData.sources).filter(
    key => demoData.sources[key].success
  ).length

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-slate-900/40 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Target</label>
              <div className="text-lg font-mono text-white bg-slate-800 px-3 py-2 rounded">
                {demoData.target}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Risk Score</label>
              <div className="space-y-2">
                <Progress value={demoData.riskScore} className="h-3" />
                <Badge variant={getRiskBadgeVariant(demoData.riskScore)} className="w-full justify-center">
                  {demoData.riskScore}/100 - {getRiskLabel(demoData.riskScore)}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Analysis Time</label>
              <div className="text-sm text-slate-300 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {new Date(demoData.timestamp).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <label className="text-sm text-slate-400">Summary</label>
            <p className="text-white">{demoData.summary}</p>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {demoData.alerts.length > 0 && (
        <Card className="bg-slate-900/40 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              Security Alerts ({demoData.alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {demoData.alerts.map((alert, index) => (
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
          </CardContent>
        </Card>
      )}

      {/* Source Overview */}
      <Card className="bg-slate-900/40 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-400" />
            Intelligence Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reputation">Reputation</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="geolocation">Location</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-800/50 rounded">
                  <Server className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                  <div className="text-2xl font-bold text-white">{successfulSources}</div>
                  <div className="text-xs text-slate-400">Active Sources</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <div className="text-2xl font-bold text-white">
                    {demoData.alerts.filter(a => a.severity === 'info').length}
                  </div>
                  <div className="text-xs text-slate-400">Info Alerts</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                  <div className="text-2xl font-bold text-white">
                    {demoData.alerts.filter(a => a.severity === 'medium').length}
                  </div>
                  <div className="text-xs text-slate-400">Warnings</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded">
                  <XCircle className="w-8 h-8 mx-auto mb-2 text-red-400" />
                  <div className="text-2xl font-bold text-white">
                    {demoData.alerts.filter(a => a.severity === 'critical').length}
                  </div>
                  <div className="text-xs text-slate-400">Critical Issues</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reputation" className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/50 rounded">
                  <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    VirusTotal Analysis
                  </h3>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-red-400">
                        {demoData.sources.virustotal.data.malicious}
                      </div>
                      <div className="text-xs text-slate-400">Malicious</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-orange-400">
                        {demoData.sources.virustotal.data.suspicious}
                      </div>
                      <div className="text-xs text-slate-400">Suspicious</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-400">
                        {demoData.sources.virustotal.data.harmless}
                      </div>
                      <div className="text-xs text-slate-400">Clean</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-slate-400">
                        {demoData.sources.virustotal.data.undetected}
                      </div>
                      <div className="text-xs text-slate-400">Undetected</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded">
                  <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    AbuseIPDB Report
                  </h3>
                  <div className="text-sm space-y-1">
                    <div>Abuse Confidence: <span className="text-orange-400 font-semibold">
                      {demoData.sources.abuseipdb.data.abuseConfidence}%
                    </span></div>
                    <div>Total Reports: <span className="text-white">
                      {demoData.sources.abuseipdb.data.totalReports}
                    </span></div>
                    <div>Usage Type: <span className="text-cyan-400">
                      {demoData.sources.abuseipdb.data.usageType}
                    </span></div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="technical" className="space-y-4">
              <div className="p-4 bg-slate-800/50 rounded">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Server className="w-4 h-4" />
                  Network Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Organization:</span>
                    <span className="text-white ml-2">{demoData.sources.shodan.data.org}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">ISP:</span>
                    <span className="text-white ml-2">{demoData.sources.shodan.data.isp}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">ASN:</span>
                    <span className="text-white ml-2">AS{demoData.sources.bgpview.data.asn}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Prefix:</span>
                    <span className="text-white ml-2">{demoData.sources.bgpview.data.prefix}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="geolocation" className="space-y-4">
              <div className="p-4 bg-slate-800/50 rounded">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Geographic Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Country:</span>
                    <span className="text-white ml-2">{demoData.sources.shodan.data.country}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Open Ports:</span>
                    <span className="text-white ml-2">{demoData.sources.shodan.data.ports.join(', ')}</span>
                  </div>
                  {targetType === 'domain' && (
                    <>
                      <div>
                        <span className="text-slate-400">Subdomains:</span>
                        <span className="text-white ml-2">{demoData.sources.securitytrails.data.subdomains.length}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">DNS Records:</span>
                        <span className="text-white ml-2">{demoData.sources.securitytrails.data.records}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}