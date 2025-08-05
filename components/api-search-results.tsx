"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Globe, Shield, AlertTriangle, Eye } from "lucide-react"
import type { ShodanResult, ThreatIntelResult } from "@/lib/api-integrations"

interface ApiSearchResultsProps {
  results: ShodanResult[]
  threatIntel: ThreatIntelResult[]
  loading: boolean
}

export function ApiSearchResults({ results, threatIntel, loading }: ApiSearchResultsProps) {
  const [selectedResult, setSelectedResult] = useState<ShodanResult | null>(null)

  if (loading) {
    return (
      <Card className="bg-slate-800/30 border-slate-700 p-8">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
          <span className="text-slate-300">Scanning the digital shadows...</span>
        </div>
      </Card>
    )
  }

  if (results.length === 0) {
    return (
      <Card className="bg-slate-800/30 border-slate-700 p-8">
        <div className="text-center text-slate-400">
          <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No entities found in the digital realm</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {results.map((result, index) => {
        const threat = threatIntel.find((t) => t.ip === result.ip)
        return (
          <Card
            key={index}
            className="bg-slate-800/30 border-slate-700 p-4 hover:bg-slate-800/50 transition-all cursor-pointer"
            onClick={() => setSelectedResult(result)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="text-white font-mono">
                    {result.ip}:{result.port}
                  </h3>
                  <p className="text-slate-400 text-sm">{result.service}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {threat && (
                  <Badge variant={threat.reputation === "malicious" ? "destructive" : "secondary"} className="text-xs">
                    {threat.reputation}
                  </Badge>
                )}
                {result.vulnerability && (
                  <Badge variant="destructive" className="text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    VULN
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Location:</span>
                <span className="text-slate-300 ml-2">
                  {result.city}, {result.country}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Organization:</span>
                <span className="text-slate-300 ml-2">{result.organization}</span>
              </div>
            </div>

            {result.vulnerability && (
              <div className="mt-3 p-2 bg-red-900/20 border border-red-500/30 rounded">
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <Shield className="w-4 h-4" />
                  <span>Vulnerability: {result.vulnerability}</span>
                </div>
              </div>
            )}

            {threat && threat.categories.length > 0 && (
              <div className="mt-3 flex gap-2">
                {threat.categories.map((category, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs border-orange-500 text-orange-400">
                    {category}
                  </Badge>
                ))}
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
