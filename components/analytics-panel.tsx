"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart3, 
  TrendingUp, 
  Globe, 
  Users,
  ExternalLink, 
  Copy, 
  Share2,
  Building,
  Crown,
  Zap,
  Code,
  Shield,
  Search,
  Link
} from "lucide-react"

interface AnalyticsPanelProps {
  data: any
  domain: string
  onCopy: (text: string, label: string) => void
  onOpenExternal: (service: string, query: string) => void
}

export function AnalyticsPanel({ data, domain, onCopy, onOpenExternal }: AnalyticsPanelProps) {
  const {
    traffic = {},
    technologies = [],
    socialMedia = {},
    seo = {},
    competitors = [],
    relatedByTech = []
  } = data

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getTechCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'CDN': 'text-blue-400 border-blue-400',
      'Analytics': 'text-green-400 border-green-400',
      'JavaScript Frameworks': 'text-yellow-400 border-yellow-400',
      'Web Server': 'text-red-400 border-red-400',
      'CMS': 'text-purple-400 border-purple-400',
      'E-commerce': 'text-pink-400 border-pink-400',
      'Security': 'text-orange-400 border-orange-400'
    }
    return colors[category] || 'text-cyan-400 border-cyan-400'
  }

  const getSEOScore = (value: number, max: number) => {
    return Math.round((value / max) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Traffic Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/30 border-slate-600">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-cyan-400 text-sm">
              <Globe className="w-4 h-4" />
              Global Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              #{formatNumber(traffic.globalRank || 0)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Worldwide ranking
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/30 border-slate-600">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-green-400 text-sm">
              <Users className="w-4 h-4" />
              Monthly Visits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatNumber(traffic.monthlyVisits || 0)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Estimated monthly visitors
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/30 border-slate-600">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-purple-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              Bounce Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {Math.round((traffic.bounceRate || 0) * 100)}%
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Visitor retention
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technology Stack */}
      <Card className="bg-slate-800/30 border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-400">
            <Code className="w-5 h-5" />
            Technology Stack
            <Badge variant="outline" className="ml-auto text-orange-400 border-orange-400">
              {technologies.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {technologies.map((tech: any, index: number) => (
                <div key={index} className="p-3 rounded bg-slate-700/30 border border-slate-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-orange-400" />
                      <span className="text-white font-medium">{tech.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onCopy(tech.name, "Technology")}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(`https://builtwith.com/technologies/${tech.category}`, '_blank')}
                        className="h-6 w-6 p-0"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getTechCategoryColor(tech.category)}`}
                    >
                      {tech.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs border-slate-500 text-slate-300">
                      {tech.confidence} Confidence
                    </Badge>
                    <div className="text-xs text-slate-400">
                      {tech.firstDetected} - {tech.lastDetected}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* SEO Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/30 border-slate-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <Search className="w-5 h-5" />
              SEO Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Domain Authority</span>
                <span className="text-white">{seo.domainAuthority || 0}/100</span>
              </div>
              <Progress value={seo.domainAuthority || 0} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Page Authority</span>
                <span className="text-white">{seo.pageAuthority || 0}/100</span>
              </div>
              <Progress value={seo.pageAuthority || 0} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <div className="text-lg font-bold text-white">
                  {formatNumber(seo.backlinks || 0)}
                </div>
                <div className="text-xs text-slate-400">Backlinks</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  {formatNumber(seo.referringDomains || 0)}
                </div>
                <div className="text-xs text-slate-400">Referring Domains</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  {formatNumber(seo.organicKeywords || 0)}
                </div>
                <div className="text-xs text-slate-400">Organic Keywords</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  #{formatNumber(traffic.countryRank || 0)}
                </div>
                <div className="text-xs text-slate-400">Country Rank</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Presence */}
        <Card className="bg-slate-800/30 border-slate-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-pink-400">
              <Share2 className="w-5 h-5" />
              Social Media Presence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(socialMedia).map(([platform, data]: [string, any]) => (
              <div key={platform} className="flex items-center justify-between p-2 rounded bg-slate-700/30 border border-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                    {platform[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium capitalize">{platform}</div>
                    <div className="text-xs text-slate-400">
                      {formatNumber(data.followers || 0)} followers
                      {data.verified && <Crown className="w-3 h-3 inline ml-1 text-yellow-400" />}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onCopy(data.url, `${platform} URL`)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(data.url, '_blank')}
                    className="h-6 w-6 p-0"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Competitors */}
      <Card className="bg-slate-800/30 border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <Building className="w-5 h-5" />
            Competitors & Similar Sites
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {competitors.map((competitor: string, index: number) => (
              <div key={index} className="flex items-center justify-between p-2 rounded bg-slate-700/30 border border-slate-600">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-red-400" />
                  <span className="text-white font-mono text-sm">{competitor}</span>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onCopy(competitor, "Competitor")}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(`https://${competitor}`, '_blank')}
                    className="h-6 w-6 p-0"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Related by Technology */}
      <Card className="bg-slate-800/30 border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-400">
            <Link className="w-5 h-5" />
            Related Domains by Technology
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48">
            <div className="space-y-3">
              {relatedByTech.map((item: any, index: number) => (
                <div key={index} className="p-3 rounded bg-slate-700/30 border border-slate-600">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-medium">{item.technology}</span>
                  </div>
                  <div className="space-y-1">
                    {item.relatedDomains.map((relatedDomain: string, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-slate-300 font-mono">{relatedDomain}</span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onCopy(relatedDomain, "Related Domain")}
                            className="h-4 w-4 p-0"
                          >
                            <Copy className="w-2 h-2" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(`https://${relatedDomain}`, '_blank')}
                            className="h-4 w-4 p-0"
                          >
                            <ExternalLink className="w-2 h-2" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* External Services */}
      <Card className="bg-slate-800/30 border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">
            <ExternalLink className="w-5 h-5" />
            External Analytics Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenExternal('similarweb', domain)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              SimilarWeb
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenExternal('builtwith', domain)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              BuiltWith
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://www.alexa.com/siteinfo/${domain}`, '_blank')}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              Alexa
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://www.wappalyzer.com/lookup/${domain}`, '_blank')}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              Wappalyzer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
