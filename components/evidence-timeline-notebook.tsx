"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Bookmark, Download, Plus, Trash2, Calendar, FileText, Tag, Eye } from "lucide-react"
import { ExplainThisTooltip } from './explain-this-tooltip'

interface EvidenceItem {
  id: string
  timestamp: Date
  type: 'finding' | 'note' | 'bookmark' | 'export'
  title: string
  description: string
  source: string
  tags: string[]
  severity?: 'low' | 'medium' | 'high' | 'critical'
  data?: any
}

export function EvidenceTimelineNotebook() {
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([
    {
      id: '1',
      timestamp: new Date('2024-08-08T10:30:00'),
      type: 'finding',
      title: 'Suspicious IP Address Detected',
      description: 'IP 192.168.1.100 showing unusual port scanning activity',
      source: 'Shodan',
      tags: ['suspicious', 'port-scan', 'investigation'],
      severity: 'high',
      data: { ip: '192.168.1.100', ports: [80, 443, 22, 3389] }
    },
    {
      id: '2',
      timestamp: new Date('2024-08-08T11:45:00'),
      type: 'note',
      title: 'Investigation Notes',
      description: 'Cross-referencing with threat intelligence feeds. IP appears in multiple IOC lists from the past 30 days.',
      source: 'Manual Entry',
      tags: ['analysis', 'threat-intel', 'ioc'],
      severity: 'medium'
    },
    {
      id: '3',
      timestamp: new Date('2024-08-08T12:15:00'),
      type: 'bookmark',
      title: 'CVE-2024-1234 Reference',
      description: 'Critical vulnerability affecting Apache web servers - relevant to our investigation',
      source: 'CVE Database',
      tags: ['cve', 'apache', 'critical'],
      severity: 'critical'
    }
  ])

  const [newNote, setNewNote] = useState({ title: '', description: '', tags: '' })
  const [activeTab, setActiveTab] = useState('timeline')

  const addNote = () => {
    if (newNote.title.trim()) {
      const note: EvidenceItem = {
        id: Date.now().toString(),
        timestamp: new Date(),
        type: 'note',
        title: newNote.title,
        description: newNote.description,
        source: 'Manual Entry',
        tags: newNote.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      }
      setEvidenceItems([note, ...evidenceItems])
      setNewNote({ title: '', description: '', tags: '' })
    }
  }

  const deleteItem = (id: string) => {
    setEvidenceItems(evidenceItems.filter(item => item.id !== id))
  }

  const exportEvidence = () => {
    const evidenceReport = {
      case: 'Digital Forensics Investigation',
      timestamp: new Date().toISOString(),
      items: evidenceItems,
      summary: `Investigation containing ${evidenceItems.length} evidence items`
    }
    
    const blob = new Blob([JSON.stringify(evidenceReport, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `evidence-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // Add export event to timeline
    const exportItem: EvidenceItem = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: 'export',
      title: 'Evidence Report Exported',
      description: `Exported ${evidenceItems.length} evidence items for legal review`,
      source: 'System',
      tags: ['export', 'legal', 'report']
    }
    setEvidenceItems([exportItem, ...evidenceItems])
  }

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-400/30'
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-400/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
      case 'low': return 'bg-green-500/20 text-green-300 border-green-400/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'finding': return <Eye className="w-4 h-4" />
      case 'note': return <FileText className="w-4 h-4" />
      case 'bookmark': return <Bookmark className="w-4 h-4" />
      case 'export': return <Download className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card-feminine border-blue-300/20">
        <CardHeader>
          <CardTitle className="text-blue-300 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <ExplainThisTooltip term="Evidence Timeline">
              Evidence Timeline & Case Notebook
            </ExplainThisTooltip>
          </CardTitle>
          <p className="text-slate-300 text-sm">
            Track your digital forensics investigation, save findings, and build your case documentation
          </p>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="glass-card-feminine border-blue-300/20">
          <TabsTrigger value="timeline" className="data-[state=active]:bg-blue-500/30 data-[state=active]:text-blue-100">
            <Clock className="w-4 h-4 mr-2" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="notebook" className="data-[state=active]:bg-purple-500/30 data-[state=active]:text-purple-100">
            <FileText className="w-4 h-4 mr-2" />
            Case Notes
          </TabsTrigger>
          <TabsTrigger value="bookmarks" className="data-[state=active]:bg-pink-500/30 data-[state=active]:text-pink-100">
            <Bookmark className="w-4 h-4 mr-2" />
            Bookmarks
          </TabsTrigger>
        </TabsList>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-slate-200">Investigation Timeline</h3>
            <Button onClick={exportEvidence} className="bg-green-500/70 hover:bg-green-500/90 backdrop-blur-md">
              <Download className="w-4 h-4 mr-2" />
              Export Evidence
            </Button>
          </div>

          <div className="space-y-4">
            {evidenceItems.map((item, index) => (
              <Card key={item.id} className="glass-card-feminine border-slate-400/20 relative">
                {/* Timeline connector */}
                {index < evidenceItems.length - 1 && (
                  <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-pink-400/50 to-purple-400/50"></div>
                )}
                
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full glass-card-feminine border-pink-300/30 flex items-center justify-center text-pink-300">
                      {getTypeIcon(item.type)}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-slate-200">{item.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">
                            {item.timestamp.toLocaleString()}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteItem(item.id)}
                            className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-300">{item.description}</p>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="text-xs bg-slate-600/30 text-slate-300">
                          {item.source}
                        </Badge>
                        {item.severity && (
                          <Badge className={`text-xs ${getSeverityColor(item.severity)}`}>
                            {item.severity.toUpperCase()}
                          </Badge>
                        )}
                        {item.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs glass-card-feminine border-slate-400/30 text-slate-300">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Notebook Tab */}
        <TabsContent value="notebook" className="space-y-4">
          <Card className="glass-card-feminine border-purple-300/20">
            <CardHeader>
              <CardTitle className="text-purple-300 text-lg">Add Case Note</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Note title..."
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="glass-card border-purple-300/30 text-white placeholder-slate-400"
              />
              <Textarea
                placeholder="Detailed description of findings, analysis, or observations..."
                value={newNote.description}
                onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
                className="glass-card border-purple-300/30 text-white placeholder-slate-400 min-h-[100px]"
              />
              <Input
                placeholder="Tags (comma-separated): analysis, suspicious, malware"
                value={newNote.tags}
                onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                className="glass-card border-purple-300/30 text-white placeholder-slate-400"
              />
              <Button onClick={addNote} className="bg-purple-500/70 hover:bg-purple-500/90 backdrop-blur-md">
                <Plus className="w-4 h-4 mr-2" />
                Add Note
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {evidenceItems.filter(item => item.type === 'note').map(note => (
              <Card key={note.id} className="glass-card-feminine border-slate-400/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-slate-200">{note.title}</h4>
                    <span className="text-xs text-slate-400">{note.timestamp.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">{note.description}</p>
                  <div className="flex gap-1 flex-wrap">
                    {note.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs glass-card-feminine border-slate-400/30 text-slate-300">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Bookmarks Tab */}
        <TabsContent value="bookmarks" className="space-y-4">
          <div className="space-y-4">
            {evidenceItems.filter(item => item.type === 'bookmark').map(bookmark => (
              <Card key={bookmark.id} className="glass-card-feminine border-slate-400/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Bookmark className="w-5 h-5 text-pink-300 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-slate-200">{bookmark.title}</h4>
                        <span className="text-xs text-slate-400">{bookmark.timestamp.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-slate-300 mb-2">{bookmark.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge className="text-xs bg-slate-600/30 text-slate-300">
                          {bookmark.source}
                        </Badge>
                        {bookmark.severity && (
                          <Badge className={`text-xs ${getSeverityColor(bookmark.severity)}`}>
                            {bookmark.severity.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}