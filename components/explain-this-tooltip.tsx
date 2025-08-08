"use client"

import React, { useState } from 'react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HelpCircle, ExternalLink, BookOpen } from "lucide-react"

interface ExplainThisTooltipProps {
  term: string
  children: React.ReactNode
  explanation?: {
    simple: string
    technical: string
    legal?: string
    examples?: string[]
    learnMore?: string
  }
}

const DEFAULT_EXPLANATIONS: Record<string, {
  simple: string
  technical: string
  legal?: string
  examples?: string[]
  learnMore?: string
}> = {
  "CVE": {
    simple: "A CVE is like a unique ID number for a security vulnerability - think of it as a 'bug report' for software that could be exploited by hackers.",
    technical: "Common Vulnerabilities and Exposures (CVE) is a standardized identifier for publicly known cybersecurity vulnerabilities and exposures.",
    legal: "CVEs are often referenced in compliance frameworks and legal proceedings as evidence of known security risks.",
    examples: ["CVE-2024-1234: Buffer overflow in Apache", "CVE-2023-5678: SQL injection in WordPress"],
    learnMore: "https://cve.mitre.org/"
  },
  "Shodan": {
    simple: "Shodan is like a search engine for internet-connected devices - it finds cameras, servers, and other devices that are connected to the web.",
    technical: "Shodan is a search engine that scans the internet for connected devices and services, indexing their banners and metadata.",
    legal: "Often used in digital forensics and security assessments, but must be used ethically and within legal boundaries.",
    examples: ["Finding exposed webcams", "Discovering unsecured databases", "Mapping IoT device deployments"],
    learnMore: "https://www.shodan.io/about"
  },
  "Botnet": {
    simple: "A botnet is a network of infected computers that hackers control remotely - like having an army of zombie computers doing their bidding.",
    technical: "A botnet is a collection of compromised devices connected to the internet that are controlled remotely by cybercriminals.",
    legal: "Operating or participating in botnets is illegal in most jurisdictions and can result in severe criminal penalties.",
    examples: ["Emotet banking trojan", "Mirai IoT botnet", "Zeus financial malware"],
    learnMore: "https://www.cisa.gov/topics/cybersecurity-threats/botnet-identification"
  },
  "Google Dorking": {
    simple: "Google Dorking uses special search tricks to find sensitive information that websites accidentally exposed - like finding unlocked doors on the internet.",
    technical: "Google Dorking involves using advanced search operators to locate sensitive information indexed by search engines.",
    legal: "While the techniques are legal, accessing discovered sensitive information may violate laws depending on jurisdiction and intent.",
    examples: ['site:example.com filetype:pdf "confidential"', 'intitle:"index of" password.txt', 'inurl:admin login'],
    learnMore: "https://www.exploit-db.com/google-hacking-database"
  },
  "Threat Intelligence": {
    simple: "Threat intelligence is like having a neighborhood watch for the internet - collecting information about cyber threats to help protect against them.",
    technical: "Threat intelligence involves collecting, analyzing, and disseminating information about current and emerging cybersecurity threats.",
    legal: "Used extensively in corporate security and law enforcement for proactive threat detection and incident response.",
    examples: ["IOC feeds", "Malware signatures", "Attack pattern analysis"],
    learnMore: "https://www.cisa.gov/topics/cyber-threats-and-advisories/threat-intelligence"
  }
}

export function ExplainThisTooltip({ term, children, explanation }: ExplainThisTooltipProps) {
  const [showTechnical, setShowTechnical] = useState(false)
  const explainData = explanation || DEFAULT_EXPLANATIONS[term]

  if (!explainData) {
    return <>{children}</>
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="relative inline-flex items-center group cursor-help">
          {children}
          <HelpCircle className="w-3 h-3 ml-1 text-pink-400/60 group-hover:text-pink-300 transition-colors" />
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="glass-card-feminine border-pink-300/30 p-4 w-80">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge className="glass-card-feminine bg-pink-500/20 text-pink-300 border-pink-300/30">
              {term}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTechnical(!showTechnical)}
              className="text-xs text-slate-300 hover:text-pink-200"
            >
              <BookOpen className="w-3 h-3 mr-1" />
              {showTechnical ? 'Simple' : 'Technical'}
            </Button>
          </div>
          
          <div className="text-sm text-slate-200">
            {showTechnical ? explainData.technical : explainData.simple}
          </div>

          {explainData.legal && (
            <div className="text-xs text-purple-300 bg-purple-500/10 p-2 rounded-lg border border-purple-400/20">
              <strong>Legal Note:</strong> {explainData.legal}
            </div>
          )}

          {explainData.examples && (
            <div className="space-y-1">
              <div className="text-xs font-medium text-slate-300">Examples:</div>
              <ul className="text-xs text-slate-400 space-y-1">
                {explainData.examples.map((example, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-pink-400 mr-2">•</span>
                    <code className="bg-slate-800/50 px-1 rounded text-pink-200">{example}</code>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {explainData.learnMore && (
            <Button
              variant="outline"
              size="sm"
              className="w-full glass-card-feminine border-slate-400/30 text-slate-200 hover:text-pink-200 text-xs"
              onClick={() => window.open(explainData.learnMore, '_blank')}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Learn More
            </Button>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}