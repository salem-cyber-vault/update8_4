"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Settings, 
  Key, 
  Shield, 
  Globe, 
  Eye, 
  EyeOff, 
  Save, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Download,
  Upload,
  Trash2
} from 'lucide-react'

interface APIService {
  name: string
  category: string
  description: string
  keyName: string
  required: boolean
  hasFreetier: boolean
  website: string
  status: 'configured' | 'missing' | 'invalid'
}

const API_SERVICES: APIService[] = [
  // Device & Infrastructure Intelligence
  { name: 'Shodan', category: 'Device Intelligence', description: 'Internet-connected device search and analysis', keyName: 'SHODAN_API_KEY', required: false, hasFreetier: true, website: 'https://shodan.io', status: 'missing' },
  { name: 'Censys', category: 'Device Intelligence', description: 'Internet scanning and SSL certificate data', keyName: 'CENSYS_API_ID', required: false, hasFreetier: true, website: 'https://censys.io', status: 'missing' },
  { name: 'ZoomEye', category: 'Device Intelligence', description: 'Alternative device search engine', keyName: 'ZOOMEYE_API_KEY', required: false, hasFreetier: true, website: 'https://zoomeye.org', status: 'missing' },

  // Threat Intelligence & Reputation
  { name: 'VirusTotal', category: 'Threat Intelligence', description: 'File/URL/IP reputation analysis', keyName: 'VIRUSTOTAL_API_KEY', required: false, hasFreeTimer: true, website: 'https://virustotal.com', status: 'missing' },
  { name: 'AbuseIPDB', category: 'Threat Intelligence', description: 'IP reputation and abuse reporting', keyName: 'ABUSEIPDB_API_KEY', required: false, hasFreeTimer: true, website: 'https://abuseipdb.com', status: 'missing' },
  { name: 'GreyNoise', category: 'Threat Intelligence', description: 'Internet noise and scanning activity', keyName: 'GREYNOISE_API_KEY', required: false, hasFreeTimer: true, website: 'https://greynoise.io', status: 'missing' },
  { name: 'IPQualityScore', category: 'Threat Intelligence', description: 'Fraud detection and risk scoring', keyName: 'IPQUALITYSCORE_API_KEY', required: false, hasFreeTimer: true, website: 'https://ipqualityscore.com', status: 'missing' },

  // Passive DNS & Subdomain Intelligence
  { name: 'SecurityTrails', category: 'DNS Intelligence', description: 'Historical DNS and subdomain data', keyName: 'SECURITYTRAILS_API_KEY', required: false, hasFreeTimer: true, website: 'https://securitytrails.com', status: 'missing' },
  { name: 'Farsight DNSDB', category: 'DNS Intelligence', description: 'Passive DNS database', keyName: 'FARSIGHT_API_KEY', required: false, hasFreeTimer: false, website: 'https://dnsdb.info', status: 'missing' },
  { name: 'RiskIQ', category: 'DNS Intelligence', description: 'Threat intelligence and passive DNS', keyName: 'RISKIQ_API_KEY', required: false, hasFreeTimer: false, website: 'https://riskiq.com', status: 'missing' },

  // WHOIS & Domain Intelligence
  { name: 'WhoisXML API', category: 'Domain Intelligence', description: 'Comprehensive WHOIS data', keyName: 'WHOISXML_API_KEY', required: false, hasFreeTimer: true, website: 'https://whoisxmlapi.com', status: 'missing' },
  { name: 'DomainTools', category: 'Domain Intelligence', description: 'Advanced domain intelligence', keyName: 'DOMAINTOOLS_API_KEY', required: false, hasFreeTimer: false, website: 'https://domaintools.com', status: 'missing' },

  // Technology Stack & Analytics
  { name: 'BuiltWith', category: 'Web Intelligence', description: 'Technology profiling and stack detection', keyName: 'BUILTWITH_API_KEY', required: false, hasFreeTimer: true, website: 'https://builtwith.com', status: 'missing' },
  { name: 'SimilarWeb', category: 'Web Intelligence', description: 'Website analytics and traffic data', keyName: 'SIMILARWEB_API_KEY', required: false, hasFreeTimer: false, website: 'https://similarweb.com', status: 'missing' },

  // Email & Person Intelligence
  { name: 'Hunter.io', category: 'OSINT', description: 'Email finder and verification', keyName: 'HUNTER_API_KEY', required: false, hasFreeTimer: true, website: 'https://hunter.io', status: 'missing' },
  { name: 'EmailRep', category: 'OSINT', description: 'Email reputation checking', keyName: 'EMAILREP_API_KEY', required: false, hasFreeTimer: true, website: 'https://emailrep.io', status: 'missing' },
  { name: 'Have I Been Pwned', category: 'OSINT', description: 'Breach data checking', keyName: 'HIBP_API_KEY', required: false, hasFreeTimer: true, website: 'https://haveibeenpwned.com', status: 'missing' },

  // Search & Discovery
  { name: 'Google Custom Search', category: 'Search Intelligence', description: 'Custom search engine for dorking', keyName: 'GOOGLE_API_KEY', required: false, hasFreeTimer: true, website: 'https://developers.google.com', status: 'missing' },
  { name: 'GitHub API', category: 'Code Intelligence', description: 'Code search for leaked credentials', keyName: 'GITHUB_API_TOKEN', required: false, hasFreeTimer: true, website: 'https://github.com', status: 'missing' }
]

interface SettingsPanelProps {
  onClose?: () => void
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({})
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [features, setFeatures] = useState({
    bulkEnrichment: true,
    exportFeatures: true,
    alerting: true,
    animations: true,
    liveUpdates: true,
    premiumFeatures: false
  })
  const [saving, setSaving] = useState(false)
  const [testingConnections, setTestingConnections] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<Record<string, 'testing' | 'success' | 'error' | 'idle'>>({})

  useEffect(() => {
    // Load saved settings from localStorage
    const savedKeys = localStorage.getItem('cyberVault_apiKeys')
    const savedFeatures = localStorage.getItem('cyberVault_features')
    
    if (savedKeys) {
      try {
        setApiKeys(JSON.parse(savedKeys))
      } catch (e) {
        console.error('Failed to load API keys:', e)
      }
    }
    
    if (savedFeatures) {
      try {
        setFeatures(JSON.parse(savedFeatures))
      } catch (e) {
        console.error('Failed to load features:', e)
      }
    }
  }, [])

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      // Save to localStorage (in a real app, this would be sent to a secure server)
      localStorage.setItem('cyberVault_apiKeys', JSON.stringify(apiKeys))
      localStorage.setItem('cyberVault_features', JSON.stringify(features))
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success message
      alert('Settings saved successfully!')
    } catch (error) {
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const testConnection = async (service: APIService) => {
    const apiKey = apiKeys[service.keyName]
    if (!apiKey) return

    setConnectionStatus(prev => ({ ...prev, [service.keyName]: 'testing' }))
    
    try {
      // Simulate API test (in a real app, this would test the actual API)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Random success/failure for demo
      const success = Math.random() > 0.3
      setConnectionStatus(prev => ({ 
        ...prev, 
        [service.keyName]: success ? 'success' : 'error' 
      }))
    } catch (error) {
      setConnectionStatus(prev => ({ ...prev, [service.keyName]: 'error' }))
    }
  }

  const testAllConnections = async () => {
    setTestingConnections(true)
    const configuredServices = API_SERVICES.filter(service => apiKeys[service.keyName])
    
    for (const service of configuredServices) {
      await testConnection(service)
    }
    
    setTestingConnections(false)
  }

  const exportSettings = () => {
    const settings = {
      features,
      configuredServices: API_SERVICES.filter(service => apiKeys[service.keyName]).map(s => s.name),
      exportTime: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `salem-cyber-vault-settings-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearAllSettings = () => {
    if (confirm('Are you sure you want to clear all settings? This action cannot be undone.')) {
      setApiKeys({})
      setFeatures({
        bulkEnrichment: true,
        exportFeatures: true,
        alerting: true,
        animations: true,
        liveUpdates: true,
        premiumFeatures: false
      })
      localStorage.removeItem('cyberVault_apiKeys')
      localStorage.removeItem('cyberVault_features')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'testing': return <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />
      default: return <Eye className="w-4 h-4 text-slate-400" />
    }
  }

  const groupedServices = API_SERVICES.reduce((acc, service) => {
    if (!acc[service.category]) acc[service.category] = []
    acc[service.category].push(service)
    return acc
  }, {} as Record<string, APIService[]>)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-slate-900/90 via-purple-900/30 to-slate-900/90 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-3">
              <div className="relative">
                <Settings className="w-8 h-8 text-purple-400" />
                <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-lg animate-pulse"></div>
              </div>
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Intelligence Settings
              </span>
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportSettings}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={clearAllSettings}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
              {onClose && (
                <Button variant="outline" size="sm" onClick={onClose}>
                  Close
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="api-keys" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
        </TabsList>

        {/* API Keys Tab */}
        <TabsContent value="api-keys" className="space-y-6">
          <Alert className="border-blue-500 bg-blue-500/10">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-blue-400">
              API keys are stored locally in your browser and never transmitted to our servers. 
              Many services work without keys using public data sources and free tiers.
            </AlertDescription>
          </Alert>

          {Object.entries(groupedServices).map(([category, services]) => (
            <Card key={category} className="bg-slate-900/40 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-purple-400">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.keyName} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-white">{service.name}</h3>
                            {service.hasFreeTimer && (
                              <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                                Free Tier
                              </Badge>
                            )}
                            {service.required && (
                              <Badge variant="destructive" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-400">{service.description}</p>
                          <a 
                            href={service.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-cyan-400 hover:underline"
                          >
                            {service.website}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          {connectionStatus[service.keyName] && getStatusIcon(connectionStatus[service.keyName])}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => testConnection(service)}
                            disabled={!apiKeys[service.keyName] || connectionStatus[service.keyName] === 'testing'}
                          >
                            Test
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <Input
                            type={showKeys[service.keyName] ? 'text' : 'password'}
                            placeholder={`Enter ${service.name} API key...`}
                            value={apiKeys[service.keyName] || ''}
                            onChange={(e) => setApiKeys(prev => ({
                              ...prev,
                              [service.keyName]: e.target.value
                            }))}
                            className="bg-slate-800 border-slate-600 text-white pr-10"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1 h-8 w-8 p-0"
                            onClick={() => setShowKeys(prev => ({
                              ...prev,
                              [service.keyName]: !prev[service.keyName]
                            }))}
                          >
                            {showKeys[service.keyName] ? 
                              <EyeOff className="w-4 h-4" /> : 
                              <Eye className="w-4 h-4" />
                            }
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <Card className="bg-slate-900/40 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-cyan-400">Feature Toggles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">Bulk Enrichment</h3>
                      <p className="text-sm text-slate-400">Analyze multiple targets simultaneously</p>
                    </div>
                    <Switch
                      checked={features.bulkEnrichment}
                      onCheckedChange={(checked) => setFeatures(prev => ({
                        ...prev,
                        bulkEnrichment: checked
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">Export Features</h3>
                      <p className="text-sm text-slate-400">Enable CSV/JSON/PDF export capabilities</p>
                    </div>
                    <Switch
                      checked={features.exportFeatures}
                      onCheckedChange={(checked) => setFeatures(prev => ({
                        ...prev,
                        exportFeatures: checked
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">Alerting System</h3>
                      <p className="text-sm text-slate-400">Real-time threat and risk alerts</p>
                    </div>
                    <Switch
                      checked={features.alerting}
                      onCheckedChange={(checked) => setFeatures(prev => ({
                        ...prev,
                        alerting: checked
                      }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">Animations</h3>
                      <p className="text-sm text-slate-400">Enable UI animations and effects</p>
                    </div>
                    <Switch
                      checked={features.animations}
                      onCheckedChange={(checked) => setFeatures(prev => ({
                        ...prev,
                        animations: checked
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">Live Updates</h3>
                      <p className="text-sm text-slate-400">Real-time data refreshing</p>
                    </div>
                    <Switch
                      checked={features.liveUpdates}
                      onCheckedChange={(checked) => setFeatures(prev => ({
                        ...prev,
                        liveUpdates: checked
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">Premium Features</h3>
                      <p className="text-sm text-slate-400">Enable premium data sources and features</p>
                    </div>
                    <Switch
                      checked={features.premiumFeatures}
                      onCheckedChange={(checked) => setFeatures(prev => ({
                        ...prev,
                        premiumFeatures: checked
                      }))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testing Tab */}
        <TabsContent value="testing" className="space-y-6">
          <Card className="bg-slate-900/40 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-orange-400">Connection Testing</CardTitle>
                <Button 
                  onClick={testAllConnections}
                  disabled={testingConnections}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {testingConnections ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
                  Test All Connections
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {API_SERVICES.map((service) => {
                    const hasKey = apiKeys[service.keyName]
                    const status = connectionStatus[service.keyName] || 'idle'
                    
                    return (
                      <div key={service.keyName} className="flex items-center justify-between p-3 bg-slate-800/50 rounded">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(status)}
                          <div>
                            <h3 className="font-medium text-white">{service.name}</h3>
                            <p className="text-sm text-slate-400">{service.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {hasKey ? (
                            <Badge variant="default" className="text-xs">
                              Configured
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Not Configured
                            </Badge>
                          )}
                          {status === 'success' && (
                            <Badge variant="default" className="text-xs bg-green-600">
                              Connected
                            </Badge>
                          )}
                          {status === 'error' && (
                            <Badge variant="destructive" className="text-xs">
                              Failed
                            </Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-center">
        <Button 
          onClick={handleSaveSettings}
          disabled={saving}
          className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
        >
          {saving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}