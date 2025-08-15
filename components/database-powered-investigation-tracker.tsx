"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import {
  InvestigationDB,
  type Investigation,
  type Finding,
  type TimelineEvent,
  isSupabaseConfigured,
} from "@/lib/supabase/database"
import { Database, Plus, Save, Search, Clock, Target, CheckCircle, Loader2, RefreshCw } from "lucide-react"

export function DatabasePoweredInvestigationTracker() {
  const [investigations, setInvestigations] = useState<Investigation[]>([])
  const [activeInvestigation, setActiveInvestigation] = useState<Investigation | null>(null)
  const [findings, setFindings] = useState<Finding[]>([])
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [showNewInvestigation, setShowNewInvestigation] = useState(false)
  const [newInvestigationTitle, setNewInvestigationTitle] = useState("")
  const [newInvestigationDesc, setNewInvestigationDesc] = useState("")
  const [newFinding, setNewFinding] = useState("")
  const [selectedFindingType, setSelectedFindingType] = useState<Finding["type"]>("note")

  // Load investigations on mount
  useEffect(() => {
    if (isSupabaseConfigured) {
      loadInvestigations()
    }
  }, [])

  // Load findings and timeline when active investigation changes
  useEffect(() => {
    if (activeInvestigation && isSupabaseConfigured) {
      loadFindings(activeInvestigation.id)
      loadTimelineEvents(activeInvestigation.id)
    }
  }, [activeInvestigation])

  // Set up real-time subscriptions
  useEffect(() => {
    if (!isSupabaseConfigured) return

    const investigationsSubscription = InvestigationDB.subscribeToInvestigations((payload) => {
      console.log("Investigation update:", payload)
      loadInvestigations()
    })

    return () => {
      investigationsSubscription?.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!activeInvestigation || !isSupabaseConfigured) return

    const findingsSubscription = InvestigationDB.subscribeToFindings(activeInvestigation.id, (payload) => {
      console.log("Finding update:", payload)
      loadFindings(activeInvestigation.id)
    })

    const timelineSubscription = InvestigationDB.subscribeToTimelineEvents(activeInvestigation.id, (payload) => {
      console.log("Timeline update:", payload)
      loadTimelineEvents(activeInvestigation.id)
    })

    return () => {
      findingsSubscription?.unsubscribe()
      timelineSubscription?.unsubscribe()
    }
  }, [activeInvestigation])

  const loadInvestigations = async () => {
    setLoading(true)
    try {
      const data = await InvestigationDB.getInvestigations()
      setInvestigations(data)
      if (data.length > 0 && !activeInvestigation) {
        setActiveInvestigation(data[0])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load investigations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadFindings = async (investigationId: string) => {
    try {
      const data = await InvestigationDB.getFindings(investigationId)
      setFindings(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load findings",
        variant: "destructive",
      })
    }
  }

  const loadTimelineEvents = async (investigationId: string) => {
    try {
      const data = await InvestigationDB.getTimelineEvents(investigationId)
      setTimelineEvents(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load timeline events",
        variant: "destructive",
      })
    }
  }

  const createInvestigation = async () => {
    if (!newInvestigationTitle.trim()) return

    setLoading(true)
    try {
      const investigation = await InvestigationDB.createInvestigation({
        title: newInvestigationTitle,
        description: newInvestigationDesc,
        status: "active",
        priority: "medium",
        targets: [],
        tags: [],
      })

      if (investigation) {
        // Add initial timeline event
        await InvestigationDB.addTimelineEvent({
          investigation_id: investigation.id,
          title: "Investigation Created",
          description: `New investigation: ${investigation.title}`,
          event_type: "discovery",
          source: "System",
          severity: "info",
          event_timestamp: new Date().toISOString(),
          metadata: {},
        })

        setActiveInvestigation(investigation)
        setNewInvestigationTitle("")
        setNewInvestigationDesc("")
        setShowNewInvestigation(false)
        loadInvestigations()

        toast({
          title: "Success",
          description: "Investigation created successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create investigation",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addFinding = async () => {
    if (!activeInvestigation || !newFinding.trim()) return

    setLoading(true)
    try {
      const finding = await InvestigationDB.addFinding({
        investigation_id: activeInvestigation.id,
        type: selectedFindingType,
        title: `${selectedFindingType.toUpperCase()} Finding`,
        content: newFinding,
        source: "Manual Entry",
        severity: "medium",
        verified: false,
        tags: [],
        metadata: {},
      })

      if (finding) {
        // Add timeline event
        await InvestigationDB.addTimelineEvent({
          investigation_id: activeInvestigation.id,
          title: "New Finding Added",
          description: `Added ${selectedFindingType} finding: ${finding.title}`,
          event_type: "analysis",
          source: "User",
          severity: "info",
          event_timestamp: new Date().toISOString(),
          metadata: { finding_id: finding.id },
        })

        setNewFinding("")
        loadFindings(activeInvestigation.id)
        loadTimelineEvents(activeInvestigation.id)

        toast({
          title: "Success",
          description: "Finding added successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add finding",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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

  if (!isSupabaseConfigured) {
    return (
      <Card className="bg-amber-900/20 border-amber-600">
        <CardContent className="p-8 text-center">
          <Database className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-amber-400 mb-2">Database Connection Required</h3>
          <p className="text-amber-200 mb-4">
            Connect Supabase to enable persistent investigation tracking and real-time collaboration.
          </p>
          <Button
            onClick={() => window.open("https://vercel.com/dashboard", "_blank")}
            className="bg-amber-600 hover:bg-amber-700"
          >
            Configure Supabase
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Investigation Tracker</h2>
          <p className="text-slate-400">Database-powered investigation management with real-time collaboration</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={loadInvestigations} variant="outline" className="border-slate-600 bg-transparent">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
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
                  <Button onClick={createInvestigation} disabled={loading} className="bg-cyan-600 hover:bg-cyan-700">
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Create Investigation
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Investigation List */}
      <Card className="bg-slate-900/40 border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Database className="w-5 h-5 text-cyan-400" />
            Stored Investigations ({investigations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
              <span className="ml-2 text-slate-300">Loading investigations...</span>
            </div>
          ) : investigations.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              No investigations found. Create your first investigation to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {investigations.map((investigation) => (
                <Card
                  key={investigation.id}
                  className={`cursor-pointer transition-all ${
                    activeInvestigation?.id === investigation.id
                      ? "bg-cyan-900/30 border-cyan-500"
                      : "bg-slate-800/30 border-slate-600 hover:border-slate-500"
                  }`}
                  onClick={() => setActiveInvestigation(investigation)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-white text-sm line-clamp-1">{investigation.title}</h3>
                      <Badge className={getSeverityColor(investigation.priority)}>
                        {investigation.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-xs mb-3 line-clamp-2">{investigation.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <Badge
                        variant="outline"
                        className={
                          investigation.status === "active"
                            ? "text-green-400 border-green-500"
                            : investigation.status === "completed"
                              ? "text-blue-400 border-blue-500"
                              : "text-slate-400 border-slate-500"
                        }
                      >
                        {investigation.status.toUpperCase()}
                      </Badge>
                      <span className="text-slate-500">{new Date(investigation.updated_at).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {activeInvestigation && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add Finding */}
            <Card className="bg-slate-900/40 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="w-5 h-5 text-orange-400" />
                  Add Finding
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
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
                  <Button onClick={addFinding} disabled={loading} className="bg-orange-600 hover:bg-orange-700">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Findings */}
            <Card className="bg-slate-900/40 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Search className="w-5 h-5 text-green-400" />
                  Findings ({findings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {findings.map((finding) => (
                      <Card key={finding.id} className="bg-slate-800/30 border-slate-600">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {finding.type.toUpperCase()}
                              </Badge>
                              <h4 className="font-medium text-white text-sm">{finding.title}</h4>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getSeverityColor(finding.severity)}>
                                {finding.severity.toUpperCase()}
                              </Badge>
                              {finding.verified && <CheckCircle className="w-4 h-4 text-green-400" />}
                            </div>
                          </div>
                          <p className="text-slate-300 text-sm mb-2">{finding.content}</p>
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>{finding.source}</span>
                            <span>{new Date(finding.created_at).toLocaleString()}</span>
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
                  <Database className="w-5 h-5 text-cyan-400" />
                  Investigation Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-white mb-1">{activeInvestigation.title}</h3>
                  <p className="text-slate-400 text-sm">{activeInvestigation.description}</p>
                </div>

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
                      {new Date(activeInvestigation.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Updated:</span>
                    <span className="text-white text-sm">
                      {new Date(activeInvestigation.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="bg-slate-900/40 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Clock className="w-5 h-5 text-purple-400" />
                  Timeline ({timelineEvents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-4">
                    {timelineEvents.map((event, index) => (
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
                          {index < timelineEvents.length - 1 && <div className="w-px h-8 bg-slate-600 mt-2" />}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-white text-sm font-medium">{event.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {event.event_type}
                            </Badge>
                          </div>
                          <p className="text-slate-400 text-xs mb-2">{event.description}</p>
                          <div className="flex justify-between items-center text-xs text-slate-500">
                            <span>{event.source}</span>
                            <span>{new Date(event.event_timestamp).toLocaleString()}</span>
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
