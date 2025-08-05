"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, AlertTriangle } from "lucide-react"
import { getThreatMapData, type ThreatMapData } from "@/lib/api-client"

export function ThreatWorldMap() {
  const [threatData, setThreatData] = useState<ThreatMapData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState<ThreatMapData | null>(null)

  useEffect(() => {
    const loadThreatData = async () => {
      try {
        const data = await getThreatMapData()
        setThreatData(data)
      } catch (error) {
        console.error("Failed to load threat map data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadThreatData()
    const interval = setInterval(loadThreatData, 300000) // Update every 5 minutes
    return () => clearInterval(interval)
  }, [])

  const getThreatColor = (threats: number) => {
    if (threats > 10000) return "bg-red-500"
    if (threats > 5000) return "bg-orange-500"
    if (threats > 1000) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getThreatIntensity = (threats: number) => {
    const maxThreats = Math.max(...threatData.map((d) => d.threats))
    return Math.min(1, threats / maxThreats)
  }

  return (
    <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Global Threat Intelligence Map 🌍
          <Badge variant="outline" className="text-cyan-400 border-cyan-400 animate-pulse">
            LIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-slate-400">Loading global threat data... 👻</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* World Map Visualization */}
            <div className="relative h-96 bg-slate-800/30 rounded-lg overflow-hidden">
              <svg viewBox="0 0 1000 500" className="w-full h-full">
                {/* Simplified world map paths would go here */}
                <rect width="1000" height="500" fill="transparent" />

                {/* Threat indicators */}
                {threatData.map((country, index) => (
                  <g key={country.countryCode}>
                    {/* Country threat indicator */}
                    <circle
                      cx={500 + country.coordinates[1] * 2.5} // Longitude to X
                      cy={250 - country.coordinates[0] * 2.5} // Latitude to Y (inverted)
                      r={Math.max(3, Math.min(20, country.threats / 500))}
                      fill="currentColor"
                      className={`${getThreatColor(country.threats)} opacity-70 cursor-pointer hover:opacity-100 transition-all`}
                      onClick={() => setSelectedCountry(country)}
                    />

                    {/* Pulsing effect for high-threat countries */}
                    {country.threats > 5000 && (
                      <circle
                        cx={500 + country.coordinates[1] * 2.5}
                        cy={250 - country.coordinates[0] * 2.5}
                        r={Math.max(3, Math.min(20, country.threats / 500))}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-red-400 animate-twinkle duration-3000" // Updated className here
                      />
                    )}
                  </g>
                ))}
              </svg>

              {/* Overlay information */}
              <div className="absolute top-4 left-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Critical (10K+ threats)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>High (5K+ threats)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Medium (1K+ threats)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Low (&lt;1K threats)</span>
                </div>
              </div>
            </div>

            {/* Country Details */}
            {selectedCountry && (
              <Card className="bg-slate-800/50 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">{selectedCountry.country}</h3>
                    <Badge className={`${getThreatColor(selectedCountry.threats)} text-white`}>
                      {selectedCountry.threats.toLocaleString()} threats
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Active Botnets:</span>
                      <span className="ml-2 text-orange-400">{selectedCountry.botnets}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Malware Types:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {selectedCountry.malwareTypes.map((type, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-red-400 text-red-400">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Top Threat Countries */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                Top Threat Origins 🕷️
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {threatData
                  .sort((a, b) => b.threats - a.threats)
                  .slice(0, 6)
                  .map((country, index) => (
                    <Card key={country.countryCode} className="bg-slate-800/30 border-slate-600 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">{country.country}</div>
                          <div className="text-sm text-slate-400">{country.threats.toLocaleString()} threats</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 ${getThreatColor(country.threats)} rounded-full`}></div>
                          <Badge variant="outline" className="text-xs">
                            #{index + 1}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
