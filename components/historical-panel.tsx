"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Archive, 
  Clock, 
  Camera, 
  FileText,
  ExternalLink, 
  Download,
  Globe,
  Search,
  Eye,
  Calendar
} from "lucide-react"

interface HistoricalPanelProps {
  domain: string
  onCopy: (text: string, label: string) => void
  onOpenExternal: (service: string, query: string) => void
}

export function HistoricalPanel({ domain, onCopy, onOpenExternal }: HistoricalPanelProps) {
  const archiveServices = [
    {
      name: "Wayback Machine",
      description: "Internet Archive snapshots dating back to 1996",
      icon: <Archive className="w-5 h-5 text-blue-400" />,
      url: `https://web.archive.org/web/*/${domain}`,
      searchUrl: `https://web.archive.org/web/20241201000000*/${domain}`,
      color: "blue"
    },
    {
      name: "Archive.today",
      description: "More recent snapshots and cached pages",
      icon: <Camera className="w-5 h-5 text-green-400" />,
      url: `https://archive.today/${domain}`,
      searchUrl: `https://archive.today/newest/${domain}`,
      color: "green"
    },
    {
      name: "Google Cache",
      description: "Google's cached version of the page",
      icon: <Search className="w-5 h-5 text-red-400" />,
      url: `https://webcache.googleusercontent.com/search?q=cache:${domain}`,
      searchUrl: `https://webcache.googleusercontent.com/search?q=cache:${domain}`,
      color: "red"
    },
    {
      name: "Bing Cache",
      description: "Microsoft Bing's cached version",
      icon: <Globe className="w-5 h-5 text-cyan-400" />,
      url: `https://www.bing.com/search?q=cache:${domain}`,
      searchUrl: `https://www.bing.com/search?q=cache:${domain}`,
      color: "cyan"
    },
    {
      name: "Yandex Cache",
      description: "Yandex search engine cached pages",
      icon: <FileText className="w-5 h-5 text-yellow-400" />,
      url: `https://yandexwebcache.net/yandbtm?url=${domain}`,
      searchUrl: `https://yandexwebcache.net/yandbtm?url=${domain}`,
      color: "yellow"
    }
  ]

  const timelineYears = [
    { year: 2024, snapshots: Math.floor(Math.random() * 50) + 10 },
    { year: 2023, snapshots: Math.floor(Math.random() * 80) + 20 },
    { year: 2022, snapshots: Math.floor(Math.random() * 60) + 15 },
    { year: 2021, snapshots: Math.floor(Math.random() * 70) + 25 },
    { year: 2020, snapshots: Math.floor(Math.random() * 40) + 10 },
    { year: 2019, snapshots: Math.floor(Math.random() * 30) + 5 },
    { year: 2018, snapshots: Math.floor(Math.random() * 25) + 3 }
  ]

  const quickDates = [
    { label: "Latest", date: "20241201", description: "Most recent snapshot" },
    { label: "6 Months Ago", date: "20240601", description: "Mid-2024 version" },
    { label: "1 Year Ago", date: "20231201", description: "End of 2023" },
    { label: "2 Years Ago", date: "20221201", description: "End of 2022" },
    { label: "5 Years Ago", date: "20191201", description: "Historical version" }
  ]

  return (
    <div className="space-y-6">
      {/* Archive Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {archiveServices.map((service, index) => (
          <Card key={index} className="bg-slate-800/30 border-slate-600 hover:border-slate-500 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                {service.icon}
                {service.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-slate-400">{service.description}</p>
              
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  onClick={() => window.open(service.url, '_blank', 'noopener,noreferrer')}
                  className={`bg-${service.color}-600 hover:bg-${service.color}-700 text-white`}
                >
                  <Eye className="w-3 h-3 mr-2" />
                  View Archive
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCopy(service.url, `${service.name} URL`)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Time Travel */}
      <Card className="bg-slate-800/30 border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-400">
            <Clock className="w-5 h-5" />
            Quick Time Travel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {quickDates.map((item, index) => (
              <div key={index} className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`https://web.archive.org/web/${item.date}000000*/${domain}`, '_blank')}
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 mb-2"
                >
                  <Calendar className="w-3 h-3 mr-2" />
                  {item.label}
                </Button>
                <p className="text-xs text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Snapshot Timeline */}
      <Card className="bg-slate-800/30 border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <Archive className="w-5 h-5" />
            Historical Snapshot Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timelineYears.map((year, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-16 text-right">
                  <span className="text-white font-bold">{year.year}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-2 bg-slate-700 rounded-full flex-1 relative overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                        style={{ width: `${Math.min(year.snapshots, 100)}%` }}
                      />
                    </div>
                    <Badge variant="outline" className="text-xs border-cyan-500 text-cyan-400">
                      {year.snapshots} snapshots
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(`https://web.archive.org/web/${year.year}0101000000*/${domain}`, '_blank')}
                    className="h-6 w-6 p-0"
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(`https://web.archive.org/web/${year.year}1231235959*/${domain}`, '_blank')}
                    className="h-6 w-6 p-0"
                  >
                    <Calendar className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Wayback Machine Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/30 border-slate-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <Archive className="w-5 h-5" />
              Wayback Machine Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://web.archive.org/web/changes/${domain}`, '_blank')}
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Calendar className="w-3 h-3 mr-2" />
              View All Changes
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://web.archive.org/web/2*/https://${domain}`, '_blank')}
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Clock className="w-3 h-3 mr-2" />
              Browse by Year
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://web.archive.org/save/https://${domain}`, '_blank')}
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Download className="w-3 h-3 mr-2" />
              Save Page Now
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/30 border-slate-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <Camera className="w-5 h-5" />
              Archive Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://archive.today/?run=1&url=https://${domain}`, '_blank')}
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Camera className="w-3 h-3 mr-2" />
              Create New Archive
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://ghostarchive.org/search?term=${domain}`, '_blank')}
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Search className="w-3 h-3 mr-2" />
              Search Ghost Archive
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://arquivo.pt/textsearch?q=${domain}`, '_blank')}
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Globe className="w-3 h-3 mr-2" />
              Portuguese Web Archive
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Cache Comparison */}
      <Card className="bg-slate-800/30 border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-400">
            <FileText className="w-5 h-5" />
            Cache Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenExternal('google_cache', domain)}
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 mb-2"
              >
                <Search className="w-3 h-3 mr-2" />
                Google Cache
              </Button>
              <p className="text-xs text-slate-400">Latest Google crawl</p>
            </div>
            
            <div className="text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenExternal('bing_cache', domain)}
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 mb-2"
              >
                <Globe className="w-3 h-3 mr-2" />
                Bing Cache
              </Button>
              <p className="text-xs text-slate-400">Microsoft's cached version</p>
            </div>
            
            <div className="text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenExternal('yandex_cache', domain)}
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 mb-2"
              >
                <FileText className="w-3 h-3 mr-2" />
                Yandex Cache
              </Button>
              <p className="text-xs text-slate-400">Russian search engine cache</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historical Data Sources */}
      <Card className="bg-slate-800/30 border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-400">
            <ExternalLink className="w-5 h-5" />
            Additional Historical Data Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://web.archive.org/web/*/${domain}`, '_blank')}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              Internet Archive
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://arquivo.pt/textsearch?q=${domain}`, '_blank')}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              Arquivo.pt
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://webarchive.nationalarchives.gov.uk/search/title?query=${domain}`, '_blank')}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              UK Web Archive
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://swap.stanford.edu/search?q=${domain}`, '_blank')}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              Stanford Archive
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}