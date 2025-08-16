"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SafeIcon } from "@/lib/fallback-icons"

interface SearchResult {
  id: string
  ip: string
  port: number
  protocol: string
  service: string
  product?: string
  version?: string
  country: string
  city: string
  org: string
  isp: string
  asn: string
  hostnames: string[]
  vulnerabilities: Array<{
    cve: string
    severity: "low" | "medium" | "high" | "critical"
    score: number
    description?: string
  }>
  lastSeen: string
  threatLevel: "low" | "medium" | "high" | "critical"
  isHoneypot: boolean
  ssl?: {
    enabled: boolean
    cert?: {
      issuer: string
      subject: string
      expires: string
    }
  }
  banner?: string
  tags: string[]
  shodan_data?: any
  virustotal_data?: any
  abuseipdb_data?: any
  greynoise_data?: any
}

interface InteractiveSearchResultsProps {
  query: string
  loading: boolean
  resultCount: number
}

export function InteractiveSearchResults({ query, loading, resultCount }: InteractiveSearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState("overview")
  const [deepAnalysis, setDeepAnalysis] = useState<any>(null)
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)

  useEffect(() => {
    if (query && !loading) {
      fetchRealSearchResults(query)
    }
  }, [query, loading, resultCount])

  const fetchRealSearchResults = async (searchQuery: string) => {
    try {
      console.log("[v0] Fetching real search results for:", searchQuery)

      // Make real Shodan API call
      const shodanResponse = await fetch(`/api/shodan-search?query=${encodeURIComponent(searchQuery)}`)

      if (!shodanResponse.ok) {
        throw new Error(`Shodan API returned ${shodanResponse.status}: ${shodanResponse.statusText}`)
      }

      const shodanData = await shodanResponse.json()

      if (!shodanData || typeof shodanData !== "object") {
        throw new Error("Invalid response format from Shodan API")
      }

      if (shodanData.error) {
        throw new Error(`Shodan API error: ${shodanData.error}`)
      }

      if (shodanData.matches && Array.isArray(shodanData.matches)) {
        const realResults: SearchResult[] = shodanData.matches.slice(0, 20).map((match: any, i: number) => {
          const safeGet = (obj: any, path: string, fallback: any = "Unknown") => {
            try {
              return path.split(".").reduce((current, key) => current?.[key], obj) || fallback
            } catch {
              return fallback
            }
          }

          return {
            id: `shodan-${safeGet(match, "ip_str", "unknown")}-${safeGet(match, "port", 0)}`,
            ip: safeGet(match, "ip_str", "0.0.0.0"),
            port: safeGet(match, "port", 0),
            protocol: safeGet(match, "transport", "tcp"),
            service: safeGet(match, "product") || safeGet(match, "_shodan.module", "unknown"),
            product: safeGet(match, "product"),
            version: safeGet(match, "version"),
            country: safeGet(match, "location.country_name", "Unknown"),
            city: safeGet(match, "location.city", "Unknown"),
            org: safeGet(match, "org", "Unknown"),
            isp: safeGet(match, "isp", "Unknown"),
            asn: safeGet(match, "asn", "Unknown"),
            hostnames: Array.isArray(match.hostnames) ? match.hostnames : [],
            vulnerabilities:
              match.vulns && typeof match.vulns === "object"
                ? Object.keys(match.vulns).map((cve) => ({
                    cve,
                    severity: "medium" as const,
                    score: 5.0,
                    description: safeGet(match.vulns[cve], "summary"),
                  }))
                : [],
            lastSeen: safeGet(match, "timestamp", new Date().toISOString()),
            threatLevel: (match.vulns && Object.keys(match.vulns).length > 0 ? "high" : "low") as const,
            isHoneypot: Array.isArray(match.tags) ? match.tags.includes("honeypot") : false,
            ssl: match.ssl
              ? {
                  enabled: true,
                  cert: {
                    issuer: safeGet(match, "ssl.cert.issuer.CN", "Unknown"),
                    subject: safeGet(match, "ssl.cert.subject.CN", "Unknown"),
                    expires: safeGet(match, "ssl.cert.expires", "Unknown"),
                  },
                }
              : { enabled: false },
            banner: safeGet(match, "data", ""),
            tags: Array.isArray(match.tags) ? match.tags : [],
            shodan_data: match,
          }
        })

        setResults(realResults)
        console.log("[v0] Loaded real results:", realResults.length)
      } else {
        console.log("[v0] No matches found in Shodan response")
        setResults([])
      }
    } catch (error) {
      console.error("[v0] Error fetching real search results:", error)
      console.error("[v0] Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        query: searchQuery,
      })
      // Fallback to empty results instead of mock data
      setResults([])
    }
  }

  const investigateWithVirusTotal = async (ip: string) => {
    setLoadingAnalysis(true)
    try {
      console.log("[v0] Investigating IP with VirusTotal:", ip)
      const response = await fetch(`/api/virustotal-ip?ip=${ip}`)
      const data = await response.json()
      setDeepAnalysis({ type: "virustotal", data, ip })
    } catch (error) {
      console.error("[v0] VirusTotal investigation failed:", error)
    }
    setLoadingAnalysis(false)
  }

  const investigateWithAbuseIPDB = async (ip: string) => {
    setLoadingAnalysis(true)
    try {
      console.log("[v0] Investigating IP with AbuseIPDB:", ip)
      const response = await fetch(`/api/abuseipdb-check?ip=${ip}`)
      const data = await response.json()
      setDeepAnalysis({ type: "abuseipdb", data, ip })
    } catch (error) {
      console.error("[v0] AbuseIPDB investigation failed:", error)
    }
    setLoadingAnalysis(false)
  }

  const investigateWithGreyNoise = async (ip: string) => {
    setLoadingAnalysis(true)
    try {
      console.log("[v0] Investigating IP with GreyNoise:", ip)
      const response = await fetch(`/api/greynoise-ip?ip=${ip}`)
      const data = await response.json()
      setDeepAnalysis({ type: "greynoise", data, ip })
    } catch (error) {
      console.error("[v0] GreyNoise investigation failed:", error)
    }
    setLoadingAnalysis(false)
  }

  const performWhoisLookup = async (ip: string) => {
    setLoadingAnalysis(true)
    try {
      console.log("[v0] Performing WHOIS lookup:", ip)
      const response = await fetch(`/api/whois-lookup?ip=${ip}`)
      const data = await response.json()
      setDeepAnalysis({ type: "whois", data, ip })
    } catch (error) {
      console.error("[v0] WHOIS lookup failed:", error)
    }
    setLoadingAnalysis(false)
  }

  const exploreCVE = async (cve: string) => {
    setLoadingAnalysis(true)
    try {
      console.log("[v0] Exploring CVE:", cve)
      const response = await fetch(`/api/cve-details?cve=${cve}`)
      const data = await response.json()
      setDeepAnalysis({ type: "cve", data, cve })
    } catch (error) {
      console.error("[v0] CVE exploration failed:", error)
    }
    setLoadingAnalysis(false)
  }

  const exploreGeolocation = async (ip: string) => {
    setLoadingAnalysis(true)
    try {
      console.log("[v0] Exploring geolocation for:", ip)
      const response = await fetch(`/api/ip-geolocation?ip=${ip}`)
      const data = await response.json()
      setDeepAnalysis({ type: "geolocation", data, ip })
    } catch (error) {
      console.error("[v0] Geolocation exploration failed:", error)
    }
    setLoadingAnalysis(false)
  }

  const exploreASN = async (asn: string) => {
    setLoadingAnalysis(true)
    try {
      console.log("[v0] Exploring ASN:", asn)
      const response = await fetch(`/api/asn-analysis?asn=${asn}`)
      const data = await response.json()
      setDeepAnalysis({ type: "asn", data, asn })
    } catch (error) {
      console.error("[v0] ASN exploration failed:", error)
    }
    setLoadingAnalysis(false)
  }

  const getThreatColor = (level: string) => {
    switch (level) {
      case "critical":
        return "text-red-400 bg-red-900/20 border-red-500"
      case "high":
        return "text-orange-400 bg-orange-900/20 border-orange-500"
      case "medium":
        return "text-yellow-400 bg-yellow-900/20 border-yellow-500"
      default:
        return "text-green-400 bg-green-900/20 border-green-500"
    }
  }

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedCards(newExpanded)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (loading) {
    return (
      <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl">
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            <span className="text-slate-300">Scanning the digital landscape...</span>
          </div>
          <Progress value={33} className="mt-4" />
        </CardContent>
      </Card>
    )
  }

  if (!results.length) return null

  return (
    <div className="space-y-6">
      {/* Results Overview */}
      <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <SafeIcon name="Activity" className="w-5 h-5" />
            Live Search Results - {query}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{results.length}</div>
              <div className="text-sm text-slate-400">Live Results</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {results.filter((r) => r.vulnerabilities.length > 0).length}
              </div>
              <div className="text-sm text-slate-400">Vulnerable</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">
                {results.filter((r) => r.threatLevel === "high" || r.threatLevel === "critical").length}
              </div>
              <div className="text-sm text-slate-400">High Risk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{new Set(results.map((r) => r.country)).size}</div>
              <div className="text-sm text-slate-400">Countries</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results List */}
      <div className="space-y-4">
        {results.map((result) => (
          <Card
            key={result.id}
            className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl hover:border-cyan-500/50 transition-all cursor-pointer"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" onClick={() => toggleExpanded(result.id)} className="p-1 h-auto">
                    {expandedCards.has(result.id) ? (
                      <SafeIcon name="ChevronDown" className="w-4 h-4" />
                    ) : (
                      <SafeIcon name="ChevronRight" className="w-4 h-4" />
                    )}
                  </Button>
                  <div className="flex items-center gap-2">
                    <SafeIcon name="Server" className="w-5 h-5 text-cyan-400" />
                    <button
                      className="font-mono text-lg text-white hover:text-cyan-400 transition-colors"
                      onClick={() => exploreGeolocation(result.ip)}
                    >
                      {result.ip}:{result.port}
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`${result.ip}:${result.port}`)}
                      className="p-1 h-auto"
                    >
                      <SafeIcon name="Copy" className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getThreatColor(result.threatLevel)}>{result.threatLevel.toUpperCase()}</Badge>
                  {result.isHoneypot && (
                    <Badge className="text-purple-400 bg-purple-900/20 border-purple-500">HONEYPOT</Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  <SafeIcon name="Globe" className="w-4 h-4" />
                  {result.service.toUpperCase()}
                </div>
                <div className="flex items-center gap-1">
                  <SafeIcon name="MapPin" className="w-4 h-4" />
                  {result.city}, {result.country}
                </div>
                <div className="flex items-center gap-1">
                  <SafeIcon name="Flag" className="w-4 h-4" />
                  <button className="hover:text-cyan-400 transition-colors" onClick={() => exploreASN(result.asn)}>
                    {result.asn}
                  </button>
                </div>
                {result.ssl?.enabled && (
                  <div className="flex items-center gap-1">
                    <SafeIcon name="Lock" className="w-4 h-4 text-green-400" />
                    SSL
                  </div>
                )}
              </div>
            </CardHeader>

            {expandedCards.has(result.id) && (
              <CardContent className="pt-0">
                <Separator className="mb-4" />

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4 bg-slate-800/30">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="network">Network</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-white mb-2">Service Information</h4>
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="text-slate-400">Product:</span> {result.product}
                          </div>
                          <div>
                            <span className="text-slate-400">Version:</span> {result.version}
                          </div>
                          <div>
                            <span className="text-slate-400">Protocol:</span> {result.protocol.toUpperCase()}
                          </div>
                          <div>
                            <span className="text-slate-400">Last Seen:</span>{" "}
                            {new Date(result.lastSeen).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Location & ISP</h4>
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="text-slate-400">ISP:</span> {result.isp}
                          </div>
                          <div>
                            <span className="text-slate-400">ASN:</span> {result.asn}
                          </div>
                          <div>
                            <span className="text-slate-400">Hostnames:</span> {result.hostnames.join(", ")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="security" className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                        <SafeIcon name="Shield" className="w-4 h-4" />
                        Vulnerabilities
                      </h4>
                      {result.vulnerabilities.length > 0 ? (
                        <div className="space-y-2">
                          {result.vulnerabilities.map((vuln, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                              <div className="flex items-center gap-3">
                                <SafeIcon
                                  name="AlertTriangle"
                                  className={`w-4 h-4 ${
                                    vuln.severity === "critical"
                                      ? "text-red-400"
                                      : vuln.severity === "high"
                                        ? "text-orange-400"
                                        : vuln.severity === "medium"
                                          ? "text-yellow-400"
                                          : "text-green-400"
                                  }`}
                                />
                                <button
                                  className="font-mono hover:text-cyan-400 transition-colors"
                                  onClick={() => exploreCVE(vuln.cve)}
                                >
                                  {vuln.cve}
                                </button>
                                <Badge className={getThreatColor(vuln.severity)}>{vuln.severity.toUpperCase()}</Badge>
                              </div>
                              <div className="text-sm text-slate-400">Score: {vuln.score.toFixed(1)}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-green-400 text-sm">No known vulnerabilities</div>
                      )}
                    </div>

                    {result.ssl && (
                      <div>
                        <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                          <SafeIcon name="Lock" className="w-4 h-4" />
                          SSL Certificate
                        </h4>
                        {result.ssl.enabled && result.ssl.cert ? (
                          <div className="space-y-1 text-sm bg-slate-800/30 p-3 rounded-lg">
                            <div>
                              <span className="text-slate-400">Issuer:</span> {result.ssl.cert.issuer}
                            </div>
                            <div>
                              <span className="text-slate-400">Subject:</span> {result.ssl.cert.subject}
                            </div>
                            <div>
                              <span className="text-slate-400">Expires:</span>{" "}
                              {new Date(result.ssl.cert.expires).toLocaleDateString()}
                            </div>
                          </div>
                        ) : (
                          <div className="text-red-400 text-sm">SSL not enabled</div>
                        )}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="network" className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Network Information</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div>
                            <span className="text-slate-400">IP Address:</span> {result.ip}
                          </div>
                          <div>
                            <span className="text-slate-400">Port:</span> {result.port}
                          </div>
                          <div>
                            <span className="text-slate-400">Protocol:</span> {result.protocol.toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <div>
                            <span className="text-slate-400">ASN:</span> {result.asn}
                          </div>
                          <div>
                            <span className="text-slate-400">Organization:</span> {result.org}
                          </div>
                          <div>
                            <span className="text-slate-400">ISP:</span> {result.isp}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="details" className="space-y-4">
                    {result.banner && (
                      <div>
                        <h4 className="font-semibold text-white mb-2">Service Banner</h4>
                        <ScrollArea className="h-32 w-full">
                          <pre className="text-xs text-slate-300 bg-slate-800/30 p-3 rounded-lg font-mono">
                            {result.banner}
                          </pre>
                        </ScrollArea>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold text-white mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-slate-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700/50">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                        <SafeIcon name="Eye" className="w-4 h-4 mr-2" />
                        Deep Analysis
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-700">
                      <DialogHeader>
                        <DialogTitle className="text-cyan-400">Deep Analysis - {result.ip}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Button onClick={() => investigateWithVirusTotal(result.ip)} disabled={loadingAnalysis}>
                            <SafeIcon name="Shield" className="w-4 h-4 mr-2" />
                            VirusTotal Analysis
                          </Button>
                          <Button onClick={() => investigateWithAbuseIPDB(result.ip)} disabled={loadingAnalysis}>
                            <SafeIcon name="AlertTriangle" className="w-4 h-4 mr-2" />
                            AbuseIPDB Check
                          </Button>
                          <Button onClick={() => investigateWithGreyNoise(result.ip)} disabled={loadingAnalysis}>
                            <SafeIcon name="Activity" className="w-4 h-4 mr-2" />
                            GreyNoise Intel
                          </Button>
                          <Button onClick={() => performWhoisLookup(result.ip)} disabled={loadingAnalysis}>
                            <SafeIcon name="Globe" className="w-4 h-4 mr-2" />
                            WHOIS Lookup
                          </Button>
                        </div>

                        {loadingAnalysis && (
                          <div className="flex items-center justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                            <span className="ml-4 text-slate-300">Analyzing...</span>
                          </div>
                        )}

                        {deepAnalysis && (
                          <div className="bg-slate-800/30 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-white mb-2">
                              {deepAnalysis.type.toUpperCase()} Analysis Results
                            </h3>
                            <ScrollArea className="h-64">
                              <pre className="text-xs text-slate-300 font-mono">
                                {JSON.stringify(deepAnalysis.data, null, 2)}
                              </pre>
                            </ScrollArea>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-600 bg-transparent"
                    onClick={() => investigateWithVirusTotal(result.ip)}
                  >
                    <SafeIcon name="Shield" className="w-4 h-4 mr-2" />
                    VirusTotal
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-600 bg-transparent"
                    onClick={() => investigateWithAbuseIPDB(result.ip)}
                  >
                    <SafeIcon name="AlertTriangle" className="w-4 h-4 mr-2" />
                    AbuseIPDB
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-600 bg-transparent"
                    onClick={() => performWhoisLookup(result.ip)}
                  >
                    <SafeIcon name="Globe" className="w-4 h-4 mr-2" />
                    WHOIS
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
