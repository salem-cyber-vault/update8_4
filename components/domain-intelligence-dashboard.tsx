"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { 
  Search, 
  Globe, 
  Server, 
  Calendar, 
  Users, 
  Shield, 
  ExternalLink, 
  Copy, 
  History, 
  Network, 
  BarChart3, 
  Eye, 
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Building,
  Mail,
  Phone,
  Link,
  Database,
  Zap,
  Crown,
  TrendingUp,
  Share2,
  Archive,
  FileText,
  Download
} from "lucide-react"
import { toast } from "sonner"

interface DomainIntelligenceProps {
  initialDomain?: string
}

export function DomainIntelligenceDashboard({ initialDomain = "" }: DomainIntelligenceProps) {
  const [domain, setDomain] = useState(initialDomain)
  const [loading, setLoading] = useState(false)
  const [safeMode, setSafeMode] = useState(true)
  const [activeTab, setActiveTab] = useState("whois")
  
  // Data states
  const [whoisData, setWhoisData] = useState<any>(null)
  const [relatedData, setRelatedData] = useState<any>(null)
  const [subdomainData, setSubdomainData] = useState<any>(null)
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (searchDomain?: string) => {
    const targetDomain = searchDomain || domain
    if (!targetDomain.trim()) {
      toast.error("Please enter a domain name")
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      // Fetch all domain intelligence data in parallel
      const [whoisRes, relatedRes, subdomainRes, analyticsRes] = await Promise.allSettled([
        fetch(`/api/domain-intelligence/whois?domain=${encodeURIComponent(targetDomain)}`),
        fetch(`/api/domain-intelligence/related-domains?domain=${encodeURIComponent(targetDomain)}&action=reverse-ip`),
        fetch(`/api/domain-intelligence/subdomains?domain=${encodeURIComponent(targetDomain)}`),
        fetch(`/api/domain-intelligence/analytics?domain=${encodeURIComponent(targetDomain)}`)
      ])

      // Process WHOIS data
      if (whoisRes.status === 'fulfilled' && whoisRes.value.ok) {
        const whoisResult = await whoisRes.value.json()
        setWhoisData(whoisResult)
      }

      // Process related domains data
      if (relatedRes.status === 'fulfilled' && relatedRes.value.ok) {
        const relatedResult = await relatedRes.value.json()
        setRelatedData(relatedResult)
      }

      // Process subdomain data
      if (subdomainRes.status === 'fulfilled' && subdomainRes.value.ok) {
        const subdomainResult = await subdomainRes.value.json()
        setSubdomainData(subdomainResult)
      }

      // Process analytics data
      if (analyticsRes.status === 'fulfilled' && analyticsRes.value.ok) {
        const analyticsResult = await analyticsRes.value.json()
        setAnalyticsData(analyticsResult)
      }

      toast.success(`Domain intelligence gathered for ${targetDomain}`)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch domain intelligence'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copied to clipboard`)
    } catch (err) {
      toast.error("Failed to copy to clipboard")
    }
  }

  const openExternalService = (service: string, query: string) => {
    const urls: Record<string, string> = {
      whois: `https://who.is/whois/${query}`,
      wayback: `https://web.archive.org/web/*/${query}`,
      archive: `https://archive.today/${query}`,
      google_cache: `https://webcache.googleusercontent.com/search?q=cache:${query}`,
      bing_cache: `https://www.bing.com/search?q=cache:${query}`,
      yandex_cache: `https://yandexwebcache.net/yandbtm?url=${query}`,
      virustotal: `https://www.virustotal.com/gui/domain/${query}`,
      securitytrails: `https://securitytrails.com/domain/${query}`,
      censys: `https://search.censys.io/hosts?q=${query}`,
      shodan: `https://www.shodan.io/search?query=hostname:${query}`,
      dnsdumpster: `https://dnsdumpster.com/`,
      builtwith: `https://builtwith.com/${query}`,
      similarweb: `https://www.similarweb.com/website/${query}`
    }
    
    if (urls[service]) {
      window.open(urls[service], '_blank', 'noopener,noreferrer')
    }
  }

  const quickSearches = [
    "google.com",
    "github.com", 
    "stackoverflow.com",
    "microsoft.com",
    "apple.com"
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-slate-800/40 to-purple-800/40 border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Globe className="w-8 h-8 text-cyan-400" />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Domain Intelligence Dashboard
            </span>
            <Crown className="w-6 h-6 text-yellow-400" />
          </CardTitle>
          <p className="text-slate-300">
            Comprehensive domain analysis including WHOIS, subdomains, historical data, and technology stack
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Interface */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Enter domain (e.g., example.com)"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="bg-slate-700/30 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            <Button 
              onClick={() => handleSearch()}
              disabled={loading}
              className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Analyze
            </Button>
          </div>

          {/* Quick Search Buttons */}
          <div className="flex gap-2 flex-wrap">
            {quickSearches.map((quickDomain) => (
              <Button
                key={quickDomain}
                variant="outline"
                size="sm"
                onClick={() => {
                  setDomain(quickDomain)
                  handleSearch(quickDomain)
                }}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                {quickDomain}
              </Button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                checked={safeMode}
                onCheckedChange={setSafeMode}
                id="safe-mode"
              />
              <label htmlFor="safe-mode" className="text-sm text-slate-300">
                Safe Mode (filter sensitive content)
              </label>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDomain("")
                  setWhoisData(null)
                  setRelatedData(null)
                  setSubdomainData(null)
                  setAnalyticsData(null)
                  setError(null)
                }}
                className="border-slate-600 text-slate-300"
              >
                Clear
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(domain, "Domain")}
                className="border-slate-600 text-slate-300"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-500 bg-red-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-400">
              <XCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      {(whoisData || relatedData || subdomainData || analyticsData) && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/30 border-slate-700">
            <TabsTrigger value="whois" className="data-[state=active]:bg-cyan-600">
              <Server className="w-4 h-4 mr-2" />
              WHOIS
            </TabsTrigger>
            <TabsTrigger value="related" className="data-[state=active]:bg-purple-600">
              <Network className="w-4 h-4 mr-2" />
              Related
            </TabsTrigger>
            <TabsTrigger value="subdomains" className="data-[state=active]:bg-orange-600">
              <Database className="w-4 h-4 mr-2" />
              Subdomains
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-green-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="historical" className="data-[state=active]:bg-blue-600">
              <Archive className="w-4 h-4 mr-2" />
              Historical
            </TabsTrigger>
          </TabsList>

          {/* WHOIS Tab */}
          <TabsContent value="whois" className="space-y-4">
            {whoisData && (
              <WhoisPanel 
                data={whoisData} 
                domain={domain}
                onCopy={copyToClipboard}
                onOpenExternal={openExternalService}
              />
            )}
          </TabsContent>

          {/* Related Domains Tab */}
          <TabsContent value="related" className="space-y-4">
            {relatedData && (
              <RelatedDomainsPanel 
                data={relatedData} 
                domain={domain}
                onCopy={copyToClipboard}
                onOpenExternal={openExternalService}
              />
            )}
          </TabsContent>

          {/* Subdomains Tab */}
          <TabsContent value="subdomains" className="space-y-4">
            {subdomainData && (
              <SubdomainsPanel 
                data={subdomainData} 
                domain={domain}
                onCopy={copyToClipboard}
                onOpenExternal={openExternalService}
              />
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            {analyticsData && (
              <AnalyticsPanel 
                data={analyticsData} 
                domain={domain}
                onCopy={copyToClipboard}
                onOpenExternal={openExternalService}
              />
            )}
          </TabsContent>

          {/* Historical Tab */}
          <TabsContent value="historical" className="space-y-4">
            <HistoricalPanel 
              domain={domain}
              onCopy={copyToClipboard}
              onOpenExternal={openExternalService}
            />
          </TabsContent>
        </Tabs>
      )}

      {/* Legal Disclaimer */}
      <Card className="bg-slate-800/20 border-slate-700">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2 text-xs text-slate-400">
            <AlertTriangle className="w-4 h-4 mt-0.5 text-yellow-400" />
            <div>
              <p className="font-medium text-slate-300 mb-1">Legal & Ethical Use Notice</p>
              <p>
                This tool is for legitimate security research, threat intelligence, and authorized penetration testing only. 
                Users must comply with applicable laws and obtain proper authorization before analyzing domains they don't own. 
                Salem Cyber Vault is not responsible for misuse of this tool.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Individual panel components will be imported from separate files
import { WhoisPanel } from "./whois-panel"
import { RelatedDomainsPanel } from "./related-domains-panel" 
import { SubdomainsPanel } from "./subdomains-panel"
import { AnalyticsPanel } from "./analytics-panel"
import { HistoricalPanel } from "./historical-panel"
