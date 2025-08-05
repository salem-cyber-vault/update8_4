"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Globe,
  MapPin,
  Server,
  Shield,
  AlertTriangle,
  Eye,
  ChevronDown,
  ChevronUp,
  Wifi,
  Lock,
  Database,
  Zap,
  Target,
  Search,
} from "lucide-react"
import { CVEIntelligencePanel } from "./cve-intelligence-panel"
import { ShodanProInterface } from "./shodan-pro-interface"
import { getProductVulnerabilityIntel } from "@/lib/cvedb-client"
import type { ShodanHost } from "@/lib/api-client"

interface EnhancedHostCardProps {
  host: ShodanHost
  threatIntel?: any
}

export function EnhancedHostCard({ host, threatIntel }: EnhancedHostCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [showCVEPanel, setShowCVEPanel] = useState(false)
  const [showShodanPro, setShowShodanPro] = useState(false)
  const [vulnIntel, setVulnIntel] = useState<any>(null)

  useEffect(() => {
    if (host.product && showCVEPanel) {
      loadVulnerabilityIntel()
    }
  }, [host.product, showCVEPanel])

  const loadVulnerabilityIntel = async () => {
    if (!host.product) return

    try {
      const intel = await getProductVulnerabilityIntel(host.product)
      setVulnIntel(intel)
    } catch (error) {
      console.error("Failed to load vulnerability intel:", error)
    }
  }

  const getServiceIcon = (product?: string) => {
    if (!product) return <Server className="w-4 h-4" />

    const p = product.toLowerCase()
    if (p.includes("apache") || p.includes("nginx")) return <Globe className="w-4 h-4" />
    if (p.includes("ssh")) return <Lock className="w-4 h-4" />
    if (p.includes("mysql") || p.includes("mongodb")) return <Database className="w-4 h-4" />
    if (p.includes("camera") || p.includes("webcam")) return <Eye className="w-4 h-4" />
    return <Server className="w-4 h-4" />
  }

  const getThreatLevel = () => {
    let score = 0
    const reasons = []

    // Base threat scoring
    if (host.vulns && host.vulns.length > 0) {
      score += host.vulns.length * 2
      reasons.push(`${host.vulns.length} CVE(s)`)
    }

    if (threatIntel?.abuseipdb?.abuseConfidence > 75) {
      score += 3
      reasons.push("High abuse confidence")
    }

    if (threatIntel?.virustotal?.data?.attributes?.last_analysis_stats?.malicious > 0) {
      score += 2
      reasons.push("VT detections")
    }

    // Enhanced scoring with vulnerability intel
    if (vulnIntel) {
      if (vulnIntel.criticalCVEs.length > 0) {
        score += vulnIntel.criticalCVEs.length * 3
        reasons.push(`${vulnIntel.criticalCVEs.length} critical CVE(s)`)
      }
      if (vulnIntel.kevCVEs.length > 0) {
        score += vulnIntel.kevCVEs.length * 4
        reasons.push(`${vulnIntel.kevCVEs.length} KEV(s)`)
      }
      if (vulnIntel.ransomwareCVEs.length > 0) {
        score += vulnIntel.ransomwareCVEs.length * 5
        reasons.push(`${vulnIntel.ransomwareCVEs.length} ransomware CVE(s)`)
      }
    }

    if (score > 10) return { level: "critical", color: "text-red-400", bg: "bg-red-500/10", reasons }
    if (score > 5) return { level: "high", color: "text-orange-400", bg: "bg-orange-500/10", reasons }
    if (score > 2) return { level: "medium", color: "text-yellow-400", bg: "bg-yellow-500/10", reasons }
    return { level: "low", color: "text-green-400", bg: "bg-green-500/10", reasons }
  }

  const threat = getThreatLevel()

  return (
    <div className="space-y-4">
      <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl hover:bg-slate-900/60 transition-all duration-300 group">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800/50 rounded-lg">{getServiceIcon(host.product)}</div>
              <div>
                <h3 className="text-lg font-mono text-white group-hover:text-cyan-400 transition-colors">
                  {host.ip_str}:{host.port}
                </h3>
                <p className="text-slate-400 text-sm">
                  {host.product} {host.version && `v${host.version}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {host.vulns && host.vulns.length > 0 && (
                <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {host.vulns.length} CVE{host.vulns.length > 1 ? "s" : ""}
                </Badge>
              )}

              {vulnIntel && vulnIntel.kevCVEs.length > 0 && (
                <Badge variant="destructive" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  <Target className="w-3 h-3 mr-1" />
                  {vulnIntel.kevCVEs.length} KEV
                </Badge>
              )}

              <Badge className={`${threat.bg} ${threat.color} border-current/30`}>
                <Shield className="w-3 h-3 mr-1" />
                {threat.level.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Enhanced Threat Summary */}
          {threat.reasons.length > 0 && (
            <div className="mb-4 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <div className="text-sm text-slate-300">
                <span className="text-slate-400">Threat indicators: </span>
                {threat.reasons.join(", ")}
              </div>
            </div>
          )}

          {/* Location & Organization */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="text-sm">
                {host.location.city}, {host.location.country_name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Wifi className="w-4 h-4 text-slate-400" />
              <span className="text-sm truncate">{host.org}</span>
            </div>
          </div>

          {/* Title/Banner */}
          {host.title && (
            <div className="mb-4 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <p className="text-slate-300 text-sm font-mono">{host.title}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-400">Last seen: {new Date(host.timestamp).toLocaleDateString()}</div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShodanPro(true)}
                className="text-slate-400 hover:text-cyan-400"
              >
                <Search className="w-4 h-4 mr-1" />
                Analyze
              </Button>

              {host.product && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCVEPanel(!showCVEPanel)}
                  className="text-slate-400 hover:text-red-400"
                >
                  <Zap className="w-4 h-4 mr-1" />
                  CVE Intel
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="text-slate-400 hover:text-white"
              >
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Expanded Details */}
          {expanded && (
            <div className="mt-4 pt-4 border-t border-slate-700/30 space-y-4">
              {/* Vulnerabilities */}
              {host.vulns && host.vulns.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Vulnerabilities
                  </h4>
                  <div className="space-y-1">
                    {host.vulns.slice(0, 5).map((cve, index) => (
                      <Badge
                        key={index}
                        variant="destructive"
                        className="mr-2 mb-1 bg-red-500/10 text-red-400 border-red-500/30"
                      >
                        {cve}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* SSL Certificate */}
              {host.ssl && (
                <div>
                  <h4 className="text-sm font-medium text-green-400 mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    SSL Certificate
                  </h4>
                  <div className="text-sm text-slate-300 space-y-1">
                    <div>Subject: {host.ssl.cert.subject.CN}</div>
                    <div>Issuer: {host.ssl.cert.issuer.CN}</div>
                  </div>
                </div>
              )}

              {/* Threat Intelligence */}
              {threatIntel && (
                <div>
                  <h4 className="text-sm font-medium text-purple-400 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Threat Intelligence
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {threatIntel.abuseipdb && (
                      <div>
                        <span className="text-slate-400">Abuse Confidence:</span>
                        <span
                          className={`ml-2 ${threatIntel.abuseipdb.abuseConfidence > 50 ? "text-red-400" : "text-green-400"}`}
                        >
                          {threatIntel.abuseipdb.abuseConfidence}%
                        </span>
                      </div>
                    )}
                    {threatIntel.virustotal && (
                      <div>
                        <span className="text-slate-400">VT Detections:</span>
                        <span className="ml-2 text-slate-300">
                          {threatIntel.virustotal.data.attributes.last_analysis_stats.malicious}/
                          {Object.values(threatIntel.virustotal.data.attributes.last_analysis_stats).reduce(
                            (a: any, b: any) => a + b,
                            0,
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* CVE Intelligence Panel */}
      {showCVEPanel && host.product && <CVEIntelligencePanel product={host.product} cveIds={host.vulns} />}

      {/* Shodan Pro Interface Modal */}
      <Dialog open={showShodanPro} onOpenChange={setShowShodanPro}>
        <DialogContent className="max-w-7xl max-h-[95vh] bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-2xl text-cyan-400">Advanced Host Analysis - {host.ip_str}</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[80vh]">
            <ShodanProInterface initialHost={host} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
