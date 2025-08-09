"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Globe, 
  MapPin, 
  Building, 
  Wifi, 
  Shield, 
  Copy, 
  ExternalLink, 
  Loader2, 
  AlertTriangle,
  CheckCircle,
  Eye,
  Smartphone,
  Server,
  Search
} from "lucide-react"

interface IPIntelligence {
  ip: string
  city?: string
  region?: string
  country?: string
  country_code?: string
  latitude?: number
  longitude?: number
  timezone?: string
  asn?: string
  org?: string
  isp?: string
  proxy?: boolean
  hosting?: boolean
  tor?: boolean
  mobile?: boolean
  success?: boolean
  provider: string
}

interface Props {
  initialIP?: string
}

export function IPIntelligencePanel({ initialIP = "" }: Props) {
  const [ip, setIP] = useState(initialIP)
  const [provider, setProvider] = useState("auto")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<IPIntelligence | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleLookup = async () => {
    if (!ip.trim()) {
      setError("Please enter an IP address")
      return
    }

    setLoading(true)
    setError(null)
    setData(null)

    try {
      const response = await fetch(`/api/ip-lookup?ip=${encodeURIComponent(ip.trim())}&source=${provider}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here
    })
  }

  const openInProvider = () => {
    if (!data) return
    
    const urls = {
      "ip-api.com": `https://ip-api.com/#${data.ip}`,
      "ipwho.is": `https://ipwho.is/${data.ip}`,
      "ipinfo.io": `https://ipinfo.io/${data.ip}`,
      "ipgeolocation.io": `https://ipgeolocation.io/ip-location/${data.ip}`
    }
    
    const url = urls[data.provider as keyof typeof urls]
    if (url) {
      window.open(url, '_blank')
    }
  }

  const getMapUrl = () => {
    if (!data?.latitude || !data?.longitude) return null
    return `https://www.openstreetmap.org/?mlat=${data.latitude}&mlon=${data.longitude}&zoom=10`
  }

  const getRiskLevel = () => {
    if (!data) return null
    
    let riskScore = 0
    if (data.proxy) riskScore += 2
    if (data.tor) riskScore += 3
    if (data.hosting) riskScore += 1
    
    if (riskScore >= 3) return { level: "High", color: "text-red-400" }
    if (riskScore >= 1) return { level: "Medium", color: "text-yellow-400" }
    return { level: "Low", color: "text-green-400" }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLookup()
    }
  }

  return (
    <div className="space-y-6">
      {/* Query Interface */}
      <Card className="bg-slate-800/30 border-slate-600 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            IP Intelligence Lookup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Enter IP address (e.g., 8.8.8.8)"
                value={ip}
                onChange={(e) => setIP(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-slate-700/30 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger className="w-48 bg-slate-700/30 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="auto">Auto (Best Results)</SelectItem>
                <SelectItem value="ip-api">ip-api.com</SelectItem>
                <SelectItem value="ipwho">ipwho.is</SelectItem>
                <SelectItem value="ipinfo">ipinfo.io</SelectItem>
                <SelectItem value="ipgeolocation">ipgeolocation.io</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handleLookup}
              disabled={loading}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Lookup
            </Button>
          </div>

          {/* Quick IP Examples */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIP("8.8.8.8")}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              8.8.8.8 (Google DNS)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIP("1.1.1.1")}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              1.1.1.1 (Cloudflare)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIP("208.67.222.222")}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              208.67.222.222 (OpenDNS)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert className="border-red-500/50 bg-red-500/10">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-400">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Results Display */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card className="bg-slate-800/30 border-slate-600 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location Details
                </div>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {data.provider}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-slate-400">IP Address</label>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono">{data.ip}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(data.ip)}
                      className="h-6 w-6 p-0 hover:bg-slate-700"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-slate-400">Country</label>
                  <div className="text-white">{data.country} ({data.country_code})</div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-slate-400">Region</label>
                  <div className="text-white">{data.region || "Unknown"}</div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-slate-400">City</label>
                  <div className="text-white">{data.city || "Unknown"}</div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-slate-400">Coordinates</label>
                  <div className="text-white font-mono">
                    {data.latitude && data.longitude 
                      ? `${data.latitude}, ${data.longitude}`
                      : "Unknown"
                    }
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-slate-400">Timezone</label>
                  <div className="text-white">{data.timezone || "Unknown"}</div>
                </div>
              </div>

              {/* Map Link */}
              {getMapUrl() && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(getMapUrl()!, '_blank')}
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  View on Map
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Network Information */}
          <Card className="bg-slate-800/30 border-slate-600 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-orange-400 flex items-center gap-2">
                <Wifi className="w-5 h-5" />
                Network & Organization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-sm text-slate-400">ISP</label>
                  <div className="flex items-center gap-2">
                    <span className="text-white">{data.isp || "Unknown"}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(data.isp || "")}
                      className="h-6 w-6 p-0 hover:bg-slate-700"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-slate-400">Organization</label>
                  <div className="text-white">{data.org || "Unknown"}</div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-slate-400">ASN</label>
                  <div className="text-white font-mono">{data.asn || "Unknown"}</div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="border-t border-slate-600 pt-4">
                <label className="text-sm text-slate-400 mb-3 block">Security Assessment</label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Risk Level</span>
                    <span className={`text-sm font-semibold ${getRiskLevel()?.color}`}>
                      {getRiskLevel()?.level}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <Eye className={`w-4 h-4 ${data.proxy ? 'text-red-400' : 'text-green-400'}`} />
                      <span className="text-sm text-slate-300">Proxy</span>
                      <Badge variant={data.proxy ? "destructive" : "secondary"} className="text-xs">
                        {data.proxy ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className={`w-4 h-4 ${data.tor ? 'text-red-400' : 'text-green-400'}`} />
                      <span className="text-sm text-slate-300">Tor</span>
                      <Badge variant={data.tor ? "destructive" : "secondary"} className="text-xs">
                        {data.tor ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Server className={`w-4 h-4 ${data.hosting ? 'text-yellow-400' : 'text-green-400'}`} />
                      <span className="text-sm text-slate-300">Hosting</span>
                      <Badge variant={data.hosting ? "outline" : "secondary"} className="text-xs">
                        {data.hosting ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Smartphone className={`w-4 h-4 ${data.mobile ? 'text-blue-400' : 'text-slate-400'}`} />
                      <span className="text-sm text-slate-300">Mobile</span>
                      <Badge variant={data.mobile ? "outline" : "secondary"} className="text-xs">
                        {data.mobile ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Action Buttons */}
      {data && (
        <Card className="bg-slate-800/30 border-slate-600 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex gap-3 flex-wrap">
              <Button
                variant="outline"
                onClick={openInProvider}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in {data.provider}
              </Button>
              <Button
                variant="outline"
                onClick={() => copyToClipboard(JSON.stringify(data, null, 2))}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy JSON Data
              </Button>
              <Button
                variant="outline"
                onClick={() => copyToClipboard(`${data.city}, ${data.region}, ${data.country}`)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Copy Location
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}