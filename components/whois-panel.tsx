"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  Server, 
  Calendar, 
  Users, 
  Building, 
  Mail, 
  Phone, 
  MapPin,
  ExternalLink, 
  Copy, 
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react"

interface WhoisPanelProps {
  data: any
  domain: string
  onCopy: (text: string, label: string) => void
  onOpenExternal: (service: string, query: string) => void
}

export function WhoisPanel({ data, domain, onCopy, onOpenExternal }: WhoisPanelProps) {
  const whoisInfo = data.fallback || data.WhoisRecord || data

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not available'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    if (!expiryDate) return null
    try {
      const expiry = new Date(expiryDate)
      const now = new Date()
      const diffTime = expiry.getTime() - now.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays
    } catch {
      return null
    }
  }

  const daysUntilExpiry = getDaysUntilExpiry(whoisInfo.expiresDate || whoisInfo.expiry_date)

  const getExpiryStatus = (days: number | null) => {
    if (days === null) return { status: 'unknown', color: 'gray', text: 'Unknown' }
    if (days < 0) return { status: 'expired', color: 'red', text: 'Expired' }
    if (days < 30) return { status: 'warning', color: 'orange', text: 'Expiring Soon' }
    if (days < 90) return { status: 'caution', color: 'yellow', text: 'Monitor' }
    return { status: 'good', color: 'green', text: 'Active' }
  }

  const expiryStatus = getExpiryStatus(daysUntilExpiry)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Basic Information */}
      <Card className="bg-slate-800/30 border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <Server className="w-5 h-5" />
            Domain Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm text-slate-400">Domain Name</label>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-white font-mono">
                  {whoisInfo.domainName || domain}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onCopy(whoisInfo.domainName || domain, "Domain")}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-400">Registrar</label>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-white">
                  {whoisInfo.registrar || whoisInfo.registrarName || 'Not available'}
                </span>
                {whoisInfo.registrar && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onCopy(whoisInfo.registrar, "Registrar")}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-400">Status</label>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {(whoisInfo.status || ['Active']).map((status: string, index: number) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs border-slate-500 text-slate-300"
                  >
                    {status}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date Information */}
      <Card className="bg-slate-800/30 border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-400">
            <Calendar className="w-5 h-5" />
            Important Dates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm text-slate-400">Created Date</label>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4 text-green-400" />
                <span className="text-white">
                  {formatDate(whoisInfo.createdDate || whoisInfo.creation_date)}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-400">Updated Date</label>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-white">
                  {formatDate(whoisInfo.updatedDate || whoisInfo.updated_date)}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-400">Expires Date</label>
              <div className="flex items-center gap-2 mt-1">
                {expiryStatus.status === 'expired' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                {expiryStatus.status === 'warning' && <AlertTriangle className="w-4 h-4 text-orange-400" />}
                {expiryStatus.status === 'good' && <CheckCircle className="w-4 h-4 text-green-400" />}
                {expiryStatus.status === 'unknown' && <Info className="w-4 h-4 text-gray-400" />}
                <span className="text-white">
                  {formatDate(whoisInfo.expiresDate || whoisInfo.expiry_date)}
                </span>
                {daysUntilExpiry !== null && (
                  <Badge 
                    variant="outline"
                    className={`text-xs border-${expiryStatus.color}-500 text-${expiryStatus.color}-400`}
                  >
                    {daysUntilExpiry > 0 ? `${daysUntilExpiry} days` : 'Expired'}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="bg-slate-800/30 border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-400">
            <Users className="w-5 h-5" />
            Registrant Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm text-slate-400">Organization</label>
              <div className="flex items-center gap-2 mt-1">
                <Building className="w-4 h-4 text-blue-400" />
                <span className="text-white">
                  {whoisInfo.registrantOrganization || whoisInfo.registrant?.organization || 'Privacy Protected'}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-400">Name</label>
              <div className="flex items-center gap-2 mt-1">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="text-white">
                  {whoisInfo.registrantName || whoisInfo.registrant?.name || 'Privacy Protected'}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-400">Email</label>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-green-400" />
                <span className="text-white">
                  {whoisInfo.registrantEmail || whoisInfo.registrant?.email || 'Privacy Protected'}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-400">Location</label>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4 text-red-400" />
                <span className="text-white">
                  {[
                    whoisInfo.registrantCity || whoisInfo.registrant?.city,
                    whoisInfo.registrantState || whoisInfo.registrant?.state,
                    whoisInfo.registrantCountry || whoisInfo.registrant?.country
                  ].filter(Boolean).join(', ') || 'Privacy Protected'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Name Servers & Technical Details */}
      <Card className="bg-slate-800/30 border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">
            <Shield className="w-5 h-5" />
            Technical Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Name Servers</label>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {(whoisInfo.nameServers || ['ns1.example.com', 'ns2.example.com']).map((ns: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <Server className="w-3 h-3 text-cyan-400" />
                    <span className="text-white font-mono text-sm">{ns}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onCopy(ns, "Name Server")}
                      className="h-4 w-4 p-0"
                    >
                      <Copy className="w-2 h-2" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <Separator className="bg-slate-600" />

          <div>
            <label className="text-sm text-slate-400">DNSSEC</label>
            <div className="flex items-center gap-2 mt-1">
              <Shield className="w-4 h-4 text-purple-400" />
              <span className="text-white">
                {whoisInfo.dnssec || 'Not Configured'}
              </span>
              <Badge 
                variant="outline"
                className={`text-xs ${
                  whoisInfo.dnssec === 'signed' || whoisInfo.dnssec === 'signedDelegation'
                    ? 'border-green-500 text-green-400'
                    : 'border-orange-500 text-orange-400'
                }`}
              >
                {whoisInfo.dnssec === 'signed' || whoisInfo.dnssec === 'signedDelegation' ? 'Secure' : 'Unsigned'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* External Services */}
      <Card className="bg-slate-800/30 border-slate-600 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-400">
            <ExternalLink className="w-5 h-5" />
            External WHOIS Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenExternal('whois', domain)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              who.is
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
              onClick={() => onOpenExternal('virustotal', domain)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              VirusTotal
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenExternal('censys', domain)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              Censys
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}