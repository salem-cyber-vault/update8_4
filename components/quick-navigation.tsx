"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Shield, 
  Globe, 
  Bot, 
  Eye, 
  BookOpen, 
  Activity,
  Zap,
  ArrowRight,
  Sparkles
} from "lucide-react"

interface QuickNavigationProps {
  onNavigate: (tab: string) => void
  currentTab: string
}

export function QuickNavigation({ onNavigate, currentTab }: QuickNavigationProps) {
  const navigationItems = [
    {
      id: 'ledger',
      title: 'Live Intelligence',
      description: 'Real-time cybersecurity metrics and live data feed',
      icon: <Activity className="w-6 h-6" />,
      color: 'emerald',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-400/30',
      textColor: 'text-emerald-300',
      hoverColor: 'hover:bg-emerald-500/20'
    },
    {
      id: 'search',
      title: 'Universal Scanner',
      description: 'Intelligent Shodan and OSINT exploration tools',
      icon: <Search className="w-6 h-6" />,
      color: 'pink',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-400/30',
      textColor: 'text-pink-300',
      hoverColor: 'hover:bg-pink-500/20'
    },
    {
      id: 'cve',
      title: 'CVE Intelligence',
      description: 'Comprehensive vulnerability analysis and monitoring',
      icon: <Shield className="w-6 h-6" />,
      color: 'purple',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-400/30',
      textColor: 'text-purple-300',
      hoverColor: 'hover:bg-purple-500/20'
    },
    {
      id: 'threats',
      title: 'Evidence Timeline',
      description: 'Digital forensics and investigation workflow',
      icon: <Globe className="w-6 h-6" />,
      color: 'blue',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-400/30',
      textColor: 'text-blue-300',
      hoverColor: 'hover:bg-blue-500/20'
    },
    {
      id: 'botnets',
      title: 'Live Threats',
      description: 'Real-time botnet and malware tracking',
      icon: <Bot className="w-6 h-6" />,
      color: 'indigo',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-400/30',
      textColor: 'text-indigo-300',
      hoverColor: 'hover:bg-indigo-500/20'
    },
    {
      id: 'dorking',
      title: 'OSINT Explore',
      description: 'Advanced Google dorking and reconnaissance',
      icon: <Eye className="w-6 h-6" />,
      color: 'teal',
      bgColor: 'bg-teal-500/10',
      borderColor: 'border-teal-400/30',
      textColor: 'text-teal-300',
      hoverColor: 'hover:bg-teal-500/20'
    }
  ]

  return (
    <Card className="glass-card-feminine border-slate-400/20 mb-8">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-pink-300 animate-soft-pulse" />
          <h3 className="text-lg font-semibold text-gradient-feminine">Quick Navigation</h3>
          <Badge variant="outline" className="glass-card-feminine border-slate-400/30 text-slate-300">
            <Sparkles className="w-3 h-3 mr-1" />
            Explore All Features
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onNavigate(item.id)}
              className={`
                glass-card h-auto p-4 text-left justify-start transition-all duration-300
                ${item.bgColor} ${item.borderColor} ${item.hoverColor}
                ${currentTab === item.id ? 'ring-2 ring-pink-400/30' : ''}
                border backdrop-blur-md
              `}
            >
              <div className="flex items-start gap-3 w-full">
                <div className={`${item.textColor} mt-1`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-medium ${item.textColor}`}>
                      {item.title}
                    </span>
                    {currentTab === item.id && (
                      <Badge variant="outline" className="text-xs bg-pink-500/20 text-pink-300 border-pink-300/30">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 leading-tight">
                    {item.description}
                  </p>
                </div>
                <ArrowRight className={`w-4 h-4 ${item.textColor} opacity-60 flex-shrink-0 mt-1`} />
              </div>
            </Button>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-pink-500/5 to-purple-500/5 border border-pink-300/20">
          <p className="text-sm text-slate-300">
            <span className="text-pink-300 font-medium">💡 Pro Tip:</span> Each section offers unique insights into cyber intelligence. 
            Start with Live Intelligence to see real-time metrics, then explore specific tools based on your investigation needs.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}