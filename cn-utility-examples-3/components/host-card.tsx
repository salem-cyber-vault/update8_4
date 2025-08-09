"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Globe,
  MapPin,
  Server,
  Shield,
  AlertTriangle,
  Eye,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Wifi,
  Lock,
  Database,
} from "lucide-react"
import type { ShodanHost } from "@/lib/api-integrations"

interface HostCardProps {
  host: ShodanHost
  threatIntel?: any
}

export function HostCard({ host, threatIntel }: HostCardProps) {
  const [expanded, setExpanded] = useState(false)

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
    if (threatIntel?.abuseipdb?.abuseConfidence > 75)
      return { level: "high", color: "text-red-400", bg: "bg-red-500/10" }
    if (threatIntel?.abuseipdb?.abuseConfidence > 25)
      return { level: "medium", color: "text-yellow-400", bg: "bg-yellow-500/10" }
    if (threatIntel?.virustotal?.data?.attributes?.last_analysis_stats?.malicious > 0)
      return { level: "medium", color: "text-yellow-400", bg: "bg-yellow-500/10" }
    return { level: "low", color: "text-green-400", bg: "bg-green-500/10" }
  }

  const threat = getThreatLevel()

  return (
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

            <Badge className={`${threat.bg} ${threat.color} border-current/30`}>
              <Shield className="w-3 h-3 mr-1" />
              {threat.level.toUpperCase()}
            </Badge>
          </div>
        </div>

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

        {/* Tags */}
        {host.tags && host.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {host.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs border-slate-600 text-slate-400">
                {tag}
              </Badge>
            ))}
            {host.tags.length > 3 && (
              <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                +{host.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Expand/Collapse */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-400">Last seen: {new Date(host.timestamp).toLocaleDateString()}</div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(`https://www.shodan.io/host/${host.ip_str}`, "_blank")}
              className="text-slate-400 hover:text-cyan-400"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>

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

            {/* Hostnames */}
            {host.hostnames && host.hostnames.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-blue-400 mb-2">Hostnames</h4>
                <div className="flex flex-wrap gap-1">
                  {host.hostnames.slice(0, 3).map((hostname, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-blue-500/30 text-blue-400">
                      {hostname}
                    </Badge>
                  ))}
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
  )
}
