"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Database, 
  Server, 
  Shield, 
  Calendar,
  ExternalLink, 
  Copy, 
  Search,
  FileText,
  Eye,
  History
} from "lucide-react"

interface SubdomainsPanelProps {
  data: any
  domain: string
  onCopy: (text: string, label: string) => void
  onOpenExternal: (service: string, query: string) => void
}

export function SubdomainsPanel({ data, domain, onCopy, onOpenExternal }: SubdomainsPanelProps) {
  const {
    subdomains = [],
    certificates = [],
    passiveDns = [],
    dnsHistory = [],
    totalSubdomains = 0
  } = data

  const allSubdomains = [
    ...subdomains.map((s: any) => ({ ...s, type: 'subdomain' })),
    ...certificates.map((c: any) => ({ ...c, type: 'certificate' })),
    ...passiveDns.map((p: any) => ({ ...p, type: 'passive' }))
  ]

  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      'SecurityTrails': 'text-blue-400 border-blue-400',
      'crt.sh': 'text-green-400 border-green-400',
      'DNSDumpster': 'text-purple-400 border-purple-400',
      'Fallback': 'text-gray-400 border-gray-400'
    }
    return colors[source] || 'text-cyan-400 border-cyan-400'
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'certificate': return <FileText className="w-4 h-4 text-green-400" />
      case 'passive': return <Eye className="w-4 h-4 text-purple-400" />
      default: return <Database className="w-4 h-4 text-cyan-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/30 border-slate-600">
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{totalSubdomains}</div>
              <div className="text-sm text-slate-400">Total Found</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/30 border-slate-600">
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{subdomains.length}</div>
              <div className="text-sm text-slate-400">Active Subdomains</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/30 border-slate-600">
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{certificates.length}</div>
              <div className="text-sm text-slate-400">Certificate Logs</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/30 border-slate-600">
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{passiveDns.length}</div>
              <div className="text-sm text-slate-400">Passive DNS</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subdomain Data */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/30 border-slate-700">
          <TabsTrigger value="all">All ({allSubdomains.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({subdomains.length})</TabsTrigger>
          <TabsTrigger value="certificates">Certificates ({certificates.length})</TabsTrigger>
          <TabsTrigger value="passive">Passive DNS ({passiveDns.length})</TabsTrigger>
        </TabsList>

        {/* All Subdomains */}
        <TabsContent value="all" className="space-y-4">
          <Card className="bg-slate-800/30 border-slate-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-400">
                <Database className="w-5 h-5" />
                All Discovered Subdomains
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {allSubdomains.length > 0 ? (
                    allSubdomains.map((item: any, index: number) => (
                      <div key={index} className="p-3 rounded bg-slate-700/30 border border-slate-600">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(item.type)}
                            <span className="text-white font-mono text-sm">{item.subdomain}</span>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onCopy(item.subdomain, "Subdomain")}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(`https://${item.subdomain}`, '_blank')}
                              className="h-6 w-6 p-0"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getSourceColor(item.source)}`}
                          >
                            {item.source}
                          </Badge>
                          {item.ip && (
                            <Badge variant="outline" className="text-xs border-slate-500 text-slate-300">
                              {item.ip}
                            </Badge>
                          )}
                          {item.firstSeen && (
                            <Badge variant="outline" className="text-xs border-slate-500 text-slate-300">
                              First: {item.firstSeen}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-slate-400 py-8">
                      <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No subdomains discovered</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Subdomains */}
        <TabsContent value="active" className="space-y-4">
          <Card className="bg-slate-800/30 border-slate-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Server className="w-5 h-5" />
                Active Subdomains
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {subdomains.map((item: any, index: number) => (
                    <div key={index} className="p-3 rounded bg-slate-700/30 border border-slate-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Server className="w-4 h-4 text-blue-400" />
                          <span className="text-white font-mono text-sm">{item.subdomain}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onCopy(item.subdomain, "Subdomain")}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onOpenExternal('shodan', `hostname:${item.subdomain}`)}
                            className="h-6 w-6 p-0"
                          >
                            <Search className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(`https://${item.subdomain}`, '_blank')}
                            className="h-6 w-6 p-0"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getSourceColor(item.source)}`}
                        >
                          {item.source}
                        </Badge>
                        <div className="text-xs text-slate-400">
                          {item.firstSeen} - {item.lastSeen}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificate Transparency */}
        <TabsContent value="certificates" className="space-y-4">
          <Card className="bg-slate-800/30 border-slate-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <FileText className="w-5 h-5" />
                Certificate Transparency Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {certificates.map((item: any, index: number) => (
                    <div key={index} className="p-3 rounded bg-slate-700/30 border border-slate-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-green-400" />
                          <span className="text-white font-mono text-sm">{item.subdomain}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onCopy(item.subdomain, "Certificate Domain")}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(`https://crt.sh/?q=${item.subdomain}`, '_blank')}
                            className="h-6 w-6 p-0"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs border-green-500 text-green-400">
                          {item.issuer || 'Certificate Authority'}
                        </Badge>
                        <div className="text-xs text-slate-400">
                          Valid: {item.validFrom} - {item.validTo}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Passive DNS */}
        <TabsContent value="passive" className="space-y-4">
          <Card className="bg-slate-800/30 border-slate-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Eye className="w-5 h-5" />
                Passive DNS Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {passiveDns.map((item: any, index: number) => (
                    <div key={index} className="p-3 rounded bg-slate-700/30 border border-slate-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-purple-400" />
                          <span className="text-white font-mono text-sm">{item.subdomain}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onCopy(item.subdomain, "Passive DNS Domain")}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onCopy(item.ip, "IP Address")}
                            className="h-6 w-6 p-0"
                          >
                            <Server className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs border-purple-500 text-purple-400">
                          {item.type} Record
                        </Badge>
                        <Badge variant="outline" className="text-xs border-slate-500 text-slate-300">
                          {item.ip}
                        </Badge>
                        <div className="text-xs text-slate-400">
                          First seen: {item.firstSeen}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* External Services */}
      <Card className="bg-slate-800/30 border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-400">
            <ExternalLink className="w-5 h-5" />
            External Subdomain Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://crt.sh/?q=${domain}`, '_blank')}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              crt.sh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenExternal('dnsdumpster', domain)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              DNSDumpster
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenExternal('securitytrails', domain)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              SecurityTrails
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://subdomainfinder.c99.nl/scans/${domain}`, '_blank')}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              C99.nl
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}