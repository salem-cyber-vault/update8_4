"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Network, 
  Server, 
  Globe, 
  Link,
  ExternalLink, 
  Copy, 
  MapPin,
  Calendar,
  Users,
  Building
} from "lucide-react"

interface RelatedDomainsPanelProps {
  data: any
  domain: string
  onCopy: (text: string, label: string) => void
  onOpenExternal: (service: string, query: string) => void
}

export function RelatedDomainsPanel({ data, domain, onCopy, onOpenExternal }: RelatedDomainsPanelProps) {
  const {
    reverseIP = [],
    relatedDomains = [],
    dnsNeighbors = [],
    ipHistory = []
  } = data

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Reverse IP Lookup */}
      <Card className="bg-slate-800/30 border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <Server className="w-5 h-5" />
            Reverse IP Lookup
            <Badge variant="outline" className="ml-auto text-cyan-400 border-cyan-400">
              {reverseIP.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {reverseIP.length > 0 ? (
                reverseIP.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded bg-slate-700/30 border border-slate-600">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      <span className="text-white font-mono text-sm">{item.name || item.domain}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onCopy(item.name || item.domain, "Domain")}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onOpenExternal('whois', item.name || item.domain)}
                        className="h-6 w-6 p-0"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-400 py-8">
                  <Server className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No reverse IP data available</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* DNS Neighbors */}
      <Card className="bg-slate-800/30 border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-400">
            <Network className="w-5 h-5" />
            DNS Neighbors
            <Badge variant="outline" className="ml-auto text-purple-400 border-purple-400">
              {dnsNeighbors.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {dnsNeighbors.length > 0 ? (
                dnsNeighbors.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded bg-slate-700/30 border border-slate-600">
                    <div className="flex items-center gap-2">
                      <Network className="w-4 h-4 text-purple-400" />
                      <span className="text-white font-mono text-sm">{item.name || item.domain}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onCopy(item.name || item.domain, "Neighbor Domain")}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onOpenExternal('shodan', item.name || item.domain)}
                        className="h-6 w-6 p-0"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-400 py-8">
                  <Network className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No DNS neighbors found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Related Domains by WHOIS */}
      <Card className="bg-slate-800/30 border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-400">
            <Link className="w-5 h-5" />
            Related by WHOIS
            <Badge variant="outline" className="ml-auto text-orange-400 border-orange-400">
              {relatedDomains.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {relatedDomains.length > 0 ? (
                relatedDomains.map((item: any, index: number) => (
                  <div key={index} className="p-2 rounded bg-slate-700/30 border border-slate-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-orange-400" />
                        <span className="text-white font-mono text-sm">{item.domain}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onCopy(item.domain, "Related Domain")}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onOpenExternal('whois', item.domain)}
                          className="h-6 w-6 p-0"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-1">
                      <Badge variant="outline" className="text-xs border-slate-500 text-slate-300">
                        {item.relation}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-400 py-8">
                  <Link className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No related domains found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* IP History */}
      <Card className="bg-slate-800/30 border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">
            <Calendar className="w-5 h-5" />
            IP History
            <Badge variant="outline" className="ml-auto text-green-400 border-green-400">
              {ipHistory.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {ipHistory.length > 0 ? (
                ipHistory.map((item: any, index: number) => (
                  <div key={index} className="p-2 rounded bg-slate-700/30 border border-slate-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-green-400" />
                        <span className="text-white font-mono text-sm">{item.ip}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onCopy(item.ip, "IP Address")}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onOpenExternal('shodan', `ip:${item.ip}`)}
                          className="h-6 w-6 p-0"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{item.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-400 py-8">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No IP history available</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* External Services */}
      <Card className="bg-slate-800/30 border-slate-600 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-400">
            <ExternalLink className="w-5 h-5" />
            External Lookup Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://viewdns.info/reverseip/?host=${domain}`, '_blank')}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              ViewDNS
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://dnslytics.com/domain/${domain}`, '_blank')}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              DNSlytics
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://securitytrails.com/domain/${domain}/history/dns`, '_blank')}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              SecurityTrails
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://domainiq.com/${domain}`, '_blank')}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              DomainIQ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
