"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Globe,
  Shield,
  AlertTriangle,
  MapPin,
  Server,
  Eye,
  ExternalLink,
  Copy,
  ChevronDown,
  ChevronRight,
  Lock,
  Activity,
  Flag,
} from "lucide-react"

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

  // Mock data generation for demonstration
  useEffect(() => {
    if (query && !loading) {
      const mockResults: SearchResult[] = Array.from({ length: Math.min(20, resultCount) }, (_, i) => ({
        id: `result-${i}`,
        ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        port: [22, 80, 443, 3389, 21, 23, 25, 53, 110, 143, 993, 995][Math.floor(Math.random() * 12)],
        protocol: ["tcp", "udp"][Math.floor(Math.random() * 2)],
        service: ["http", "https", "ssh", "ftp", "telnet", "smtp", "dns"][Math.floor(Math.random() * 7)],
        product: ["Apache", "Nginx", "OpenSSH", "Microsoft IIS", "Postfix", "BIND"][Math.floor(Math.random() * 6)],
        version: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
        country: ["US", "CN", "RU", "DE", "GB", "FR", "JP", "BR"][Math.floor(Math.random() * 8)],
        city: ["New York", "Beijing", "Moscow", "Berlin", "London", "Paris", "Tokyo", "São Paulo"][
          Math.floor(Math.random() * 8)
        ],
        org: ["Amazon", "Google", "Microsoft", "DigitalOcean", "Cloudflare", "OVH"][Math.floor(Math.random() * 6)],
        isp: ["AWS", "Google Cloud", "Azure", "DigitalOcean", "Linode"][Math.floor(Math.random() * 5)],
        asn: `AS${Math.floor(Math.random() * 90000) + 10000}`,
        hostnames: [`host${i}.example.com`, `server${i}.domain.org`],
        vulnerabilities:
          Math.random() > 0.7
            ? [
                {
                  cve: `CVE-2024-${Math.floor(Math.random() * 9999)
                    .toString()
                    .padStart(4, "0")}`,
                  severity: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as any,
                  score: Math.random() * 10,
                },
              ]
            : [],
        lastSeen: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        threatLevel: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as any,
        isHoneypot: Math.random() > 0.9,
        ssl:
          Math.random() > 0.5
            ? {
                enabled: true,
                cert: {
                  issuer: "Let's Encrypt",
                  subject: `*.example${i}.com`,
                  expires: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
                },
              }
            : { enabled: false },
        banner: `${["Apache", "Nginx", "OpenSSH"][Math.floor(Math.random() * 3)]} Server Ready\nConnection established`,
        tags: ["web-server", "production", "cloud"].slice(0, Math.floor(Math.random() * 3) + 1),
      }))
      setResults(mockResults)
    }
  }, [query, loading, resultCount])

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
            <Activity className="w-5 h-5" />
            Search Results - {query}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{results.length}</div>
              <div className="text-sm text-slate-400">Total Results</div>
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
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                  <div className="flex items-center gap-2">
                    <Server className="w-5 h-5 text-cyan-400" />
                    <span className="font-mono text-lg text-white">
                      {result.ip}:{result.port}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`${result.ip}:${result.port}`)}
                      className="p-1 h-auto"
                    >
                      <Copy className="w-3 h-3" />
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
                  <Globe className="w-4 h-4" />
                  {result.service.toUpperCase()}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {result.city}, {result.country}
                </div>
                <div className="flex items-center gap-1">
                  <Flag className="w-4 h-4" />
                  {result.org}
                </div>
                {result.ssl?.enabled && (
                  <div className="flex items-center gap-1">
                    <Lock className="w-4 h-4 text-green-400" />
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
                        <Shield className="w-4 h-4" />
                        Vulnerabilities
                      </h4>
                      {result.vulnerabilities.length > 0 ? (
                        <div className="space-y-2">
                          {result.vulnerabilities.map((vuln, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                              <div className="flex items-center gap-3">
                                <AlertTriangle
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
                                <span className="font-mono">{vuln.cve}</span>
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
                          <Lock className="w-4 h-4" />
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
                  <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                    <Eye className="w-4 h-4 mr-2" />
                    Investigate
                  </Button>
                  <Button size="sm" variant="outline" className="border-slate-600 bg-transparent">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Shodan
                  </Button>
                  <Button size="sm" variant="outline" className="border-slate-600 bg-transparent">
                    <Shield className="w-4 h-4 mr-2" />
                    VirusTotal
                  </Button>
                  <Button size="sm" variant="outline" className="border-slate-600 bg-transparent">
                    <Globe className="w-4 h-4 mr-2" />
                    Whois
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
