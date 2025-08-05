"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Globe,
  Server,
  Shield,
  Eye,
  MapPin,
  Wifi,
  Database,
  Lock,
  Zap,
  Target,
  AlertTriangle,
  BookOpen,
  Lightbulb,
  Filter,
  Download,
  Share,
  Copy,
  CheckCircle,
} from "lucide-react"
import { searchShodan, getComprehensiveThreatIntel } from "@/lib/api-client"
import { CVEIntelligencePanel } from "./cve-intelligence-panel"
import type { ShodanHost } from "@/lib/api-client"

interface ShodanProInterfaceProps {
  initialQuery?: string
  initialHost?: ShodanHost
}

export function ShodanProInterface({ initialQuery = "", initialHost }: ShodanProInterfaceProps) {
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<ShodanHost[]>([])
  const [selectedHost, setSelectedHost] = useState<ShodanHost | null>(initialHost || null)
  const [threatIntel, setThreatIntel] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [activeTab, setActiveTab] = useState("search")
  const [showFilters, setShowFilters] = useState(false)
  const [copied, setCopied] = useState(false)

  // Search filters
  const [filters, setFilters] = useState({
    country: "",
    port: "",
    product: "",
    org: "",
    hasVulns: false,
    hasSSL: false,
  })

  useEffect(() => {
    if (initialHost) {
      loadHostIntelligence(initialHost)
    }
  }, [initialHost])

  const searchQueries = [
    {
      category: "🌐 Web Services",
      queries: [
        { name: "Apache Servers", query: "apache", description: "Find Apache web servers" },
        { name: "Nginx Servers", query: "nginx", description: "Discover Nginx web servers" },
        { name: "IIS Servers", query: "iis", description: "Microsoft IIS web servers" },
        { name: "Default Pages", query: 'title:"Apache2 Ubuntu Default Page"', description: "Default Apache pages" },
      ],
    },
    {
      category: "🔐 Remote Access",
      queries: [
        { name: "SSH Servers", query: "port:22", description: "SSH remote access servers" },
        { name: "RDP Servers", query: "port:3389", description: "Windows Remote Desktop" },
        { name: "VNC Servers", query: "port:5900", description: "VNC remote desktop" },
        { name: "Telnet", query: "port:23", description: "Telnet services (often IoT)" },
      ],
    },
    {
      category: "🗄️ Databases",
      queries: [
        { name: "MySQL", query: "port:3306", description: "MySQL database servers" },
        { name: "MongoDB", query: "port:27017", description: "MongoDB databases" },
        { name: "Redis", query: "port:6379", description: "Redis key-value stores" },
        { name: "Elasticsearch", query: "port:9200", description: "Elasticsearch clusters" },
      ],
    },
    {
      category: "📹 IoT & Cameras",
      queries: [
        { name: "Webcams", query: "webcam", description: "Internet-connected cameras" },
        { name: "IP Cameras", query: 'title:"Network Camera"', description: "Network IP cameras" },
        { name: "DVR Systems", query: "DVR", description: "Digital video recorders" },
        { name: "Smart TVs", query: "smart tv", description: "Internet-connected TVs" },
      ],
    },
    {
      category: "🏭 Industrial",
      queries: [
        { name: "SCADA", query: "scada", description: "Industrial control systems" },
        { name: "Modbus", query: "port:502", description: "Modbus industrial protocol" },
        { name: "Building Automation", query: "building automation", description: "Smart building systems" },
        { name: "Wind Turbines", query: "wind turbine", description: "Wind energy systems" },
      ],
    },
    {
      category: "⚠️ Vulnerable Systems",
      queries: [
        { name: "Default Passwords", query: "default password", description: "Systems with default creds" },
        { name: "Unpatched Systems", query: "vuln", description: "Systems with known vulnerabilities" },
        { name: "Exposed Configs", query: 'title:"Index of /" config', description: "Exposed configuration files" },
        { name: "Open Directories", query: 'title:"Index of /"', description: "Open directory listings" },
      ],
    },
  ]

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setActiveTab("results")

    try {
      // Build query with filters
      let finalQuery = searchQuery
      if (filters.country) finalQuery += ` country:${filters.country}`
      if (filters.port) finalQuery += ` port:${filters.port}`
      if (filters.product) finalQuery += ` product:${filters.product}`
      if (filters.org) finalQuery += ` org:"${filters.org}"`
      if (filters.hasVulns) finalQuery += ` has_vuln:true`
      if (filters.hasSSL) finalQuery += ` has_ssl:true`

      const searchResults = await searchShodan(finalQuery)
      setResults(searchResults.matches || [])
      setTotalResults(searchResults.total || 0)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadHostIntelligence = async (host: ShodanHost) => {
    setLoading(true)
    try {
      const intel = await getComprehensiveThreatIntel(host.ip_str)
      setThreatIntel(intel)
    } catch (error) {
      console.error("Failed to load threat intelligence:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleHostSelect = (host: ShodanHost) => {
    setSelectedHost(host)
    setActiveTab("analysis")
    loadHostIntelligence(host)
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

  const getThreatLevel = (host: ShodanHost) => {
    let score = 0
    if (host.vulns && host.vulns.length > 0) score += host.vulns.length * 2
    if (threatIntel?.abuseipdb?.abuseConfidence > 75) score += 3
    if (threatIntel?.virustotal?.data?.attributes?.last_analysis_stats?.malicious > 0) score += 2

    if (score > 5) return { level: "high", color: "text-red-400", bg: "bg-red-500/10" }
    if (score > 2) return { level: "medium", color: "text-yellow-400", bg: "bg-yellow-500/10" }
    return { level: "low", color: "text-green-400", bg: "bg-green-500/10" }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const exportResults = () => {
    const data = {
      query,
      timestamp: new Date().toISOString(),
      totalResults,
      results: results.slice(0, 100), // Limit export
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `shodan-search-${Date.now()}.json`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            <Search className="w-6 h-6" />
            Shodan Pro Interface 🔍
            <Badge variant="outline" className="text-cyan-400 border-cyan-400">
              Professional Mode
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Interface */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter search query (e.g., apache, nginx, port:80, country:US)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 text-lg h-12"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button onClick={() => handleSearch()} disabled={loading} className="bg-cyan-600 hover:bg-cyan-700 h-12">
              {loading ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <Card className="bg-slate-800/30 border-slate-600 p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Country</label>
                  <Input
                    placeholder="US, CN, DE..."
                    value={filters.country}
                    onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Port</label>
                  <Input
                    placeholder="80, 443, 22..."
                    value={filters.port}
                    onChange={(e) => setFilters({ ...filters, port: e.target.value })}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Product</label>
                  <Input
                    placeholder="apache, nginx..."
                    value={filters.product}
                    onChange={(e) => setFilters({ ...filters, product: e.target.value })}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Organization</label>
                  <Input
                    placeholder="Google, Amazon..."
                    value={filters.org}
                    onChange={(e) => setFilters({ ...filters, org: e.target.value })}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={filters.hasVulns}
                      onChange={(e) => setFilters({ ...filters, hasVulns: e.target.checked })}
                      className="rounded"
                    />
                    Has Vulnerabilities
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={filters.hasSSL}
                      onChange={(e) => setFilters({ ...filters, hasSSL: e.target.checked })}
                      className="rounded"
                    />
                    Has SSL Certificate
                  </label>
                </div>
              </div>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/30 border-slate-700">
          <TabsTrigger value="search" className="data-[state=active]:bg-cyan-600">
            <Search className="w-4 h-4 mr-2" />
            Search Library
          </TabsTrigger>
          <TabsTrigger value="results" className="data-[state=active]:bg-blue-600">
            <Globe className="w-4 h-4 mr-2" />
            Results ({totalResults})
          </TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-purple-600">
            <Shield className="w-4 h-4 mr-2" />
            Host Analysis
          </TabsTrigger>
          <TabsTrigger value="guide" className="data-[state=active]:bg-green-600">
            <BookOpen className="w-4 h-4 mr-2" />
            Pro Guide
          </TabsTrigger>
        </TabsList>

        {/* Search Library Tab */}
        <TabsContent value="search" className="space-y-6">
          <div className="space-y-6">
            {searchQueries.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="bg-slate-800/30 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {category.queries.map((item, index) => (
                      <Card
                        key={index}
                        className="bg-slate-700/30 border-slate-600 cursor-pointer hover:bg-slate-700/50 transition-all"
                        onClick={() => {
                          setQuery(item.query)
                          handleSearch(item.query)
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-white">{item.name}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                copyToClipboard(item.query)
                              }}
                              className="text-slate-400 hover:text-cyan-400"
                            >
                              {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            </Button>
                          </div>
                          <p className="text-sm text-slate-300 mb-2">{item.description}</p>
                          <code className="text-xs bg-slate-600/50 px-2 py-1 rounded text-cyan-400 block">
                            {item.query}
                          </code>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          {results.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="text-slate-300">
                Found {totalResults.toLocaleString()} results for "{query}"
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={exportResults}
                  className="border-slate-600 text-slate-300 bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(window.location.href)}
                  className="border-slate-600 text-slate-300"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          )}

          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {results.map((host, index) => (
                <Card
                  key={`${host.ip_str}-${host.port}-${index}`}
                  className="bg-slate-800/30 border-slate-600 cursor-pointer hover:bg-slate-800/50 transition-all"
                  onClick={() => handleHostSelect(host)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-700/50 rounded-lg">{getServiceIcon(host.product)}</div>
                        <div>
                          <h3 className="font-mono text-cyan-400 text-lg">
                            {host.ip_str}:{host.port}
                          </h3>
                          <p className="text-slate-400">
                            {host.product} {host.version && `v${host.version}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {host.vulns && host.vulns.length > 0 && (
                          <Badge variant="destructive" className="bg-red-500/20 text-red-400">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {host.vulns.length} CVE
                          </Badge>
                        )}
                        <Badge variant="outline" className="border-slate-500 text-slate-300">
                          {host.location.country_name}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">
                          {host.location.city}, {host.location.country_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300 truncate">{host.org}</span>
                      </div>
                    </div>

                    {host.title && (
                      <div className="mt-3 p-2 bg-slate-700/30 rounded text-sm text-slate-300 font-mono">
                        {host.title}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Host Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          {selectedHost ? (
            <div className="space-y-6">
              {/* Host Overview */}
              <Card className="bg-slate-800/30 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-cyan-400 flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    Host Analysis: {selectedHost.ip_str}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Basic Info */}
                    <Card className="bg-slate-700/30 border-slate-600 p-4">
                      <h4 className="text-white font-medium mb-3">Basic Information</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-slate-400">IP Address:</span>
                          <span className="ml-2 text-cyan-400 font-mono">{selectedHost.ip_str}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Port:</span>
                          <span className="ml-2 text-white">{selectedHost.port}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Service:</span>
                          <span className="ml-2 text-white">
                            {selectedHost.product} {selectedHost.version}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">Transport:</span>
                          <span className="ml-2 text-white">{selectedHost.transport}</span>
                        </div>
                      </div>
                    </Card>

                    {/* Location */}
                    <Card className="bg-slate-700/30 border-slate-600 p-4">
                      <h4 className="text-white font-medium mb-3">Location & Network</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-slate-400">Country:</span>
                          <span className="ml-2 text-white">{selectedHost.location.country_name}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">City:</span>
                          <span className="ml-2 text-white">{selectedHost.location.city}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Organization:</span>
                          <span className="ml-2 text-white">{selectedHost.org}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">ISP:</span>
                          <span className="ml-2 text-white">{selectedHost.isp}</span>
                        </div>
                      </div>
                    </Card>

                    {/* Security */}
                    <Card className="bg-slate-700/30 border-slate-600 p-4">
                      <h4 className="text-white font-medium mb-3">Security Assessment</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-slate-400">Threat Level:</span>
                          <Badge
                            className={`ml-2 ${getThreatLevel(selectedHost).bg} ${getThreatLevel(selectedHost).color}`}
                          >
                            {getThreatLevel(selectedHost).level.toUpperCase()}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-slate-400">Vulnerabilities:</span>
                          <span className="ml-2 text-white">{selectedHost.vulns ? selectedHost.vulns.length : 0}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">SSL Certificate:</span>
                          <span className="ml-2 text-white">{selectedHost.ssl ? "Yes" : "No"}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Last Seen:</span>
                          <span className="ml-2 text-white">
                            {new Date(selectedHost.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Detailed Analysis */}
                  {selectedHost.title && (
                    <Card className="bg-slate-700/30 border-slate-600 p-4">
                      <h4 className="text-white font-medium mb-3">Service Banner</h4>
                      <pre className="text-sm text-slate-300 bg-slate-800/50 p-3 rounded overflow-x-auto">
                        {selectedHost.title}
                      </pre>
                    </Card>
                  )}

                  {/* Vulnerabilities */}
                  {selectedHost.vulns && selectedHost.vulns.length > 0 && (
                    <Card className="bg-red-900/20 border-red-500/30 p-4">
                      <h4 className="text-red-400 font-medium mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Detected Vulnerabilities
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedHost.vulns.map((cve, index) => (
                          <Badge key={index} variant="destructive" className="bg-red-500/20 text-red-400">
                            {cve}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* SSL Certificate */}
                  {selectedHost.ssl && (
                    <Card className="bg-green-900/20 border-green-500/30 p-4">
                      <h4 className="text-green-400 font-medium mb-3 flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        SSL Certificate
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Subject:</span>
                          <span className="ml-2 text-green-300">{selectedHost.ssl.cert.subject.CN}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Issuer:</span>
                          <span className="ml-2 text-green-300">{selectedHost.ssl.cert.issuer.CN}</span>
                        </div>
                      </div>
                    </Card>
                  )}
                </CardContent>
              </Card>

              {/* CVE Intelligence */}
              {selectedHost.product && (
                <CVEIntelligencePanel product={selectedHost.product} cveIds={selectedHost.vulns} />
              )}
            </div>
          ) : (
            <Card className="bg-slate-800/30 border-slate-600 p-12">
              <div className="text-center">
                <Server className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No Host Selected</h3>
                <p className="text-slate-400">Select a host from the search results to view detailed analysis</p>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Pro Guide Tab */}
        <TabsContent value="guide" className="space-y-6">
          <Card className="bg-slate-800/30 border-slate-600">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Shodan Pro Guide 🧙‍♂️
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search Operators */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  Search Operators
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { operator: "port:", example: "port:80", description: "Search for specific ports" },
                    { operator: "country:", example: "country:US", description: "Filter by country code" },
                    { operator: "city:", example: "city:London", description: "Filter by city name" },
                    { operator: "org:", example: 'org:"Google"', description: "Search by organization" },
                    { operator: "product:", example: "product:Apache", description: "Filter by product/service" },
                    { operator: "version:", example: "version:2.4", description: "Specific software version" },
                    { operator: "hostname:", example: "hostname:example.com", description: "Search by hostname" },
                    { operator: "net:", example: "net:192.168.1.0/24", description: "Search IP ranges" },
                  ].map((item, index) => (
                    <Card key={index} className="bg-slate-700/30 border-slate-600 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-cyan-400 font-bold">{item.operator}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setQuery(item.example)
                            setActiveTab("search")
                          }}
                          className="text-slate-400 hover:text-cyan-400"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-slate-300 mb-1">{item.description}</p>
                      <code className="text-xs bg-slate-600/50 px-2 py-1 rounded text-green-400">{item.example}</code>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Advanced Techniques */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  Advanced Techniques
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      title: "Combining Operators",
                      description: "Use multiple operators together for precise searches",
                      example: 'apache country:US port:80 -title:"Apache2 Ubuntu Default Page"',
                    },
                    {
                      title: "Excluding Results",
                      description: "Use minus (-) to exclude specific terms",
                      example: "nginx -country:CN -port:443",
                    },
                    {
                      title: "Wildcard Searches",
                      description: "Use asterisk (*) for wildcard matching",
                      example: "title:*admin* port:80",
                    },
                    {
                      title: "Date Ranges",
                      description: "Search for recently discovered services",
                      example: "apache after:2024-01-01 before:2024-12-31",
                    },
                  ].map((technique, index) => (
                    <Card key={index} className="bg-slate-700/30 border-slate-600 p-4">
                      <h4 className="text-white font-medium mb-2">{technique.title}</h4>
                      <p className="text-slate-300 text-sm mb-3">{technique.description}</p>
                      <div className="flex items-center justify-between">
                        <code className="text-xs bg-slate-600/50 px-2 py-1 rounded text-cyan-400 flex-1 mr-2">
                          {technique.example}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setQuery(technique.example)
                            handleSearch(technique.example)
                          }}
                          className="text-slate-400 hover:text-cyan-400"
                        >
                          Try It
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Safety Tips */}
              <Card className="bg-amber-900/20 border-amber-500/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-amber-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-400 mb-1">Ethical Usage Guidelines 🛡️</h4>
                      <ul className="text-sm text-amber-300 space-y-1">
                        <li>• Only scan systems you own or have explicit permission to test</li>
                        <li>• Use this tool for educational and defensive security purposes</li>
                        <li>• Respect rate limits and don't overload target systems</li>
                        <li>• Report vulnerabilities responsibly through proper channels</li>
                        <li>• Always comply with local laws and regulations</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
