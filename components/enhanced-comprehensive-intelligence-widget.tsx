"use client"

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Search, 
  Shield, 
  Globe, 
  Mail, 
  FileHash, 
  Link2, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  Download,
  Share2,
  RefreshCw,
  Zap,
  Target,
  MapPin,
  Server,
  Database,
  Lock,
  Wifi,
  Bug,
  TrendingUp,
  Upload,
  Copy,
  Settings,
  MoreVertical,
  Trash2,
  Archive,
  Star,
  Bookmark,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  BarChart3,
  PieChart,
  LineChart,
  Maximize2,
  Minimize2,
  RotateCcw,
  Save,
  ExternalLink,
  Info,
  HelpCircle,
  Keyboard,
  MousePointer,
  Layers,
  Command,
  Terminal,
  Code2,
  FileText,
  Image,
  Table,
  Hash,
  Scan,
  Activity,
  Cpu,
  Monitor,
  Smartphone,
  Briefcase,
  Calendar,
  Users,
  Building,
  Flag,
  Award,
  Crosshair
} from 'lucide-react'
import { 
  ComprehensiveIntelligenceResult, 
  comprehensiveIntelligence,
  analyzeIP,
  analyzeDomain,
  analyzeEmail,
  analyzeHash,
  analyzeURL
} from '@/lib/comprehensive-intelligence'
import { DemoIntelligenceResults } from '@/components/demo-intelligence-results'

interface AdvancedTarget {
  id: string
  value: string
  type: 'ip' | 'domain' | 'email' | 'hash' | 'url'
  status: 'pending' | 'analyzing' | 'completed' | 'error'
  result?: ComprehensiveIntelligenceResult | null
  timestamp?: string
  starred?: boolean
  tags?: string[]
}

interface EnhancedComprehensiveIntelligenceWidgetProps {
  className?: string
  defaultTarget?: string
  defaultType?: 'ip' | 'domain' | 'email' | 'hash' | 'url'
}

export function EnhancedComprehensiveIntelligenceWidget({ 
  className, 
  defaultTarget = '',
  defaultType = 'ip'
}: EnhancedComprehensiveIntelligenceWidgetProps) {
  const [target, setTarget] = useState(defaultTarget)
  const [targetType, setTargetType] = useState<'ip' | 'domain' | 'email' | 'hash' | 'url'>(defaultType)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ComprehensiveIntelligenceResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [demoMode, setDemoMode] = useState(true)
  
  // Advanced features
  const [bulkMode, setBulkMode] = useState(false)
  const [targets, setTargets] = useState<AdvancedTarget[]>([])
  const [viewMode, setViewMode] = useState<'single' | 'grid' | 'table'>('single')
  const [filterMode, setFilterMode] = useState<'all' | 'high-risk' | 'completed' | 'starred'>('all')
  const [sortMode, setSortMode] = useState<'timestamp' | 'risk' | 'type'>('timestamp')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [autoAnalyze, setAutoAnalyze] = useState(false)
  const [realTimeMode, setRealTimeMode] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; target: AdvancedTarget | null }>({ x: 0, y: 0, target: null })
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const targetInputRef = useRef<HTMLInputElement>(null)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'Enter':
            e.preventDefault()
            handleAnalyze()
            break
          case 'r':
            e.preventDefault()
            handleRefreshAll()
            break
          case 'b':
            e.preventDefault()
            setBulkMode(!bulkMode)
            break
          case 'd':
            e.preventDefault()
            setDemoMode(!demoMode)
            break
          case 's':
            e.preventDefault()
            if (result) exportResults()
            break
          case 'h':
            e.preventDefault()
            setShowKeyboardShortcuts(true)
            break
          case 'Delete':
            e.preventDefault()
            handleClearAll()
            break
        }
      }
      
      if (e.key === 'Escape') {
        setContextMenu({ x: 0, y: 0, target: null })
        setShowKeyboardShortcuts(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [result, bulkMode, demoMode])

  // Drag and drop functionality
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const text = e.dataTransfer.getData('text/plain')
    if (text) {
      const lines = text.split('\n').filter(line => line.trim())
      if (lines.length === 1) {
        setTarget(lines[0].trim())
        if (autoAnalyze) {
          setTimeout(() => handleAnalyze(), 500)
        }
      } else {
        // Bulk import
        setBulkMode(true)
        addBulkTargets(lines.map(line => line.trim()).filter(Boolean))
      }
    }
  }

  const handleAnalyze = useCallback(async () => {
    if (!target.trim()) return
    
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      if (demoMode) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        setResult({ demoMode: true, target: target.trim(), type: targetType } as any)
      } else {
        let analysisResult: ComprehensiveIntelligenceResult
        
        switch (targetType) {
          case 'ip':
            analysisResult = await analyzeIP(target.trim())
            break
          case 'domain':
            analysisResult = await analyzeDomain(target.trim())
            break
          case 'email':
            analysisResult = await analyzeEmail(target.trim())
            break
          case 'hash':
            analysisResult = await analyzeHash(target.trim())
            break
          case 'url':
            analysisResult = await analyzeURL(target.trim())
            break
          default:
            throw new Error('Invalid target type')
        }
        
        setResult(analysisResult)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
      setResult({ demoMode: true, target: target.trim(), type: targetType } as any)
    } finally {
      setLoading(false)
    }
  }, [target, targetType, demoMode])

  const addBulkTargets = (newTargets: string[]) => {
    const uniqueTargets = newTargets.map(t => ({
      id: Math.random().toString(36).substr(2, 9),
      value: t,
      type: detectTargetType(t),
      status: 'pending' as const,
      timestamp: new Date().toISOString(),
      starred: false,
      tags: []
    }))
    
    setTargets(prev => [...prev, ...uniqueTargets])
  }

  const detectTargetType = (value: string): 'ip' | 'domain' | 'email' | 'hash' | 'url' => {
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(value)) return 'ip'
    if (value.includes('@')) return 'email'
    if (value.startsWith('http')) return 'url'
    if (/^[a-f0-9]{32,}$/i.test(value)) return 'hash'
    return 'domain'
  }

  const handleBulkAnalysis = async () => {
    const pendingTargets = targets.filter(t => t.status === 'pending')
    
    for (const target of pendingTargets) {
      setTargets(prev => prev.map(t => 
        t.id === target.id ? { ...t, status: 'analyzing' } : t
      ))
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate analysis
        
        setTargets(prev => prev.map(t => 
          t.id === target.id 
            ? { 
                ...t, 
                status: 'completed',
                result: { demoMode: true, target: target.value, type: target.type } as any
              } 
            : t
        ))
      } catch {
        setTargets(prev => prev.map(t => 
          t.id === target.id ? { ...t, status: 'error' } : t
        ))
      }
    }
  }

  const handleRefreshAll = () => {
    if (result) {
      handleAnalyze()
    }
    if (targets.length > 0) {
      handleBulkAnalysis()
    }
  }

  const handleClearAll = () => {
    setTargets([])
    setResult(null)
    setError(null)
    setTarget('')
  }

  const handleContextMenu = (e: React.MouseEvent, target: AdvancedTarget) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, target })
  }

  const exportResults = () => {
    if (!result) return
    
    const exportData = {
      target: result.target,
      type: result.type,
      timestamp: result.timestamp,
      riskScore: result.riskScore,
      summary: result.summary,
      alerts: result.alerts,
      sources: Object.keys(result.sources).filter(key => !result.sources[key].error)
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cyber-intel-${result.target}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportBulkResults = () => {
    const completedTargets = targets.filter(t => t.status === 'completed' && t.result)
    const exportData = {
      timestamp: new Date().toISOString(),
      totalTargets: completedTargets.length,
      results: completedTargets.map(t => ({
        target: t.value,
        type: t.type,
        status: t.status,
        result: t.result
      }))
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bulk-intel-analysis-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importTargets = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const lines = content.split('\n').map(line => line.trim()).filter(Boolean)
        addBulkTargets(lines)
      } catch (error) {
        setError('Failed to import targets')
      }
    }
    reader.readAsText(file)
  }

  const quickTargets = [
    { label: '🌐 8.8.8.8', type: 'ip' as const, value: '8.8.8.8', description: 'Google Public DNS' },
    { label: '🔍 google.com', type: 'domain' as const, value: 'google.com', description: 'Google Search Engine' },
    { label: '📧 test@example.com', type: 'email' as const, value: 'test@example.com', description: 'Sample Email Address' },
    { label: '🔐 Sample Hash', type: 'hash' as const, value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', description: 'SHA-256 Hash Example' },
    { label: '🌍 malicious-site.com', type: 'domain' as const, value: 'malicious-site.com', description: 'Test Malicious Domain' },
    { label: '⚠️ 192.168.1.1', type: 'ip' as const, value: '192.168.1.1', description: 'Private Network IP' }
  ]

  const filteredTargets = targets.filter(target => {
    switch (filterMode) {
      case 'high-risk':
        return target.result && (target.result as any).riskScore > 70
      case 'completed':
        return target.status === 'completed'
      case 'starred':
        return target.starred
      default:
        return true
    }
  })

  return (
    <div 
      className={`space-y-6 ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Enhanced Header */}
      <Card className={`bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-cyan-900/30 border-slate-700 transition-all duration-300 ${dragOver ? 'border-cyan-400 shadow-cyan-400/20 shadow-lg' : ''}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-3">
              <div className="relative">
                <Target className="w-8 h-8 text-cyan-400" />
                <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-lg animate-pulse"></div>
              </div>
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Advanced Intelligence Analysis
              </span>
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowKeyboardShortcuts(true)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Keyboard className="w-4 h-4 mr-2" />
                Shortcuts
              </Button>
              
              <Button
                variant={bulkMode ? "default" : "outline"}
                size="sm"
                onClick={() => setBulkMode(!bulkMode)}
                className={bulkMode ? "bg-purple-600 hover:bg-purple-700" : "border-slate-600 text-slate-300 hover:bg-slate-700"}
              >
                <Layers className="w-4 h-4 mr-2" />
                Bulk Mode
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Settings className="w-4 h-4 mr-2" />
                Advanced
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {dragOver && (
            <div className="mb-4 p-4 border-2 border-dashed border-cyan-400 bg-cyan-400/10 rounded-lg text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
              <p className="text-cyan-400 font-medium">Drop targets here for analysis</p>
              <p className="text-slate-400 text-sm">Single target or multiple lines for bulk analysis</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-300 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Target Type
              </label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white focus:border-cyan-400 transition-colors"
              >
                <option value="ip">🌐 IP Address</option>
                <option value="domain">🔍 Domain</option>
                <option value="email">📧 Email</option>
                <option value="hash">🔐 File Hash</option>
                <option value="url">🌍 URL</option>
              </select>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-slate-300 flex items-center gap-2">
                <Crosshair className="w-4 h-4" />
                Target
              </label>
              <Input
                ref={targetInputRef}
                type="text"
                placeholder={`Enter ${targetType}... (Ctrl+Enter to analyze)`}
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white focus:border-cyan-400 transition-colors"
                onKeyPress={(e) => e.key === 'Enter' && !e.ctrlKey && handleAnalyze()}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-300 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Action
              </label>
              <Button 
                onClick={handleAnalyze} 
                disabled={loading || !target.trim()}
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 transition-all duration-300"
              >
                {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                {loading ? 'Analyzing...' : 'Analyze'}
              </Button>
            </div>
          </div>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="mb-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Demo Mode</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={demoMode}
                      onChange={(e) => setDemoMode(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Auto Analyze</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoAnalyze}
                      onChange={(e) => setAutoAnalyze(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Real-time Updates</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={realTimeMode}
                      onChange={(e) => setRealTimeMode(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Quick Targets */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300 flex items-center gap-2">
              <MousePointer className="w-4 h-4" />
              Quick Targets:
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {quickTargets.map((quick, index) => (
                <Button
                  key={quick.value}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTargetType(quick.type)
                    setTarget(quick.value)
                    if (autoAnalyze) {
                      setTimeout(() => handleAnalyze(), 500)
                    }
                  }}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 transition-all duration-200 hover:scale-105 group"
                  title={quick.description}
                >
                  <span className="group-hover:scale-110 transition-transform duration-200">
                    {quick.label}
                  </span>
                </Button>
              ))}
            </div>
          </div>
          
          {/* Bulk Mode Controls */}
          {bulkMode && (
            <div className="mt-6 p-4 bg-purple-900/20 rounded-lg border border-purple-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-purple-400 flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Bulk Analysis Mode
                </h3>
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.csv"
                    onChange={importTargets}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-purple-600 text-purple-400 hover:bg-purple-700"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportBulkResults}
                    disabled={!targets.some(t => t.status === 'completed')}
                    className="border-purple-600 text-purple-400 hover:bg-purple-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    onClick={handleBulkAnalysis}
                    disabled={!targets.some(t => t.status === 'pending')}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Analyze All
                  </Button>
                </div>
              </div>
              
              {targets.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">
                      {targets.length} targets • {targets.filter(t => t.status === 'completed').length} completed
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFilterMode(filterMode === 'all' ? 'completed' : 'all')}
                        className="border-slate-600 text-slate-300"
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        {filterMode}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
                        className="border-slate-600 text-slate-300"
                      >
                        {viewMode === 'table' ? <Grid className="w-4 h-4" /> : <Table className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <ScrollArea className="h-48">
                    <div className="space-y-2">
                      {filteredTargets.map((target) => (
                        <div
                          key={target.id}
                          className="flex items-center justify-between p-2 bg-slate-800/50 rounded border border-slate-700 hover:border-purple-600 transition-colors"
                          onContextMenu={(e) => handleContextMenu(e, target)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {target.status === 'pending' && <Clock className="w-4 h-4 text-yellow-400" />}
                              {target.status === 'analyzing' && <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />}
                              {target.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-400" />}
                              {target.status === 'error' && <XCircle className="w-4 h-4 text-red-400" />}
                            </div>
                            <span className="font-mono text-sm text-white">{target.value}</span>
                            <Badge variant="outline" className="text-xs">
                              {target.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            {target.starred && <Star className="w-4 h-4 text-yellow-400" />}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setTargets(prev => prev.filter(t => t.id !== target.id))}
                              className="text-slate-400 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert className="border-red-500 bg-red-500/10 animate-in slide-in-from-top-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-400">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {(result as any).demoMode ? (
            <DemoIntelligenceResults 
              target={(result as any).target} 
              targetType={(result as any).type} 
            />
          ) : (
            <div className="space-y-6">
              {/* Enhanced Results Display would go here */}
              <Card className="bg-slate-900/40 border-slate-700">
                <CardHeader>
                  <CardTitle>Analysis Complete</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Advanced analysis results would be displayed here.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Context Menu */}
      {contextMenu.target && (
        <div
          className="fixed z-50 bg-slate-800 border border-slate-600 rounded-lg shadow-lg py-1 min-w-[150px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onMouseLeave={() => setContextMenu({ x: 0, y: 0, target: null })}
        >
          <button className="w-full px-3 py-1 text-left hover:bg-slate-700 text-sm text-white flex items-center gap-2">
            <Copy className="w-4 h-4" />
            Copy Target
          </button>
          <button className="w-full px-3 py-1 text-left hover:bg-slate-700 text-sm text-white flex items-center gap-2">
            <Star className="w-4 h-4" />
            Star Target
          </button>
          <button className="w-full px-3 py-1 text-left hover:bg-slate-700 text-sm text-white flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Open in New Tab
          </button>
          <Separator className="my-1 bg-slate-600" />
          <button className="w-full px-3 py-1 text-left hover:bg-slate-700 text-sm text-red-400 flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}

      {/* Keyboard Shortcuts Modal */}
      {showKeyboardShortcuts && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <Card className="w-96 bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Keyboard className="w-5 h-5" />
                Keyboard Shortcuts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Analyze</span>
                  <code className="bg-slate-800 px-2 py-1 rounded text-xs">Ctrl+Enter</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Refresh</span>
                  <code className="bg-slate-800 px-2 py-1 rounded text-xs">Ctrl+R</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Toggle Bulk Mode</span>
                  <code className="bg-slate-800 px-2 py-1 rounded text-xs">Ctrl+B</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Toggle Demo</span>
                  <code className="bg-slate-800 px-2 py-1 rounded text-xs">Ctrl+D</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Export Results</span>
                  <code className="bg-slate-800 px-2 py-1 rounded text-xs">Ctrl+S</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Show Help</span>
                  <code className="bg-slate-800 px-2 py-1 rounded text-xs">Ctrl+H</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Clear All</span>
                  <code className="bg-slate-800 px-2 py-1 rounded text-xs">Ctrl+Del</code>
                </div>
              </div>
              <Button
                onClick={() => setShowKeyboardShortcuts(false)}
                className="w-full mt-4"
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}