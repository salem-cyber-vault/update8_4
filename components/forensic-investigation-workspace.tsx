"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Plus,
  FileText,
  Clock,
  MapPin,
  Shield,
  Database,
  Globe,
  Target,
  Zap,
  Copy,
  ExternalLink,
  Save,
  Download,
  Share,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

export interface Investigation {
  id: string
  title: string
  description: string
  status: "active" | "completed" | "archived"
  priority: "low" | "medium" | "high" | "critical"
  createdAt: string
  updatedAt: string
  targets: string[]
  findings: Finding[]
  timeline: TimelineEvent[]
  tags: string[]
}

export interface Finding {
  id: string
  type: "ip" | "domain" | "cve" | "malware" | "indicator" | "note"
  title: string
  content: string
  source: string
  severity: "info" | "low" | "medium" | "high" | "critical"
  timestamp: string
  verified: boolean
  tags: string[]
  metadata?: Record<string, any>
}

export interface TimelineEvent {
  id: string
  timestamp: string
  title: string
  description: string
  type: "discovery" | "analysis" | "correlation" | "action"
  source: string
  severity: "info" | "warning" | "critical"
}

interface IntelligencePanel {
  id: string
  title: string
  type: "shodan" | "virustotal" | "cve" | "whois" | "dns" | "geolocation"
  data: any
  loading: boolean
  error?: string
}

export function ForensicInvestigationWorkspace() {
  const [activeInvestigation, setActiveInvestigation] = useState<Investigation | null>(null)
  const [investigations, setInvestigations] = useState<Investigation[]>([])
  const [searchTarget, setSearchTarget] = useState("")
  const [newFinding, setNewFinding] = useState("")
  const [selectedFindingType, setSelectedFindingType] = useState<Finding["type"]>("note")
  const [intelligencePanels, setIntelligencePanels] = useState<IntelligencePanel[]>([])
  const [showNewInvestigation, setShowNewInvestigation] = useState(false)
  const [newInvestigationTitle, setNewInvestigationTitle] = useState("")
  const [newInvestigationDesc, setNewInvestigationDesc] = useState("")
  const [expandedFindings, setExpandedFindings] = useState<Set<string>>(new Set())

  // Initialize with sample data
  useEffect(() => {
    const sampleInvestigation: Investigation = {
      id: "inv-001",
      title: "Suspicious Network Activity - 192.168.1.100",
      description: "Investigating unusual outbound connections and potential data exfiltration",
      status: "active",
      priority: "high",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      targets: ["192.168.1.100", "malicious-domain.com", "CVE-2024-1234"],
      findings: [
        {
          id: "find-001",
          type: "ip",
          title: "Malicious IP Communication",
          content: "Target IP 192.168.1.100 communicating with known C&C server 45.33.32.156",
          source: "Network Monitoring",
          severity: "high",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          verified: true,
          tags: ["c2", "outbound", "suspicious"],
          metadata: { port: 443, protocol: "HTTPS", bytes: 15420 },
        },
        {
          id: "find-002",
          type: "cve",
          title: "Vulnerable Service Detected",
          content: "Apache HTTP Server 2.4.41 running with known vulnerability CVE-2024-1234",
          source: "Vulnerability Scanner",
          severity: "critical",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          verified: true,
          tags: ["vulnerability", "apache", "rce"],
          metadata: { cvss: 9.8, exploitAvailable: true },
        },
      ],
      timeline: [
        {
          id: "timeline-001",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          title: "Initial Detection",
          description: "Anomalous network traffic detected from 192.168.1.100",
          type: "discovery",
          source: "SIEM",
          severity: "warning",
        },
        {
          id: "timeline-002",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          title: "C&C Communication Identified",
          description: "Confirmed communication with known command and control server",
          type: "analysis",
          source: "Threat Intelligence",
          severity: "critical",
        },
      ],
      tags: ["malware", "c2", "data-exfiltration"],
    }

    setInvestigations([sampleInvestigation])
    setActiveInvestigation(sampleInvestigation)
  }, [])

  const createNewInvestigation = () => {
    if (!newInvestigationTitle.trim()) return

    const newInvestigation: Investigation = {
      id: `inv-${Date.now()}`,
      title: newInvestigationTitle,
      description: newInvestigationDesc,
      status: "active",
      priority: "medium",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      targets: [],
      findings: [],
      timeline: [
        {
          id: `timeline-${Date.now()}`,
          timestamp: new Date().toISOString(),
          title: "Investigation Created",
          description: `New investigation: ${newInvestigationTitle}`,
          type: "discovery",
          source: "User",
          severity: "info",
        },
      ],
      tags: [],
    }

    setInvestigations((prev) => [...prev, newInvestigation])
    setActiveInvestigation(newInvestigation)
    setNewInvestigationTitle("")
    setNewInvestigationDesc("")
    setShowNewInvestigation(false)
  }

  const addFinding = () => {
    if (!activeInvestigation || !newFinding.trim()) return

    const finding: Finding = {
      id: `find-${Date.now()}`,
      type: selectedFindingType,
      title: `${selectedFindingType.toUpperCase()} Finding`,
      content: newFinding,
      source: "Manual Entry",
      severity: "medium",
      timestamp: new Date().toISOString(),
      verified: false,
      tags: [],
      metadata: {},
    }

    const updatedInvestigation = {
      ...activeInvestigation,
      findings: [...activeInvestigation.findings, finding],
      updatedAt: new Date().toISOString(),
    }

    setActiveInvestigation(updatedInvestigation)
    setInvestigations((prev) => prev.map((inv) => (inv.id === activeInvestigation.id ? updatedInvestigation : inv)))
    setNewFinding("")
  }

  const runIntelligenceGathering = async (target: string) => {
    if (!target.trim()) return

    const panels: IntelligencePanel[] = [
      { id: "shodan", title: "Shodan Intelligence", type: "shodan", data: null, loading: true },
      { id: "virustotal", title: "VirusTotal Analysis", type: "virustotal", data: null, loading: true },
      { id: "whois", title: "WHOIS Information", type: "whois", data: null, loading: true },
      { id: "geolocation", title: "Geolocation Data", type: "geolocation", data: null, loading: true },
    ]

    setIntelligencePanels(panels)


  // TODO: Replace with real API call for panel data
  // Example: fetchPanelData(panel.type).then(data => setIntelligencePanels((prev) => prev.map(panel => ({ ...panel, loading: false, data }))))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-400 bg-red-900/20 border-red-500"
      case "high":
        return "text-orange-400 bg-orange-900/20 border-orange-500"
      case "medium":
        return "text-yellow-400 bg-yellow-900/20 border-yellow-500"
      case "low":
        return "text-blue-400 bg-blue-900/20 border-blue-500"
      default:
        return "text-slate-400 bg-slate-900/20 border-slate-500"
    }
  }

  const toggleFindingExpanded = (id: string) => {
    const newExpanded = new Set(expandedFindings)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedFindings(newExpanded)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Forensic Investigation Workspace</h2>
          <p className="text-slate-400">Comprehensive digital forensics and threat analysis environment</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={showNewInvestigation} onOpenChange={setShowNewInvestigation}>
            <DialogTrigger asChild>
              <Button className="bg-cyan-600 hover:bg-cyan-700">
                <Plus className="w-4 h-4 mr-2" />
                New Investigation
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Investigation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Investigation Title</label>
                  <Input
                    value={newInvestigationTitle}
                    onChange={(e) => setNewInvestigationTitle(e.target.value)}
                    placeholder="Enter investigation title..."
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Description</label>
                  <Textarea
                    value={newInvestigationDesc}
                    onChange={(e) => setNewInvestigationDesc(e.target.value)}
                    placeholder="Describe the investigation scope and objectives..."
                    className="bg-slate-800 border-slate-600 text-white"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowNewInvestigation(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createNewInvestigation} className="bg-cyan-600 hover:bg-cyan-700">
                    Create Investigation
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Investigation Selector */}
      <Card className="bg-slate-900/40 border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="w-5 h-5 text-cyan-400" />
            Active Investigations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {investigations.map((investigation) => (
              <Card
                key={investigation.id}
                className={`min-w-80 cursor-pointer transition-all ${
                  activeInvestigation?.id === investigation.id
                    ? "bg-cyan-900/30 border-cyan-500"
                    : "bg-slate-800/30 border-slate-600 hover:border-slate-500"
                }`}
                onClick={() => setActiveInvestigation(investigation)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white text-sm">{investigation.title}</h3>
                    <Badge className={getSeverityColor(investigation.priority)}>
                      {investigation.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-xs mb-3 line-clamp-2">{investigation.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">{investigation.findings.length} findings</span>
                    <span className="text-slate-500">{new Date(investigation.updatedAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {activeInvestigation && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Investigation Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Intelligence Gathering */}
            <Card className="bg-slate-900/40 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Search className="w-5 h-5 text-green-400" />
                  Intelligence Gathering
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Input
                    value={searchTarget}
                    onChange={(e) => setSearchTarget(e.target.value)}
                    placeholder="Enter IP, domain, or indicator to investigate..."
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                  <Button
                    onClick={() => runIntelligenceGathering(searchTarget)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Investigate
                  </Button>
                </div>

                {intelligencePanels.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {intelligencePanels.map((panel) => (
                      <Card key={panel.id} className="bg-slate-800/30 border-slate-600">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm text-white flex items-center gap-2">
                            {panel.type === "shodan" && <Globe className="w-4 h-4 text-blue-400" />}
                            {panel.type === "virustotal" && <Shield className="w-4 h-4 text-red-400" />}
                            {panel.type === "whois" && <Database className="w-4 h-4 text-purple-400" />}
                            {panel.type === "geolocation" && <MapPin className="w-4 h-4 text-green-400" />}
                            {panel.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {panel.loading ? (
                            <div className="space-y-2">
                              <Progress value={33} className="h-2" />
                              <p className="text-xs text-slate-400">Gathering intelligence...</p>
                            </div>
                          ) : panel.data ? (
                            <div className="space-y-2 text-xs">
                              {panel.type === "shodan" && (
                                <>
                                  <div>
                                    <span className="text-slate-400">Ports:</span> {panel.data.ports.join(", ")}
                                  </div>
                                  <div>
                                    <span className="text-slate-400">Services:</span> {panel.data.services.join(", ")}
                                  </div>
                                  <div>
                                    <span className="text-slate-400">Vulnerabilities:</span>{" "}
                                    {panel.data.vulnerabilities.length}
                                  </div>
                                </>
                              )}
                              {panel.type === "virustotal" && (
                                <>
                                  <div>
                                    <span className="text-slate-400">Detections:</span> {panel.data.detections}/
                                    {panel.data.totalEngines}
                                  </div>
                                  <div>
                                    <span className="text-slate-400">Reputation:</span>
                                    <Badge
                                      className={
                                        panel.data.reputation === "malicious"
                                          ? "ml-2 text-red-400 bg-red-900/20"
                                          : "ml-2 text-green-400 bg-green-900/20"
                                      }
                                    >
                                      {panel.data.reputation}
                                    </Badge>
                                  </div>
                                </>
                              )}
                              {panel.type === "whois" && (
                                <>
                                  <div>
                                    <span className="text-slate-400">Registrar:</span> {panel.data.registrar}
                                  </div>
                                  <div>
                                    <span className="text-slate-400">Created:</span> {panel.data.createdDate}
                                  </div>
                                  <div>
                                    <span className="text-slate-400">Expires:</span> {panel.data.expiryDate}
                                  </div>
                                </>
                              )}
                              {panel.type === "geolocation" && (
                                <>
                                  <div>
                                    <span className="text-slate-400">Location:</span> {panel.data.city},{" "}
                                    {panel.data.country}
                                  </div>
                                  <div>
                                    <span className="text-slate-400">ISP:</span> {panel.data.isp}
                                  </div>
                                  <div>
                                    <span className="text-slate-400">Coordinates:</span> {panel.data.lat},{" "}
                                    {panel.data.lng}
                                  </div>
                                </>
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-500">No data available</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Findings */}
            <Card className="bg-slate-900/40 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="w-5 h-5 text-orange-400" />
                  Investigation Findings ({activeInvestigation.findings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="flex gap-2">
                    <Select
                      value={selectedFindingType}
                      onValueChange={(value: Finding["type"]) => setSelectedFindingType(value)}
                    >
                      <SelectTrigger className="w-32 bg-slate-800 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="note">Note</SelectItem>
                        <SelectItem value="ip">IP Address</SelectItem>
                        <SelectItem value="domain">Domain</SelectItem>
                        <SelectItem value="cve">CVE</SelectItem>
                        <SelectItem value="malware">Malware</SelectItem>
                        <SelectItem value="indicator">Indicator</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={newFinding}
                      onChange={(e) => setNewFinding(e.target.value)}
                      placeholder="Add new finding or observation..."
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                    <Button onClick={addFinding} className="bg-orange-600 hover:bg-orange-700">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {activeInvestigation.findings.map((finding) => (
                      <Card key={finding.id} className="bg-slate-800/30 border-slate-600">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleFindingExpanded(finding.id)}
                                className="p-1 h-auto"
                              >
                                {expandedFindings.has(finding.id) ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </Button>
                              <Badge variant="outline" className="text-xs">
                                {finding.type.toUpperCase()}
                              </Badge>
                              <h4 className="font-medium text-white text-sm">{finding.title}</h4>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getSeverityColor(finding.severity)}>
                                {finding.severity.toUpperCase()}
                              </Badge>
                              {finding.verified && (
                                <Badge className="text-green-400 bg-green-900/20 border-green-500">VERIFIED</Badge>
                              )}
                            </div>
                          </div>

                          <p className="text-slate-300 text-sm mb-2">{finding.content}</p>

                          {expandedFindings.has(finding.id) && (
                            <div className="mt-4 pt-4 border-t border-slate-700 space-y-2">
                              <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                  <span className="text-slate-400">Source:</span> {finding.source}
                                </div>
                                <div>
                                  <span className="text-slate-400">Timestamp:</span>{" "}
                                  {new Date(finding.timestamp).toLocaleString()}
                                </div>
                              </div>
                              {finding.tags.length > 0 && (
                                <div className="flex gap-1 flex-wrap">
                                  {finding.tags.map((tag, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              {finding.metadata && Object.keys(finding.metadata).length > 0 && (
                                <div className="bg-slate-900/50 p-2 rounded text-xs">
                                  <pre className="text-slate-300">{JSON.stringify(finding.metadata, null, 2)}</pre>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700">
                            <span className="text-xs text-slate-500">
                              {new Date(finding.timestamp).toLocaleString()}
                            </span>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Investigation Details */}
            <Card className="bg-slate-900/40 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  Investigation Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-white mb-1">{activeInvestigation.title}</h3>
                  <p className="text-slate-400 text-sm">{activeInvestigation.description}</p>
                </div>

                <Separator className="bg-slate-700" />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Status:</span>
                    <Badge className={getSeverityColor(activeInvestigation.status)}>
                      {activeInvestigation.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Priority:</span>
                    <Badge className={getSeverityColor(activeInvestigation.priority)}>
                      {activeInvestigation.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Created:</span>
                    <span className="text-white text-sm">
                      {new Date(activeInvestigation.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Updated:</span>
                    <span className="text-white text-sm">
                      {new Date(activeInvestigation.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                <div>
                  <h4 className="text-white text-sm font-medium mb-2">Targets</h4>
                  <div className="space-y-1">
                    {activeInvestigation.targets.map((target, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-slate-300 font-mono">{target}</span>
                        <Button size="sm" variant="ghost" className="h-6 px-2">
                          <Search className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" className="border-slate-600 bg-transparent">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-slate-600 bg-transparent">
                    <Share className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="bg-slate-900/40 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Clock className="w-5 h-5 text-purple-400" />
                  Investigation Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-4">
                    {activeInvestigation.timeline.map((event, index) => (
                      <div key={event.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              event.severity === "critical"
                                ? "bg-red-400"
                                : event.severity === "warning"
                                  ? "bg-yellow-400"
                                  : "bg-blue-400"
                            }`}
                          />
                          {index < activeInvestigation.timeline.length - 1 && (
                            <div className="w-px h-8 bg-slate-600 mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-white text-sm font-medium">{event.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {event.type}
                            </Badge>
                          </div>
                          <p className="text-slate-400 text-xs mb-2">{event.description}</p>
                          <div className="flex justify-between items-center text-xs text-slate-500">
                            <span>{event.source}</span>
                            <span>{new Date(event.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
